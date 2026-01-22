import { Target, Eye, Heart, CheckCircle } from "lucide-react";

const About = () => {
  const values = [
    { title: "Excellence", description: "We strive for the highest standards in everything we do, ensuring top-quality service and continuous improvement." },
    { title: "Integrity", description: "We conduct our business with honesty, transparency, and ethical practices, building trust with our clients and partners." },
    { title: "Innovation", description: "We embrace change and innovation, constantly seeking new ways to improve our services and deliver value to our clients." },
    { title: "Customer Focus", description: "Our clients are at the heart of our business. We listen to their needs and work tirelessly to exceed their expectations." },
    { title: "Collaboration", description: "We believe in the power of teamwork and collaboration, both within our organization and with our clients, to achieve shared success." },
    { title: "Respect", description: "We treat everyone with respect and dignity, fostering a positive and inclusive work environment." },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Who We Are
          </h2>
          <p className="text-muted-foreground text-lg">
            <span className="text-primary font-semibold">Xview</span> Global Services LLP is a Business Process Outsourcing and third party company that provides specialized 
            services to other businesses by handling various operational tasks. These tasks can range from customer 
            support and IT services to human resources, finance, and digital marketing.
          </p>
        </div>

        {/* Vision, Mission, Values Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground">
              To be the leading global provider of innovative and efficient outsourcing solutions, 
              empowering businesses to achieve their full potential.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              To deliver exceptional outsourcing services that enhance our clients' operational efficiency, 
              reduce costs, and drive business growth. We are committed to leveraging cutting-edge technology 
              and a customer-centric approach.
            </p>
          </div>

          {/* Values */}
          <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Values</h3>
            <p className="text-muted-foreground">
              We are committed to absolute integrity, transparency, flexibility, innovation, quality 
              and customer satisfaction. Our collective efforts enable clients to achieve their goals.
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="bg-secondary text-secondary-foreground rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center mb-8">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">{value.title}</h4>
                  <p className="text-white/70 text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
