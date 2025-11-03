import React, { useState, useEffect, useRef } from 'react';
import { generateWorkoutPlan, generateExerciseAlternative } from '../services/geminiService';
import { MENU_DATA_DETAILED } from '../services/geminiService';

interface Exercise {
    name: string;
    duration: string;
    instructions: string;
    tip: string;
}

interface RecommendedMeal {
    name: string;
    reason: string;
}

interface WorkoutPlan {
    workoutName: string;
    description: string;
    exercises: Exercise[];
    recommendedMeal: RecommendedMeal;
}

const WorkoutSkeleton = () => (
    <div className="space-y-4 animate-pulse mt-8">
        <div className="h-8 bg-zinc-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-zinc-200 rounded w-full max-w-lg mx-auto"></div>
        <div className="pt-6 space-y-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-zinc-100 p-4 rounded-lg flex items-start gap-4">
                    <div className="bg-zinc-200 w-10 h-10 rounded-full flex-shrink-0"></div>
                    <div className="flex-grow space-y-2">
                        <div className="h-5 bg-zinc-200 rounded w-1/2"></div>
                        <div className="h-3 bg-zinc-200 rounded w-3/4"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Modal: React.FC<{ isVisible: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isVisible, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalTitleId = 'modal-title';

    useEffect(() => {
        if (!isVisible) return;

        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        firstElement?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, onClose]);


    if (!isVisible) return null;
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={modalTitleId}>
        <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 relative animate-on-scroll" data-animation="scale-up" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 id={modalTitleId} className="text-xl font-bold font-iowan text-[var(--primary-dark)]">{title}</h3>
            <button onClick={onClose} className="text-2xl text-zinc-400 hover:text-zinc-600" aria-label="Close nutrition details">&times;</button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    );
};

