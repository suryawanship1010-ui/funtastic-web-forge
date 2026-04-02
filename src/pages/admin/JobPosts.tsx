import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Users } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface JobPost {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string | null;
  experience: string | null;
  salary_range: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  title: "",
  slug: "",
  department: "",
  location: "",
  employment_type: "full-time",
  description: "",
  requirements: "",
  experience: "",
  salary_range: "",
  status: "draft",
};

const JobPosts = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as JobPost[];
    },
  });

  const { data: appCounts } = useQuery({
    queryKey: ["admin-job-app-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("job_post_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((a) => {
        counts[a.job_post_id] = (counts[a.job_post_id] || 0) + 1;
      });
      return counts;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof emptyForm & { id?: string }) => {
      const payload = {
        title: data.title,
        slug: data.slug,
        department: data.department,
        location: data.location,
        employment_type: data.employment_type,
        description: data.description,
        requirements: data.requirements || null,
        experience: data.experience || null,
        salary_range: data.salary_range || null,
        status: data.status,
      };

      if (data.id) {
        const { error } = await supabase.from("job_posts").update(payload).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("job_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success("Job post saved!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success("Job deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (job: JobPost) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      slug: job.slug,
      department: job.department,
      location: job.location,
      employment_type: job.employment_type,
      description: job.description,
      requirements: job.requirements || "",
      experience: job.experience || "",
      salary_range: job.salary_range || "",
      status: job.status,
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const statusColor = (s: string) => {
    if (s === "published") return "bg-green-100 text-green-800";
    if (s === "closed") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Posts</h1>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Job Post</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded animate-pulse" />)}
        </div>
      ) : !jobs?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No job posts yet. Create your first job listing!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <Badge className={statusColor(job.status)}>{job.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.department} · {job.location} · {job.employment_type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/careers/${job.id}/applications`}>
                    <Users className="h-4 w-4 mr-1" />
                    {appCounts?.[job.id] || 0}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/careers/${job.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(job)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm("Delete this job post?")) deleteMutation.mutate(job.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Job Post" : "New Job Post"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(editingId ? { ...form, id: editingId } : form);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((p) => ({
                      ...p,
                      title,
                      slug: editingId ? p.slug : generateSlug(title),
                    }));
                  }}
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input required value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                <Input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.employment_type} onValueChange={(v) => setForm((p) => ({ ...p, employment_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Experience</Label>
                <Input value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} placeholder="e.g. 2-4 years" />
              </div>
              <div>
                <Label>Salary Range</Label>
                <Input value={form.salary_range} onChange={(e) => setForm((p) => ({ ...p, salary_range: e.target.value }))} placeholder="e.g. ₹5-8 LPA" />
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea required rows={5} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <Label>Requirements</Label>
              <Textarea rows={4} value={form.requirements} onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPosts;
