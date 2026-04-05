import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Eye, Users, X } from "lucide-react";
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
  const [requirementsList, setRequirementsList] = useState<string[]>([""]);
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);

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

  const { data: departments } = useQuery({
    queryKey: ["admin-departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
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

  const { data: jobDepartments } = useQuery({
    queryKey: ["admin-job-departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_departments")
        .select("*, departments(name)");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof emptyForm & { id?: string }) => {
      const deptNames = selectedDeptIds
        .map((id) => departments?.find((d) => d.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      const payload = {
        title: data.title,
        slug: data.slug,
        department: deptNames || data.department,
        location: data.location,
        employment_type: data.employment_type,
        description: data.description,
        requirements: requirementsList.filter((r) => r.trim()).join("\n") || null,
        experience: data.experience || null,
        salary_range: data.salary_range || null,
        status: data.status,
      };

      let jobId: string;

      if (data.id) {
        const { error } = await supabase.from("job_posts").update(payload).eq("id", data.id);
        if (error) throw error;
        jobId = data.id;
      } else {
        const { data: inserted, error } = await supabase.from("job_posts").insert(payload).select("id").single();
        if (error) throw error;
        jobId = inserted.id;
      }

      // Save job-department mappings
      await supabase.from("job_departments").delete().eq("job_post_id", jobId);
      if (selectedDeptIds.length > 0) {
        const mappings = selectedDeptIds.map((department_id) => ({
          job_post_id: jobId,
          department_id,
        }));
        const { error } = await supabase.from("job_departments").insert(mappings);
        if (error) throw error;
      }

      // Save individual requirements
      await supabase.from("job_requirements").delete().eq("job_post_id", jobId);
      const reqs = requirementsList.filter((r) => r.trim());
      if (reqs.length > 0) {
        const reqRows = reqs.map((requirement_text, i) => ({
          job_post_id: jobId,
          requirement_text: requirement_text.trim(),
          display_order: i,
        }));
        const { error } = await supabase.from("job_requirements").insert(reqRows);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-job-departments"] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setRequirementsList([""]);
      setSelectedDeptIds([]);
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

  const openEdit = async (job: JobPost) => {
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

    // Load requirements
    const { data: reqs } = await supabase
      .from("job_requirements")
      .select("*")
      .eq("job_post_id", job.id)
      .order("display_order");
    if (reqs && reqs.length > 0) {
      setRequirementsList(reqs.map((r) => r.requirement_text));
    } else if (job.requirements) {
      setRequirementsList(job.requirements.split("\n").filter(Boolean));
    } else {
      setRequirementsList([""]);
    }

    // Load department mappings
    const deptMappings = jobDepartments?.filter((jd) => jd.job_post_id === job.id) || [];
    setSelectedDeptIds(deptMappings.map((jd) => jd.department_id));

    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setRequirementsList([""]);
    setSelectedDeptIds([]);
    setDialogOpen(true);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const statusColor = (s: string) => {
    if (s === "published") return "bg-green-100 text-green-800";
    if (s === "closed") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const addRequirement = () => setRequirementsList((prev) => [...prev, ""]);
  const removeRequirement = (index: number) =>
    setRequirementsList((prev) => prev.filter((_, i) => i !== index));
  const updateRequirement = (index: number, value: string) =>
    setRequirementsList((prev) => prev.map((r, i) => (i === index ? value : r)));

  const toggleDept = (deptId: string) => {
    setSelectedDeptIds((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    );
  };

  const getJobDeptNames = (jobId: string) => {
    const mappings = jobDepartments?.filter((jd) => jd.job_post_id === jobId) || [];
    return mappings.map((m: any) => m.departments?.name).filter(Boolean);
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
          {jobs.map((job) => {
            const deptNames = getJobDeptNames(job.id);
            return (
              <div key={job.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    <Badge className={statusColor(job.status)}>{job.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {deptNames.length > 0 ? deptNames.join(", ") : job.department} · {job.location} · {job.employment_type}
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
            );
          })}
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

            {/* Department Selection */}
            <div>
              <Label>Departments</Label>
              <div className="border rounded-lg p-3 mt-1 space-y-2 max-h-40 overflow-y-auto">
                {departments && departments.length > 0 ? (
                  departments.filter((d) => d.is_active).map((dept) => (
                    <div key={dept.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`dept-${dept.id}`}
                        checked={selectedDeptIds.includes(dept.id)}
                        onCheckedChange={() => toggleDept(dept.id)}
                      />
                      <label htmlFor={`dept-${dept.id}`} className="text-sm cursor-pointer">
                        {dept.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No departments found. <Link to="/admin/departments" className="text-primary underline">Add departments</Link> first.
                  </p>
                )}
              </div>
              {selectedDeptIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedDeptIds.map((id) => {
                    const dept = departments?.find((d) => d.id === id);
                    return dept ? (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {dept.name}
                        <button type="button" onClick={() => toggleDept(id)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
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

            {/* Dynamic Requirements */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Requirements</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </div>
              <div className="space-y-2">
                {requirementsList.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                    />
                    {requirementsList.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
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
