import React, { useEffect, useRef } from 'react';

const StatItem = ({ icon, count, suffix, label }: { icon: string; count: number; suffix: string; label: string }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const end = count;
                const duration = 2000;
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    start = Math.floor(progress * end);
                    element.textContent = start.toLocaleString();
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        element.textContent = end.toLocaleString();
                    }
                };
                requestAnimationFrame(animate);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        
        observer.observe(element);
        return () => observer.disconnect();
    }, [count]);

    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md text-[var(--primary)] text-2xl sm:text-3xl flex items-center justify-center flex-shrink-0">
                <i className={`fas ${icon}`}></i>
            </div>
            <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[var(--primary-dark)]">
                    <span ref={ref}>0</span>{suffix}
                </div>
                <div className="text-zinc-600 font-medium">{label}</div>
            </div>
        </div>
    );
}

export const About: React.FC = () => {
    return (
        <section id="about" className="py-16 sm:py-20 md:py-24 bg-[var(--off-white)]">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="animate-on-scroll" data-animation="slide-in-left">
                        <div className="mb-8">
                             <p className="text-[var(--accent-secondary)] font-semibold mb-2">Our Mission</p>
                            <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                                More Than Just a Meal
                                <span className="absolute bottom-0 left-0 w-20 h-1 bg-[var(--accent)]"></span>
                            </h2>
                        </div>
                        <blockquote className="border-l-4 border-[var(--primary)] pl-6 text-base md:text-lg text-zinc-600 space-y-4 mb-8 italic">
                            <p>Founded in Bengaluru, Taazabites was born from a passion for making healthy eating accessible, delicious, and convenient. We proudly serve health-conscious individuals and corporate clients across the entire Bengaluru metropolitan area.</p>
                            <p>We're committed to sustainability, sourcing locally whenever possible, and bringing you meals that are as good for your body as they are for your taste buds.</p>
                        </blockquote>
                        <div>
                            <p className="font-iowan text-2xl text-[var(--primary-dark)] tracking-wider">Keerthi and Manjula</p>
                            <p className="text-zinc-500">Founders, Taazabites™</p>
                        </div>
                    </div>
                    <div className="space-y-8 animate-on-scroll" data-animation="slide-in-right">
                        <StatItem icon="fa-utensils" count={25000} suffix="+" label="Meals Served" />
                        <StatItem icon="fa-smile" count={98} suffix="%" label="Satisfaction Rate" />
                        <StatItem icon="fa-carrot" count={120} suffix="+" label="Unique Menu Items" />
                        <StatItem icon="fa-user-md" count={10} suffix="+" label="Nutrition Experts" />
                    </div>
                </div>
            </div>
        </section>
    );
};