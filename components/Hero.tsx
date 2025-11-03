

import React, { useState, useEffect } from 'react';
import { generateHeroCopy } from '../services/geminiService';

const prompts = {
  lateNight: [ // 11pm - 3am
    "Late-Night Cravings? Plan a Healthy Tomorrow.",
    "The City Sleeps, Your Health Goals Don't. Plan Ahead.",
    "Dreaming of a Healthier You? Let's Start Tomorrow.",
  ],
  earlyMorning: [ // 3am - 8am
    "Rise Before the Sun. Fuel Your Day the Right Way.",
    "An Early Start Deserves a Perfect Meal. Plan It Now.",
    "Good Morning, Early Bird! Your Healthy Meals Await.",
  ],
  morning: [ // 8am - 11am
    "Good Morning, Bangalore! What's for Lunch?",
    "Conquer Your Morning. We'veGot Your Lunch Covered.",
    "Fuel Your Productive Morning with a Healthy Meal Plan.",
  ],
  afternoon: [ // 11am - 3pm
    "Lunchtime Hustle? Get Freshness Delivered to Your Desk.",
    "The Perfect Mid-Day Fuel Is Just an Order Away.",
    "Don't Skip Lunch. Elevate It.",
  ],
  lateAfternoon: [ // 3pm - 6pm
    "Imagine a Perfect Dinner Tonight. Let's Make It Happen.",
    "Long Day? A Delicious, Healthy Dinner Is A Click Away.",
    "Finish Your Day Strong. A Chef-Crafted Meal Awaits.",
  ],
  evening: [ // 6pm - 11pm
    "Unwind with a Delicious, Guilt-Free Dinner.",
    "Dinner is Served. The Healthy, Hassle-Free Way.",
    "End Your Day on a High Note. A Perfect Meal Awaits.",
  ],
};

const holidays: { [key: string]: string } = {
    "1-1": "Happy New Year, Bangalore!",
    "26-1": "Happy Republic Day!",
    "15-8": "Happy Independence Day!",
    "2-10": "Wishing you a peaceful Gandhi Jayanti.",
    // Note: Diwali's date is variable. A more robust solution would use a library.
    // This is a placeholder for demonstration.
    "1-11": "Happy Diwali! May your life be full of light and joy.", 
    "25-12": "Merry Christmas and Happy Holidays!",
};


