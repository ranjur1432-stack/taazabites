import React, { useState, useEffect } from 'react';
import { generateIngredientSpotlight } from '../services/geminiService';

const ingredientImageMap: { [key: string]: { url: string; srcSet: string } } = {
    'Avocado': {
        url: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/KwM7z-0b571135-d864-4cc9-826d-f40132708c1c.jpg?format=webp&w=800&q=75",
        srcSet: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/KwM7z-0b571135-d864-4cc9-826d-f40132708c1c.jpg?format=webp&w=400&q=75 400w, https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/KwM7z-0b571135-d864-4cc9-826d-f40132708c1c.jpg?format=webp&w=800&q=75 800w",
    },
    'Quinoa': {
        url: "https://images.unsplash.com/photo-1565599225828-55b80f342d85?ixlib=rb-4.0.3&fm=webp&w=800&q=75",
        srcSet: "https://images.unsplash.com/photo-1565599225828-55b80f342d85?ixlib=rb-4.0.3&fm=webp&w=400&q=75 400w, https://images.unsplash.com/photo-1565599225828-55b80f342d85?ixlib=rb-4.0.3&fm=webp&w=800&q=75 800w",
    },
    'Paneer': {
        url: "https://images.unsplash.com/photo-1589647363594-8342772591e4?ixlib=rb-4.0.3&fm=webp&w=800&q=75",
        srcSet: "https://images.unsplash.com/photo-1589647363594-8342772591e4?ixlib=rb-4.0.3&fm=webp&w=400&q=75 400w, https://images.unsplash.com/photo-1589647363594-8342772591e4?ixlib=rb-4.0.3&fm=webp&w=800&q=75 800w",
    },
    'Chicken Breast': {
        url: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3&fm=webp&w=800&q=75",
        srcSet: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3&fm=webp&w=400&q=75 400w, https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3&fm=webp&w=800&q=75 800w",
    },
    'Chia Seeds': {
        url: "https://images.unsplash.com/photo-1507914449082-c22146961163?ixlib=rb-4.0.3&fm=webp&w=800&q=75",
        srcSet: "https://images.unsplash.com/photo-1507914449082-c22146961163?ixlib=rb-4.0.3&fm=webp&w=400&q=75 400w, https://images.unsplash.com/photo-1507914449082-c22146961163?ixlib=rb-4.0.3&fm=webp&w=800&q=75 800w",
    }
};

const SkeletonLoader = () => (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center animate-pulse">
        <div className="relative">
            <div className="absolute w-[95%] h-full bg-zinc-200 rounded-3xl transform rotate-3 -z-10"></div>
            <div className="rounded-2xl shadow-2xl overflow-hidden aspect-square max-w-lg mx-auto bg-zinc-200"></div>
        </div>
        <div>
            <div className="h-4 bg-zinc-200 rounded w-1/4 mb-3"></div>
            <div className="h-8 bg-zinc-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-zinc-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
                <div className="h-5 bg-zinc-200 rounded"></div>
                <div className="h-5 bg-zinc-200 rounded"></div>
                <div className="h-5 bg-zinc-200 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);


export const IngredientSpotlight: React.FC = () => {
    const [ingredient, setIngredient] = useState<{ name: string; title: string; description: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchIngredient = async () => {
            setIsLoading(true);
            try {
                const result = await generateIngredientSpotlight();
                if (result && result.name && ingredientImageMap[result.name]) {
                    setIngredient(result);
                } else {
                    throw new Error("AI did not return a valid ingredient.");
                }
            } catch (err) {
                 const message = err instanceof Error ? err.message : "Could not load ingredient.";
                 setError(message);
                 setIngredient({ // Fallback content
                    name: "Avocado",
                    title: "The Nutrient-Dense Powerhouse",
                    description: "Packed with monounsaturated fats, fiber, and potassium, avocados support heart health, improve digestion, and provide a creamy, satisfying texture to our bowls. We source our Hass avocados from the best local farms.",
                 });
            } finally {
                setIsLoading(false);
            }
        };
        fetchIngredient();
    }, []);

    const currentImage = ingredient ? ingredientImageMap[ingredient.name] : ingredientImageMap['Avocado'];

    return (
        <section id="ingredient-spotlight" className="py-16 sm:py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4">
                {isLoading ? <SkeletonLoader /> : (
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="relative animate-on-scroll is-visible" data-animation="slide-in-left">
                            <div className="absolute w-[95%] h-full bg-gradient-to-tr from-green-100/80 to-lime-50 rounded-3xl transform rotate-3 -z-10"></div>
                            <div className="rounded-2xl shadow-2xl overflow-hidden aspect-[4/3] lg:aspect-square max-w-lg mx-auto image-container">
                                {error && <div className="p-4 text-red-600">{error}</div>}
                                {ingredient && (
                                    <img
                                        src={currentImage.url}
                                        srcSet={currentImage.srcSet}
                                        sizes="(max-width: 1023px) 90vw, 450px"
                                        alt={`A close-up of a fresh ${ingredient.name}, a key ingredient in Taazabites meals in Bengaluru`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                        onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="animate-on-scroll is-visible" data-animation="slide-in-right">
                             {ingredient && (
                                <>
                                    <p className="font-semibold text-[var(--accent-secondary)] mb-2">Ingredient Spotlight</p>
                                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] mb-4">
                                        {ingredient.name}: {ingredient.title}
                                    </h2>
                                    <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
                                        {ingredient.description}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};