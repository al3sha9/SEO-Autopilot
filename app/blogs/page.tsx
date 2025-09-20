"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Clock, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const router = useRouter()

  // Set page title
  useEffect(() => {
    document.title = "All Articles | BlogBot"
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      if (response.ok) {
        const data = await response.json()
        // Firebase API returns { posts: [] } format
        setBlogs(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  // Filter blogs based on search query and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(blogs.map(blog => blog.category)))]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg">Loading articles...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">All Articles</h1>
                <p className="text-muted-foreground">Discover our latest insights and stories</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by title, content, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{blogs.length}</div>
              <div className="text-sm text-muted-foreground">Total Articles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {blogs.filter(blog => blog.image).length}
              </div>
              <div className="text-sm text-muted-foreground">With Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(blogs.reduce((acc, blog) => acc + parseInt(blog.readTime), 0) / blogs.length) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Read Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-all duration-300 group">
              <div className="relative overflow-hidden">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary/20">
                      {blog.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <Badge className="absolute top-3 left-3" variant="secondary">
                  {blog.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {blog.readTime}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {blog.excerpt.replace(/#+\s*/g, '').substring(0, 120)}...
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.keywords.slice(0, 3).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {blog.keywords.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{blog.keywords.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Link href={`/blog/${blog.slug}`}>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Read Article
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "All" 
                  ? "No articles match your search criteria." 
                  : "No articles found."}
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredBlogs.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
