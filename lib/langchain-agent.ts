import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { AgentExecutor, createToolCallingAgent } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import googleTrends from 'google-trends-api'
import axios from 'axios'
import * as cheerio from 'cheerio'
// Note: fs and path removed - using Firebase Storage instead

// Define the LangChain tools
const keywordResearchTool = tool(
  async ({ topic }: { topic: string }) => {
    try {
      console.log(`🔍 LangChain Tool: Fetching Google Trends data for: ${topic}`)
      
      const relatedQueriesData = await googleTrends.relatedQueries({
        keyword: topic,
        startTime: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)),
        geo: 'US'
      })

      const parsedData = JSON.parse(relatedQueriesData)
      let keywords: string[] = []
      
      if (parsedData?.default?.rankedList?.[0]?.rankedKeyword) {
        const risingQueries = parsedData.default.rankedList[0].rankedKeyword
          .slice(0, 5)
          .map((item: any) => item.query.toLowerCase())
        keywords.push(...risingQueries)
      }
      
      if (parsedData?.default?.rankedList?.[1]?.rankedKeyword) {
        const topQueries = parsedData.default.rankedList[1].rankedKeyword
          .slice(0, 5)
          .map((item: any) => item.query.toLowerCase())
        keywords.push(...topQueries)
      }

      keywords = [...new Set(keywords)].slice(0, 10)
      
      if (keywords.length > 0) {
        return `Found ${keywords.length} trending keywords: ${keywords.join(', ')}`
      }
      
      // Fallback keywords based on topic
      const fallbackKeywords = getTopicSpecificKeywords(topic)
      return `Using topic-specific fallback keywords: ${fallbackKeywords.join(', ')}`
      
    } catch (error) {
      console.error('Google Trends API Error:', error)
      const fallbackKeywords = getTopicSpecificKeywords(topic)  
      return `Google Trends failed, using topic-specific keywords: ${fallbackKeywords.join(', ')}`
    }
  },
  {
    name: "keyword_research",
    description: "Research trending keywords for a given topic using Google Trends API",
    schema: z.object({
      topic: z.string().describe("The topic to research keywords for")
    })
  }
)

const competitorAnalysisTool = tool(
  async ({ topic }: { topic: string }) => {
    try {
      console.log(`🔍 LangChain Tool: Analyzing competitors for: ${topic}`)
      
      const searchQuery = encodeURIComponent(topic)
      const searchUrl = `https://www.google.com/search?q=${searchQuery}&num=10`
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      })

      const $ = cheerio.load(response.data)
      const competitors: Array<{ title: string; url: string }> = []

      $('div[data-ved] h3').each((index, element) => {
        if (competitors.length >= 3) return false
        
        const title = $(element).text().trim()
        const linkElement = $(element).closest('a')
        let url = linkElement.attr('href') || ''
        
        if (url.startsWith('/url?q=')) {
          const urlParams = new URLSearchParams(url.substring(6))
          url = urlParams.get('q') || url
        }
        
        if (title && url && !url.includes('google.com')) {
          competitors.push({ title, url })
        }
      })

      if (competitors.length > 0) {
        return `Found ${competitors.length} competitors: ${competitors.map(c => `${c.title} (${c.url})`).join('; ')}`
      }
      
      // Fallback with relevant competitor insights based on topic
      const fallbackInsights = getTopicSpecificCompetitorInsights(topic)
      return fallbackInsights
      
    } catch (error) {
      console.error('Competitor analysis error:', error)
      const fallbackInsights = getTopicSpecificCompetitorInsights(topic)
      return fallbackInsights
    }
  },
  {
    name: "competitor_analysis",
    description: "Analyze competitors by scraping Google search results for a given topic",
    schema: z.object({
      topic: z.string().describe("The topic to analyze competitors for")
    })
  }
)

