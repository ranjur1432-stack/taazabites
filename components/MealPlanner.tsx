import React, { useState, useEffect, useRef } from 'react';
import { generateMealPlan } from '../services/geminiService';

interface Meal {
    name: string;
    reason: string;
}

interface DailyTotals {
    calories: string;
    protein: string;
}

interface MealPlan {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    summary: string;
    dailyTotals: DailyTotals;
}

// NEW: Themed loading component
const loadingMessages = [
    "Consulting our AI nutritionist...",
    "Balancing your macros...",
    "Crafting your delicious plan...",
    "Selecting the freshest ingredients...",
    "Finalizing your health journey..."
];

const ThemedMealPlanLoader = () => {
    const [message, setMessage] = useState(loadingMessages[0]);
    const messageRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % loadingMessages.length;
            if (messageRef.current) {
                messageRef.current.style.opacity = '0';
                setTimeout(() => {
                    setMessage(loadingMessages[index]);
                    if (messageRef.current) {
                        messageRef.current.style.opacity = '1';
                    }
                }, 300);
            }
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
             {/* Steaming Bowl SVG Animation */}
            <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path
                        d="M 10,60 Q 50,110 90,60"
                        stroke="#d1d5db"
                        strokeWidth="5"
                        fill="transparent"
                        strokeLinecap="round"
                    />
                     <path
                        d="M 15,62 Q 50,105 85,62"
                        fill="#f3f4f6"
                    />
                </svg>
                {/* Steam particles */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-300 rounded-full opacity-60"
                    style={{ animation: 'rise-steam 2.5s infinite ease-out' }}
                ></div>
                 <div
                    className="absolute top-0 left-1/3 -translate-x-1/2 w-1 h-4 bg-gray-300 rounded-full opacity-50"
                    style={{ animation: 'rise-steam 2.5s infinite ease-out 0.5s' }}
                ></div>
                <div
                    className="absolute top-0 left-2/3 -translate-x-1/2 w-1 h-3 bg-gray-300 rounded-full opacity-70"
                    style={{ animation: 'rise-steam 2.5s infinite ease-out 1s' }}
                ></div>
            </div>
            {/* Dynamic Text */}
            <p ref={messageRef} className="text-zinc-600 font-semibold transition-opacity duration-300 h-6">
                {message}
            </p>
             {/* Progress Bar */}
            <div className="w-full max-w-xs h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full loader-progress"></div>
            </div>
        </div>
    );
};