export const WorkoutCoach: React.FC = () => {
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [goal, setGoal] = useState('Weight Loss');
    const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [swappingExerciseIndex, setSwappingExerciseIndex] = useState<number | null>(null);
    const [updatedExerciseIndex, setUpdatedExerciseIndex] = useState<number | null>(null);
    const [completedExercises, setCompletedExercises] = useState<boolean[]>([]);


    const handleNutritionClick = (mealName: string) => {
        const mealDetails = MENU_DATA_DETAILED.find(item => item.name === mealName);
        if (!mealDetails) return;

        const nutritionParts = mealDetails.nutritionInfo.split(', ').map(part => {
            const [key, value] = part.split(': ');
            return { key, value };
        });

        setModalContent({
            title: mealDetails.name,
            content: (
                <div className="space-y-2">
                    {nutritionParts.map(({ key, value }) => (
                        <div key={key} className="flex justify-between items-baseline text-sm border-b border-zinc-100 py-1">
                            <span className="font-semibold text-zinc-600">{key}</span>
                            <span className="text-zinc-800 font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            )
        });
    };

    const handleShareClick = () => {
        setIsShareModalOpen(true);
    };

    const getShareLinks = () => {
        if (!plan) return {};
        const shareText = `Check out my AI-generated workout plan from Taazabites: "${plan.workoutName}" for ${goal}!`;
        const shareUrl = window.location.href; // Or a specific link to the workout if available
        const hashtags = 'Taazabites,AIWorkout,Fitness,HealthyLiving';
        const encodedText = encodeURIComponent(shareText);
        const encodedUrl = encodeURIComponent(shareUrl);

        return {
            whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${hashtags}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        };
    };

    const shareLinks = getShareLinks();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setPlan(null);
        setCompletedExercises([]);

        try {
            const result = await generateWorkoutPlan(goal);
            setPlan(result);
            setCompletedExercises(new Array(result.exercises.length).fill(false));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred while generating your workout.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwapExercise = async (indexToSwap: number) => {
        if (!plan) return;
        setSwappingExerciseIndex(indexToSwap);
        setError('');

        const exerciseToReplace = plan.exercises[indexToSwap];
        const currentExercises = plan.exercises;

        try {
            const newExercise = await generateExerciseAlternative(goal, currentExercises, exerciseToReplace.name);
            
            const newExercises = [...plan.exercises];
            newExercises[indexToSwap] = newExercise;

            setPlan({ ...plan, exercises: newExercises });
            setUpdatedExerciseIndex(indexToSwap);
            
            setTimeout(() => {
                setUpdatedExerciseIndex(null);
            }, 1500); // Duration of the animation

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not find an alternative. Please try again.';
            setError(message); // Ideally, show this near the button
        } finally {
            setSwappingExerciseIndex(null);
        }
    };
    
    const handleToggleComplete = (index: number) => {
        setCompletedExercises(prev => {
            const newCompleted = [...prev];
            newCompleted[index] = !newCompleted[index];
            return newCompleted;
        });
    };
    
    const exerciseIcons = [
        'fa-running', 'fa-fist-raised', 'fa-heartbeat', 'fa-burn', 'fa-dumbbell', 'fa-biking'
    ];

    return (
        <section id="workout-coach" className="py-16 sm:py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="mb-8 animate-on-scroll" data-animation="slide-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                           Your AI Workout Coach
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                        </h2>
                        <p className="mt-4 text-zinc-600">Complement your healthy meals with a quick, AI-generated workout plan. No equipment needed!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border form-glow flex flex-col sm:flex-row items-center gap-4 animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.1s">
                         <div className="relative w-full sm:w-1/2">
                            <label htmlFor="healthGoalWorkout" className="sr-only">Health Goal</label>
                            <i className="fas fa-flag-checkered absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400" aria-hidden="true"></i>
                            <select 
                                id="healthGoalWorkout" 
                                name="healthGoalWorkout"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full bg-zinc-50 p-3 pl-10 rounded-lg border-2 border-zinc-200 outline-none appearance-none focus:border-[var(--primary)] transition-all"
                            >
                                <option>Weight Loss</option>
                                <option>Muscle Tone</option>
                                <option>Flexibility & Mobility</option>
                                <option>General Fitness</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full sm:w-1/2 bg-gradient-to-r from-[var(--accent-secondary)] to-orange-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-400 disabled:from-zinc-400 disabled:shadow-none disabled:scale-100 disabled:text-zinc-500 ripple-effect">
                            {isLoading ? <><div className="meal-plan-loader"></div><span>Generating...</span></> : <>💪 Generate Workout</>}
                        </button>
                    </form>

                     <div id="workoutPlanResult" className="mt-8 text-left" aria-live="polite">
                        {isLoading && <WorkoutSkeleton />}
                        {error && <div role="alert" className="text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>}
                        {!isLoading && !plan && !error && (
                            <div className="text-center text-zinc-500 border-2 border-dashed border-zinc-300 p-8 rounded-lg animate-on-scroll" data-animation="fade-in">
                                <i className="fas fa-dumbbell text-3xl mb-3 text-zinc-400" aria-hidden="true"></i>
                                <p className="font-semibold">Select your goal and get a personalized workout!</p>
                                <p className="text-zinc-500 text-sm mt-1">Perfectly paired with your Taazabites meals.</p>
                            </div>
                        )}
                        {plan && (
                            <div className="space-y-6 animate-fade-in-pop">
                                <div className="text-center">
                                    <h3 className="text-2xl md:text-3xl font-bold font-iowan text-[var(--primary-dark)]">{plan.workoutName}</h3>
                                    <p className="mt-2 text-zinc-600 max-w-2xl mx-auto">{plan.description}</p>
                                </div>
                                
                                {/* Progress Bar */}
                                {(() => {
                                    const completedCount = completedExercises.filter(Boolean).length;
                                    const totalExercises = plan.exercises.length;
                                    const completionPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
                                    return (
                                        <div className="my-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-semibold text-zinc-600">Workout Progress</span>
                                                <span className="text-sm font-bold text-[var(--primary)]">{completionPercentage}% Complete</span>
                                            </div>
                                            <div className="w-full bg-zinc-200 rounded-full h-2.5">
                                                <div className="bg-[var(--primary)] h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })()}


                                <div className="space-y-3">
                                    {plan.exercises.map((exercise, index) => {
                                        const isSwapping = swappingExerciseIndex === index;
                                        const isUpdated = updatedExerciseIndex === index;
                                        const isCompleted = completedExercises[index];
                                        return (
                                        <div key={`${exercise.name}-${index}`} className={`bg-white shadow-lg p-4 sm:p-5 rounded-lg border transition-all duration-300 ${isUpdated ? 'highlight-update' : ''} ${isCompleted ? 'bg-green-50/70 border-green-200' : 'border-zinc-100'}`}>
                                            <div className="flex items-start gap-4">
                                                <button
                                                    onClick={() => handleToggleComplete(index)}
                                                    aria-pressed={isCompleted}
                                                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-zinc-300 bg-white hover:border-[var(--primary)]'}`}
                                                    aria-label={`Mark ${exercise.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                                                >
                                                    {isCompleted && <i className="fas fa-check text-white text-xs"></i>}
                                                </button>
                                                
                                                <div className="flex-grow">
                                                    <div className={`flex flex-col sm:flex-row sm:justify-between w-full ${isCompleted ? 'opacity-60' : ''}`}>
                                                        <div className="flex items-start gap-4">
                                                            <div className={`bg-zinc-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-colors ${isCompleted ? 'bg-green-100 text-[var(--primary)]' : 'text-[var(--accent-secondary)]'}`} aria-hidden="true">
                                                                <i className={`fas ${exerciseIcons[index % exerciseIcons.length]}`}></i>
                                                            </div>
                                                            <div>
                                                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className={`font-bold text-lg transition-colors ${isCompleted ? 'line-through text-zinc-600' : 'text-zinc-800'}`}>{exercise.name}</h4>
                                                                        {exercise.tip && (
                                                                            <div className="relative group flex items-center">
                                                                                <i className="fas fa-info-circle text-zinc-400 cursor-help text-sm" aria-describedby={`tip-${index}`}></i>
                                                                                <span id={`tip-${index}`} role="tooltip" className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 bg-zinc-800 text-white text-xs text-center rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none z-10 shadow-lg before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-zinc-800">
                                                                                    <strong>Tip:</strong> {exercise.tip}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <span className={`text-sm font-bold px-2 py-0.5 rounded-md inline-block transition-colors ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-[var(--primary-light)] text-[var(--primary)]'}`}>{exercise.duration}</span>
                                                                </div>
                                                                <p className={`text-sm mt-1 transition-colors ${isCompleted ? 'line-through text-zinc-500' : 'text-zinc-600'}`}>{exercise.instructions}</p>
                                                            </div>
                                                        </div>
                                                        <div className="self-end sm:self-start mt-3 sm:mt-0 sm:pl-4 flex-shrink-0">
                                                            <button 
                                                                onClick={() => handleSwapExercise(index)} 
                                                                disabled={isSwapping}
                                                                className="group flex items-center justify-center gap-2 text-sm font-semibold text-[var(--accent-secondary)] hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                aria-label={`Swap ${exercise.name} for another exercise`}
                                                            >
                                                                {isSwapping ? (
                                                                    <>
                                                                        <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                                                                        <span>Finding...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fas fa-sync-alt transition-transform duration-300 group-hover:rotate-90"></i>
                                                                        <span>Swap</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )})}
                                </div>

                                {plan.recommendedMeal && (
                                    <div className="mt-8 pt-6 border-t border-dashed">
                                        <div className="text-center mb-4">
                                            <h4 className="text-xl font-bold font-iowan text-[var(--primary-dark)]">Post-Workout Fuel</h4>
                                        </div>
                                        <div className="bg-white shadow-lg p-4 sm:p-5 rounded-lg flex items-start gap-4 border-2 border-[var(--primary-light)]">
                                            <div className="bg-zinc-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl text-[var(--primary)] flex-shrink-0" aria-hidden="true">
                                                <i className="fas fa-utensils"></i>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-baseline">
                                                    <h5 className="font-bold text-lg text-[var(--primary-dark)]">{plan.recommendedMeal.name}</h5>
                                                    <button onClick={() => handleNutritionClick(plan.recommendedMeal.name)} className="text-xs font-semibold text-[var(--primary-dark)] hover:underline flex items-center gap-1 flex-shrink-0 ml-2">
                                                        Nutrition <i className="fas fa-info-circle"></i>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-zinc-600 mt-1">{plan.recommendedMeal.reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="text-center mt-8">
                                    <button
                                        onClick={handleShareClick}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-400 disabled:from-zinc-400 ripple-effect mx-auto"
                                    >
                                        <i className="fas fa-share-alt"></i> Share Workout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal isVisible={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
                {modalContent?.content}
            </Modal>
            <Modal isVisible={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Share Your Workout!">
                <div className="space-y-4">
                    <p className="text-zinc-600 text-center">Inspire your friends by sharing your awesome workout plan!</p>
                    <div className="flex justify-center items-center gap-4 text-3xl">
                        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="text-zinc-500 hover:text-[#25D366] transition-colors"><i className="fab fa-whatsapp"></i></a>
                        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="text-zinc-500 hover:text-[#1DA1F2] transition-colors"><i className="fab fa-twitter"></i></a>
                        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="text-zinc-500 hover:text-[#1877F2] transition-colors"><i className="fab fa-facebook-f"></i></a>
                    </div>
                </div>
            </Modal>
        </section>
    );
}