const imageGenerationTool = tool(
  async ({ topic, keywords }: { topic: string; keywords: string }) => {
    const hfToken = process.env.HUGGINGFACE_API_KEY

    if (!hfToken) {
      return 'No Hugging Face API key found, skipping image generation'
    }

    try {
      console.log(`🎨 LangChain Tool: Generating image for: ${topic}`)
      
      const imagePrompt = createImagePrompt(topic, keywords.split(', '))
      
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
              height: 576,
            }
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`)
      }

      const imageBuffer = Buffer.from(await response.arrayBuffer())
      const slug = topic.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-")
      const filename = `${slug}-${Date.now()}.jpg`
      
      // Import Firebase storage helper (dynamic import to avoid issues)
      const { FirebaseDB } = await import('./firebase')
      
      // Upload to Firebase Storage instead of local filesystem
      const firebaseImageUrl = await FirebaseDB.uploadImage(imageBuffer, filename)
      
      return `Image generated successfully: ${firebaseImageUrl}`
      
    } catch (error) {
      return `Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
  {
    name: "image_generation",
    description: "Generate AI images for blog posts using Hugging Face Stable Diffusion",
    schema: z.object({
      topic: z.string().describe("The topic to generate an image for"),
      keywords: z.string().describe("Comma-separated keywords to include in the image prompt")
    })
  }
)

const contentGenerationTool = tool(
  async ({ topic, keywords, competitorInsights }: { topic: string; keywords: string; competitorInsights: string }) => {
    try {
      console.log(`✍️ LangChain Tool: Generating content for: ${topic}`)
      
      // Use Gemini to generate the blog content
      const llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        apiKey: process.env.GOOGLE_AI_API_KEY,
        temperature: 0.7,
      })

      const contentPrompt = ChatPromptTemplate.fromTemplate(`
        Write a comprehensive, SEO-optimized blog post about "{topic}".
        
        Keywords to include: {keywords}
        Competitor insights: {competitorInsights}
        
        Requirements:
        - 2000+ words
        - Proper markdown formatting with headers (H1, H2, H3)
        - Include the keywords naturally throughout
        - Professional, engaging tone
        - Include actionable insights
        - Add a compelling introduction and conclusion
        
        Format as markdown starting with an H1 title.
      `)

      const result = await llm.invoke(
        await contentPrompt.format({
          topic,
          keywords,
          competitorInsights
        })
      )

      return result.content as string
      
    } catch (error) {
      return `Error generating content: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
  {
    name: "content_generation",
    description: "Generate SEO-optimized blog content using AI",
    schema: z.object({
      topic: z.string().describe("The topic to write about"),
      keywords: z.string().describe("Comma-separated keywords to include"),
      competitorInsights: z.string().describe("Insights from competitor analysis")
    })
  }
)

const socialMediaTool = tool(
  async ({ topic, keywords }: { topic: string; keywords: string }) => {
    const keywordList = keywords.split(', ')
    const posts = [
      `🚀 Just published a comprehensive guide on ${topic}! Everything you need to know about ${keywordList[0]} and more. Check it out! #${keywordList[1]?.replace(/\s+/g, '') || 'content'}`,
      
      `💡 Pro tip: ${topic} is more important than ever. Here are the key insights every professional should know about ${keywordList[0]}...`,
      
      `📈 The ultimate ${topic} breakdown is here! From ${keywordList[0]} to advanced strategies, this guide covers it all. Link in bio!`,
      
      `🎯 New blog post alert! Everything you need to know about ${topic} in one comprehensive guide. From ${keywordList[0]} to advanced strategies - it's all covered! Link in bio 👆`
    ]

    return `Social Media Posts Generated:
1. ${posts[0]}
2. ${posts[1]}
3. ${posts[2]}
4. ${posts[3]}`
  },
  {
    name: "social_media_generation",
    description: "Generate social media posts for a blog topic",
    schema: z.object({
      topic: z.string().describe("The blog topic"),
      keywords: z.string().describe("Comma-separated keywords")
    })
  }
)

function createImagePrompt(topic: string, keywords: string[]): string {
  const topKeywords = keywords.slice(0, 3).join(', ')
  const topicLower = topic.toLowerCase()
  
  let basePrompt = ""
  let style = "professional, clean, modern"
  
  if (topicLower.includes('ai') || topicLower.includes('tech')) {
    basePrompt = `Futuristic AI technology concept, ${topKeywords}, digital innovation`
    style = "sci-fi, digital art, blue and purple tones"
  } else if (topicLower.includes('business')) {
    basePrompt = `Modern business environment, ${topKeywords}, professional workspace`
    style = "corporate, professional photography"
  } else {
    basePrompt = `Abstract concept representing ${topic}, ${topKeywords}`
    style = "modern, conceptual, professional"
  }
  
  return `${basePrompt}, ${style}, high quality, 16:9 aspect ratio, blog header image`
}

