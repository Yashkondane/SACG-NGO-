import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    title: 'Celebrating Diwali: A Guide to the Festival of Lights',
    excerpt: 'Discover the rich traditions and modern celebrations of Diwali in Greater New Haven. Learn about the significance of this beautiful festival and how our community comes together.',
    author: 'Priya Sharma',
    date: 'January 28, 2026',
    category: 'Culture',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Building Community Through Shared Meals',
    excerpt: 'Food has always been at the heart of South Asian culture. Explore how our community potlucks create connections and celebrate our diverse culinary heritage.',
    author: 'Rajesh Patel',
    date: 'January 20, 2026',
    category: 'Community',
    readTime: '4 min read',
  },
  {
    id: 3,
    title: 'Teaching Heritage Languages to the Next Generation',
    excerpt: 'How SACG\'s language programs are helping children connect with their cultural roots while growing up in America. Success stories from our youth education initiatives.',
    author: 'Anjali Mehta',
    date: 'January 15, 2026',
    category: 'Education',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'The Impact of Community Support: A Member\'s Journey',
    excerpt: 'A heartwarming story of how SACG helped a new family navigate life in New Haven, from finding housing to making lifelong friends.',
    author: 'Vikram Singh',
    date: 'January 10, 2026',
    category: 'Stories',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Classical Arts in Contemporary Times',
    excerpt: 'Exploring how traditional South Asian dance, music, and art forms remain relevant and vibrant in modern American society through our cultural programs.',
    author: 'Deepa Chatterjee',
    date: 'January 5, 2026',
    category: 'Arts',
    readTime: '5 min read',
  },
  {
    id: 6,
    title: 'Volunteer Spotlight: Making a Difference One Event at a Time',
    excerpt: 'Meet the dedicated volunteers who make SACG events possible. Their stories of service, commitment, and the joy of giving back to the community.',
    author: 'Kiran Desai',
    date: 'December 28, 2025',
    category: 'Community',
    readTime: '4 min read',
  },
]

const categories = ['All', 'Culture', 'Community', 'Education', 'Stories', 'Arts']

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">SACG Blog</h1>
            <p className="text-lg md:text-xl max-w-3xl text-balance">
              Stories, insights, and reflections from our vibrant South Asian community.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === 'All' ? 'default' : 'secondary'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 text-sm"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Badge className="mb-4">Featured</Badge>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  <div className="md:w-2/5 bg-gradient-to-br from-primary/20 to-accent/20 min-h-[300px]" />
                  <div className="md:w-3/5">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Badge variant="secondary">{blogPosts[0].category}</Badge>
                        <span>•</span>
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                      <CardTitle className="text-3xl mb-3">{blogPosts[0].title}</CardTitle>
                      <CardDescription className="text-base">{blogPosts[0].excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{blogPosts[0].author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{blogPosts[0].date}</span>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/blog/${blogPosts[0].id}`}>
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {blogPosts.slice(1).map((post) => (
                <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10" />
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href={`/blog/${post.id}`}>Read Article</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Never Miss a Story</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-balance">
              Subscribe to our newsletter to get the latest blog posts and community updates delivered to your inbox.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/newsletter">Subscribe Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
