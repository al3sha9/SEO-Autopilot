import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (server-side)
function initFirebaseAdmin() {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  }
  
  return getApps()[0]
}

// Initialize Firebase Admin
const firebaseAdmin = initFirebaseAdmin()

// Get Firestore instance
export const db = getFirestore(firebaseAdmin)

// Database helper functions
export class FirebaseDB {
  // Blog Posts
  static async getAllBlogs(): Promise<any[]> {
    try {
      const blogsSnapshot = await db.collection('blogs').orderBy('publishedAt', 'desc').get()
      return blogsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching blogs:', error)
      return []
    }
  }

  static async getBlogBySlug(slug: string): Promise<any | null> {
    try {
      const blogSnapshot = await db.collection('blogs').where('slug', '==', slug).limit(1).get()
      if (blogSnapshot.empty) return null
      
      const doc = blogSnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      }
    } catch (error) {
      console.error('Error fetching blog by slug:', error)
      return null
    }
  }

  static async createBlog(blogData: any) {
    try {
      const docRef = await db.collection('blogs').add({
        ...blogData,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      
      return {
        id: docRef.id,
        ...blogData
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      throw error
    }
  }

  static async updateBlog(id: string, blogData: any) {
    try {
      await db.collection('blogs').doc(id).update({
        ...blogData,
        updatedAt: new Date().toISOString(),
      })
      
      return {
        id,
        ...blogData
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      throw error
    }
  }

  static async deleteBlog(id: string) {
    try {
      await db.collection('blogs').doc(id).delete()
      
      // Also delete associated social posts
      await db.collection('socialPosts').doc(id).delete()
      
      return true
    } catch (error) {
      console.error('Error deleting blog:', error)
      throw error
    }
  }

  // Social Media Posts
  static async saveSocialPosts(blogId: string, socialContent: string) {
    try {
      await db.collection('socialPosts').doc(blogId).set({
        content: socialContent,
        createdAt: new Date().toISOString(),
      })
      
      return true
    } catch (error) {
      console.error('Error saving social posts:', error)
      throw error
    }
  }

  static async getSocialPosts(blogId: string) {
    try {
      const doc = await db.collection('socialPosts').doc(blogId).get()
      if (!doc.exists) return null
      
      return doc.data()
    } catch (error) {
      console.error('Error fetching social posts:', error)
      return null
    }
  }

  // Statistics
  static async getStats() {
    try {
      const blogsSnapshot = await db.collection('blogs').get()
      const totalPosts = blogsSnapshot.size
      
      // Get categories
      const categories = new Set()
      blogsSnapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.category) categories.add(data.category)
      })
      
      // Get recent posts (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentPostsSnapshot = await db.collection('blogs')
        .where('publishedAt', '>=', thirtyDaysAgo.toISOString())
        .get()
      
      return {
        totalPosts,
        totalCategories: categories.size,
        recentPosts: recentPostsSnapshot.size,
        categories: Array.from(categories) as string[]
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        totalPosts: 0,
        totalCategories: 0,
        recentPosts: 0,
        categories: []
      }
    }
  }
}

export default FirebaseDB