export const Hero: React.FC = () => {
  const [heroContent, setHeroContent] = useState({
    subtitle: "Nourish Your Life, One Bite at a Time",
  });
  const [specialGreeting, setSpecialGreeting] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [heroCopies, setHeroCopies] = useState([
    {
      headline: 'Unleash Your\nPeak Performance.',
      subheadline: 'Fuel your ambition with chef-crafted, nutritionist-designed meals, delivered effortlessly to your demanding Bengaluru lifestyle.'
    }
  ]);
  const [currentCopyIndex, setCurrentCopyIndex] = useState(0);


  useEffect(() => {
    // Check for special holidays
    const today = new Date();
    const dateKey = `${today.getDate()}-${today.getMonth() + 1}`;
    if (holidays[dateKey]) {
        setSpecialGreeting(holidays[dateKey]);
    }

    // Set time-based dynamic prompt
    const hour = today.getHours();
    let currentPrompts;

    if (hour >= 3 && hour < 8) { // Early Morning: 3am - 8am
        currentPrompts = prompts.earlyMorning;
    } else if (hour >= 8 && hour < 11) { // Morning: 8am - 11am
        currentPrompts = prompts.morning;
    } else if (hour >= 11 && hour < 15) { // Lunchtime: 11am - 3pm
        currentPrompts = prompts.afternoon;
    } else if (hour >= 15 && hour < 18) { // Late Afternoon: 3pm - 6pm
        currentPrompts = prompts.lateAfternoon;
    } else if (hour >= 18 && hour < 23) { // Evening: 6pm - 11pm
        currentPrompts = prompts.evening;
    } else { // Late Night: 11pm - 3am
        currentPrompts = prompts.lateNight;
    }
    
    const subtitle = currentPrompts[Math.floor(Math.random() * currentPrompts.length)];
    
    setHeroContent({ subtitle });

    // Fetch dynamic hero copy from Gemini
    const fetchHeroCopy = async () => {
        try {
            const copies = await generateHeroCopy();
            if (copies && copies.length > 0) {
                // Combine with the default one to ensure there's always something to show
                setHeroCopies(prev => [...prev, ...copies]);
            }
        } catch (error) {
            console.error("Failed to fetch hero copy:", error);
            // Fallback is already in state, so no action needed
        }
    };
    fetchHeroCopy();

  }, []);

  // Effect for rotating copy
  useEffect(() => {
    if (heroCopies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCopyIndex(prevIndex => (prevIndex + 1) % heroCopies.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [heroCopies.length]);
  
  const heroImageUrl = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&fm=webp";
  const currentCopy = heroCopies[currentCopyIndex];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-white text-center overflow-hidden">
      <div className="absolute inset-0 image-container">
        <img
          src={`${heroImageUrl}&w=1920&q=50`}
          srcSet={`${heroImageUrl}&w=640&q=50 640w, ${heroImageUrl}&w=1280&q=50 1280w, ${heroImageUrl}&w=1920&q=50 1920w`}
          sizes="100vw"
          alt="A healthy and colorful bowl of food with fresh ingredients"
          className={`w-full h-full object-cover animate-ken-burns ${isImageLoaded ? 'is-loaded' : ''}`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setIsImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
      </div>
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-5xl">
        {specialGreeting && (
            <div className="mb-4 animate-on-scroll" data-animation="fade-in">
                <p className="inline-block bg-[var(--accent)] text-zinc-900 font-bold px-4 py-2 rounded-full text-lg shadow-lg">
                    {specialGreeting}
                </p>
            </div>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold text-white/90 mb-3 animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.1s" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
            {heroContent.subtitle}
        </h2>
        <h1 key={currentCopyIndex} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-iowan mb-4 leading-tight whitespace-pre-line animate-on-scroll is-visible" data-animation="slide-fade-in-up" style={{textShadow: '0 3px 15px rgba(0,0,0,0.6)'}}>
          {currentCopy.headline}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 text-white/90 animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.2s" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
          {currentCopy.subheadline}
        </p>
        {/* Key Features - Desktop */}
        <div className="mt-8 hidden sm:flex items-center justify-center gap-6 sm:gap-8 max-w-4xl mx-auto text-white/90 animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.3s">
            <div className="flex items-center justify-center gap-3">
                <i className="fas fa-utensils text-[var(--accent)] text-xl"></i>
                <span className="font-semibold">Chef-Crafted Meals</span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <i className="fas fa-brain text-[var(--accent)] text-xl"></i>
                <span className="font-semibold">AI-Powered Plans</span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <i className="fas fa-truck-fast text-[var(--accent)] text-xl"></i>
                <span className="font-semibold">Fresh & Fast Delivery</span>
            </div>
        </div>
        {/* Key Features - Mobile */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:hidden text-white/90 animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.3s">
            <div className="flex items-center justify-center gap-3">
                <i className="fas fa-utensils text-[var(--accent)] text-lg"></i>
                <span className="font-semibold text-base">Chef-Crafted Meals</span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <i className="fas fa-brain text-[var(--accent)] text-lg"></i>
                <span className="font-semibold text-base">AI-Powered Plans</span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <i className="fas fa-truck-fast text-[var(--accent)] text-lg"></i>
                <span className="font-semibold text-base">Fresh & Fast Delivery</span>
            </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.4s">
          <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-bold px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl shadow-lg shadow-[var(--primary)]/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--primary)]/50 transition-all duration-300 ripple-effect">
            <i className="fas fa-shopping-cart transition-transform duration-300 group-hover:translate-x-1"></i>
            <span>Order Now</span>
          </a>
          <div className="relative">
             <a href="https://wa.me/917975771457?text=Hi%20Taazabites!%20I'm%20interested%20in%20your%20subscription%20plans.%20Could%20you%20tell%20me%20more?" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white font-bold px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl shadow-lg shadow-yellow-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300 ripple-effect">
                 <i className="fas fa-calendar-alt transition-transform duration-300 group-hover:rotate-6"></i>
                 <span>View Subscriptions</span>
              </a>
              <span className="absolute -top-3 -right-3 bg-[var(--accent-secondary)] text-white text-xs font-bold px-2.5 py-1 rounded-full transform rotate-12 shadow-lg animate-pulse-badge">
                Best Value
              </span>
          </div>
          <a href="https://wa.me/917975771457?text=Hi%20Taazabites!%20I'd%20like%20to%20inquire%20about%20your%20corporate%20meal%20plans." target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl shadow-lg shadow-black/20 hover:-translate-y-1 hover:bg-white/20 hover:border-white transition-all duration-300 ripple-effect">
             <i className="fas fa-briefcase transition-transform duration-300 group-hover:scale-110"></i>
             <span>Corporate Plans</span>
          </a>
        </div>
      </div>
       <div className="section-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </section>
  );
};