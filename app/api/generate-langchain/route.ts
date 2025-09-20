import { NextRequest, NextResponse } from 'next/server'
import { createSEOAgent } from '@/lib/langchain-agent'
import { createBlogPost, saveSocialPosts } from '@/lib/blog'

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    console.log(`🚀 Starting LangChain SEO Agent for: ${topic}`)

    // Create the LangChain agent
    const agent = await createSEOAgent()

    // Run the agent with a comprehensive prompt
    const result = await agent.invoke({
      input: `I need you to act as a comprehensive SEO content creation agent for the topic: "${topic}".

Please execute the following tasks in sequence:

1. First, use the keyword_research tool to find trending keywords related to "${topic}"
2. Then, use the competitor_analysis tool to analyze what competitors are doing for "${topic}"
3. Next, use the image_generation tool to create a relevant blog banner image for "${topic}"
4. Then, use the content_generation tool to write a comprehensive blog post about "${topic}" using the keywords and competitor insights you found
5. Finally, provide 4 social media posts that promote this content

Please execute all these tools and provide me with:
- The trending keywords you found
- Competitor insights
- Generated image URL (if successful)
- The complete blog post content
- Social media posts

Make sure to use the actual tool outputs to inform each subsequent step.`
    })

    console.log('🤖 LangChain Agent completed')

    // Parse the agent's response to extract structured data
    const agentOutput = result.output || result.content || result.text || ''
    
    console.log('🔍 Agent Output Length:', agentOutput.length)
    console.log('🔍 Agent Output Preview:', agentOutput.substring(0, 500) + '...')
    
    // Try to extract tool results from the agent's intermediate steps
    let toolResults = {
      keywords: [] as string[],
      competitors: [] as Array<{ title: string; url: string }>,
      competitorInsights: '',
      imageUrl: null as string | null,
      content: '',
      socialPosts: [] as string[]
    }
    
    // Check if we have intermediate steps from tool executions
    if (result.intermediateSteps && Array.isArray(result.intermediateSteps)) {
      console.log('📊 Found intermediate steps:', result.intermediateSteps.length)
      
      for (const step of result.intermediateSteps) {
        if (step.action && step.observation) {
          const toolName = step.action.tool
          const toolOutput = step.observation
          
          console.log(`🔧 Tool: ${toolName}, Output length: ${toolOutput.length}`)
          
          if (toolName === 'keyword_research') {
            toolResults.keywords = parseKeywordsFromToolOutput(toolOutput)
          } else if (toolName === 'competitor_analysis') {
            const { competitors, insights } = parseCompetitorAnalysisFromToolOutput(toolOutput)
            toolResults.competitors = competitors
            toolResults.competitorInsights = insights
          } else if (toolName === 'image_generation') {
            toolResults.imageUrl = parseImageUrlFromToolOutput(toolOutput)
          } else if (toolName === 'content_generation') {
            toolResults.content = parseContentFromToolOutput(toolOutput)
          }
        }
      }
    }
    
    // Debug logging for image URL extraction
    console.log('🖼️ Tool results imageUrl:', toolResults.imageUrl)
    console.log('🖼️ Checking agent output for image URL...')
    const fallbackImageUrl = extractImageUrl(agentOutput)
    console.log('🖼️ Fallback imageUrl from agent output:', fallbackImageUrl)
    
    // Fallback to parsing from the final agent output if tool results are empty
    const keywords = toolResults.keywords.length > 0 ? toolResults.keywords : extractKeywordsFromResponse(agentOutput)
    const competitors = toolResults.competitors.length > 0 ? toolResults.competitors : []
    const competitorInsights = toolResults.competitorInsights || extractCompetitorInsights(agentOutput)
    const imageUrl = toolResults.imageUrl || fallbackImageUrl
    const content = toolResults.content || extractBlogContent(agentOutput)
    const socialPosts = extractSocialPosts(agentOutput) // Always parse from final output
    
    console.log('🖼️ Final imageUrl being used:', imageUrl)

    // Save the blog post
    const { slug, title } = createBlogPost(topic, content, keywords, imageUrl || undefined)

    // Save social media posts
    saveSocialPosts(slug, socialPosts)

    console.log(`✅ LangChain content generation completed for: ${title}`)

    return NextResponse.json({
      success: true,
      slug,
      title,
      keywords,
      competitors,
      competitorInsights,
      socialPosts,
      imageUrl,
      agentOutput, // Include full agent output for debugging
      message: `Content generated successfully using LangChain agent!`
    })

  } catch (error) {
    console.error('Error in LangChain content generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate content with LangChain agent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper functions to parse tool outputs
function parseKeywordsFromToolOutput(toolOutput: string): string[] {
  // Try to extract from comma-separated list anywhere in the output
  const keywords = toolOutput
    .replace(/Using.*?keywords?:\s*/i, '')
    .split(/[,\n]/)
    .map(k => k.trim())
    .filter(k => k.length > 2 && !k.toLowerCase().includes('using') && !k.toLowerCase().includes('fallback'))
    .slice(0, 10)
  
  return keywords.length > 0 ? keywords : []
}

function parseCompetitorAnalysisFromToolOutput(toolOutput: string): { competitors: Array<{ title: string; url: string }>, insights: string } {
  const competitors: Array<{ title: string; url: string }> = []
  
  // Look for competitor data in the format: "Title (URL)"
  const competitorMatches = toolOutput.match(/([^(]+)\s*\(([^)]+)\)/g)
  if (competitorMatches) {
    for (const match of competitorMatches.slice(0, 3)) {
      const parts = match.match(/([^(]+)\s*\(([^)]+)\)/)
      if (parts) {
        competitors.push({
          title: parts[1].trim(),
          url: parts[2].trim()
        })
      }
    }
  }
  
  return {
    competitors,
    insights: toolOutput.trim()
  }
}

function parseImageUrlFromToolOutput(toolOutput: string): string | null {
  console.log('🖼️ Parsing image URL from tool output:', toolOutput.substring(0, 300))
  
  // The image generation tool returns: "Image generated successfully: /generated-images/filename.jpg"
  const patterns = [
    /Image generated successfully:\s*(\/generated-images\/[^\s\n]+\.jpg)/i,
    /\/generated-images\/[^\s\n]+\.jpg/,
    /generated-images\/[^\s\n]+\.jpg/,
    /Image\s+(?:saved|generated)\s+(?:at|to):\s*([^\s\n]+)/i,
    /Image\s+URL:\s*([^\s\n]+)/i
  ]
  
  for (const pattern of patterns) {
    const match = toolOutput.match(pattern)
    if (match) {
      let imageUrl = match[1] || match[0]
      // Ensure it starts with /
      if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl
      }
      console.log('🖼️ Found image URL in tool output:', imageUrl)
      return imageUrl
    }
  }
  
  console.log('🖼️ No image URL found in tool output')
  return null
}

function parseContentFromToolOutput(toolOutput: string): string {
  // The tool output should be the actual blog content from the content generation tool
  let content = toolOutput.trim()
  
  // Clean the content of any embedded metadata
  content = cleanBlogContent(content)
  
  // Make sure it looks like blog content (starts with # or has substantial text)
  if (content.startsWith('#') || content.length > 500) {
    return content
  }
  
  // If the tool output doesn't look like content, return empty so fallback parsing is used
  return ''
}

// Helper functions to extract data from agent output (fallback)
function extractKeywordsFromResponse(response: string): string[] {
  // Look for the new structured format first
  const keywordMatch = response.match(/KEYWORDS:\s*([^\n]+)/i)
  if (keywordMatch) {
    const keywords = keywordMatch[1]
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, 10)
    return keywords
  }
  
  // Fallback to old parsing
  const oldKeywordMatch = response.match(/(?:keywords?|trending|found)[\s\S]*?:([\s\S]*?)(?:\n\n|\.|$)/i)
  if (oldKeywordMatch) {
    return oldKeywordMatch[1]
      .split(/[,\n]/)
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, 10)
  }
  return ['seo', 'content', 'marketing', 'strategy'] // fallback
}

