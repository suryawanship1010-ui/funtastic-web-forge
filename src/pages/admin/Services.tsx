import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  color_from: string;
  color_to: string;
  display_order: number;
  is_active: boolean;
}

interface SubService {
  id: string;
  service_id: string;
  name: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  "Headphones", "Monitor", "Users", "Calculator", "Briefcase", "FileText",
  "Cloud", "Shield", "UserCheck", "CreditCard", "Building", "Database",
  "FolderOpen", "ShoppingCart", "ClipboardList", "Phone", "Mail", "Globe",
  "Zap", "Target", "Clock", "TrendingUp", "Settings", "MessageSquare"
];

const colorOptions = [
  { label: "Orange", from: "orange-500", to: "orange-600" },
  { label: "Blue", from: "blue-500", to: "blue-600" },
  { label: "Green", from: "green-500", to: "green-600" },
  { label: "Purple", from: "purple-500", to: "purple-600" },
  { label: "Pink", from: "pink-500", to: "pink-600" },
  { label: "Teal", from: "teal-500", to: "teal-600" },
  { label: "Indigo", from: "indigo-500", to: "indigo-600" },
];

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null);
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Form state for service
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    icon_name: "Briefcase",
    color_from: "orange-500",
    color_to: "orange-600",
    is_active: true
  });

  // Form state for sub-service
  const [subFormData, setSubFormData] = useState({
    name: "",
    description: "",
    icon_name: "FileText",
    is_active: true
  });

  // Fetch services
  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as Service[];
    }
  });

  // Fetch sub-services
  const { data: subServices } = useQuery({
    queryKey: ["admin-sub-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sub_services")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as SubService[];
    }
  });

  // Create/Update service mutation
  const serviceMutation = useMutation({
    mutationFn: async (data: Partial<Service> & { id?: string }) => {
      if (data.id) {
        const { id, ...updateData } = data;
        const { error } = await supabase
          .from("services")
          .update(updateData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const maxOrder = services?.reduce((max, s) => Math.max(max, s.display_order), 0) || 0;
        const insertData = {
          slug: data.slug!,
          title: data.title!,
          description: data.description!,
          icon_name: data.icon_name || "Briefcase",
          color_from: data.color_from || "orange-500",
          color_to: data.color_to || "orange-600",
          is_active: data.is_active ?? true,
          display_order: maxOrder + 1
        };
        const { error } = await supabase
          .from("services")
          .insert(insertData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setIsDialogOpen(false);
      setEditingService(null);
      resetForm();
      toast.success(editingService ? "Service updated" : "Service created");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Service deleted");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    }
  });

  // Create/Update sub-service mutation
  const subServiceMutation = useMutation({
    mutationFn: async (data: Partial<SubService> & { id?: string; service_id: string }) => {
      if (data.id) {
        const { id, service_id, ...updateData } = data;
        const { error } = await supabase
          .from("sub_services")
          .update(updateData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const serviceSubServices = subServices?.filter(s => s.service_id === data.service_id);
        const maxOrder = serviceSubServices?.reduce((max, s) => Math.max(max, s.display_order), 0) || 0;
        const insertData = {
          service_id: data.service_id,
          name: data.name!,
          description: data.description!,
          icon_name: data.icon_name || "FileText",
          is_active: data.is_active ?? true,
          display_order: maxOrder + 1
        };
        const { error } = await supabase
          .from("sub_services")
          .insert(insertData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sub-services"] });
      setIsSubDialogOpen(false);
      setEditingSubService(null);
      resetSubForm();
      toast.success(editingSubService ? "Sub-service updated" : "Sub-service created");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    }
  });

  // Delete sub-service mutation
  const deleteSubServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sub_services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sub-services"] });
      toast.success("Sub-service deleted");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      description: "",
      icon_name: "Briefcase",
      color_from: "orange-500",
      color_to: "orange-600",
      is_active: true
    });
  };

  const resetSubForm = () => {
    setSubFormData({
      name: "",
      description: "",
      icon_name: "FileText",
      is_active: true
    });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      title: service.title,
      description: service.description,
      icon_name: service.icon_name,
      color_from: service.color_from,
      color_to: service.color_to,
      is_active: service.is_active
    });
    setIsDialogOpen(true);
  };

  const handleEditSubService = (subService: SubService) => {
    setEditingSubService(subService);
    setSelectedServiceId(subService.service_id);
    setSubFormData({
      name: subService.name,
      description: subService.description,
      icon_name: subService.icon_name,
      is_active: subService.is_active
    });
    setIsSubDialogOpen(true);
  };

  const handleAddSubService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    resetSubForm();
    setEditingSubService(null);
    setIsSubDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingService) {
      serviceMutation.mutate({ ...formData, id: editingService.id });
    } else {
      serviceMutation.mutate(formData);
    }
  };

  const handleSubSubmit = () => {
    if (!selectedServiceId) return;
    if (editingSubService) {
      subServiceMutation.mutate({ ...subFormData, id: editingSubService.id, service_id: selectedServiceId });
    } else {
      subServiceMutation.mutate({ ...subFormData, service_id: selectedServiceId });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services Management</h1>
          <p className="text-muted-foreground">Manage your service offerings and sub-services</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingService(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL-friendly)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g., customer-support"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full border rounded-md p-2"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Color Theme</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, color_from: color.from, color_to: color.to })}
                      className={`p-3 rounded-md bg-gradient-to-br from-${color.from} to-${color.to} text-white text-xs font-medium ${
                        formData.color_from === color.from ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSubmit} disabled={serviceMutation.isPending} className="w-full">
                {serviceMutation.isPending ? "Saving..." : editingService ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sub-service Dialog */}
      <Dialog open={isSubDialogOpen} onOpenChange={(open) => {
        setIsSubDialogOpen(open);
        if (!open) {
          setEditingSubService(null);
          resetSubForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubService ? "Edit Sub-Service" : "Add Sub-Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sub-name">Name</Label>
              <Input
                id="sub-name"
                value={subFormData.name}
                onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="sub-description">Description</Label>
              <Textarea
                id="sub-description"
                value={subFormData.description}
                onChange={(e) => setSubFormData({ ...subFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="sub-icon">Icon</Label>
              <select
                id="sub-icon"
                value={subFormData.icon_name}
                onChange={(e) => setSubFormData({ ...subFormData, icon_name: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={subFormData.is_active}
                onCheckedChange={(checked) => setSubFormData({ ...subFormData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSubSubmit} disabled={subServiceMutation.isPending} className="w-full">
              {subServiceMutation.isPending ? "Saving..." : editingSubService ? "Update Sub-Service" : "Create Sub-Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services?.map((service) => {
                const serviceSubServices = subServices?.filter(s => s.service_id === service.id);
                const isExpanded = expandedService === service.id;
                
                return (
                  <>
                    <TableRow key={service.id}>
                      <TableCell>
                        <button
                          onClick={() => setExpandedService(isExpanded ? null : service.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${service.color_from} to-${service.color_to} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{service.icon_name.slice(0, 2)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{service.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">{service.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{service.slug}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${service.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                          {service.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleAddSubService(service.id)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteServiceMutation.mutate(service.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={5} className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Sub-Services ({serviceSubServices?.length || 0})</h4>
                            {serviceSubServices && serviceSubServices.length > 0 ? (
                              <div className="space-y-2">
                                {serviceSubServices.map((sub) => (
                                  <div key={sub.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                                    <div>
                                      <div className="font-medium text-sm">{sub.name}</div>
                                      <div className="text-xs text-muted-foreground">{sub.description}</div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="ghost" size="sm" onClick={() => handleEditSubService(sub)}>
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => deleteSubServiceMutation.mutate(sub.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No sub-services yet. Click + to add one.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
