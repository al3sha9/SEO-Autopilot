import { NextRequest, NextResponse } from 'next/server'
import { deleteBlogPost, getAllBlogPosts } from '@/lib/blog-firebase'

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      )
    }

    // Check if blog exists
    const allBlogs = await getAllBlogPosts()
    const blogToDelete = allBlogs.find(blog => blog.id === id)
    
    if (!blogToDelete) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Delete from Firebase
    const success = await deleteBlogPost(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete blog post from database' },
        { status: 500 }
      )
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
