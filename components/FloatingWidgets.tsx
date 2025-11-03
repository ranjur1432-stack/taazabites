import React, { useState, useEffect } from 'react';

const NavItem: React.FC<{ href: string; icon: string; label: string; isActive: boolean; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void; }> = ({ href, icon, label, isActive, onClick }) => (
    <a 
        href={href}
        onClick={onClick}
        className={`flex flex-col items-center justify-center transition-colors w-1/5 h-full gap-1 ${isActive ? 'text-[var(--primary)]' : 'text-zinc-500 hover:text-[var(--primary)]'}`}
        aria-current={isActive ? 'page' : undefined}
    >
        <i className={`fas ${icon} text-xl`}></i>
        <span className="text-xs font-medium">{label}</span>
    </a>
);

const NavButton: React.FC<{ icon: string; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center transition-colors w-1/5 h-full gap-1 text-zinc-500 hover:text-[var(--primary)]"
    >
        <i className={`fas ${icon} text-xl`}></i>
        <span className="text-xs font-medium">{label}</span>
    </button>
);


export const FloatingWidgets: React.FC<{ onSearchClick: () => void; }> = ({ onSearchClick }) => {
    const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const toggleVisibility = () => {
            setIsBackToTopVisible(window.scrollY > 500);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

     useEffect(() => {
        const sections = ['hero', 'subscriptions', 'meal-planner'];
        const observerOptions = {
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Handles smooth scrolling for all on-page navigation links.
     * It prevents the default anchor behavior and uses scrollIntoView
     * for a robust, smooth scroll that works consistently.
     */
    const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        // Ensure we have a valid hash link
        if (!targetId || !targetId.startsWith('#')) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-44 right-4 z-40 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg transition-all duration-300 ripple-effect lg:bottom-24 ${isBackToTopVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                aria-label="Back to top"
            >
                <i className="fas fa-arrow-up"></i>
            </button>


            {/* WhatsApp Widget */}
            <a
                href="https://wa.me/917975771457?text=Hi%20Taazabites!"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-24 right-4 lg:right-5 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 ripple-effect lg:bottom-5"
                aria-label="Chat on WhatsApp"
            >
                <i className="fab fa-whatsapp text-3xl"></i>
            </a>

            {/* Sticky Bottom Nav for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 z-40">
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl shadow-[0_-5px_20px_rgba(0,0,0,0.08)] border-t border-zinc-200/60">
                    <nav className="flex justify-around items-center h-full">
                        <NavItem href="#hero" icon="fa-home" label="Home" isActive={activeSection === 'hero'} onClick={handleNavLinkClick} />
                        <NavItem href="#subscriptions" icon="fa-calendar-alt" label="Plans" isActive={activeSection === 'subscriptions'} onClick={handleNavLinkClick} />
                        <div className="w-1/5"></div>
                        <NavItem href="#meal-planner" icon="fa-magic" label="AI Plan" isActive={activeSection === 'meal-planner'} onClick={handleNavLinkClick} />
                        <NavButton icon="fa-search" label="Search" onClick={onSearchClick} />
                    </nav>
                </div>
                <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 flex flex-col items-center justify-center bg-gradient-to-r from-[var(--primary)] to-lime-500 text-white rounded-full shadow-lg shadow-[var(--primary)]/40 hover:scale-110 transition-transform duration-300 ripple-effect">
                    <i className="fas fa-utensils text-xl"></i>
                    <span className="text-[10px] font-bold mt-1">Order</span>
                </a>
            </div>
        </>
    );
};