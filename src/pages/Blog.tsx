import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category_name: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const POSTS_PER_PAGE = 6;

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, categories]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("blog_categories")
      .select("id, name, slug")
      .order("name");
    setCategories(data || []);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      // Get category ID if selected
      let categoryId: string | null = null;
      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat) categoryId = cat.id;
      }

      // If category is selected, get blog IDs from junction table first
      let blogIds: string[] | null = null;
      if (categoryId) {
        const { data: junctionData } = await supabase
          .from("blog_to_categories")
          .select("blog_id")
          .eq("category_id", categoryId);
        blogIds = junctionData?.map((j) => j.blog_id) || [];
      }

      // Fetch blogs with optional filtering
      let blogsQuery = supabase
        .from("blogs")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (blogIds !== null) {
        if (blogIds.length === 0) {
          setBlogs([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }
        blogsQuery = blogsQuery.in("id", blogIds);
      }

      // Get total count first
      const { data: allBlogs } = await blogsQuery;
      setTotalCount(allBlogs?.length || 0);

      // Now get paginated results
      const { data: blogsData, error } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .in("id", blogIds || allBlogs?.map(b => b.id) || [])
        .range(from, to);

      if (error) throw error;

      // Fetch category names for each blog using junction table
      const blogsWithCategories = await Promise.all(
        (blogsData || []).map(async (blog) => {
          const { data: catJunction } = await supabase
            .from("blog_to_categories")
            .select("category_id")
            .eq("blog_id", blog.id)
            .limit(1);
          
          let categoryName: string | null = null;
          if (catJunction && catJunction.length > 0) {
            const cat = categories.find((c) => c.id === catJunction[0].category_id);
            categoryName = cat?.name || null;
          }

          return {
            ...blog,
            category_name: categoryName,
          };
        })
      );

      setBlogs(blogsWithCategories);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const handleCategoryClick = (slug: string | null) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const readingTime = (content: string | null) => {
    if (!content) return "1 min read";
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and updates from XView Global.
          </p>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(null)}
            >
              All Posts
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No blog posts found.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <Link to={`/blog/${blog.slug}`}>
                      {blog.featured_image ? (
                        <div className="h-48 overflow-hidden">
                          <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/30">{blog.title.charAt(0)}</span>
                        </div>
                      )}
                    </Link>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        {blog.category_name && (
                          <Badge variant="secondary" className="text-xs">{blog.category_name}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readingTime(blog.excerpt)}
                        </span>
                      </div>
                      <Link to={`/blog/${blog.slug}`}>
                        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h2>
                      </Link>
                      {blog.excerpt && <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{blog.excerpt}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(blog.published_at || blog.created_at), "MMM d, yyyy")}
                        </span>
                        <Link to={`/blog/${blog.slug}`} className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;