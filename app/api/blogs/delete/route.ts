import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAllBlogPosts } from '@/lib/blog'

export async function DELETE(request: NextRequest) {
  try {
    const { id, slug } = await request.json()

    if (!id || !slug) {
      return NextResponse.json(
        { error: 'Blog ID and slug are required' },
        { status: 400 }
      )
    }

    // Read current blogs
    const blogsJsonPath = path.join(process.cwd(), 'data', 'blogs.json')
    const postsDir = path.join(process.cwd(), 'posts')
    const socialPostsDir = path.join(process.cwd(), 'public', 'social_posts')

    // Remove from blogs.json
    const allBlogs = getAllBlogPosts()
    const blogToDelete = allBlogs.find(blog => blog.id === id)
    
    if (!blogToDelete) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    const updatedBlogs = allBlogs.filter(blog => blog.id !== id)
    fs.writeFileSync(blogsJsonPath, JSON.stringify(updatedBlogs, null, 2))

    // Remove MDX file
    const mdxPath = path.join(postsDir, `${slug}.mdx`)
    if (fs.existsSync(mdxPath)) {
      fs.unlinkSync(mdxPath)
    }

    // Remove social posts file
    const socialPostsPath = path.join(socialPostsDir, `${slug}.txt`)
    if (fs.existsSync(socialPostsPath)) {
      fs.unlinkSync(socialPostsPath)
    }

    console.log(`✅ Deleted blog post: ${blogToDelete.title} (${id})`)

    return NextResponse.json({
      success: true,
      message: `Blog post "${blogToDelete.title}" deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
