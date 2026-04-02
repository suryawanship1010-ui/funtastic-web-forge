import { 
  Headphones, 
  Monitor, 
  Users, 
  Calculator, 
  Briefcase, 
  FileText,
  Cloud,
  Shield,
  UserCheck,
  CreditCard,
  Award as TrendingUp,
  Building,
  Phone,
  Database,
  FolderOpen,
  ArrowRight,
  ShoppingCart,
  ClipboardList,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Headphones,
  Monitor,
  Users,
  Calculator,
  Briefcase,
  FileText,
  Cloud,
  Shield,
  UserCheck,
  CreditCard,
  Building,
  Phone,
  Database,
  FolderOpen,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
};

// Default fallback services data
const defaultServices = [
  {
    id: "customer-support",
    icon: Headphones,
    title: "Customer Support Services",
    description: "Comprehensive customer support solutions to enhance your customer experience.",
    features: [
      "24/7 Multi-channel Support",
      "Inbound & Outbound Call Centers",
      "Live Chat & Email Support",
      "Technical Support Helpdesk"
    ],
    subServices: null
  },
  {
    id: "it-outsourcing",
    icon: Monitor,
    title: "IT Services",
    description: "Complete IT solutions to keep your systems running smoothly and securely.",
    features: null,
    subServices: [
      { icon: Cloud, name: "Managed IT Services", desc: "Comprehensive IT management to keep your systems running smoothly." },
      { icon: Cloud, name: "Cloud Services", desc: "Secure and scalable cloud solutions to enhance your business operations." },
      { icon: Shield, name: "Development & Support", desc: "Custom software development and technical support for your business needs." }
    ]
  },
  {
    id: "finance-accounting",
    icon: Calculator,
    title: "Finance & Accounting",
    description: "Expert financial and accounting services to optimize your business operations.",
    features: null,
    subServices: [
      { icon: FileText, name: "Bookkeeping", desc: "Accurate and up-to-date financial records to keep your business on track." },
      { icon: TrendingUp, name: "Tax Preparation", desc: "Expert tax services to ensure compliance and optimize your tax strategy." },
      { icon: Calculator, name: "Financial Analysis", desc: "In-depth financial analysis to help you make informed business decisions." }
    ]
  },
  {
    id: "procurement-services",
    icon: ShoppingCart,
    title: "Procurement & Purchasing Services",
    description: "End-to-end procurement solutions to streamline your purchasing operations.",
    features: null,
    subServices: [
      { icon: ClipboardList, name: "Strategic Sourcing", desc: "Supplier research, RFQ/RFP creation, cost optimization and negotiations support." },
      { icon: ShoppingCart, name: "Purchase Order Management", desc: "PR review, PO creation, order confirmation and ERP system updates." },
      { icon: Building, name: "Vendor Management", desc: "Vendor onboarding, supplier coordination, performance monitoring and compliance." }
    ]
  },
  {
    id: "bpo-services",
    icon: Briefcase,
    title: "Business Process Outsourcing",
    description: "End-to-end business process management including HR functions for optimal efficiency.",
    features: null,
    subServices: [
      { icon: Building, name: "Back-office Outsourcing", desc: "Tasks like payroll, billing, accounts payable/receivable and procurement." },
      { icon: Phone, name: "Front-office Outsourcing", desc: "Customer-related services like call centers, help desks, and technical support." },
      { icon: UserCheck, name: "HR & Recruitment Services", desc: "Recruitment, payroll management, and employee benefits administration." }
    ]
  },
  {
    id: "administrative-support",
    icon: FileText,
    title: "Administrative Support",
    description: "Professional administrative services to streamline your operations.",
    features: null,
    subServices: [
      { icon: Users, name: "Virtual Assistance", desc: "Professional virtual assistants to handle your administrative tasks." },
      { icon: Database, name: "Data Entry", desc: "Accurate and efficient data entry services to keep your records organized." },
      { icon: FolderOpen, name: "Document Management", desc: "Secure and organized document management solutions." }
    ]
  }
];

const Services = () => {
  const [activeService, setActiveService] = useState(0);

  // Fetch services from database
  const { data: dbServices } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    }
  });

  // Fetch sub-services from database
  const { data: dbSubServices } = useQuery({
    queryKey: ["public-sub-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sub_services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    }
  });

  // Transform database services to component format, fallback to defaults if DB fails
  const services = dbServices && dbServices.length > 0 
    ? dbServices.map(service => {
        const serviceSubServices = dbSubServices?.filter(sub => sub.service_id === service.id) || [];
        const IconComponent = iconMap[service.icon_name] || Briefcase;
        
        return {
          id: service.slug,
          icon: IconComponent,
          title: service.title,
          description: service.description,
          features: serviceSubServices.length === 0 ? [
            "Professional service delivery",
            "Expert team members",
            "24/7 availability",
            "Scalable solutions"
          ] : null,
          subServices: serviceSubServices.length > 0 
            ? serviceSubServices.map(sub => ({
                icon: iconMap[sub.icon_name] || FileText,
                name: sub.name,
                desc: sub.description
              }))
            : null
        };
      })
    : defaultServices;

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Overview of Services
          </h2>
          <p className="text-muted-foreground text-lg">
            We offer a comprehensive range of outsourcing solutions tailored to meet your business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-border ${
                activeService === index ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setActiveService(index)}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {service.description}
              </p>
              <Link to={`/services/${service.id}`}>
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-white/80 group/btn">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Active Service Details */}
        <div className="bg-muted/50 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center mb-6">
                {(() => {
                  const Icon = services[activeService]?.icon || Briefcase;
                  return <Icon className="h-10 w-10 text-white" />;
                })()}
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {services[activeService]?.title}
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                {services[activeService]?.description}
              </p>
              {services[activeService]?.features && (
                <ul className="space-y-3">
                  {services[activeService].features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {services[activeService]?.subServices && (
              <div className="grid gap-4">
                {services[activeService].subServices.map((sub) => (
                  <div
                    key={sub.name}
                    className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <sub.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{sub.name}</h4>
                        <p className="text-muted-foreground text-sm">{sub.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