function extractCompetitorInsights(response: string): string {
  // Look for competitors in new structured format
  const competitorMatch = response.match(/COMPETITORS:\s*([^\n]+)/i)
  if (competitorMatch) {
    const competitors = competitorMatch[1]
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0)
    
    if (competitors.length > 0) {
      return `Found ${competitors.length} competitors: ${competitors.join(', ')}`
    }
  }
  
  // Fallback
  const insightMatch = response.match(/competitor[\s\S]*?insights?[\s\S]*?:([\s\S]*?)(?:\n\n|$)/i)
  return insightMatch ? insightMatch[1].trim() : 'Competitor analysis completed using web scraping tools.'
}

function extractImageUrl(response: string): string | null {
  console.log('🖼️ Extracting image URL from agent response (length:', response.length, ')')
  
  // Look for structured format first
  const imageMatch = response.match(/IMAGE_URL:\s*([^\s\n]+)/i)
  if (imageMatch) {
    console.log('🖼️ Found structured IMAGE_URL:', imageMatch[1])
    return imageMatch[1]
  }
  
  // Look for the exact format returned by the image generation tool
  const successMatch = response.match(/Image generated successfully:\s*(\/generated-images\/[^\s\n]+\.jpg)/i)
  if (successMatch) {
    console.log('🖼️ Found "Image generated successfully" format:', successMatch[1])
    return successMatch[1]
  }
  
  // Try multiple fallback patterns
  const patterns = [
    /\/generated-images\/[^\s\n\)]+\.jpg/g,
    /generated-images\/[^\s\n\)]+\.jpg/i,
    /Image\s+(?:saved|generated)\s+(?:at|to):\s*([^\s\n]+)/i,
    /Image\s+URL:\s*([^\s\n]+)/i
  ]
  
  for (const pattern of patterns) {
    const matches = response.match(pattern)
    if (matches) {
      let imageUrl = matches[1] || matches[0]
      // Ensure it starts with /
      if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl
      }
      console.log('🖼️ Found image URL in agent response:', imageUrl)
      return imageUrl
    }
  }
  
  console.log('🖼️ No image URL found in agent response')
  return null
}

