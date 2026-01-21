import { Award, DollarSign, TrendingUp, Heart, CheckCircle } from "lucide-react";

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Award,
      title: "Expertise",
      description: "Our team of professionals has extensive experience in their respective fields.",
      stat: "10+",
      statLabel: "Years Experience"
    },
    {
      icon: DollarSign,
      title: "Cost-Effective",
      description: "We offer competitive pricing without compromising on quality.",
      stat: "40%",
      statLabel: "Cost Savings"
    },
    {
      icon: TrendingUp,
      title: "Scalability",
      description: "Our services can be scaled to meet the growing needs of your business.",
      stat: "100%",
      statLabel: "Flexible Solutions"
    },
    {
      icon: Heart,
      title: "Customer-Centric",
      description: "We prioritize customer satisfaction and strive to exceed your expectations.",
      stat: "24/7",
      statLabel: "Support Available"
    }
  ];

  const benefits = [
    "Reduce operational costs by up to 40%",
    "Access to global talent pool",
    "Focus on core business activities",
    "Improve efficiency and productivity",
    "Cutting-edge technology solutions",
    "Flexible engagement models",
    "Dedicated account management",
    "Transparent reporting and analytics"
  ];

  return (
    <section id="why-us" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Partner With Xview Global?
          </h2>
          <p className="text-muted-foreground text-lg">
            We deliver exceptional value through our expertise, cost-effective solutions, and unwavering commitment to customer satisfaction.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="group bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center border border-border hover:border-primary/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <reason.icon className="h-10 w-10 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-1">{reason.stat}</div>
              <div className="text-sm text-muted-foreground mb-4">{reason.statLabel}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-secondary text-secondary-foreground rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Benefits of Partnering With Us
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-8 md:p-12 flex items-center justify-center">
              <div className="relative">
                {/* Stats Circles */}
                <div className="w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-primary/50 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">100+</div>
                        <div className="text-xs text-white/80">Clients</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-4 -right-8 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-xs text-white/80">Satisfaction</div>
                </div>
                <div className="absolute -bottom-4 -left-8 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-white/80">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
