// Blog post management utilities using Firebase
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

  return plainText.length > 200 ? plainText.substring(0, 197) + "..." : plainText
}

// Generate unique ID for blog posts
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Default categories for new blogs
export const defaultCategories = [
  "Technology",
  "Business", 
  "Design",
  "Marketing",
  "Lifestyle",
  "Culture"
]

// Load all blog posts from Firebase
export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    return await FirebaseDB.getAllBlogs()
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

// Get a single blog post by slug
export async function getBlogBySlug(slug: string): Promise<(BlogPost & { content?: string }) | null> {
  try {
    return await FirebaseDB.getBlogBySlug(slug)
  } catch (error) {
    console.error('Error getting blog by slug:', error)
    return null
  }
}

// Get all blog posts (sorted by publishedAt descending)
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await loadBlogPosts()
}

// Get recent blog posts (last N posts)
export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts()
  return allPosts.slice(0, limit)
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts()
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase())
}

// Get all unique categories
export async function getAllCategories(): Promise<string[]> {
  const stats = await FirebaseDB.getStats()
  return stats.categories
}

// Create new blog post
export async function createBlogPost(
  title: string,
  content: string,
  category: string,
  keywords: string[] = [],
  image?: string
): Promise<BlogPost> {
  const slug = generateSlug(title)
  const excerpt = generateExcerpt(content)
  const readTime = calculateReadTime(content)
  const id = generateId()

  const blogPost: BlogPost = {
    id,
    title,
    content,
    excerpt,
    slug,
    category,
    readTime,
    publishedAt: new Date().toISOString(),
    keywords,
    image
  }

  return await FirebaseDB.createBlog(blogPost)
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await FirebaseDB.deleteBlog(id)
    return true
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
}

// Save social media posts for a blog
export async function saveSocialPosts(blogId: string, socialContent: string): Promise<void> {
  try {
    await FirebaseDB.saveSocialPosts(blogId, socialContent)
  } catch (error) {
    console.error('Error saving social posts:', error)
    throw error
  }
}

// Get social media posts for a blog
export async function getSocialPosts(blogId: string): Promise<string | null> {
  try {
    const result = await FirebaseDB.getSocialPosts(blogId)
    return result?.content || null
  } catch (error) {
    console.error('Error getting social posts:', error)
    return null
  }
}
