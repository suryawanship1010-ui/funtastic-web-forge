import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  Eye, 
  Send, 
  ImagePlus,
  X,
  CalendarIcon,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Tables } from "@/integrations/supabase/types";
import RichTextEditor from "@/components/admin/RichTextEditor";
import OGPreview from "@/components/admin/OGPreview";

type Blog = Tables<"blogs"> & { scheduled_at?: string | null };
type Category = { id: string; name: string; slug: string };

const BlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id && id !== "new");

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showOGPreview, setShowOGPreview] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [categoryId, setCategoryId] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [isUploading, setIsUploading] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("blog_categories").select("*");
    setCategories(data || []);
  };

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content || "");
        setExcerpt(data.excerpt || "");
        setFeaturedImage(data.featured_image || "");
        
        // Handle scheduled posts
        const blogData = data as Blog;
        if (blogData.scheduled_at) {
          setStatus("scheduled");
          const scheduledDateTime = new Date(blogData.scheduled_at);
          setScheduledDate(scheduledDateTime);
          setScheduledTime(format(scheduledDateTime, "HH:mm"));
        } else {
          setStatus(data.status as "draft" | "published");
        }

        // Fetch category
        const { data: categoryData } = await supabase
          .from("blog_to_categories")
          .select("category_id")
          .eq("blog_id", data.id)
          .single();
        
        if (categoryData) {
          setCategoryId(categoryData.category_id);
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog");
      navigate("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      setFeaturedImage(publicUrl);
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const saveBlog = async (publishStatus: "draft" | "published" | "scheduled") => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setSaving(true);
    try {
      let publishedAt: string | null = null;
      let scheduledAt: string | null = null;
      let finalStatus = publishStatus;

      if (publishStatus === "published") {
        publishedAt = new Date().toISOString();
      } else if (publishStatus === "scheduled" && scheduledDate) {
        const [hours, minutes] = scheduledTime.split(":").map(Number);
        const scheduledDateTime = new Date(scheduledDate);
        scheduledDateTime.setHours(hours, minutes, 0, 0);
        scheduledAt = scheduledDateTime.toISOString();
        finalStatus = "draft"; // Keep as draft until scheduled time
      }

      const blogData = {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim() || "",
        excerpt: excerpt.trim() || null,
        featured_image: featuredImage || null,
        status: finalStatus === "scheduled" ? "draft" : finalStatus,
        published_at: publishedAt,
        scheduled_at: scheduledAt,
        author_id: user.id,
      };

      let blogId = id;

      if (isEditing) {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("blogs")
          .insert(blogData)
          .select("id")
          .single();
        if (error) throw error;
        blogId = data.id;
      }

      // Handle category
      if (blogId) {
        await supabase.from("blog_to_categories").delete().eq("blog_id", blogId);
        if (categoryId) {
          await supabase.from("blog_to_categories").insert({
            blog_id: blogId,
            category_id: categoryId,
          });
        }
      }

      setLastSaved(new Date());
      
      if (publishStatus === "draft") {
        toast.success("Draft saved");
      } else if (publishStatus === "scheduled") {
        toast.success(`Scheduled for ${format(scheduledDate!, "PPP")} at ${scheduledTime}`);
      } else {
        toast.success("Blog published!");
        navigate("/admin/blogs");
      }

      if (!isEditing && blogId) {
        navigate(`/admin/blogs/${blogId}`, { replace: true });
      }
    } catch (error: any) {
      console.error("Error saving blog:", error);
      if (error.code === "23505") {
        toast.error("A blog with this slug already exists");
      } else {
        toast.error("Failed to save blog");
      }
    } finally {
      setSaving(false);
    }
  };

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (title && content && status === "draft") {
      const timer = setTimeout(() => {
        saveBlog("draft");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [title, content, excerpt]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blogs")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">{isEditing ? "Edit Post" : "New Post"}</h1>
              {lastSaved && (
                <p className="text-xs text-muted-foreground">
                  Last saved {format(lastSaved, "h:mm a")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={status === "published" ? "default" : status === "scheduled" ? "secondary" : "outline"}
              className="capitalize"
            >
              {status}
            </Badge>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowOGPreview(!showOGPreview)}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Social
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? "Edit" : "Preview"}
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => saveBlog("draft")}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Schedule Date</Label>
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border pointer-events-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => saveBlog("scheduled")}
                    disabled={!scheduledDate || saving}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Schedule Post
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={() => saveBlog("published")} disabled={saving}>
              <Send className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className={`grid gap-6 ${showOGPreview ? "lg:grid-cols-3" : ""}`}>
          <div className={showOGPreview ? "lg:col-span-2" : ""}>
            {previewMode ? (
              <div className="bg-card rounded-xl border p-8 shadow-lg">
                {featuredImage && (
                  <img 
                    src={featuredImage} 
                    alt={title} 
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-3xl font-bold mb-4">{title || "Untitled"}</h1>
                {excerpt && <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>}
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Title Input */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                  <Input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter your blog title..."
                    className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
                  />
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Slug</Label>
                      <Input
                        value={slug}
                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                        placeholder="blog-post-url"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="mt-1 h-8">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                  <Label className="text-sm font-medium mb-3 block">Featured Image</Label>
                  {featuredImage ? (
                    <div className="relative group">
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setFeaturedImage("")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <ImagePlus className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">
                          {isUploading ? "Uploading..." : "Click to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>

                {/* Excerpt */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                  <Label className="text-sm font-medium mb-3 block">Excerpt</Label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief description of your post (shown in previews and social shares)..."
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This will be used as the meta description for SEO and social media sharing.
                  </p>
                </div>

                {/* Rich Text Editor */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Content</Label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your amazing blog post..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* OG Preview Sidebar */}
          {showOGPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <OGPreview
                  title={title}
                  description={excerpt}
                  image={featuredImage}
                  url={`${window.location.origin}/blog/${slug}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogEditorPage;
