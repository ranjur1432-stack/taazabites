

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateMenuSuggestion } from '../services/geminiService';

interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  tags: string[];
  badge?: string;
  nutritionInfo: string;
  orderLink: string;
}

const menuItemsData: MenuItemProps[] = [
    { name: "High Protein Egg Chicken Meal", description: "Grilled chicken with boiled eggs and seasonal vegetables.", price: "349", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/03/HYC3ipj-ea1cb459-9f06-4842-9f10-c36beef7395f.jpg?format=webp&w=400&q=75", tags: ["high-protein", "keto", "chefs-pick"], badge: "Chef's Pick", nutritionInfo: "Calories: 450 kcal, Protein: 42g, Net Carbs: 8g, Fat: 28g, Fiber: 2g", orderLink: "https://taazabites.in/item/5215583/fit-feast-chicken-veggies-egg" },
    { name: "Quinoa Power Bowl with Grilled Paneer", description: "Nutrient-packed quinoa with grilled paneer and fresh veggies.", price: "379", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/XQI0vGF-c0de1c2c-b08a-4bf6-94b7-7cb7547c811a.jpg", tags: ["vegetarian", "high-protein", "healthy-start"], badge: "Healthy Start", nutritionInfo: "Calories: 480 kcal, Protein: 25g, Carbs: 50g, Fat: 20g, Fiber: 10g", orderLink: "https://taazabites.in/item/5518227/protein-boost-paneer-quinoa-bowl" },
    { name: "Premium Chicken Pink Pasta", description: "Creamy pink sauce with tender chicken and fresh herbs.", price: "459", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/03/VruXdfjp-e6ccb5c5-fa1f-4e5d-90bc-12161af1fa18.jpg?format=webp&w=400&q=75", tags: ["high-protein", "indulgent"], badge: "Indulgent", nutritionInfo: "Calories: 580 kcal, Protein: 38g, Carbs: 55g, Fat: 25g, Fiber: 5g", orderLink: "https://taazabites.in/item/3454075/premium-chicken-pink-pasta" },
    { name: "Dry Fruit Whey Protein Shake", description: "A powerhouse shake with whey protein, almonds, and more.", price: "269", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/15/bCSV8-f1b53677-3e7a-42ac-8e0f-46ed6af19bb6.jpg?format=webp&w=400&q=75", tags: ["high-protein", "keto", "healthy-boost"], badge: "Healthy Boost", nutritionInfo: "Calories: 380 kcal, Protein: 28g, Carbs: 30g, Fat: 18g, Sugar: 20g", orderLink: "https://taazabites.in/item/5298366/dry-fruit-whey-protein-shake300ml" },
    { name: "Dry Fruit Chia Pudding", description: "Chia seeds, assorted dry fruits and natural sweeteners.", price: "319", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/03/s9ZRSy5-f46b9d1a-8aca-471a-ae55-11652376cce1.jpg?format=webp&w=400&q=75", tags: ["vegetarian", "healthy-start", "healthy-boost"], badge: "Healthy Start", nutritionInfo: "Calories: 350 kcal, Protein: 12g, Carbs: 45g, Fat: 15g, Fiber: 15g", orderLink: "https://taazabites.in/item/5379667/dry-fruit-chia-pudding-350g" },
    { name: "Protein Scramble Rice Bowl", description: "Scrambled eggs, veggie rice, and juicy chicken breast.", price: "349", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/09/5x3bE-3c79d21a-07b6-498b-81fa-649a1c953380.jpg?format=webp&w=400&q=75", tags: ["high-protein"], nutritionInfo: "Calories: 520 kcal, Protein: 40g, Carbs: 35g, Fat: 24g, Fiber: 4g", orderLink: "https://taazabites.in/item/5215586/protein-scramble-chicken-egg-rice-bowl" },
];

// Dynamically generate filter options from menu data
const allTags = [...new Set(menuItemsData.flatMap(item => item.tags))];
const tagLabels: { [key: string]: string } = {
    'high-protein': 'High Protein',
    'vegetarian': 'Vegetarian',
    'keto': 'Keto',
    'new-item': 'New',
    'healthy-start': 'Healthy Start',
    'chefs-pick': "Chef's Pick",
    'indulgent': 'Indulgent',
    'healthy-boost': 'Healthy Boost'
};
// Filter and sort tags based on our desired order and existence in data
const availableTags = Object.keys(tagLabels).filter(tag => allTags.includes(tag));


const SocialShareButtons: React.FC<{ name: string; orderLink: string; tags: string[] }> = ({ name, orderLink, tags }) => {
    const shareText = `Check out this delicious "${name}" from Taazabites! Healthy and delicious.`;
    const shareUrl = orderLink;
    const hashtags = ['Taazabites', ...tags.map(t => t.replace(/-/g, ''))].join(',');

    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${hashtags}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-500">Share:</span>
            <div className="flex items-center gap-3 text-lg">
                <a href={shareLinks.whatsapp} data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer" aria-label={`Share ${name} on WhatsApp`} className="text-zinc-400 hover:text-[#25D366] transition-colors"><i className="fab fa-whatsapp"></i></a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label={`Share ${name} on Twitter`} className="text-zinc-400 hover:text-[#1DA1F2] transition-colors"><i className="fab fa-twitter"></i></a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Share ${name} on Facebook`} className="text-zinc-400 hover:text-[#1877F2] transition-colors"><i className="fab fa-facebook-f"></i></a>
            </div>
        </div>
    );
};

const MenuItem: React.FC<MenuItemProps & { staggerDelay: string; isSuggested?: boolean; }> = ({ name, description, price, imageUrl, badge, staggerDelay, orderLink, tags, nutritionInfo, isSuggested }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [isNutritionVisible, setIsNutritionVisible] = useState(false);
    const cardRef = useRef<HTMLElement>(null);
    const baseUrl = imageUrl.split('?')[0];
    const nutritionId = `nutrition-${name.replace(/\s+/g, '-')}`;


    useEffect(() => {
        const currentRef = cardRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '0px 0px 200px 0px', // Pre-load images 200px before they enter viewport
                threshold: 0.01
            }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const srcSet = `${baseUrl}?format=webp&w=320&q=75 320w, ${baseUrl}?format=webp&w=480&q=75 480w, ${baseUrl}?format=webp&w=640&q=75 640w`;
    
    const nutritionParts = nutritionInfo.split(', ').map(part => {
        const [key, value] = part.split(': ');
        return { key, value };
    });

    return (
        <article ref={cardRef} className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl h-full animate-on-scroll border ${isSuggested ? 'popular-glow border-[var(--primary)]' : 'border-zinc-200/60'}`} data-animation="slide-fade-in-up" data-stagger-delay={staggerDelay}>
            <div className="relative image-container aspect-[4/3]">
                {badge && <span className="absolute top-4 left-4 bg-[var(--accent-secondary)] text-white text-xs font-bold px-3 py-1 rounded-full z-10">{badge}</span>}
                {isSuggested && <span className="absolute top-4 right-4 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1.5"><i className="fas fa-magic"></i> AI Pick</span>}
                <img 
                    loading="lazy"
                    src={isInView ? imageUrl : undefined}
                    srcSet={isInView ? srcSet : undefined}
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
                    alt={`A delicious bowl of ${name} from Taazabites, Bengaluru's top healthy meal delivery.`} 
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${isImageLoaded ? 'is-loaded' : ''}`} 
                    decoding="async"
                    onLoad={() => setIsImageLoaded(true)}
                />
            </div>
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold font-iowan text-zinc-800 group-hover:text-[var(--primary-dark)] transition-colors">{name}</h3>
                <p className="text-zinc-600 text-sm mt-2 flex-grow">{description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xl sm:text-2xl font-extrabold text-zinc-900">₹{price}</p>
                    <button 
                        onClick={() => setIsNutritionVisible(!isNutritionVisible)} 
                        className="text-sm font-semibold text-[var(--primary-dark)] hover:underline flex items-center gap-1.5"
                        aria-expanded={isNutritionVisible}
                        aria-controls={nutritionId}
                    >
                        Nutrition
                        <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isNutritionVisible ? 'rotate-180' : ''}`}></i>
                    </button>
                </div>

                {/* Nutrition Info Panel */}
                <div
                    id={nutritionId}
                    className={`transition-all ease-in-out duration-300 overflow-hidden ${isNutritionVisible ? 'max-h-screen mt-4 pt-4 border-t' : 'max-h-0'}`}
                >
                    <div className="space-y-1">
                        {nutritionParts.map(({ key, value }) => (
                            <div key={key} className="flex justify-between items-baseline text-sm">
                                <span className="font-semibold text-zinc-600">{key}</span>
                                <span className="text-zinc-800 font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-200/70">
                    <SocialShareButtons name={name} orderLink={orderLink} tags={tags} />
                </div>
            </div>
            <div className="p-4 sm:p-6 pt-0 mt-auto">
                <a href={orderLink} target="_blank" rel="noopener noreferrer" className="w-full text-center py-3 px-4 rounded-lg font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-all duration-300 flex items-center justify-center gap-2 ripple-effect transform group-hover:scale-105">
                    <i className="fas fa-shopping-cart"></i> Order Now
                </a>
            </div>
        </article>
    );
};


const Modal: React.FC<{ isVisible: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isVisible, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalTitleId = 'modal-title';

    useEffect(() => {
        if (!isVisible) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onClose]);

    if (!isVisible) return null;
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-pop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={modalTitleId}>
        <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 relative" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 id={modalTitleId} className="text-xl font-bold font-iowan text-[var(--primary-dark)] flex items-center gap-2"><i className="fas fa-magic text-[var(--primary)]"></i>{title}</h3>
            <button onClick={onClose} className="text-2xl text-zinc-400 hover:text-zinc-600" aria-label="Close modal">&times;</button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    );
};

export const Menu: React.FC = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [suggestion, setSuggestion] = useState<{ mealName: string; reason: string } | null>(null);
    const [craving, setCraving] = useState('');
    const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
    const [suggestionError, setSuggestionError] = useState('');
    const [suggestedMealName, setSuggestedMealName] = useState<string | null>(null);


    const handleSuggestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!craving.trim()) return;
        setIsSuggestionLoading(true);
        setSuggestionError('');
        setSuggestion(null);
        try {
            const result = await generateMenuSuggestion(craving);
            setSuggestion(result);
            setSuggestedMealName(result.mealName);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not get a suggestion.';
            setSuggestionError(message);
        } finally {
            setIsSuggestionLoading(false);
        }
    };
    
     const handleCloseModal = () => {
        setIsSuggestionModalOpen(false);
        // Reset state after a delay to allow for closing animation
        setTimeout(() => {
            setCraving('');
            setSuggestion(null);
            setSuggestionError('');
            // Do not reset suggestedMealName here so the highlight persists
        }, 300);
    };


    const handleFilterToggle = (tag: string) => {
        setSuggestedMealName(null); // Clear suggestion highlight on filter change
        setSelectedFilters(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    const handleClearFilters = () => {
        setSuggestedMealName(null);
        setSelectedFilters([]);
    };

    const filteredItems = selectedFilters.length === 0
        ? menuItemsData
        : menuItemsData.filter(item =>
            selectedFilters.some(filter => item.tags.includes(filter))
        );

    const [currentIndex, setCurrentIndex] = useState(0);
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
        if (!isMobile || filteredItems.length <= 1) {
            resetTimeout();
            return;
        }

        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredItems.length),
            4000 // Change slide every 4 seconds
        );
        return () => {
            resetTimeout();
        };
    }, [currentIndex, filteredItems.length, isMobile, resetTimeout, selectedFilters]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };


  return (
    <>
    <section id="menu" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[var(--section-bg-light-green)] to-white relative">
        <div className="section-divider top">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
            Chef-Crafted Menu
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
          </h2>
           <p className="max-w-2xl mx-auto mt-4 text-zinc-600">Explore our delicious, nutritionist-approved meals designed for a healthier you. Freshly prepared and delivered across Bengaluru.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.2s">
            <button onClick={handleClearFilters} className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${selectedFilters.length === 0 ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white text-zinc-700 hover:bg-zinc-100 border'}`}>All</button>
            {availableTags.map(tag => (
                <button 
                    key={tag} 
                    onClick={() => handleFilterToggle(tag)} 
                    className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${selectedFilters.includes(tag) ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white text-zinc-700 hover:bg-zinc-100 border'}`}
                >
                    {tagLabels[tag]}
                </button>
            ))}
            <button onClick={() => setIsSuggestionModalOpen(true)} className="px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:scale-105 flex items-center gap-2">
                <i className="fas fa-magic"></i> AI Suggestion
            </button>
        </div>
        
        {/* Mobile Carousel */}
        <div className="relative lg:hidden">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {filteredItems.map((item, index) => (
                        <div key={item.name + index} className="w-full flex-shrink-0 px-2 flex justify-center">
                            <div className="w-[90%] sm:w-[70%] md:w-[60%]">
                                <MenuItem {...item} staggerDelay="0s" isSuggested={item.name === suggestedMealName} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="flex justify-center gap-3 mt-8">
                {filteredItems.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-[var(--primary)] scale-125' : 'bg-zinc-300 hover:bg-zinc-400'}`}
                        aria-label={`Go to menu item ${i + 1}`}
                    />
                ))}
            </div>
        </div>


        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredItems.map((item, index) => (
                <MenuItem key={item.name + index} {...item} staggerDelay={`${index * 0.1}s`} isSuggested={item.name === suggestedMealName}/>
            ))}
        </div>
      </div>
       <div className="section-divider">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
    </section>
    <Modal isVisible={isSuggestionModalOpen} onClose={handleCloseModal} title="AI Meal Suggestion">
        {!suggestion ? (
        <form onSubmit={handleSuggestionSubmit}>
            <label htmlFor="craving" className="font-semibold text-zinc-700 mb-2 block">What are you in the mood for?</label>
            <input 
                type="text" 
                id="craving" 
                value={craving}
                onChange={(e) => setCraving(e.target.value)}
                placeholder="e.g., 'a light lunch' or 'post-workout fuel'"
                className="w-full px-4 py-2 bg-white rounded-lg border-2 border-zinc-200 outline-none placeholder:text-zinc-400 focus:border-[var(--primary)] transition-all"
            />
            {suggestionError && <p className="text-red-500 text-sm mt-2">{suggestionError}</p>}
            <button type="submit" disabled={isSuggestionLoading} className="w-full mt-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-bold py-3 px-6 rounded-lg text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-400 disabled:from-zinc-400 ripple-effect">
                {isSuggestionLoading ? <div className="meal-plan-loader"></div> : "Get Suggestion"}
            </button>
        </form>
        ) : (
            <div className="text-center animate-fade-in-pop">
                <p className="text-zinc-600 mb-2">Based on your craving, we recommend:</p>
                <h4 className="text-2xl font-bold text-[var(--primary-dark)]">{suggestion.mealName}</h4>
                <blockquote className="mt-3 bg-zinc-100 border-l-4 border-zinc-300 p-3 rounded-r-lg">
                    <p className="text-zinc-700 italic">"{suggestion.reason}"</p>
                </blockquote>
                 <button onClick={handleCloseModal} className="w-full mt-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg text-lg hover:scale-105 transition-all duration-300">
                    Awesome, thanks!
                 </button>
            </div>
        )}
    </Modal>
    </>
  );
};
