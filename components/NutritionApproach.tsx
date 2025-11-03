import React from 'react';

const PillarCard = ({ icon, title, text, staggerDelay }: { icon: string; title: string; text: string; staggerDelay: string; }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 sm:gap-5 animate-on-scroll`} data-animation="slide-fade-in-up" data-stagger-delay={staggerDelay}>
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[var(--primary-light)] to-white text-[var(--primary-dark)] text-2xl flex items-center justify-center border border-zinc-200/80">
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <h3 className="text-lg sm:text-xl font-bold font-iowan text-[var(--primary-dark)] mb-1">{title}</h3>
            <p className="text-zinc-600 text-base">{text}</p>
        </div>
    </div>
);


export const NutritionApproach: React.FC = () => {
    const imageUrlBase = "https://cdn.urbanpiper.com/media/bizmedia/2025/10/15/WT8cK1-62d3e3a9-d9c9-44bc-b500-6573f43c2298.jpg";

    return (
        <section id="nutrition-approach" className="py-16 sm:py-20 md:py-24 bg-[var(--section-bg-light-green)] overflow-hidden relative">
             <div className="section-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                        Our Nutrition-First Approach
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image Column with Decorative Elements */}
                    <div className="relative animate-on-scroll hidden lg:block" data-animation="scale-up">
                         {/* Decorative Background */}
                        <div className="absolute w-[90%] h-[90%] bg-gradient-to-br from-green-100 to-lime-100/50 rounded-3xl transform -rotate-6"></div>
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/5] w-full max-w-md mx-auto image-container">
                            <img 
                                src={`${imageUrlBase}?format=webp&w=800&q=75`}
                                srcSet={`${imageUrlBase}?format=webp&w=400&q=75 400w, ${imageUrlBase}?format=webp&w=800&q=75 800w, ${imageUrlBase}?format=webp&w=1200&q=75 1200w`}
                                sizes="(max-width: 640px) 100vw, (max-width: 1023px) 80vw, 450px"
                                alt="A delicious and healthy Taazabites meal in a bowl"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                            />
                        </div>
                    </div>

                     {/* Text & Pillars Column */}
                    <div className="flex flex-col gap-8">
                        <PillarCard 
                            staggerDelay="0.1s"
                            icon="fa-balance-scale-right"
                            title="Macro-Balanced Meals"
                            text="Every dish is perfectly balanced with protein, carbs, and healthy fats to fuel your body and mind."
                        />
                        <PillarCard 
                            staggerDelay="0.2s"
                            icon="fa-seedling"
                            title="Clean, Whole Ingredients"
                            text="No artificial preservatives, colors, or flavors. We source locally and prioritize natural foods you can trust."
                        />
                        <PillarCard 
                            staggerDelay="0.3s"
                            icon="fa-user-cog"
                            title="Personalized Nutrition"
                            text="Our AI and nutritionists help tailor plans to your dietary needs and health goals, ensuring every meal works for you."
                        />
                    </div>
                </div>
                
                 {/* CTA Block */}
                <div className="mt-20 text-center bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto animate-on-scroll border border-zinc-200/60" data-animation="scale-up" data-stagger-delay="0.4s">
                    <h3 className="text-2xl sm:text-3xl font-bold font-iowan text-[var(--primary-dark)] mb-4">
                        Ready to Fuel Your Body Intelligently?
                    </h3>
                    <p className="text-zinc-600 mb-6 text-base sm:text-lg max-w-2xl mx-auto">
                        Explore our menu and discover how delicious and easy healthy eating can be. Your journey to peak wellness starts here.
                    </p>
                    <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white font-semibold px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl shadow-lg shadow-yellow-500/30 hover:scale-105 hover:shadow-2xl transition-all duration-300 ripple-effect">
                        <i className="fas fa-utensils"></i> Explore The Menu
                    </a>
                </div>
            </div>
             <div className="section-divider top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
};