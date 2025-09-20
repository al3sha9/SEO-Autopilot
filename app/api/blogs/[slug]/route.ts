import { NextResponse } from 'next/server'
import { FirebaseDB } from '@/lib/firebase'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    console.log(`Fetching blog post with slug: ${params.slug}`)
    const post = await FirebaseDB.getBlogBySlug(params.slug)
    
    if (!post) {
      console.log(`Blog post not found for slug: ${params.slug}`)
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    console.log(`Found blog post: ${post.title}`)
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}
