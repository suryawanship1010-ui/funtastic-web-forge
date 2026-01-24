import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, startOfDay } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Visitor = Tables<"site_visitors">;

interface PageStats {
  page: string;
  views: number;
}

interface DailyStats {
  date: string;
  views: number;
}

const Analytics = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageStats, setPageStats] = useState<PageStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [uniqueSessions, setUniqueSessions] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from("site_visitors")
          .select("*")
          .order("visited_at", { ascending: false });

        if (error) throw error;

        const visitorsData = data || [];
        setVisitors(visitorsData);

        // Calculate page stats
        const pageCounts: Record<string, number> = {};
        visitorsData.forEach((v) => {
          const page = v.page_visited || "/";
          pageCounts[page] = (pageCounts[page] || 0) + 1;
        });
        const sortedPages = Object.entries(pageCounts)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10);
        setPageStats(sortedPages);

        // Calculate daily stats for last 7 days
        const last7Days: DailyStats[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = startOfDay(subDays(new Date(), i));
          const nextDate = startOfDay(subDays(new Date(), i - 1));
          const views = visitorsData.filter((v) => {
            const visitDate = new Date(v.visited_at!);
            return visitDate >= date && visitDate < nextDate;
          }).length;
          last7Days.push({
            date: format(date, "MMM d"),
            views,
          });
        }
        setDailyStats(last7Days);

        // Calculate unique sessions
        const uniqueSessionIds = new Set(visitorsData.map((v) => v.session_id));
        setUniqueSessions(uniqueSessionIds.size);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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
      <h1 className="text-3xl font-bold">Site Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Pages/Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueSessions > 0 ? (visitors.length / uniqueSessions).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Traffic */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Traffic (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-40 gap-2">
            {dailyStats.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary rounded-t transition-all"
                  style={{
                    height: `${Math.max((day.views / Math.max(...dailyStats.map((d) => d.views), 1)) * 120, 4)}px`,
                  }}
                />
                <span className="text-xs text-muted-foreground">{day.date}</span>
                <span className="text-xs font-medium">{day.views}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pageStats.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <span className="text-sm font-medium">{page.page}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 bg-primary rounded"
                    style={{
                      width: `${(page.views / Math.max(...pageStats.map((p) => p.views), 1)) * 100}px`,
                    }}
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {page.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {visitors.slice(0, 20).map((visitor) => (
              <div
                key={visitor.id}
                className="flex items-center justify-between text-sm py-2 border-b last:border-0"
              >
                <span className="font-medium">{visitor.page_visited}</span>
                <span className="text-muted-foreground">
                  {format(new Date(visitor.visited_at!), "PPp")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