// Create the LangChain agent
export async function createSEOAgent() {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_AI_API_KEY,
    temperature: 0,
  })

  const tools = [
    keywordResearchTool,
    competitorAnalysisTool,
    imageGenerationTool,
    contentGenerationTool,
    socialMediaTool
  ]

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert SEO content creation agent with access to specialized tools. 

Your job is to create comprehensive content packages by using ALL available tools in sequence:

1. ALWAYS start with keyword_research tool to find trending keywords
2. Then use competitor_analysis tool to understand the competitive landscape  
3. Use content_generation tool to write the blog post (using keywords and competitor insights)
4. Use image_generation tool to create a blog banner image
5. Finally use social_media_generation tool to create promotional posts

After using all tools, provide the results in this EXACT JSON-like format (but as plain text):

KEYWORDS: keyword1, keyword2, keyword3, keyword4, keyword5
COMPETITORS: competitor1|url1, competitor2|url2, competitor3|url3  
IMAGE_URL: /generated-images/filename.jpg
CONTENT_GENERATED: YES
BLOG_CONTENT_START:
[paste the full blog content here]
BLOG_CONTENT_END:
SOCIAL_POSTS_START:
1. [social post 1]
2. [social post 2] 
3. [social post 3]
4. [social post 4]
SOCIAL_POSTS_END:

This format makes it easy to extract each piece of data. Always use ALL the tools and provide results in this exact format.`],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"]
  ])

  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt
  })

  return new AgentExecutor({
    agent,
    tools,
    verbose: true,
    maxIterations: 10
  })
}

// Helper function to get topic-specific competitor insights
function getTopicSpecificCompetitorInsights(topic: string): string {
  const topicLower = topic.toLowerCase()
  
  if (topicLower.includes('next') || topicLower.includes('nextjs') || topicLower.includes('next.js')) {
    return `Top Next.js competitors include: Vercel Blog (https://vercel.com/blog) - focuses on performance and developer experience, Next.js Docs (https://nextjs.org/learn) - comprehensive tutorials and guides, and Dev.to Next.js articles (https://dev.to/t/nextjs) - community-driven content. These competitors emphasize Next.js benefits like SSR, SSG, and improved SEO capabilities.`
  }
  
  if (topicLower.includes('ai')) {
    return `AI content competitors focus on practical applications, case studies, and future trends. They emphasize real-world implementations and business value propositions.`
  }
  
  return `Competitors in this space typically focus on comprehensive guides, practical examples, and actionable insights. They often use case studies and real-world applications to demonstrate value.`
}

// Helper function to get topic-specific keywords
function getTopicSpecificKeywords(topic: string): string[] {
  const topicLower = topic.toLowerCase()
  
  // Next.js specific keywords
  if (topicLower.includes('next') || topicLower.includes('nextjs') || topicLower.includes('next.js')) {
    return [
      'nextjs', 'react framework', 'server side rendering', 'static site generation', 
      'next.js benefits', 'vercel', 'react', 'javascript framework', 'full stack react',
      'next.js performance'
    ]
  }
  
  // AI/Tech specific keywords  
  if (topicLower.includes('ai') || topicLower.includes('artificial intelligence') || topicLower.includes('tech')) {
    return ['ai', 'artificial intelligence', 'machine learning', 'technology', 'automation', 'innovation', 'digital transformation', 'future tech']
  }
  
  // Business keywords
  if (topicLower.includes('business') || topicLower.includes('marketing')) {
    return ['business strategy', 'marketing', 'growth', 'entrepreneurship', 'digital marketing', 'business development', 'leadership', 'success']
  }
  
  // Generic but relevant keywords
  return ['guide', 'tips', 'best practices', 'benefits', 'how to', 'tutorial', 'examples', 'strategy']
}

// Execute the SEO agent workflow
export async function runSEOAgentWorkflow(topic: string) {
  const executor = await createSEOAgent()
  
  const result = await executor.invoke({
    input: `Create a comprehensive SEO content package for the topic: "${topic}". 
    
    Please use all available tools to:
    1. Research trending keywords
    2. Analyze competitors
    3. Generate a high-quality blog post
    4. Create a relevant image
    5. Generate social media posts
    
    Return a summary of all the work completed.`
  })

  return result
}
