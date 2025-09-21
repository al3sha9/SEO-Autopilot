// Blog post management utilities
import FirebaseDB from './firebase'

export interface BlogPost {
  id: string
  title: string
  content?: string
  excerpt: string
  slug: string
  category: string
  readTime: string
  publishedAt: string
  keywords: string[]
  image?: string
}

// Generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
}

// Calculate estimated read time based on content length
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

// Extract excerpt from content (first 200 characters as requested)
export function generateExcerpt(content: string): string {
  // Remove markdown formatting for excerpt
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim()

  return plainText.length > 200 ? plainText.substring(0, 200) + "..." : plainText
}

// Determine category based on content keywords
export function suggestCategory(content: string): string {
  const contentLower = content.toLowerCase()

  if (contentLower.includes("fashion") || contentLower.includes("style") || contentLower.includes("clothing")) {
    return "Fashion"
  } else if (contentLower.includes("seo") || contentLower.includes("marketing") || contentLower.includes("digital")) {
    return "Marketing"
  } else if (
    contentLower.includes("business") ||
    contentLower.includes("entrepreneur") ||
    contentLower.includes("startup")
  ) {
    return "Business"
  } else if (contentLower.includes("design") || contentLower.includes("ui") || contentLower.includes("ux")) {
    return "Design"
  } else if (
    contentLower.includes("code") ||
    contentLower.includes("programming") ||
    contentLower.includes("development")
  ) {
    return "Development"
  } else if (contentLower.includes("technology") || contentLower.includes("tech") || contentLower.includes("ai")) {
    return "Technology"
  }

  return "General"
}

// Read all blog posts from JSON file
export function getAllBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOGS_JSON_PATH)) {
      return []
    }
    const jsonData = fs.readFileSync(BLOGS_JSON_PATH, 'utf8')
    return JSON.parse(jsonData)
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

// Read a single blog post content from MDX file
export function getBlogPostContent(slug: string): string | null {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return null
    }
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    console.error('Error reading blog post content:', error)
    return null
  }
}

// Get a single blog post with content
export function getBlogPost(slug: string): BlogPost | null {
  const posts = getAllBlogPosts()
  const post = posts.find(p => p.slug === slug)
  if (!post) return null

  const content = getBlogPostContent(slug)
  return { ...post, content: content || undefined }
}

// Save blog post metadata to JSON and content to MDX file
export function saveBlogPost(title: string, content: string, keywords: string[], imageUrl?: string): BlogPost {
  const slug = generateSlug(title)
  const excerpt = generateExcerpt(content)
  const category = suggestCategory(content)
  const readTime = calculateReadTime(content)

  const newPost: BlogPost = {
    id: Date.now().toString(),
    title,
    excerpt,
    slug,
    category,
    readTime,
    publishedAt: new Date().toISOString().split("T")[0],
    keywords,
    ...(imageUrl && { image: imageUrl })
  }

  // Save to JSON file
  const existingPosts = getAllBlogPosts()
  existingPosts.unshift(newPost) // Add to beginning

  // Ensure data directory exists
  const dataDir = path.dirname(BLOGS_JSON_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  fs.writeFileSync(BLOGS_JSON_PATH, JSON.stringify(existingPosts, null, 2))

  // Save content to MDX file
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true })
  }

  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`)
  
  // Add image banner to content if imageUrl is provided
  let finalContent = content
  if (imageUrl) {
    // Add image banner after the title but before the content
    const lines = content.split('\n')
    const titleIndex = lines.findIndex(line => line.startsWith('# '))
    if (titleIndex !== -1) {
      lines.splice(titleIndex + 1, 0, '', `![${title}](${imageUrl})`, '')
      finalContent = lines.join('\n')
    } else {
      // If no title found, add at the beginning
      finalContent = `![${title}](${imageUrl})\n\n${content}`
    }
  }
  
  fs.writeFileSync(mdxPath, finalContent)

  return newPost
}

// Save social media posts to text file
export function saveSocialPosts(slug: string, socialPosts: string[]): void {
  try {
    if (!fs.existsSync(SOCIAL_POSTS_DIR)) {
      fs.mkdirSync(SOCIAL_POSTS_DIR, { recursive: true })
    }

    const filePath = path.join(SOCIAL_POSTS_DIR, `${slug}.txt`)
    const content = socialPosts.join('\n\n---\n\n')
    fs.writeFileSync(filePath, content)
  } catch (error) {
    console.error('Error saving social posts:', error)
  }
}

// Extract title from content (first H1 or first line)
export function extractTitleFromContent(content: string): string {
  const lines = content.split('\n')
  
  // Look for first H1
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.substring(2).trim()
    }
  }
  
  // Fallback to first non-empty line
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed) {
      return trimmed
    }
  }
  
  return 'Untitled Post'
}

// Create blog post from generated content
export function createBlogPost(generatedTitle: string, content: string, keywords: string[] = [], imageUrl?: string): { slug: string; title: string } {
  // Extract title from content if it looks like it has an H1, otherwise use generated title
  const title = extractTitleFromContent(content) || generatedTitle
  
  const savedPost = saveBlogPost(title, content, keywords, imageUrl)
  
  return {
    slug: savedPost.slug,
    title: savedPost.title
  }
}
