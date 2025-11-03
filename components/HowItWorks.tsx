
import React, { useState } from 'react';

const stepsData = [
  {
    id: 1,
    icon: 'fa-robot',
    title: 'Personalize with AI',
    description: 'Answer a few simple questions and let our revolutionary AI nutritionist craft a personalized meal plan just for you. Or, take control and build your own from our diverse menu.',
    imageUrl: 'https://images.unsplash.com/photo-1576834599553-b088a04467c6?ixlib=rb-4.0.3&fm=webp&w=800&q=75',
  },
  {
    id: 2,
    icon: 'fa-utensils',
    title: 'Gourmet, Healthy Cooking',
    description: 'Our expert chefs transform the freshest, locally-sourced ingredients into delicious, macro-balanced meals. Every dish is a perfect blend of nutrition and flavor, cooked to perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&fm=webp&w=800&q=75',
  },
  {
    id: 3,
    icon: 'fa-shipping-fast',
    title: 'Effortless & On-Time Delivery',
    description: 'Your meals are delivered fresh to your doorstep in Bengaluru, right on schedule. Skip the shopping, prepping, and cleaning. Just heat, eat, and conquer your day.',
    imageUrl: 'https://images.unsplash.com/photo-1596797882565-3c483b483981?ixlib=rb-4.0.3&fm=webp&w=800&q=75',
  },
];

const StepItem: React.FC<{
  step: typeof stepsData[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ step, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
        isActive
          ? 'bg-white shadow-2xl border-[var(--primary)] scale-105'
          : 'bg-zinc-50 border-transparent hover:bg-white hover:shadow-lg'
      }`}
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 flex-shrink-0 ${
            isActive
              ? 'bg-[var(--primary)] text-white'
              : 'bg-zinc-200 text-zinc-600'
          }`}
        >
          <i className={`fas ${step.icon}`}></i>
        </div>
        <div>
          <h3 className="text-lg font-bold font-iowan text-[var(--primary-dark)]">{step.title}</h3>
        </div>
      </div>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isActive ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-zinc-600">{step.description}</p>
        </div>
      </div>
    </div>
  );
};


export const HowItWorks: React.FC = () => {
    const [activeStep, setActiveStep] = useState(1);

    return (
        <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-[var(--section-bg-light-green)] overflow-hidden relative">
             <div className="section-divider top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                        Your Journey to Peak Health
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-zinc-600">Three simple steps to unlock a healthier, more productive you with Taazabites in Bengaluru.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="flex flex-col gap-6 animate-on-scroll" data-animation="slide-in-left">
                        {stepsData.map((step) => (
                            <StepItem
                                key={step.id}
                                step={step}
                                isActive={activeStep === step.id}
                                onClick={() => setActiveStep(step.id)}
                            />
                        ))}
                    </div>

                    <div className="relative h-96 lg:h-[500px] animate-on-scroll" data-animation="slide-in-right">
                         <div className="absolute w-full h-full bg-gradient-to-br from-green-100 to-lime-100/50 rounded-3xl transform rotate-3 -z-10"></div>
                        {stepsData.map((step) => (
                             <div 
                                key={step.id}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${activeStep === step.id ? 'opacity-100' : 'opacity-0'}`}
                             >
                                <img
                                    src={step.imageUrl}
                                    alt={step.title}
                                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        ))}
                    </div>
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
