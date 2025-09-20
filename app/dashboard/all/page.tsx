"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, ExternalLink, LogOut, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { removeAuthCookie } from "@/lib/auth"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  category: string
  readTime: string
  publishedAt: string
  keywords: string[]
  image?: string
}

function AdminAllBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleLogout = () => {
    removeAuthCookie()
    router.push("/")
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId: string, slug: string) => {
    setDeletingId(blogId)
    try {
      const response = await fetch('/api/blogs/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: blogId, slug }),
      })

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== blogId))
      } else {
        console.error('Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-lg">Loading blogs...</div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Blog Posts</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage all your blog content</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{blogs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">With Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {blogs.filter(blog => blog.image).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {new Set(blogs.map(blog => blog.category)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog List */}
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-32 h-24 flex-shrink-0">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{blog.category}</Badge>
                          <Badge variant="outline">{blog.readTime}</Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {blog.excerpt.replace(/#+\s*/g, '').substring(0, 150)}...
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {blog.keywords.slice(0, 5).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {blog.keywords.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.keywords.length - 5} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Published: {blog.publishedAt} • ID: {blog.id}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/blog/${blog.slug}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={deletingId === blog.id}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {deletingId === blog.id ? 'Deleting...' : 'Delete'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                                  This will remove the blog post from the list and delete the associated content file.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBlog(blog.id, blog.slug)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {blogs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts found.</p>
                <Link href="/dashboard">
                  <Button className="mt-4">
                    Create Your First Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}

export default function AdminAllBlogsPage() {
  return <AdminAllBlogs />
}
