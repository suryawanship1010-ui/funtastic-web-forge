import { ArrowRight, Globe, Users, Award, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import xviewLogo from "@/assets/xview-logo-new.jpg";

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-particle opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Animated Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <path
            d="M0,540 Q480,400 960,540 T1920,540"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="animate-draw-line"
          />
          <path
            d="M0,600 Q480,700 960,600 T1920,600"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            className="animate-draw-line"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 animate-fade-in-down border border-white/20">
              <img 
                src={xviewLogo} 
                alt="Xview Global Services Logo" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">Your Trusted Partner in Outsourcing Solutions</span>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>

            {/* Company Name with X Animation */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up overflow-hidden">
              <span className="inline-block">
                <span className="inline-block text-primary animate-slide-in-x font-extrabold" style={{ animationDelay: "0.1s" }}>X</span>
                <span className="inline-block text-primary animate-fade-slide-right" style={{ animationDelay: "0.3s" }}>view</span>
              </span>{" "}
              <span className="text-white animate-fade-slide-right inline-block" style={{ animationDelay: "0.5s" }}>Global Services LLP</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-4 italic animate-fade-in-up font-light" style={{ animationDelay: "0.2s" }}>
              "Empowering Business Worldwide"
            </p>

            <p className="text-white/70 mb-8 max-w-lg animate-fade-in-up text-lg leading-relaxed" style={{ animationDelay: "0.3s" }}>
              A Business Process Outsourcing company providing specialized services 
              by handling customer support, IT services, human resources, finance, and digital marketing.
            </p>

            <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Button
                size="lg"
                onClick={() => scrollToSection("#services")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 group text-lg px-8 py-6 hover:scale-105"
              >
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("#about")}
                className="border-white bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm text-lg px-8 py-6 hover:scale-105 transition-all duration-300 hover:border-primary"
              >
                Learn More
              </Button>
            </div>

            {/* Stats with animations */}
            <div className="grid grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 animate-bounce-slow" />
                  <span className="text-3xl font-bold">50+</span>
                </div>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Happy Clients</p>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-6 w-6 animate-spin-slow" />
                  <span className="text-3xl font-bold">Global</span>
                </div>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Reach</p>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-6 w-6 animate-pulse" />
                  <span className="text-3xl font-bold">24/7</span>
                </div>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Support</p>
              </div>
            </div>
          </div>

          {/* Visual Element - Enhanced Globe Animation */}
          <div className="hidden lg:block relative animate-fade-in-right">
            <div className="relative w-full h-[600px]">
              {/* Logo Display - Changed position to bottom left */}
              <div className="absolute bottom-8 left-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 animate-float z-20">
                <img 
                  src={xviewLogo} 
                  alt="Xview Logo" 
                  className="h-16 w-auto rounded-lg"
                />
              </div>

              {/* Central Globe with Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer rotating ring */}
                <div className="absolute w-96 h-96 rounded-full border border-primary/30 animate-spin-slow" />
                
                {/* Middle pulsing ring */}
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-transparent border border-white/20 flex items-center justify-center animate-pulse-ring">
                  <div className="w-60 h-60 rounded-full bg-gradient-to-br from-primary/30 to-transparent border border-white/30 flex items-center justify-center animate-float">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/50 flex items-center justify-center shadow-lg shadow-primary/30">
                      <Globe className="w-20 h-20 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Orbiting dots */}
                <div className="absolute w-72 h-72 animate-orbit">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary" />
                </div>
                <div className="absolute w-80 h-80 animate-orbit-reverse">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/70 rounded-full" />
                </div>
              </div>

              {/* Floating Service Cards */}
              <div className="absolute top-16 right-8 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl animate-float-delayed border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group">
                <div className="text-primary font-bold group-hover:scale-105 transition-transform">Development & Support</div>
                <p className="text-white/60 text-xs mt-1">Cloud & IT Services</p>
              </div>
              <div className="absolute bottom-32 left-0 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl animate-float border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group" style={{ animationDelay: "1.5s" }}>
                <div className="text-primary font-bold group-hover:scale-105 transition-transform">Customer Support</div>
                <p className="text-white/60 text-xs mt-1">24/7 Assistance</p>
              </div>
              <div className="absolute top-1/2 -right-4 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl animate-float border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group" style={{ animationDelay: "2s" }}>
                <div className="text-primary font-bold group-hover:scale-105 transition-transform">Finance & Procurement</div>
                <p className="text-white/60 text-xs mt-1">Accounting & Purchasing</p>
              </div>
              <div className="absolute bottom-16 right-20 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl animate-float border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group" style={{ animationDelay: "2.5s" }}>
                <div className="text-primary font-bold group-hover:scale-105 transition-transform">Process Outsourcing</div>
                <p className="text-white/60 text-xs mt-1">BPO Solutions</p>
              </div>
              <div className="absolute top-32 left-8 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl animate-float border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group" style={{ animationDelay: "3s" }}>
                <div className="text-primary font-bold group-hover:scale-105 transition-transform">Data Entry</div>
                <p className="text-white/60 text-xs mt-1">Accurate Processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with enhanced animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll Down</span>
        <button
          onClick={() => scrollToSection("#about")}
          className="text-white/60 hover:text-primary transition-colors p-2 rounded-full border border-white/20 hover:border-primary"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
