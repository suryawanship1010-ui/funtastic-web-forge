import { ArrowRight, Globe, Users, Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full border border-white/20" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full border border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/10" />
      </div>

      {/* World Map Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          <ellipse cx="500" cy="250" rx="400" ry="200" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
          <ellipse cx="500" cy="250" rx="300" ry="150" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
          <ellipse cx="500" cy="250" rx="200" ry="100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
      <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-orange-400 rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-primary rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm">Your Trusted Partner in Outsourcing Solutions</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-primary">X</span>view Global
              <br />
              <span className="text-white/90">Services LLP</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-4 italic">
              "Empowering Business Worldwide"
            </p>

            <p className="text-white/70 mb-8 max-w-lg">
              A Business Process Outsourcing (BPO) company providing specialized services 
              by handling customer support, IT services, human resources, finance, and digital marketing.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                size="lg"
                onClick={() => scrollToSection("#services")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group"
              >
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("#about")}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">100+</span>
                </div>
                <p className="text-white/60 text-sm">Happy Clients</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Globe className="h-5 w-5" />
                  <span className="text-2xl font-bold">Global</span>
                </div>
                <p className="text-white/60 text-sm">Reach</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Award className="h-5 w-5" />
                  <span className="text-2xl font-bold">24/7</span>
                </div>
                <p className="text-white/60 text-sm">Support</p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px]">
              {/* Central Globe */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 to-transparent border border-white/20 flex items-center justify-center animate-float">
                  <div className="w-60 h-60 rounded-full bg-gradient-to-br from-primary/40 to-transparent border border-white/30 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/50 to-transparent border border-white/40 flex items-center justify-center">
                      <Globe className="w-20 h-20 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting Icons */}
              <div className="absolute top-10 right-20 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="text-primary font-bold">IT Services</div>
              </div>
              <div className="absolute bottom-20 left-10 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="text-primary font-bold">Customer Support</div>
              </div>
              <div className="absolute top-1/3 right-0 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl animate-float" style={{ animationDelay: "2s" }}>
                <div className="text-primary font-bold">Finance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection("#about")}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
