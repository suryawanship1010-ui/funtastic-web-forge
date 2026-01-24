import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    totalVisitors: 0,
    totalBlogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [inquiriesRes, newInquiriesRes, visitorsRes, blogsRes] = await Promise.all([
          supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
          supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("site_visitors").select("id", { count: "exact", head: true }),
          supabase.from("blogs").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          totalInquiries: inquiriesRes.count || 0,
          newInquiries: newInquiriesRes.count || 0,
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

  const statCards = [
    {
      title: "Total Inquiries",
      value: stats.totalInquiries,
      icon: MessageSquare,
      description: `${stats.newInquiries} new`,
    },
    {
      title: "Site Visitors",
      value: stats.totalVisitors,
      icon: Users,
      description: "Total page views",
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs,
      icon: FileText,
      description: "Published articles",
    },
    {
      title: "Conversion Rate",
      value: stats.totalVisitors > 0 ? `${((stats.totalInquiries / stats.totalVisitors) * 100).toFixed(1)}%` : "0%",
      icon: TrendingUp,
      description: "Inquiries / Visitors",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
