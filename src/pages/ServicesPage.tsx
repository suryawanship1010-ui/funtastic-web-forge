import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, Phone, Mail, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  Award,
  Building,
  Database,
  FolderOpen,
  Zap,
  Target,
  Clock,
  TrendingUp,
  Settings,
  MessageSquare,
  HelpCircle,
  Code,
  Server,
  Lock,
  DollarSign,
  PieChart,
  FileCheck,
  Clipboard,
  UserPlus,
  Gift,
  Layers,
  BarChart3,
  PhoneCall,
  Laptop,
  Mail as MailIcon
} from "lucide-react";

const servicesData = {
  "customer-support": {
    id: "customer-support",
    icon: Headphones,
    title: "Customer Support Services",
    tagline: "Exceptional Customer Experience, Delivered 24/7",
    description: "Our customer support services are designed to provide your customers with exceptional experiences across all touchpoints. We combine skilled professionals, advanced technology, and proven methodologies to handle customer interactions efficiently and professionally.",
    color: "from-orange-500 to-orange-600",
    heroImage: "https://images.unsplash.com/photo-1553775927-a071d5a6a39a?w=1200&h=600&fit=crop",
    benefits: [
      { icon: Clock, title: "24/7 Availability", desc: "Round-the-clock support ensuring your customers always have assistance" },
      { icon: MessageSquare, title: "Multi-channel Support", desc: "Phone, email, chat, social media - we cover all channels" },
      { icon: Globe, title: "Multilingual Teams", desc: "Support in multiple languages to serve global customers" },
      { icon: TrendingUp, title: "Scalable Solutions", desc: "Easily scale up or down based on your business needs" }
    ],
    services: [
      {
        icon: PhoneCall,
        name: "Inbound & Outbound Call Centers",
        description: "Professional call center services with trained agents who represent your brand excellently. Handle customer inquiries, sales calls, surveys, and more.",
        features: ["Customer inquiry handling", "Order processing", "Appointment scheduling", "Sales & upselling", "Market research calls"]
      },
      {
        icon: MessageSquare,
        name: "Live Chat Support",
        description: "Real-time chat support for instant customer assistance on your website or app. Reduce response times and increase customer satisfaction.",
        features: ["Instant response", "Proactive chat triggers", "Chat-to-ticket conversion", "Canned responses", "Chat analytics"]
      },
      {
        icon: MailIcon,
        name: "Email Support",
        description: "Professional email management with quick turnaround times. Handle customer queries, complaints, and requests efficiently.",
        features: ["Same-day response", "Email categorization", "Automated acknowledgments", "Escalation protocols", "Customer follow-ups"]
      },
      {
        icon: HelpCircle,
        name: "Technical Support Helpdesk",
        description: "Tier 1 and Tier 2 technical support for software, hardware, and IT-related issues. Expert troubleshooting and problem resolution.",
        features: ["Issue diagnosis", "Remote troubleshooting", "Knowledge base management", "Ticket prioritization", "SLA compliance"]
      }
    ],
    stats: [
      { value: "98%", label: "Customer Satisfaction" },
      { value: "<30s", label: "Average Response Time" },
      { value: "24/7", label: "Support Availability" },
      { value: "15+", label: "Languages Supported" }
    ]
  },
  "it-outsourcing": {
    id: "it-outsourcing",
    icon: Monitor,
    title: "IT Outsourcing Services",
    tagline: "Technology Solutions That Drive Business Growth",
    description: "Leverage our comprehensive IT outsourcing services to reduce costs, access specialized expertise, and focus on your core business. We provide end-to-end technology solutions that keep your systems running smoothly and securely.",
    color: "from-blue-500 to-blue-600",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
    benefits: [
      { icon: Settings, title: "Expert Management", desc: "Access to certified IT professionals without recruitment hassles" },
      { icon: Shield, title: "Enhanced Security", desc: "Enterprise-grade cybersecurity protecting your digital assets" },
      { icon: Cloud, title: "Cloud Excellence", desc: "Seamless cloud migration and management services" },
      { icon: Zap, title: "Cost Efficiency", desc: "Reduce IT overhead by up to 40% with our managed services" }
    ],
    services: [
      {
        icon: Server,
        name: "Managed IT Services",
        description: "Comprehensive IT management including infrastructure monitoring, maintenance, and optimization. Proactive approach to prevent issues before they impact your business.",
        features: ["24/7 infrastructure monitoring", "Proactive maintenance", "Network management", "Desktop support", "IT consulting"]
      },
      {
        icon: Cloud,
        name: "Cloud Services",
        description: "End-to-end cloud solutions from migration to management. We help you leverage AWS, Azure, or Google Cloud for maximum efficiency.",
        features: ["Cloud migration", "Cloud architecture", "Cost optimization", "Backup & recovery", "Multi-cloud management"]
      },
      {
        icon: Lock,
        name: "Cybersecurity Services",
        description: "Protect your business from evolving cyber threats with our comprehensive security solutions. From assessment to implementation and monitoring.",
        features: ["Security audits", "Penetration testing", "Endpoint protection", "Security training", "Incident response"]
      },
      {
        icon: Code,
        name: "Software Development",
        description: "Custom software development tailored to your business needs. From web applications to mobile apps and enterprise solutions.",
        features: ["Custom web apps", "Mobile development", "API integration", "Legacy modernization", "QA & testing"]
      }
    ],
    stats: [
      { value: "99.9%", label: "Uptime Guaranteed" },
      { value: "40%", label: "Cost Reduction" },
      { value: "500+", label: "Systems Managed" },
      { value: "ISO 27001", label: "Certified" }
    ]
  },
  "hr-outsourcing": {
    id: "hr-outsourcing",
    icon: Users,
    title: "Human Resource Outsourcing",
    tagline: "Streamline HR Operations, Empower Your Workforce",
    description: "Transform your HR operations with our comprehensive human resource outsourcing solutions. We handle everything from recruitment to payroll, allowing you to focus on strategic initiatives while we take care of day-to-day HR functions.",
    color: "from-green-500 to-green-600",
    heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
    benefits: [
      { icon: UserPlus, title: "Top Talent Access", desc: "Find the best candidates with our proven recruitment processes" },
      { icon: Clock, title: "Time Savings", desc: "Free up your team's time from administrative HR tasks" },
      { icon: Shield, title: "Compliance Assured", desc: "Stay compliant with labor laws and regulations" },
      { icon: TrendingUp, title: "Strategic HR", desc: "Transform HR from cost center to strategic partner" }
    ],
    services: [
      {
        icon: UserCheck,
        name: "Recruitment & Staffing",
        description: "End-to-end recruitment services from job posting to onboarding. We find candidates who fit your culture and have the skills you need.",
        features: ["Job description development", "Candidate sourcing", "Screening & interviews", "Background checks", "Onboarding support"]
      },
      {
        icon: CreditCard,
        name: "Payroll Management",
        description: "Accurate and timely payroll processing with full compliance. Handle salaries, taxes, benefits, and more without the headache.",
        features: ["Salary processing", "Tax calculations", "Statutory compliance", "Payslip generation", "Year-end reporting"]
      },
      {
        icon: Gift,
        name: "Benefits Administration",
        description: "Comprehensive management of employee benefits programs. From health insurance to retirement plans, we handle it all.",
        features: ["Benefits enrollment", "Claims processing", "Vendor management", "Plan optimization", "Employee communication"]
      },
      {
        icon: Clipboard,
        name: "HR Administration",
        description: "Complete HR administrative support including policy development, documentation, and employee relations management.",
        features: ["Policy development", "Employee records", "Leave management", "Performance tracking", "HR reporting"]
      }
    ],
    stats: [
      { value: "35%", label: "Hiring Cost Reduction" },
      { value: "99.8%", label: "Payroll Accuracy" },
      { value: "50%", label: "Time Saved on HR Tasks" },
      { value: "100%", label: "Compliance Rate" }
    ]
  },
  "finance-accounting": {
    id: "finance-accounting",
    icon: Calculator,
    title: "Finance and Accounting Services",
    tagline: "Financial Excellence for Business Success",
    description: "Our finance and accounting outsourcing services provide you with expert financial management without the overhead of an in-house team. From bookkeeping to strategic financial planning, we deliver accuracy, compliance, and valuable insights.",
    color: "from-purple-500 to-purple-600",
    heroImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop",
    benefits: [
      { icon: Target, title: "Accuracy Guaranteed", desc: "Error-free financial records with multiple review layers" },
      { icon: DollarSign, title: "Cost Savings", desc: "Save up to 50% compared to in-house finance teams" },
      { icon: PieChart, title: "Strategic Insights", desc: "Data-driven financial analysis for better decisions" },
      { icon: Shield, title: "Audit Ready", desc: "Always prepared for audits with organized records" }
    ],
    services: [
      {
        icon: FileText,
        name: "Bookkeeping Services",
        description: "Accurate and timely recording of all financial transactions. Maintain organized books that give you a clear picture of your financial health.",
        features: ["Transaction recording", "Bank reconciliation", "Accounts payable", "Accounts receivable", "Financial statements"]
      },
      {
        icon: FileCheck,
        name: "Tax Preparation & Planning",
        description: "Comprehensive tax services ensuring compliance while optimizing your tax position. From preparation to filing and strategic planning.",
        features: ["Tax preparation", "GST/VAT filing", "Tax planning", "Compliance management", "Audit support"]
      },
      {
        icon: BarChart3,
        name: "Financial Analysis & Reporting",
        description: "In-depth financial analysis and customized reporting to support informed business decisions and strategic planning.",
        features: ["Financial modeling", "Budget analysis", "Cash flow forecasting", "KPI dashboards", "Variance analysis"]
      },
      {
        icon: Calculator,
        name: "Management Accounting",
        description: "Strategic financial management services to optimize your business performance and support growth initiatives.",
        features: ["Cost accounting", "Budgeting", "Profitability analysis", "Financial planning", "Business intelligence"]
      }
    ],
    stats: [
      { value: "99.9%", label: "Accuracy Rate" },
      { value: "50%", label: "Cost Reduction" },
      { value: "100%", label: "On-time Delivery" },
      { value: "CPA", label: "Certified Team" }
    ]
  },
  "bpo-services": {
    id: "bpo-services",
    icon: Briefcase,
    title: "Business Process Outsourcing",
    tagline: "Optimize Operations, Maximize Efficiency",
    description: "Our business process outsourcing services help you streamline operations, reduce costs, and improve efficiency. We handle both back-office and front-office processes, allowing you to focus on core business activities and strategic growth.",
    color: "from-pink-500 to-pink-600",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop",
    benefits: [
      { icon: Layers, title: "Process Excellence", desc: "Optimized workflows for maximum efficiency" },
      { icon: Zap, title: "Quick Turnaround", desc: "Fast processing times with quality assurance" },
      { icon: TrendingUp, title: "Scalability", desc: "Easily scale operations up or down as needed" },
      { icon: Target, title: "Focus on Core", desc: "Free up resources to focus on strategic initiatives" }
    ],
    services: [
      {
        icon: Building,
        name: "Back-Office Outsourcing",
        description: "Comprehensive back-office support including data management, order processing, and administrative tasks that keep your business running smoothly.",
        features: ["Data entry & processing", "Order management", "Invoice processing", "Procurement support", "Database management"]
      },
      {
        icon: PhoneCall,
        name: "Front-Office Outsourcing",
        description: "Customer-facing services that represent your brand professionally. From call centers to help desks, we deliver exceptional customer experiences.",
        features: ["Call center services", "Help desk support", "Customer service", "Sales support", "Technical support"]
      },
      {
        icon: Database,
        name: "Knowledge Process Outsourcing",
        description: "High-value knowledge-based processes including research, analytics, and specialized domain expertise.",
        features: ["Market research", "Data analytics", "Content management", "Legal processing", "Financial research"]
      },
      {
        icon: Laptop,
        name: "Digital Process Outsourcing",
        description: "Modern digital services including automation, digital marketing support, and technology-enabled process management.",
        features: ["Process automation", "Digital transformation", "Marketing operations", "Social media management", "E-commerce support"]
      }
    ],
    stats: [
      { value: "40%", label: "Cost Savings" },
      { value: "99%", label: "SLA Compliance" },
      { value: "60%", label: "Efficiency Increase" },
      { value: "24/7", label: "Operations" }
    ]
  },
  "administrative-support": {
    id: "administrative-support",
    icon: FileText,
    title: "Administrative Support Services",
    tagline: "Professional Administrative Excellence",
    description: "Our administrative support services provide you with skilled professionals who handle your day-to-day administrative tasks efficiently. From virtual assistance to document management, we ensure smooth operations so you can focus on what matters most.",
    color: "from-teal-500 to-teal-600",
    heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=600&fit=crop",
    benefits: [
      { icon: Clock, title: "Time Freedom", desc: "Reclaim hours spent on administrative tasks" },
      { icon: Users, title: "Skilled Professionals", desc: "Access to trained virtual assistants and specialists" },
      { icon: Shield, title: "Data Security", desc: "Secure handling of all your documents and data" },
      { icon: Zap, title: "Quick Delivery", desc: "Fast turnaround times on all assignments" }
    ],
    services: [
      {
        icon: Users,
        name: "Virtual Assistance",
        description: "Professional virtual assistants to handle your administrative tasks. Email management, calendar scheduling, travel arrangements, and more.",
        features: ["Email management", "Calendar scheduling", "Travel arrangements", "Meeting coordination", "Personal assistance"]
      },
      {
        icon: Database,
        name: "Data Entry Services",
        description: "Accurate and efficient data entry services with quality checks. Handle large volumes of data with precision and quick turnaround.",
        features: ["Form processing", "Database updates", "Data cleaning", "Data migration", "Quality assurance"]
      },
      {
        icon: FolderOpen,
        name: "Document Management",
        description: "Organized and secure document management solutions. Digitization, storage, retrieval, and archiving of all your business documents.",
        features: ["Document digitization", "Filing & organization", "Secure storage", "Quick retrieval", "Archiving"]
      },
      {
        icon: Clipboard,
        name: "Office Administration",
        description: "Complete office administration support including correspondence handling, vendor management, and operational coordination.",
        features: ["Correspondence handling", "Vendor coordination", "Inventory management", "Report preparation", "General administration"]
      }
    ],
    stats: [
      { value: "99.5%", label: "Accuracy Rate" },
      { value: "4hrs", label: "Avg Response Time" },
      { value: "1M+", label: "Documents Processed" },
      { value: "100%", label: "Client Satisfaction" }
    ]
  }
};

