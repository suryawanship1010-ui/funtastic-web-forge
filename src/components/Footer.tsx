import { MapPin, Phone, Mail, Globe, Linkedin, Twitter, Facebook, Instagram, ArrowUp } from "lucide-react";
import xviewLogo from "@/assets/xview-logo-new.jpg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    "Customer Support Services",
    "IT Outsourcing",
    "Human Resource Outsourcing",
    "Finance and Accounting",
    "Business Process Outsourcing",
    "Administrative Support"
  ];

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Choose Us", href: "#why-us" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={xviewLogo} alt="Xview Global Services" className="h-12 w-auto rounded" />
              <div>
                <h3 className="text-xl font-bold text-white">
                  <span className="text-primary">Xview</span> Global Services LLP
                </h3>
              </div>
            </div>
            <p className="text-white/70 mb-6 italic">
              "Empowering Business Worldwide"
            </p>
            <p className="text-white/60 text-sm">
              A Business Process Outsourcing company providing specialized services 
              to businesses worldwide.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a 
                    href="#services" 
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm">
                  House No. 1007, Vastushree Residency,<br />
                  Sopankaka Nagar, Gujarwadi Road,<br />
                  Katraj, Pune - 411 046
                </p>
              </div>
              <a href="tel:+919423840960" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm">+91 9423840960</span>
              </a>
              <a href="mailto:contact@xviewglobal.com" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm">contact@xviewglobal.com</span>
              </a>
              <a href="http://xviewglobal.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-sm">www.xviewglobal.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Xview Global Services LLP. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer;
