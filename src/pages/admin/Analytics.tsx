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
          // Clean up page URL
          let page = v.page_visited || "/";
          // Remove query params for cleaner display
          page = page.split("?")[0];
          pageCounts[page] = (pageCounts[page] || 0) + 1;
        });
        const sortedPages = Object.entries(pageCounts)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 8);
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
            date: format(date, "EEE"),
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

  const maxViews = Math.max(...dailyStats.map((d) => d.views), 1);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{visitors.length}</p>
            <p className="text-xs text-muted-foreground">Page Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{uniqueSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {uniqueSessions > 0 ? (visitors.length / uniqueSessions).toFixed(1) : 0}
            </p>
            <p className="text-xs text-muted-foreground">Pages/Session</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 gap-1">
            {dailyStats.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{day.views}</span>
                <div
                  className="w-full bg-primary/80 rounded-t"
                  style={{
                    height: `${Math.max((day.views / maxViews) * 80, 4)}px`,
                  }}
                />
                <span className="text-[10px] text-muted-foreground">{day.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Top Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pageStats.map((page) => (
            <div key={page.page} className="flex items-center justify-between text-sm">
              <span className="truncate flex-1 mr-4">{page.page}</span>
              <span className="text-muted-foreground">{page.views}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
