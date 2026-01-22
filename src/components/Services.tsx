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
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
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
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "it-outsourcing",
      icon: Monitor,
      title: "IT Outsourcing",
      description: "Complete IT solutions to keep your systems running smoothly and securely.",
      subServices: [
        { icon: Cloud, name: "Managed IT Services", desc: "Comprehensive IT management to keep your systems running smoothly." },
        { icon: Cloud, name: "Cloud Services", desc: "Secure and scalable cloud solutions to enhance your business operations." },
        { icon: Shield, name: "Cybersecurity", desc: "Robust security measures to protect your data and systems from threats." }
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "hr-outsourcing",
      icon: Users,
      title: "Human Resource Outsourcing",
      description: "Streamline your HR operations with our comprehensive HR solutions.",
      subServices: [
        { icon: UserCheck, name: "Recruitment Services", desc: "Efficient and effective recruitment processes to find the best talent for your business." },
        { icon: CreditCard, name: "Payroll Management", desc: "Accurate and timely payroll processing to ensure employee satisfaction." },
        { icon: TrendingUp, name: "Employee Benefits Administration", desc: "Management of employee benefits to enhance workforce morale and retention." }
      ],
      color: "from-green-500 to-green-600"
    },
    {
      id: "finance-accounting",
      icon: Calculator,
      title: "Finance and Accounting",
      description: "Expert financial services to keep your business on track.",
      subServices: [
        { icon: FileText, name: "Bookkeeping", desc: "Accurate and up-to-date financial records to keep your business on track." },
        { icon: TrendingUp, name: "Tax Preparation", desc: "Expert tax services to ensure compliance and optimize your tax strategy." },
        { icon: Calculator, name: "Financial Analysis", desc: "In-depth financial analysis to help you make informed business decisions." }
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "bpo-services",
      icon: Briefcase,
      title: "Business Process Outsourcing",
      description: "End-to-end business process management for optimal efficiency.",
      subServices: [
        { icon: Building, name: "Back-office Outsourcing", desc: "Tasks like payroll, billing, accounts payable/receivable and procurement." },
        { icon: Phone, name: "Front-office Outsourcing", desc: "Customer-related services like call centers, help desks, and technical support." }
      ],
      color: "from-pink-500 to-pink-600"
    },
    {
      id: "administrative-support",
      icon: FileText,
      title: "Administrative Support",
      description: "Professional administrative services to streamline your operations.",
      subServices: [
        { icon: Users, name: "Virtual Assistance", desc: "Professional virtual assistants to handle your administrative tasks." },
        { icon: Database, name: "Data Entry", desc: "Accurate and efficient data entry services to keep your records organized." },
        { icon: FolderOpen, name: "Document Management", desc: "Secure and organized document management solutions." }
      ],
      color: "from-teal-500 to-teal-600"
    }
  ];

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-border ${
                activeService === index ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setActiveService(index)}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>
              <Link to={`/services/${service.id}`}>
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn">
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
              <div className={`inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br ${services[activeService].color} items-center justify-center mb-6`}>
                {(() => {
                  const Icon = services[activeService].icon;
                  return <Icon className="h-10 w-10 text-white" />;
                })()}
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {services[activeService].title}
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                {services[activeService].description}
              </p>
              {services[activeService].features && (
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

            {services[activeService].subServices && (
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
