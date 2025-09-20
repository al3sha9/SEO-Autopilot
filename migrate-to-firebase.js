// Migration script to move existing blog data to Firebase
import fs from 'fs'
import path from 'path'
import FirebaseDB from './lib/firebase.js'

async function migrateBlogsToFirebase() {
  try {
    console.log('🚀 Starting migration to Firebase...')
    
    // Check if old data exists
    const blogsJsonPath = path.join(process.cwd(), 'data', 'blogs.json')
    
    if (!fs.existsSync(blogsJsonPath)) {
      console.log('📝 No existing blog data found, starting fresh.')
      return
    }
    
    // Read existing blogs
    const existingBlogs = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf8'))
    console.log(`📚 Found ${existingBlogs.length} existing blogs`)
    
    // Migrate each blog
    for (const blog of existingBlogs) {
      try {
        // Read blog content if exists
        const postsDir = path.join(process.cwd(), 'posts')
        const contentPath = path.join(postsDir, `${blog.slug}.mdx`)
        let content = blog.content || ''
        
        if (fs.existsSync(contentPath)) {
          content = fs.readFileSync(contentPath, 'utf8')
        }
        
        // Create in Firebase
        await FirebaseDB.createBlog({
          ...blog,
          content
        })
        
        console.log(`✅ Migrated: ${blog.title}`)
      } catch (error) {
        console.error(`❌ Failed to migrate ${blog.title}:`, error)
      }
    }
    
    console.log('🎉 Migration completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run migration
migrateBlogsToFirebase()
