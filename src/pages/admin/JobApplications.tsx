import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Mail, Phone, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const statusOptions = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "reviewing", label: "Reviewing", color: "bg-yellow-100 text-yellow-800" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-purple-100 text-purple-800" },
  { value: "interviewed", label: "Interviewed", color: "bg-indigo-100 text-indigo-800" },
  { value: "offered", label: "Offered", color: "bg-green-100 text-green-800" },
  { value: "hired", label: "Hired", color: "bg-emerald-100 text-emerald-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

const JobApplications = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: job } = useQuery({
    queryKey: ["admin-job", jobId],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_posts").select("*").eq("id", jobId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!jobId,
  });

  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("job_post_id", jobId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!jobId,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes: string }) => {
      const { error } = await supabase.from("job_applications").update({ status, admin_notes }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications", jobId] });
      toast.success("Application updated");
      setSelectedApp(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const downloadResume = async (path: string) => {
    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(path, 300);
    if (error) {
      toast.error("Failed to get resume link");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const filteredApps = applications?.filter(
    (a) => filterStatus === "all" || a.status === filterStatus
  );

  const getStatusColor = (status: string) =>
    statusOptions.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-800";

  return (
    <div>
      <Link to="/admin/careers" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />Back to Job Posts
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{job?.title || "Applications"}</h1>
          <p className="text-muted-foreground">{applications?.length || 0} applications</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted rounded animate-pulse" />)}
        </div>
      ) : !filteredApps?.length ? (
        <div className="text-center py-16 text-muted-foreground">No applications found.</div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-card border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => {
                setSelectedApp(app);
                setNotes(app.admin_notes || "");
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{app.applicant_name}</h3>
                  <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.email}</span>
                  {app.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{app.phone}</span>}
                  <span>{format(new Date(app.created_at), "MMM dd, yyyy")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {app.resume_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadResume(app.resume_url!);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />Resume
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedApp} onOpenChange={(o) => !o && setSelectedApp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedApp?.applicant_name}</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> {selectedApp.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selectedApp.phone || "N/A"}</div>
                <div><span className="text-muted-foreground">Applied:</span> {format(new Date(selectedApp.created_at), "MMM dd, yyyy")}</div>
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <h4 className="font-medium mb-1">Cover Letter</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap border rounded p-3">{selectedApp.cover_letter}</p>
                </div>
              )}

              {selectedApp.resume_url && (
                <Button variant="outline" onClick={() => downloadResume(selectedApp.resume_url!)}>
                  <Download className="h-4 w-4 mr-2" />Download Resume
                </Button>
              )}

              <div>
                <h4 className="font-medium mb-1">Status</h4>
                <Select
                  value={selectedApp.status}
                  onValueChange={(v) => setSelectedApp((p: any) => ({ ...p, status: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-medium mb-1">Admin Notes</h4>
                <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedApp(null)}>Cancel</Button>
                <Button
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedApp.id,
                      status: selectedApp.status,
                      admin_notes: notes,
                    })
                  }
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobApplications;
