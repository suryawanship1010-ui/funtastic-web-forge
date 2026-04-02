import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Briefcase, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const CareerDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [formData, setFormData] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    cover_letter: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);

    try {
      let resume_url: string | null = null;

      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const filePath = `${job.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, resumeFile);
        if (uploadError) throw uploadError;
        resume_url = filePath;
      }

      const { error } = await supabase.from("job_applications").insert({
        job_post_id: job.id,
        applicant_name: formData.applicant_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        cover_letter: formData.cover_letter.trim() || null,
        resume_url,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll get back to you soon.");
      setFormData({ applicant_name: "", email: "", phone: "", cover_letter: "" });
      setResumeFile(null);
    } catch (err: any) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 max-w-4xl animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4" />
          <div className="h-12 bg-muted rounded w-3/4 mb-8" />
          <div className="h-64 bg-muted rounded" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
          <Button asChild>
            <Link to="/careers"><ArrowLeft className="h-4 w-4 mr-2" />Back to Careers</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{job.title} | Careers - Xview Global Services</title>
        <meta name="description" content={`Apply for ${job.title} at Xview Global Services. ${job.department} - ${job.location}`} />
      </Helmet>
      <Header />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/careers" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Careers
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {job.department && (
                  <Badge variant="secondary"><Briefcase className="h-3 w-3 mr-1" />{job.department}</Badge>
                )}
                {job.location && (
                  <Badge variant="outline"><MapPin className="h-3 w-3 mr-1" />{job.location}</Badge>
                )}
                <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{job.employment_type}</Badge>
              </div>

              {job.salary_range && (
                <p className="text-lg font-medium text-primary mb-6">Salary: {job.salary_range}</p>
              )}

              {job.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">{job.description}</div>
                </div>
              )}

              {job.requirements && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">{job.requirements}</div>
                </div>
              )}

              {job.experience && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Experience</h2>
                  <p className="text-muted-foreground">{job.experience}</p>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
                <h3 className="text-lg font-bold mb-4">Apply Now</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.applicant_name}
                      onChange={(e) => setFormData((p) => ({ ...p, applicant_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resume">Resume (PDF)</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cover">Cover Letter</Label>
                    <Textarea
                      id="cover"
                      rows={4}
                      value={formData.cover_letter}
                      onChange={(e) => setFormData((p) => ({ ...p, cover_letter: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareerDetail;
