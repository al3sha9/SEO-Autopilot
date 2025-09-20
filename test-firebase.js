// Test Firebase connection
require('dotenv').config({ path: '.env.local' })
const admin = require('firebase-admin')

async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase connection...')
    console.log('📋 Environment check:')
    console.log('- Project ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')
    console.log('- Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing')
    console.log('- Private Key:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing')
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Missing Firebase environment variables')
    }
    
    // Initialize Firebase Admin
    if (admin.apps.length === 0) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    }
    
    // Test Firestore connection
    const db = admin.firestore()
    
    // Try to get a collection
    const collections = await db.listCollections()
    console.log('✅ Firebase connected successfully!')
    console.log('📊 Available collections:', collections.map(c => c.id))
    
    return true
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message)
    
    if (error.message.includes('NOT_FOUND') || error.message.includes('5 NOT_FOUND')) {
      console.log('\n💡 SOLUTION NEEDED:')
      console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/trends-472713')
      console.log('2. Click "Firestore Database" in the sidebar')
      console.log('3. Click "Create database"')
      console.log('4. Choose "Start in test mode"')
      console.log('5. Select a region and click "Done"')
      console.log('\nThen try generating a blog post again!')
    }
    
    return false
  }
}

// Run the test
testFirebaseConnection()
