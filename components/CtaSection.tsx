
import React from 'react';

export const CtaSection: React.FC = () => {
  const imageUrl = "https://images.unsplash.com/photo-1542690439-23ac154211b8?ixlib=rb-4.0.3&fm=webp";
  return (
    <section 
      id="cta-section" 
      className="py-16 sm:py-20 md:py-24 relative bg-black"
    >
      <img
        src={`${imageUrl}&w=1280&q=60`}
        srcSet={`${imageUrl}&w=640&q=60 640w, ${imageUrl}&w=1280&q=60 1280w, ${imageUrl}&w=1920&q=60 1920w`}
        sizes="100vw"
        loading="lazy"
        alt="A vibrant spread of healthy food ingredients"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-zinc-900/70"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold font-iowan mb-4 leading-tight animate-on-scroll" data-animation="slide-fade-in-up" style={{textShadow: '0 3px 15px rgba(0,0,0,0.6)'}}>
          Ready for a Healthier You?
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/80 animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.1s" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
          Your journey to convenient, delicious, and healthy eating starts now. Let's make your wellness goals a reality, one meal at a time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.2s">
          <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-bold px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl shadow-lg shadow-[var(--primary)]/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--primary)]/50 transition-all duration-300 ripple-effect">
            <i className="fas fa-bolt transition-transform duration-300 group-hover:scale-110"></i>
            <span>Order Now</span>
          </a>
           <a href="https://wa.me/917975771457?text=Hi%20Taazabites!%20I'm%20interested%20in%20your%20subscription%20plans.%20Could%20you%20tell%20me%20more?" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white font-bold px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl shadow-lg shadow-yellow-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300 ripple-effect">
             <i className="fas fa-calendar-alt transition-transform duration-300 group-hover:rotate-6"></i>
             <span>View Subscriptions</span>
          </a>
          <a href="https://wa.me/917975771457?text=Hi%20Taazabites!%20I'd%20like%20to%20inquire%20about%20your%20corporate%20meal%20plans." target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl shadow-lg shadow-black/20 hover:-translate-y-1 hover:bg-white/20 hover:border-white transition-all duration-300 ripple-effect">
             <i className="fas fa-briefcase transition-transform duration-300 group-hover:scale-110"></i>
             <span>Corporate Plans</span>
          </a>
        </div>
      </div>
    </section>
  );
};
