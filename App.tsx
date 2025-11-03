
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Menu } from './components/Menu';
import { CorporateBooking } from './components/CorporateBooking';
import { Subscriptions } from './components/Subscriptions';
import { MealPlanner } from './components/MealPlanner';
import { WorkoutCoach } from './components/WorkoutCoach';
import { NutritionApproach } from './components/NutritionApproach';
import { CtaSection } from './components/CtaSection';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { ExitIntentModal } from './components/ExitIntentModal';
import { AiSearch } from './components/Feedback';
import { About } from './components/About';
import { IngredientSpotlight } from './components/IngredientSpotlight';
import { Testimonials } from './components/Testimonials';
import { generateMetaDescription } from './services/geminiService';

const sectionTitles: { [key: string]: string } = {
  hero: "Taazabites: AI Meal Planner & Healthy Food Delivery in Bengaluru",
  features: "Why Taazabites? | Fresh & Healthy Food in Bengaluru",
  'how-it-works': "How It Works | Easy Healthy Meal Delivery in Bengaluru",
  about: "About Taazabites | Our Mission & Story in Bengaluru",
  menu: "Our Menu | Chef-Crafted Healthy Meals in Bengaluru",
  'corporate-booking': "Corporate Meal Plans | Healthy Office Food in Bengaluru",
  subscriptions: "Subscription Plans | Healthy Meals Delivered Weekly/Monthly",
  'meal-planner': "AI Meal Planner | Personalized Nutrition by Taazabites",
  'workout-coach': "AI Workout Coach | Fitness Plans by Taazabites",
  'nutrition-approach': "Our Nutrition-First Approach | Taazabites",
  'ingredient-spotlight': "Ingredient Spotlight | Quality Sourced by Taazabites",
  testimonials: "What Our Customers Say | Taazabites Reviews",
  faq: "FAQ | Taazabites Healthy Food Delivery",
};

const App: React.FC = () => {
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Helper function to update meta tags for dynamic SEO
  const updateMetaTag = (identifier: 'name' | 'property', value: string, content: string) => {
    let element = document.querySelector(`meta[${identifier}="${value}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(identifier, value);
      document.head.appendChild(element);
    }
    element.content = content;
  };


  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoaderVisible(false), 500);
    };
    window.addEventListener('load', handleLoad);
    
    // Fallback to hide loader
    const fallbackTimeout = setTimeout(() => setIsLoaderVisible(false), 3000);

    // Exit-intent modal trigger: show after 1 to 3 minutes
    const minDelay = 60 * 1000; // 1 minute
    const maxDelay = 3 * 60 * 1000; // 3 minutes
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    const exitModalTimer = setTimeout(() => {
        if (!sessionStorage.getItem('exitModalShown')) {
            setIsExitModalOpen(true);
            sessionStorage.setItem('exitModalShown', 'true');
        }
    }, randomDelay);

    // AI-Powered Dynamic Meta Description for SEO
    const fetchMetaDescription = async () => {
        try {
            const result = await generateMetaDescription();
            if (result && result.description) {
                updateMetaTag('name', 'description', result.description);
                updateMetaTag('property', 'og:description', result.description);
                updateMetaTag('name', 'twitter:description', result.description);
            }
        } catch (error) {
            console.error("Failed to fetch dynamic meta description:", error);
        }
    };
    fetchMetaDescription();


    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimeout);
      clearTimeout(exitModalTimer);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const currentScroll = window.scrollY;
    setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Intersection Observer for animations
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.staggerDelay;
            if (delay) {
              el.style.animationDelay = delay;
            }
            el.classList.add('is-visible');
            observerInstance.unobserve(el);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      animatedElements.forEach(el => observer.observe(el));
      
      return () => observer.disconnect();
    } else {
      // Fallback for older browsers
      animatedElements.forEach(el => el.classList.add('is-visible'));
    }
  }, []);
  
  // Ripple Effect Handler
  useEffect(() => {
    const applyRipple = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('.ripple-effect');
        if (!target) return;

        // Create ripple
        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - radius}px`;
        ripple.style.top = `${e.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');
        
        // Remove old ripple
        const existingRipple = target.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        target.appendChild(ripple);
    };

    document.addEventListener('click', applyRipple);
    return () => document.removeEventListener('click', applyRipple);
  }, []);

  // SEO: Dynamic Title Update on Scroll
  useEffect(() => {
    const sections = Object.keys(sectionTitles)
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          const sectionId = intersectingEntry.target.id;
          if (sectionTitles[sectionId]) {
            document.title = sectionTitles[sectionId];
          }
        }
      },
      {
        rootMargin: '-45% 0px -45% 0px', // Trigger when section is near the middle of the viewport
        threshold: 0,
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="bg-[var(--off-white)] text-[#333] font-sans antialiased">
      {isLoaderVisible && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex items-center justify-center transition-opacity duration-500">
          <div className="pulse-loader w-12 h-12 rounded-full bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/50"></div>
        </div>
      )}

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[1300]">
        <div 
          className="h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-secondary)] transition-all duration-200" 
          style={{ width: `${scrollProgress}%` }}>
        </div>
      </div>

      <a className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[var(--primary-dark)] focus:text-white focus:px-4 focus:py-2 focus:z-[10000] focus:rounded-lg focus:font-semibold" href="#main-content">
        Skip to main content
      </a>

      <Header />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <About />
        <Menu />
        <CorporateBooking />
        <Subscriptions />
        <MealPlanner />
        <WorkoutCoach />
        <NutritionApproach />
        <IngredientSpotlight />
        <Testimonials />
        <CtaSection />
        <Faq />
      </main>
      <Footer />
      <FloatingWidgets onSearchClick={() => setIsSearchOpen(true)} />
      <ExitIntentModal isOpen={isExitModalOpen} onClose={() => setIsExitModalOpen(false)} />
      <AiSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default App;
