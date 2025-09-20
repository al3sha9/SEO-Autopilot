import fs from 'fs';
import path from 'path';

export interface BlogPost {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  slug: string;
  category: string;
  readTime: string;
  publishedAt: string;
  keywords: string[];
  image?: string;
}

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export function getAllBlogPosts(): BlogPost[] {
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'blogs.json');
    if (!fs.existsSync(jsonPath)) return [];
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogPost(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return null;

  try {
    const filePath = path.join(process.cwd(), 'posts', `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return { ...post, content };
    }
  } catch (error) {
    console.error('Error reading blog post content:', error);
  }
  return post;
}

export function createBlogPost(title: string, content: string, keywords: string[] = []): { slug: string; title: string } {
  const slug = generateSlug(title);
  
  // Create blog post metadata
  const newPost: BlogPost = {
    id: Date.now().toString(),
    title,
    excerpt: content.substring(0, 200) + "...",
    slug,
    category: "General",
    readTime: "5 min read",
    publishedAt: new Date().toISOString().split("T")[0],
    keywords
  };

  // Save to JSON
  try {
    const existingPosts = getAllBlogPosts();
    existingPosts.unshift(newPost);
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, 'blogs.json'), JSON.stringify(existingPosts, null, 2));
  } catch (error) {
    console.error('Error saving blog metadata:', error);
  }

  // Save content to MDX
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
    fs.writeFileSync(path.join(postsDir, `${slug}.mdx`), content);
    console.log(`✅ Blog post saved: ${title} -> ${slug}`);
  } catch (error) {
    console.error('Error saving blog content:', error);
  }

  return { slug, title };
}

export function saveSocialPosts(slug: string, socialPosts: string[]): void {
  try {
    const socialDir = path.join(process.cwd(), 'public', 'social_posts');
    if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });
    const content = socialPosts.join('\n\n---\n\n');
    fs.writeFileSync(path.join(socialDir, `${slug}.txt`), content);
    console.log(`📱 Social posts saved for: ${slug}`);
  } catch (error) {
    console.error('Error saving social posts:', error);
  }
}
