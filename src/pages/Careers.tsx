import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Briefcase, Search, ArrowRight, Building2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Careers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["public-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_posts")
        .select("*")
        .eq("status", "published")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["public-departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: jobDepts } = useQuery({
    queryKey: ["public-job-departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_departments")
        .select("*, departments(name, id)");
      if (error) throw error;
      return data;
    },
  });

  const types = [...new Set(jobs?.map((j) => j.employment_type).filter(Boolean) || [])];

  const getJobDeptIds = (jobId: string) =>
    jobDepts?.filter((jd) => jd.job_post_id === jobId).map((jd) => jd.department_id) || [];

  const getJobDeptNames = (jobId: string) =>
    jobDepts?.filter((jd) => jd.job_post_id === jobId).map((jd: any) => jd.departments?.name).filter(Boolean) || [];

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || getJobDeptIds(job.id).includes(departmentFilter) || job.department === departmentFilter;
    const matchesType = typeFilter === "all" || job.employment_type === typeFilter;
    return matchesSearch && matchesDept && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Careers | Xview Global Services LLP</title>
        <meta name="description" content="Join our team at Xview Global Services. Explore current job openings and grow your career with us." />
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20 pt-32">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">We're Hiring</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Build your career with Xview Global Services. We're looking for talented individuals to help us deliver exceptional outsourcing solutions worldwide.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {departments && departments.length > 0 && (
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {types.length > 0 && (
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 border animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-16 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const deptNames = getJobDeptNames(job.id);
                return (
                  <Link
                    key={job.id}
                    to={`/careers/${job.slug}`}
                    className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
                  >
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {deptNames.length > 0 ? (
                        deptNames.map((name, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Building2 className="h-3 w-3 mr-1" />
                            {name}
                          </Badge>
                        ))
                      ) : job.department ? (
                        <Badge variant="secondary" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {job.department}
                        </Badge>
                      ) : null}
                      {job.location && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.employment_type}
                      </Badge>
                    </div>
                    {job.experience && (
                      <p className="text-sm text-muted-foreground mb-3">Experience: {job.experience}</p>
                    )}
                    <div className="flex items-center text-primary text-sm font-medium">
                      View Details <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No openings right now</h3>
              <p className="text-muted-foreground">Check back later for new opportunities, or send us your resume at contact@xviewglobal.com</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
