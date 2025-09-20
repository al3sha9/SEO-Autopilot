import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost, saveSocialPosts } from '@/lib/blog'
// @ts-ignore - no types available for google-trends-api
import googleTrends from 'google-trends-api'
import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

// Tool 1: Research Keywords using Google Trends API
async function researchKeywords(topic: string): Promise<string[]> {
  try {
    console.log(`🔍 Fetching Google Trends data for: ${topic}`)
    
    // Get related queries from Google Trends
    const relatedQueriesData = await googleTrends.relatedQueries({
      keyword: topic,
      startTime: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)), // Last 30 days
      geo: 'US'
    })

    const parsedData = JSON.parse(relatedQueriesData)
    
    let keywords: string[] = []
    
    // Extract rising queries
    if (parsedData?.default?.rankedList?.[0]?.rankedKeyword) {
      const risingQueries = parsedData.default.rankedList[0].rankedKeyword
        .slice(0, 5) // Take top 5 rising
        .map((item: any) => item.query.toLowerCase())
      keywords.push(...risingQueries)
    }
    
    // Extract top queries
    if (parsedData?.default?.rankedList?.[1]?.rankedKeyword) {
      const topQueries = parsedData.default.rankedList[1].rankedKeyword
        .slice(0, 5) // Take top 5
        .map((item: any) => item.query.toLowerCase())
      keywords.push(...topQueries)
    }

    // Remove duplicates and limit to 10
    keywords = [...new Set(keywords)].slice(0, 10)
    
    if (keywords.length > 0) {
      console.log(`✅ Found ${keywords.length} trending keywords:`, keywords.join(', '))
      return keywords
    }
    
    // Fallback if no data
    throw new Error('No Google Trends data available')
    
  } catch (error) {
    console.warn('⚠️ Google Trends API error, using fallback keywords:', error instanceof Error ? error.message : 'Unknown error')
    
    // Fallback keywords based on topic
    const keywordMap: Record<string, string[]> = {
      'climate change': ['global warming', 'carbon emissions', 'renewable energy', 'sustainability', 'greenhouse gases', 'environmental impact', 'clean energy', 'climate action'],
      'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'automation', 'chatgpt', 'generative ai', 'ai tools'],
      'seo': ['search engine optimization', 'keyword research', 'backlinks', 'content marketing', 'SERP ranking', 'google algorithm', 'organic traffic', 'seo tools'],
      'fashion': ['sustainable fashion', 'fashion trends', 'style guide', 'fashion week', 'designer brands', 'fast fashion', 'clothing trends', 'fashion industry'],
      'business': ['entrepreneurship', 'startup', 'business strategy', 'leadership', 'market analysis', 'business growth', 'digital transformation', 'business model']
    }

    const topicLower = topic.toLowerCase()
    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (topicLower.includes(key)) {
        return keywords
      }
    }

    // Generic keywords if no specific match
    return ['trending', 'popular', 'guide', 'tips', 'best practices', 'how to', 'benefits', 'examples']
  }
}

// Tool 2: Analyze Competitors using web scraping
async function analyzeCompetitors(topic: string): Promise<{ competitors: Array<{ title: string; url: string }>, insights: string }> {
  try {
    console.log(`🔍 Scraping Google search results for: ${topic}`)
    
    // Search Google for the topic
    const searchQuery = encodeURIComponent(topic)
    const searchUrl = `https://www.google.com/search?q=${searchQuery}&num=10`
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      },
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    const competitors: Array<{ title: string; url: string }> = []

    // Extract search results (Google's structure may change)
    $('div[data-ved] h3').each((index, element) => {
      if (competitors.length >= 3) return false // Stop after 3 results
      
      const title = $(element).text().trim()
      const linkElement = $(element).closest('a')
      let url = linkElement.attr('href') || ''
      
      // Clean up Google's redirect URLs
      if (url.startsWith('/url?q=')) {
        const urlParams = new URLSearchParams(url.substring(6))
        url = urlParams.get('q') || url
      }
      
      if (title && url && !url.includes('google.com')) {
        competitors.push({ title, url })
      }
    })

    if (competitors.length > 0) {
      console.log(`✅ Found ${competitors.length} competitors:`)
      competitors.forEach((comp, idx) => {
        console.log(`${idx + 1}. ${comp.title} - ${comp.url}`)
      })
      
      const insights = generateCompetitorInsights(competitors)
      return { competitors, insights }
    }
    
    throw new Error('No search results found')
    
  } catch (error) {
    console.warn('⚠️ Competitor analysis error, using fallback:', error instanceof Error ? error.message : 'Unknown error')
    
    // Fallback competitor data
    const fallbackCompetitors = [
      { title: `Ultimate Guide to ${topic}`, url: `https://example.com/${topic.toLowerCase().replace(/\s+/g, '-')}-guide` },
      { title: `${topic}: Best Practices and Tips`, url: `https://sample.com/${topic.toLowerCase().replace(/\s+/g, '-')}-tips` },
      { title: `Everything You Need to Know About ${topic}`, url: `https://demo.com/${topic.toLowerCase().replace(/\s+/g, '-')}-complete-guide` }
    ]
    
    const insights = generateCompetitorInsights(fallbackCompetitors)
    return { competitors: fallbackCompetitors, insights }
  }
}