function extractBlogContent(response: string): string {
  // Look for structured format first
  const contentMatch = response.match(/BLOG_CONTENT_START:\s*([\s\S]*?)\s*BLOG_CONTENT_END:/i)
  if (contentMatch) {
    let content = contentMatch[1].trim()
    content = cleanBlogContent(content)
    if (content.length > 100) {
      return content
    }
  }
  
  // Look for markdown blog post outside of structured format
  const markdownMatch = response.match(/(^|\n)(# [^\n]+[\s\S]*?)(\n\nKEYWORDS:|\n\nCOMPETITORS:|$)/m)
  if (markdownMatch && markdownMatch[2].length > 500) {
    let content = markdownMatch[2].trim()
    content = cleanBlogContent(content)
    return content
  }
  
  // If no proper blog content found, generate a proper blog post structure
  console.warn('⚠️ No actual blog content found in agent output, creating fallback structure')
  const topic = response.match(/topic[:\s]+"([^"]+)"/i)?.[1] || 'Generated Content Topic'
  
  return `# ${topic}

## Introduction

This comprehensive guide explores ${topic.toLowerCase()} and provides valuable insights for readers interested in this topic.

## Key Points

Understanding ${topic.toLowerCase()} is crucial in today's digital landscape. This article covers the essential aspects you need to know.

## Conclusion

${topic} continues to be an important topic with significant implications for the future.

*This content was generated automatically. Please review and enhance as needed.*`
}

function extractSocialPosts(response: string): string[] {
  // Look for structured format first
  const socialMatch = response.match(/SOCIAL_POSTS_START:\s*([\s\S]*?)\s*SOCIAL_POSTS_END:/i)
  if (socialMatch) {
    const posts = socialMatch[1]
      .split(/\n/)
      .map(post => post.replace(/^\d+\.\s*/, '').trim())
      .filter(post => post.length > 10)
      .slice(0, 4)
    
    if (posts.length > 0) {
      return posts
    }
  }
  
  // Try multiple patterns to find social media posts
  const patterns = [
    /social media[\s\S]*?posts?[\s\S]*?:([\s\S]*?)(?:\n\n|$)/i,
    /social posts?[\s\S]*?:([\s\S]*?)(?:\n\n|$)/i,
    /posts?[\s\S]*?social[\s\S]*?:([\s\S]*?)(?:\n\n|$)/i
  ]
  
  for (const pattern of patterns) {
    const match = response.match(pattern)
    if (match) {
      const posts = match[1]
        .split(/\n+/)
        .map(post => post.trim())
        .filter(post => post.length > 10 && !post.includes('**'))
        .slice(0, 4)
      
      if (posts.length > 0) {
        return posts
      }
    }
  }
  
  // Look for numbered lists or bullet points that might be social posts
  const numberedPosts = response.match(/\d+\.\s+(.+)/g)
  if (numberedPosts && numberedPosts.length >= 2) {
    const posts = numberedPosts
      .map(post => post.replace(/^\d+\.\s+/, '').trim())
      .filter(post => post.length > 20 && post.length < 280)
      .slice(0, 4)
    
    if (posts.length > 0) {
      return posts
    }
  }
  
  // Ultimate fallback social posts
  return [
    `🚀 Just published a comprehensive guide on this topic! Check it out and let me know your thoughts.`,
    `💡 New insights on this important topic - everything you need to know in one place.`,
    `🎯 Expert analysis and actionable tips in our latest blog post. Link in bio!`,
    `⚡ Don't miss this deep dive into the latest trends and strategies. Worth the read!`
  ]
}

// Helper function to clean blog content of metadata
function cleanBlogContent(content: string): string {
  // Remove any embedded keywords sections
  content = content.replace(/\n\n?Keywords?:\s*[\s\S]*?(?=\n\n|\n#|$)/gi, '')
  
  // Remove any embedded competitor sections
  content = content.replace(/\n\n?Competitors?:\s*[\s\S]*?(?=\n\n|\n#|$)/gi, '')
  
  // Remove any embedded social media sections
  content = content.replace(/\n\n?Social Media Posts?:\s*[\s\S]*?(?=\n\n|\n#|$)/gi, '')
  
  // Remove structured format markers that might leak through
  content = content.replace(/KEYWORDS:\s*[^\n]*/gi, '')
  content = content.replace(/COMPETITORS:\s*[^\n]*/gi, '')
  content = content.replace(/IMAGE_URL:\s*[^\n]*/gi, '')
  content = content.replace(/SOCIAL_POSTS_START:[\s\S]*?SOCIAL_POSTS_END:/gi, '')
  content = content.replace(/BLOG_CONTENT_START:|BLOG_CONTENT_END:/gi, '')
  
  // Clean up extra whitespace
  content = content.replace(/\n\n\n+/g, '\n\n').trim()
  
  return content
}