const MultiSelectDropdown: React.FC<{
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}> = ({ options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    const handleSelect = (option: string) => {
        let newSelected: string[];

        if (option === 'Any') {
            newSelected = selected.includes('Any') ? [] : ['Any'];
        } else {
            const currentSelected = selected.filter(item => item !== 'Any');
            if (currentSelected.includes(option)) {
                newSelected = currentSelected.filter(item => item !== option);
            } else {
                newSelected = [...currentSelected, option];
            }
        }
        
        if (newSelected.length === 0) {
          newSelected = ['Any'];
        }
        onChange(newSelected);
    };
    
    const isPlaceholder = selected.length === 0 || (selected.length === 1 && selected[0] === 'Any');

    const getDisplayValue = () => {
        if (isPlaceholder) {
            return 'Any Preference';
        }
        if (selected.length === 1) {
            return selected[0];
        }
        return `${selected.length} preferences selected`;
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="w-full bg-white p-3 rounded-lg border-2 border-zinc-200 outline-none focus:border-[var(--primary)] transition-all flex justify-between items-center text-left"
            >
                <span className={`truncate ${isPlaceholder ? 'text-zinc-400' : 'text-zinc-800'}`}>{getDisplayValue()}</span>
                <i className={`fas fa-chevron-down text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isOpen && (
                <div role="listbox" className="absolute z-10 top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-zinc-200 p-2">
                    {options.map(option => (
                        <label key={option} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-100 cursor-pointer">
                            <input
                                type="checkbox"
                                role="option"
                                aria-selected={selected.includes(option)}
                                checked={selected.includes(option)}
                                onChange={() => handleSelect(option)}
                                className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export const MealPlanner: React.FC = () => {
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(['Any']);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setPlan(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            healthGoal: formData.get('healthGoal') as string,
            dislikes: formData.get('dislikes') as string,
            nutritionalGoals: formData.get('nutritionalGoals') as string,
        };

        try {
            const result = await generateMealPlan(dietaryPreferences, data.healthGoal, data.dislikes, data.nutritionalGoals);
            setPlan(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred while generating the plan.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const mealIcons = { breakfast: 'fa-coffee', lunch: 'fa-sun', dinner: 'fa-moon' };

    return (
        <section id="meal-planner" className="py-16 sm:py-20 md:py-24 bg-white text-zinc-800">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-green-50 to-lime-100/50 p-6 md:p-8 rounded-2xl shadow-2xl animate-on-scroll" data-animation="scale-up">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                           Bengaluru's #1 AI Meal Planner
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                        </h2>
                        <p className="mt-4 text-zinc-600">Let our AI nutritionist craft a perfect 1-day meal plan from our Bengaluru kitchen, tailored to your health goals!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 form-glow" aria-describedby="ai-disclaimer">
                        <div className="relative">
                            <label htmlFor="dietaryPreference" className="block text-sm font-semibold mb-1 text-zinc-700">Dietary Preference</label>
                             <i className="fas fa-leaf absolute top-10 left-4 text-zinc-400 z-10" aria-hidden="true"></i>
                            <div className="pl-10 relative">
                                <MultiSelectDropdown
                                    options={['Any', 'Vegetarian', 'High-Protein', 'Keto']}
                                    selected={dietaryPreferences}
                                    onChange={setDietaryPreferences}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="healthGoal" className="block text-sm font-semibold mb-1 text-zinc-700">Health Goal</label>
                            <i className="fas fa-flag-checkered absolute top-10 left-4 text-zinc-400" aria-hidden="true"></i>
                            <select id="healthGoal" name="healthGoal" className="w-full bg-white p-3 pl-10 rounded-lg border-2 border-zinc-200 outline-none appearance-none focus:border-[var(--primary)] transition-all">
                                <option>Weight Loss</option><option>Muscle Gain</option><option>Maintain Health</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 relative">
                            <label htmlFor="nutritionalGoals" className="block text-sm font-semibold mb-1 text-zinc-700">Nutritional Goals (optional)</label>
                            <i className="fas fa-bullseye absolute top-10 left-4 text-zinc-400" aria-hidden="true"></i>
                            <input type="text" id="nutritionalGoals" name="nutritionalGoals" placeholder="e.g., low-carb, high-fiber" className="w-full bg-white p-3 pl-10 rounded-lg border-2 border-zinc-200 outline-none placeholder:text-zinc-400 focus:border-[var(--primary)] transition-all" />
                        </div>
                        <div className="md:col-span-2 relative">
                             <label htmlFor="dislikes" className="block text-sm font-semibold mb-1 text-zinc-700">Dislikes or Allergies (optional)</label>
                             <i className="fas fa-thumbs-down absolute top-10 left-4 text-zinc-400" aria-hidden="true"></i>
                             <input type="text" id="dislikes" name="dislikes" placeholder="e.g., mushrooms, nuts" className="w-full bg-white p-3 pl-10 rounded-lg border-2 border-zinc-200 outline-none placeholder:text-zinc-400 focus:border-[var(--primary)] transition-all" />
                        </div>
                        <button type="submit" disabled={isLoading} className="md:col-span-2 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] text-white font-bold py-3 px-6 rounded-lg text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-400 disabled:from-zinc-400 disabled:shadow-none disabled:scale-100 disabled:text-zinc-500 ripple-effect">
                            {isLoading ? <><div className="meal-plan-loader"></div><span>Crafting Your Plan...</span></> : <>✨ Generate My Plan</>}
                        </button>
                    </form>

                     <div id="ai-disclaimer" className="text-center text-xs text-zinc-500 mb-8 px-2">
                        <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                        <strong>Disclaimer:</strong> The AI-generated meal plan is a suggestion based on your inputs and our menu. It is not a substitute for professional medical or dietary advice. Please consult with a doctor or registered dietitian before making significant changes to your diet.
                    </div>

                    <div id="mealPlanResult" className="space-y-4" aria-live="polite">
                        {isLoading && <ThemedMealPlanLoader />}
                        {error && <div role="alert" className="text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>}
                        {!isLoading && !plan && !error && (
                            <div className="text-center text-zinc-500 border-2 border-dashed border-zinc-300 p-8 rounded-lg">
                                <i className="fas fa-magic text-3xl mb-3 text-zinc-400" aria-hidden="true"></i>
                                <p className="font-semibold">Unlock your personalized meal plan!</p>
                                <p className="text-zinc-500 text-sm mt-1">Tell us your goals and we'll design a delicious day for you.</p>
                            </div>
                        )}
                        {plan && (
                            <div className="space-y-4 animate-fade-in-pop">
                                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType, index) => (
                                    <div key={mealType} className="bg-white shadow-lg p-4 sm:p-5 rounded-lg flex items-start gap-4 border border-zinc-100">
                                        <div className="bg-zinc-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl text-[var(--primary)] flex-shrink-0" aria-hidden="true">
                                            <i className={`fas ${mealIcons[mealType]}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{mealType}</p>
                                            <h4 className="font-bold text-lg text-[var(--primary-dark)]">{plan[mealType].name}</h4>
                                            <p className="text-sm text-zinc-600">{plan[mealType].reason}</p>
                                        </div>
                                    </div>
                                ))}
                                
                                {plan.dailyTotals && (
                                    <div className="mt-6">
                                        <div className="bg-white/60 p-4 sm:p-5 rounded-lg border-2 border-dashed border-zinc-200">
                                            <h4 className="text-lg font-bold text-center text-[var(--primary-dark)] mb-3">Daily Nutrition Projection</h4>
                                            <div className="flex justify-around text-center">
                                                <div>
                                                    <p className="text-xl font-bold text-[var(--accent-secondary)]">{plan.dailyTotals.calories}</p>
                                                    <p className="text-sm text-zinc-600 font-medium">Calories</p>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold text-[var(--accent-secondary)]">{plan.dailyTotals.protein}</p>
                                                    <p className="text-sm text-zinc-600 font-medium">Protein</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {plan.summary && (
                                     <blockquote className="bg-[var(--primary-light)] border-l-4 border-[var(--primary)] p-4 rounded-r-lg" >
                                        <p className="text-[var(--primary-dark)] italic font-semibold">"{plan.summary}"</p>
                                    </blockquote>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};