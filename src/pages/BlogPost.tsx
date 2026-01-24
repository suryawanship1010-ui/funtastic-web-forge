import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category_name: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, content, excerpt, featured_image, published_at, created_at, category_id")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        if (error.code === "PGRST116") setNotFound(true);
        else throw error;
      } else if (data) {
        let categoryName: string | null = null;
        if (data.category_id) {
          const { data: catData } = await supabase
            .from("blog_categories")
            .select("name")
            .eq("id", data.category_id)
            .single();
          categoryName = catData?.name || null;
        }
        setBlog({ ...data, category_name: categoryName });
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const readingTime = (content: string | null) => {
    if (!content) return "1 min read";
    return `${Math.ceil(content.split(/\s+/).length / 200)} min read`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: blog?.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 max-w-3xl animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4" />
          <div className="h-12 bg-muted rounded w-3/4 mb-8" />
          <div className="h-64 bg-muted rounded" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Button asChild><Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {blog.category_name && <Badge variant="secondary">{blog.category_name}</Badge>}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(blog.published_at || blog.created_at), "MMMM d, yyyy")}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />{readingTime(blog.content)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{blog.title}</h1>
          {blog.excerpt && <p className="text-xl text-muted-foreground mb-8">{blog.excerpt}</p>}
          {blog.featured_image && (
            <div className="mb-10 rounded-xl overflow-hidden">
              <img src={blog.featured_image} alt={blog.title} className="w-full h-auto" />
            </div>
          )}

          <div className="flex justify-end mb-8">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />Share
            </Button>
          </div>

          {blog.content && (
            <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderMarkdown(blog.content)}</p>` }} />
          )}

          <div className="mt-12 pt-8 border-t flex items-center justify-between">
            <Link to="/blog" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />More Articles
            </Link>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />Share
            </Button>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;
