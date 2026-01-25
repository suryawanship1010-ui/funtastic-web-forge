import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { Mail, Phone, Building, ChevronDown, ChevronUp, Download, Reply, FileText, Sparkles } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Inquiry = Tables<"contact_inquiries">;

const emailTemplates = [
  {
    name: "Thank You",
    subject: "Thank you for contacting XView Global",
    body: `Dear {name},

Thank you for reaching out to XView Global. We have received your inquiry and appreciate your interest in our services.

Our team is currently reviewing your message and will get back to you within 1-2 business days.

If you have any urgent questions, feel free to call us at +91 9423840960.

Best regards,
XView Global Team`,
  },
  {
    name: "Follow Up",
    subject: "Following up on your inquiry - XView Global",
    body: `Dear {name},

I hope this email finds you well. I wanted to follow up on your recent inquiry about our services.

Would you be available for a quick call this week to discuss your requirements in more detail?

Please let me know a convenient time, and I'll be happy to schedule a call.

Looking forward to hearing from you.

Best regards,
XView Global Team`,
  },
  {
    name: "Quote Ready",
    subject: "Your quote is ready - XView Global",
    body: `Dear {name},

Thank you for your patience. We have prepared a customized quote based on your requirements.

Please find the details attached/below. Feel free to reach out if you have any questions or need any modifications.

We look forward to the opportunity to work with you.

Best regards,
XView Global Team`,
  },
  {
    name: "Custom Reply",
    subject: "Re: Your inquiry - XView Global",
    body: `Dear {name},

Thank you for your message.



Best regards,
XView Global Team`,
  },
];

const Inquiries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(searchParams.get("status") || "all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      let query = supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ status: value });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success("Status updated");
      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      in_progress: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      resolved: "bg-green-100 text-green-700 hover:bg-green-100",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  const sendEmailWithTemplate = (inquiry: Inquiry, template: typeof emailTemplates[0]) => {
    const subject = encodeURIComponent(template.subject);
    const body = encodeURIComponent(template.body.replace(/{name}/g, inquiry.name.split(" ")[0]));
    window.location.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
  };

  const exportToCSV = () => {
    if (inquiries.length === 0) {
      toast.error("No inquiries to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Company", "Message", "Status", "Date"];
    const rows = inquiries.map((inq) => [
      inq.name,
      inq.email,
      inq.phone || "",
      inq.company || "",
      `"${(inq.message || "").replace(/"/g, '""')}"`,
      inq.status || "new",
      format(new Date(inq.created_at!), "yyyy-MM-dd HH:mm"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inquiries_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Inquiries exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No inquiries found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{inquiry.name}</span>
                      <Badge className={getStatusBadge(inquiry.status || "new")} variant="secondary">
                        {inquiry.status?.replace("_", " ") || "new"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{inquiry.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(inquiry.created_at!), "MMM d, h:mm a")}
                    </span>
                    {expandedId === inquiry.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === inquiry.id && (
                <div className="border-t bg-muted/30 p-4 space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {inquiry.phone}
                      </a>
                    )}
                    {inquiry.company && (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Building className="h-4 w-4" />
                        {inquiry.company}
                      </span>
                    )}
                  </div>

                  <div className="bg-background rounded-lg p-3 border">
                    <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Reply with Template Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="default">
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {emailTemplates.map((template) => (
                          <DropdownMenuItem
                            key={template.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              sendEmailWithTemplate(inquiry, template);
                            }}
                          >
                            {template.name === "Thank You" && <Sparkles className="h-4 w-4 mr-2" />}
                            {template.name === "Follow Up" && <Mail className="h-4 w-4 mr-2" />}
                            {template.name === "Quote Ready" && <FileText className="h-4 w-4 mr-2" />}
                            {template.name === "Custom Reply" && <Reply className="h-4 w-4 mr-2" />}
                            {template.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex-1" />

                    {/* Status Buttons */}
                    <Button
                      size="sm"
                      variant={inquiry.status === "new" ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(inquiry.id, "new");
                      }}
                    >
                      New
                    </Button>
                    <Button
                      size="sm"
                      variant={inquiry.status === "in_progress" ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(inquiry.id, "in_progress");
                      }}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant={inquiry.status === "resolved" ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(inquiry.id, "resolved");
                      }}
                    >
                      Resolved
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inquiries;