function generateCompetitorInsights(competitors: Array<{ title: string; url: string }>): string {
  const insights = [
    `Analysis of top ${competitors.length} search results reveals a focus on comprehensive, authoritative content.`,
    `Leading articles in this space emphasize practical guides and actionable insights.`,
    `Top-ranking content typically features detailed explanations and real-world examples.`,
    `Successful competitors are creating in-depth resources that answer user questions thoroughly.`,
    `The competitive landscape shows a preference for well-structured, long-form content.`
  ]
  
  // Add specific insights based on titles
  const titleWords = competitors.map(c => c.title.toLowerCase()).join(' ')
  if (titleWords.includes('guide') || titleWords.includes('ultimate')) {
    insights.push('Competitors are heavily investing in comprehensive guide-style content.')
  }
  if (titleWords.includes('tips') || titleWords.includes('best')) {
    insights.push('Top results focus on actionable tips and best practice recommendations.')
  }
  if (titleWords.includes('complete') || titleWords.includes('everything')) {
    insights.push('Market leaders are positioning themselves as complete resources for this topic.')
  }
  
  return insights.slice(0, 3).join(' ')
}

// Tool 3: Generate Content using Hugging Face API or fallback templates
async function generateContent(topic: string, keywords: string[], competitorInsights: string): Promise<string> {
  const hfToken = process.env.HUGGINGFACE_API_KEY

  if (hfToken) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Write a comprehensive blog post about ${topic}. Include these keywords: ${keywords.join(', ')}. Based on competitor analysis: ${competitorInsights}. Make it SEO-optimized and engaging.`,
          }),
        }
      )

      if (response.ok) {
        const result = await response.json()
        return result.generated_text || generateFallbackContent(topic, keywords)
      }
    } catch (error) {
      console.error('Hugging Face API error:', error)
    }
  }

  // Fallback to template-based content generation
  return generateFallbackContent(topic, keywords)
}

function generateFallbackContent(topic: string, keywords: string[]): string {
  const templates = [
    `# The Ultimate Guide to ${topic}

## Introduction

In today's digital landscape, understanding ${topic} has become more crucial than ever. This comprehensive guide will walk you through everything you need to know about ${keywords[0]} and related concepts.

## What is ${topic}?

${topic} represents a significant opportunity for businesses and individuals alike. With the rise of ${keywords[1] || 'digital transformation'}, mastering these concepts can give you a competitive edge.

## Key Benefits

- **Enhanced Performance**: Implementing ${keywords[0]} strategies can dramatically improve your results
- **Cost Efficiency**: Smart approaches to ${topic} can reduce overhead while maximizing impact
- **Future-Proofing**: Stay ahead of trends with cutting-edge ${keywords[2] || 'techniques'}

## Best Practices

### 1. Strategic Planning
When approaching ${topic}, it's essential to have a clear strategy. Consider these factors:
- Target audience analysis
- Competitive landscape review
- Resource allocation

### 2. Implementation
Focus on ${keywords[0]} while maintaining quality standards. The key is to balance innovation with proven methodologies.

### 3. Optimization
Continuous improvement is crucial. Monitor your ${keywords[1] || 'metrics'} and adjust accordingly.

## Common Mistakes to Avoid

- Rushing the implementation process
- Ignoring ${keywords[2] || 'user feedback'}
- Failing to measure results

## Conclusion

Mastering ${topic} requires dedication and the right approach. By focusing on ${keywords[0]} and following these guidelines, you'll be well on your way to success.

Remember, the key to effective ${topic} lies in understanding your audience and delivering value consistently.`,

    `# ${topic}: A Complete Beginner's Guide

## Getting Started

Welcome to the world of ${topic}! Whether you're new to ${keywords[0]} or looking to improve your existing knowledge, this guide has you covered.

## Understanding the Basics

${topic} encompasses several key areas:

### Core Concepts
- ${keywords[0] || 'Fundamental principles'}
- ${keywords[1] || 'Best practices'}
- ${keywords[2] || 'Advanced techniques'}

### Why ${topic} Matters

In recent years, ${keywords[0]} has become increasingly important for:
- Business growth
- Competitive advantage
- Customer satisfaction

## Step-by-Step Approach

### Phase 1: Foundation
Start with understanding the basics of ${keywords[0]}. This involves:
1. Research and analysis
2. Planning your approach
3. Setting clear objectives

### Phase 2: Implementation
Put your knowledge into practice:
- Apply ${keywords[1] || 'proven strategies'}
- Monitor progress regularly
- Make data-driven adjustments

### Phase 3: Optimization
Refine your approach based on results:
- Analyze performance metrics
- Identify improvement opportunities
- Scale successful initiatives

## Tools and Resources

To succeed with ${topic}, consider these essential tools:
- Analytics platforms for measuring ${keywords[0]}
- Automation tools for ${keywords[1] || 'efficiency'}
- Community resources for ongoing learning

## Real-World Examples

Let's look at how successful companies approach ${topic}:

**Case Study 1**: A company focused on ${keywords[0]} and saw 150% improvement in their results.

**Case Study 2**: By implementing ${keywords[1] || 'strategic changes'}, another business reduced costs by 30%.

## Future Trends

The landscape of ${topic} is constantly evolving. Key trends to watch:
- Integration with ${keywords[2] || 'emerging technologies'}
- Increased focus on ${keywords[0]}
- Growing importance of data-driven decisions

## Conclusion

${topic} offers tremendous opportunities for those willing to invest the time and effort. Start with the basics, focus on ${keywords[0]}, and gradually build your expertise.

Success in ${topic} doesn't happen overnight, but with consistent effort and the right approach, you can achieve remarkable results.`
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

// Tool 4: Generate Blog Image using Hugging Face API
async function generateBlogImage(topic: string, keywords: string[]): Promise<string | null> {
  const hfToken = process.env.HUGGINGFACE_API_KEY

  if (!hfToken) {
    console.warn('⚠️ No Hugging Face API key found, skipping image generation')
    return null
  }

  try {
    console.log(`🎨 Generating image for: ${topic}`)
    
    // Create a descriptive prompt for the image
    const imagePrompt = createImagePrompt(topic, keywords)
    console.log(`🎨 Image prompt: ${imagePrompt}`)

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: imagePrompt,
          parameters: {
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: 1024,
            height: 576, // 16:9 aspect ratio for blog banners
          }
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    // Get the image as buffer
    const imageBuffer = await response.arrayBuffer()
    
    // Generate filename based on topic slug
    const slug = topic.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-")
    const filename = `${slug}-${Date.now()}.jpg`
    const imagePath = path.join(process.cwd(), 'public', 'generated-images', filename)
    
    // Ensure directory exists
    const imageDir = path.dirname(imagePath)
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true })
    }
    
    // Save image to public directory
    fs.writeFileSync(imagePath, Buffer.from(imageBuffer))
    
    const publicImagePath = `/generated-images/${filename}`
    console.log(`✅ Image generated and saved: ${publicImagePath}`)
    
    return publicImagePath
    
  } catch (error) {
    console.warn('⚠️ Image generation failed:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

function createImagePrompt(topic: string, keywords: string[]): string {
  const topKeywords = keywords.slice(0, 3).join(', ')
  
  // Create contextual prompts based on topic
  const topicLower = topic.toLowerCase()
  
  let basePrompt = ""
  let style = "professional, clean, modern"
  
  if (topicLower.includes('climate') || topicLower.includes('environment')) {
    basePrompt = `Beautiful earth from space showing green forests and blue oceans, ${topKeywords}, environmental conservation`
    style = "photorealistic, nature photography, vibrant colors"
  } else if (topicLower.includes('ai') || topicLower.includes('artificial intelligence') || topicLower.includes('tech')) {
    basePrompt = `Futuristic AI technology concept, ${topKeywords}, digital innovation, neural networks`
    style = "sci-fi, digital art, blue and purple tones"
  } else if (topicLower.includes('business') || topicLower.includes('marketing')) {
    basePrompt = `Modern business office environment, ${topKeywords}, professional workspace, growth charts`
    style = "corporate, professional photography, bright lighting"
  } else if (topicLower.includes('health') || topicLower.includes('wellness')) {
    basePrompt = `Healthy lifestyle concept, ${topKeywords}, wellness and vitality`
    style = "clean, minimalist, natural lighting"
  } else if (topicLower.includes('education') || topicLower.includes('learning')) {
    basePrompt = `Educational concept with books and learning materials, ${topKeywords}, knowledge and growth`
    style = "academic, inspiring, warm lighting"
  } else {
    basePrompt = `Abstract concept representing ${topic}, ${topKeywords}, innovation and progress`
    style = "modern, conceptual, professional"
  }
  
  return `${basePrompt}, ${style}, high quality, detailed, 16:9 aspect ratio, blog header image`
}

// Tool 5: Generate Social Media Posts
async function generateSocialPosts(topic: string, keywords: string[]): Promise<string[]> {
  const posts = [
    `🚀 Just published a comprehensive guide on ${topic}! Learn how ${keywords[0]} can transform your strategy. What's your experience with ${keywords[1] || 'this topic'}? #${keywords[0]?.replace(/\s+/g, '') || 'trending'}`,
    
    `💡 Quick tip: The secret to mastering ${topic} lies in understanding ${keywords[0]}. Here's what I've learned after years of experience... Thread 🧵 #${keywords[1]?.replace(/\s+/g, '') || 'tips'}`,
    
    `📊 Interesting fact: Companies that focus on ${keywords[0]} see 3x better results than those who don't. How are you implementing ${topic} in your workflow? #${keywords[2]?.replace(/\s+/g, '') || 'business'}`,
    
    `🎯 New blog post alert! Everything you need to know about ${topic} in one comprehensive guide. From ${keywords[0]} to advanced strategies - it's all covered! Link in bio 👆`,
    
    `⚡ Game-changer: If you're not leveraging ${keywords[0]} for your ${topic} strategy, you're missing out on huge opportunities. Here's why... #${keywords[1]?.replace(/\s+/g, '') || 'strategy'}`
  ]

  return posts
}

// Main multi-tool agent function
async function runAgent(topic: string) {
  console.log(`🤖 SEO Agent starting research for: ${topic}`)

  // Step 1: Research Keywords
  console.log('🔍 Step 1: Researching keywords...')
  const keywords = await researchKeywords(topic)
  console.log(`Found keywords: ${keywords.join(', ')}`)

  // Step 2: Analyze Competitors
  console.log('🔍 Step 2: Analyzing competitors...')
  const competitorData = await analyzeCompetitors(topic)
  console.log(`Competitor insights: ${competitorData.insights}`)

  // Step 3: Generate Content
  console.log('✍️ Step 3: Generating SEO-optimized content...')
  const content = await generateContent(topic, keywords, competitorData.insights)

  // Step 4: Generate Blog Image
  console.log('🎨 Step 4: Generating blog image...')
  const imageUrl = await generateBlogImage(topic, keywords)

  // Step 5: Generate Social Media Posts
  console.log('📱 Step 5: Creating social media posts...')
  const socialPosts = await generateSocialPosts(topic, keywords)

  return {
    content,
    keywords,
    socialPosts,
    competitors: competitorData.competitors,
    competitorInsights: competitorData.insights,
    imageUrl
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    console.log(`🚀 Starting content generation for: ${topic}`)

    // Run the multi-tool agent
    const result = await runAgent(topic)

    // Save the blog post
    const { slug, title } = createBlogPost(topic, result.content, result.keywords, result.imageUrl || undefined)

    // Save social media posts
    saveSocialPosts(slug, result.socialPosts)

    console.log(`✅ Content generation completed for: ${title}`)

    return NextResponse.json({
      success: true,
      slug,
      title,
      keywords: result.keywords,
      competitors: result.competitors,
      competitorInsights: result.competitorInsights,
      socialPosts: result.socialPosts,
      message: `Blog post "${title}" has been created successfully!`
    })

  } catch (error) {
    console.error('Error in content generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
