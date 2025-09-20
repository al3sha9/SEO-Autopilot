"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, TrendingUp, Palette, Briefcase, Globe, Heart, Zap, Menu, X } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  slug: string
  image?: string
  publishedAt: string
  readTime: string
}

const categories = [
  {
    name: "Technology",
    description: "Latest trends in tech, AI, and digital innovation",
    icon: Zap,
    color: "bg-blue-100 text-blue-700",
    posts: 0
  },
  {
    name: "Design",
    description: "UI/UX design principles and creative inspiration",
    icon: Palette,
    color: "bg-purple-100 text-purple-700",
    posts: 0
  },
  {
    name: "Business",
    description: "Entrepreneurship, strategy, and growth insights",
    icon: Briefcase,
    color: "bg-green-100 text-green-700",
    posts: 0
  },
  {
    name: "Marketing",
    description: "Digital marketing strategies and SEO tips",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-700",
    posts: 0
  },
  {
    name: "Lifestyle",
    description: "Health, wellness, and personal development",
    icon: Heart,
    color: "bg-pink-100 text-pink-700",
    posts: 0
  },
  {
    name: "Culture",
    description: "Society, trends, and cultural commentary",
    icon: Globe,
    color: "bg-indigo-100 text-indigo-700",
    posts: 0
  }
]

export default function CategoriesPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      setBlogPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Count posts per category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    posts: blogPosts.filter(post => 
      post.category.toLowerCase() === category.name.toLowerCase()
    ).length
  }))

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = !selectedCategory || 
      post.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">BlogBot</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Home
            </Link>
            <Link href="/blogs" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Articles
            </Link>
            <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              About
            </Link>
            <Link href="/categories" className="px-4 py-2 text-gray-900 bg-gray-50 text-sm font-medium transition-colors duration-200 rounded-lg">
              Categories
            </Link>
            <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Contact
            </Link>
            <Link href="/dashboard" className="ml-4">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
              <Link href="/" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                Home
              </Link>
              <Link href="/blogs" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                Articles
              </Link>
              <Link href="/about" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                About
              </Link>
              <Link href="/categories" className="block px-4 py-3 text-gray-900 bg-gray-50 text-sm font-medium transition-colors duration-200 rounded-lg">
                Categories
              </Link>
              <Link href="/contact" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link href="/dashboard" className="block">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 text-sm font-medium rounded-full transition-all duration-200">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 mb-8 leading-tight tracking-tight">
            Explore Categories
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Discover curated content across various topics, from cutting-edge technology to creative design insights.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose a category to explore related articles and insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categoriesWithCounts.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )}
                  className={`text-left p-8 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    selectedCategory === category.name
                      ? 'border-black bg-white shadow-xl'
                      : 'border-gray-200/50 bg-white hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${category.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {category.posts} articles
                    </span>
                    <ArrowRight className={`h-5 w-5 transition-transform ${
                      selectedCategory === category.name ? 'rotate-90' : ''
                    }`} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Clear Filter Button */}
          {selectedCategory && (
            <div className="text-center mb-8">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-full"
              >
                Show All Categories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
                {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
              </h2>
              <p className="text-lg text-gray-600">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Link href="/blogs">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] bg-gray-100 animate-pulse"></div>
                  <div className="p-8">
                    <div className="h-4 bg-gray-100 animate-pulse rounded-full mb-4 w-20"></div>
                    <div className="h-6 bg-gray-100 animate-pulse rounded-full mb-4"></div>
                    <div className="h-16 bg-gray-100 animate-pulse rounded-xl mb-6"></div>
                    <div className="h-4 bg-gray-100 animate-pulse rounded-full w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No articles found</h3>
              <p className="text-gray-600 mb-8">
                {selectedCategory 
                  ? `No articles found in the ${selectedCategory} category.`
                  : 'No articles match your search criteria.'
                }
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory(null)
                  setSearchTerm("")
                }}
                className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="group cursor-pointer bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-gray-300/50">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg?height=300&width=400"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {post.readTime}
                        </div>
                        <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors flex items-center">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-semibold text-gray-900 mb-6">BlogBot</h4>
              <p className="text-gray-600 leading-relaxed text-lg max-w-md">
                AI-powered SEO content generator that creates optimized blog posts, conducts keyword research, and generates social media content automatically.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-6">Categories</h5>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <Link href="/category/technology" className="hover:text-gray-900 transition-colors text-lg">
                    Technology
                  </Link>
                </li>
                <li>
                  <Link href="/category/design" className="hover:text-gray-900 transition-colors text-lg">
                    Design
                  </Link>
                </li>
                <li>
                  <Link href="/category/business" className="hover:text-gray-900 transition-colors text-lg">
                    Business
                  </Link>
                </li>
                <li>
                  <Link href="/category/culture" className="hover:text-gray-900 transition-colors text-lg">
                    Culture
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-6">Connect</h5>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-gray-900 transition-colors text-lg">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-900 transition-colors text-lg">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-gray-900 transition-colors text-lg">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gray-900 transition-colors text-lg">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200/50 mt-16 pt-8 text-center">
            <p className="text-gray-500 text-lg">&copy; 2024 BlogBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
