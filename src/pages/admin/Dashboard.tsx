import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, FileText, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    inProgressInquiries: 0,
    totalVisitors: 0,
    totalBlogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [inquiriesRes, newInquiriesRes, inProgressRes, visitorsRes, blogsRes] = await Promise.all([
          supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
          supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
          supabase.from("site_visitors").select("id", { count: "exact", head: true }),
          supabase.from("blogs").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          totalInquiries: inquiriesRes.count || 0,
          newInquiries: newInquiriesRes.count || 0,
          inProgressInquiries: inProgressRes.count || 0,
          totalVisitors: visitorsRes.count || 0,
          totalBlogs: blogsRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/inquiries">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {stats.newInquiries > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                    {stats.newInquiries} new
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">{stats.totalInquiries}</p>
              <p className="text-xs text-muted-foreground">Total Inquiries</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/inquiries?status=in_progress">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Clock className="h-5 w-5 text-secondary mb-2" />
              <p className="text-2xl font-bold">{stats.inProgressInquiries}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Users className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{stats.totalVisitors}</p>
              <p className="text-xs text-muted-foreground">Page Views</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/blogs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <FileText className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{stats.totalBlogs}</p>
              <p className="text-xs text-muted-foreground">Blog Posts</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
