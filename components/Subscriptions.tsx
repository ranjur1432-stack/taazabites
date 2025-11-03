import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
  secondary?: boolean;
  staggerDelay: string;
}

const PlanCard = ({ title, price, period, features, popular, ctaText, ctaLink, secondary = false, staggerDelay }: PlanCardProps) => (
  <article className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-300 flex flex-col h-full animate-on-scroll ${popular ? 'bg-gradient-to-br from-green-50 to-lime-100/80 border-2 border-[var(--primary)] shadow-2xl popular-glow' : 'bg-white border border-zinc-200/80 shadow-lg'}`} data-animation="slide-fade-in-up" data-stagger-delay={staggerDelay}>
    {popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white text-sm font-bold px-4 py-1 rounded-full">Most Popular</div>}
    <h3 className="text-xl sm:text-2xl font-bold font-iowan text-[var(--primary-dark)] text-center mb-2">{title}</h3>
    <div className="text-center mb-6">
      <span className="text-3xl sm:text-4xl font-extrabold text-[var(--primary-dark)]">{price}</span>
      <span className="text-zinc-500"> / {period}</span>
    </div>
    <ul className="space-y-3 text-zinc-700 mb-8 flex-grow">
      {features.map((feature: string, i: number) => (
        <li key={i} className="flex items-start gap-3">
          <i className="fas fa-check-circle text-[var(--primary)] mt-1"></i> <span>{feature}</span>
        </li>
      ))}
    </ul>
    <a href={ctaLink} target="_blank" rel="noopener noreferrer" className={`w-full text-center py-3 px-6 rounded-lg font-bold transition-all duration-300 ripple-effect ${secondary ? 'bg-white text-[var(--accent-secondary)] border-2 border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-white' : 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white hover:scale-105 shadow-lg shadow-[var(--primary)]/30'}`}>
      {ctaText}
    </a>
  </article>
);

const plans: Omit<PlanCardProps, 'staggerDelay'>[] = [
    { title: "Weekly Warrior", price: "₹1,799", period: "week", features: ['5 Meals (Lunch or Dinner)', 'Choose from full menu', 'Perfect for trying us out', 'Free Delivery'], ctaText: "Choose Plan", ctaLink: "https://wa.me/917975771457?text=Hi!%20I'm%20interested%20in%20the%20Weekly%20Warrior%20plan.", secondary: true, popular: false },
    { title: "Monthly Motivator", price: "₹6,499", period: "month", features: ['20 Meals (Lunch or Dinner)', 'Best value & savings', 'Pause or resume anytime', 'Priority Delivery'], ctaText: "Subscribe Now", ctaLink: "https://wa.me/917975771457?text=Hi!%20I'm%20interested%20in%20the%20Monthly%20Motivator%20plan.", popular: true, secondary: false },
    { title: "Corporate Fuel", price: "Custom", period: "person", features: ['For teams of 10+', 'Custom Budgeting & Menu', 'Dedicated account manager', 'Special corporate rates'], ctaText: "Contact Sales", ctaLink: "https://wa.me/917975771457?text=Hi%20Taazabites!%20I'd%20like%20to%20inquire%20about%20your%20corporate%20meal%20plans.", secondary: true, popular: false }
];


export const Subscriptions: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        if (!isMobile || plans.length <= 1) {
            resetTimeout();
            return;
        }

        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length),
            3500 // Change slide every 3.5 seconds
        );
        return () => {
            resetTimeout();
        };
    }, [currentIndex, plans.length, isMobile, resetTimeout]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

  return (
    <section id="subscriptions" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-[var(--section-bg-light-green)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
            Find Your Perfect Plan
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-zinc-600">Choose a plan that fits your lifestyle. Get started with healthy, delicious meals delivered right to your door.</p>
        </div>
        
        {/* Carousel for mobile, Flex for lg+ */}
        <div className="relative lg:hidden">
            <div className="overflow-hidden py-4">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {plans.map((plan, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-2 flex justify-center">
                            <div className="w-[90%]">
                                <PlanCard 
                                    title={plan.title}
                                    price={plan.price}
                                    period={plan.period}
                                    features={plan.features}
                                    popular={plan.popular}
                                    ctaText={plan.ctaText}
                                    ctaLink={plan.ctaLink}
                                    secondary={plan.secondary}
                                    staggerDelay="0s" 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center gap-3 mt-4">
                {plans.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-[var(--primary)] scale-125' : 'bg-zinc-300 hover:bg-zinc-400'}`}
                        aria-label={`Go to plan ${i + 1}`}
                    />
                ))}
            </div>
        </div>

        <div className="hidden lg:flex lg:items-stretch lg:justify-center lg:gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="sm:w-full sm:max-w-sm">
                <PlanCard 
                    title={plan.title}
                    price={plan.price}
                    period={plan.period}
                    features={plan.features}
                    popular={plan.popular}
                    ctaText={plan.ctaText}
                    ctaLink={plan.ctaLink}
                    secondary={plan.secondary}
                    staggerDelay={`${index * 0.1}s`} 
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};