import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '../../../lib/blog-firebase'

export async function GET() {
  try {
    console.log('Fetching all blog posts...')
    const posts = await getAllBlogPosts()
    console.log(`Found ${posts.length} posts`)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}