const allServicesOrder = [
  "customer-support",
  "it-outsourcing", 
  "hr-outsourcing",
  "finance-accounting",
  "bpo-services",
  "administrative-support"
];

const ServicesPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const service = serviceId ? servicesData[serviceId as keyof typeof servicesData] : null;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Service Not Found</h1>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allServicesOrder.indexOf(serviceId || "");
  const prevService = currentIndex > 0 ? servicesData[allServicesOrder[currentIndex - 1] as keyof typeof servicesData] : null;
  const nextService = currentIndex < allServicesOrder.length - 1 ? servicesData[allServicesOrder[currentIndex + 1] as keyof typeof servicesData] : null;

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${service.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/#services" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to All Services
          </Link>
          
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
              <Icon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{service.title}</h1>
              <p className="text-xl text-primary mt-2">{service.tagline}</p>
            </div>
          </div>
          
          <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {service.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-primary-foreground/80 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Our {service.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partner with us and experience the difference that expertise, dedication, and innovation can make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.benefits.map((benefit) => (
              <div key={benefit.title} className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Service Offerings</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions tailored to meet your specific business requirements.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {service.services.map((item) => (
              <div key={item.name} className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <div className="space-y-2">
                  {item.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Contact us today to discuss how our {service.title.toLowerCase()} can help transform your business operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                Get a Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:+919423840960">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Navigation Between Services */}
      <section className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {prevService ? (
              <Link 
                to={`/services/${prevService.id}`}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-semibold">{prevService.title}</div>
                </div>
              </Link>
            ) : <div />}
            
            {nextService ? (
              <Link 
                to={`/services/${nextService.id}`}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group text-right"
              >
                <div>
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-semibold">{nextService.title}</div>
                </div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Explore Our Other Services</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allServicesOrder.filter(id => id !== serviceId).map((id) => {
              const s = servicesData[id as keyof typeof servicesData];
              const SIcon = s.icon;
              return (
                <Link
                  key={id}
                  to={`/services/${id}`}
                  className="bg-card p-4 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all text-center group"
                >
                  <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <SIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{s.title}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
