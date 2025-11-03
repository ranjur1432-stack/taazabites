import React, { useEffect, useRef } from 'react';

interface ExitIntentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const modalElement = modalRef.current;
        if (!modalElement) return;

        // Focus trapping logic
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

        // Set initial focus
        firstElement?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);


    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-auto relative transform transition-transform duration-300 animate-scale-up overflow-hidden flex flex-col md:flex-row"
                onClick={e => e.stopPropagation()}
            >
                <div className="md:w-1/2 w-full h-48 md:h-auto relative">
                     <img src="https://cdn.urbanpiper.com/media/bizmedia/2025/09/03/HYC3ipj-ea1cb459-9f06-4842-9f10-c36beef7395f.jpg?format=webp&w=400&q=75" alt="A healthy high-protein egg and chicken meal from Taazabites as part of a special offer" className="w-full h-full object-cover" decoding="async" loading="lazy" />
                </div>
                <div className="md:w-1/2 w-full p-6 sm:p-8 text-center flex flex-col justify-center">
                    <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold font-iowan text-[var(--primary)] mb-2">
                        Wait a second!
                    </h2>
                    <p className="text-zinc-600 mb-6 text-base">
                        Before you go, here's an exclusive <strong className="font-bold text-[var(--accent-secondary)]">10% discount</strong> on your first meal order.
                    </p>
                    <a 
                        href="https://taazabites.in/menu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold px-6 py-3 text-base rounded-full shadow-lg shadow-[var(--primary)]/30 hover:scale-105 hover:shadow-xl transition-all duration-300 mb-3 ripple-effect animate-pulse-cta"
                    >
                        <i className="fas fa-tag"></i> Claim 10% Off Now
                    </a>
                    <button 
                        onClick={onClose}
                        className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
                    >
                        No, thanks, I'll pay full price.
                    </button>
                </div>
                 <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-xl text-zinc-400 hover:text-zinc-600 transition-colors w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center bg-white/50 md:bg-transparent"
                    aria-label="Close modal"
                >
                    &times;
                </button>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-up {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
                
                @keyframes pulse-cta {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(85, 181, 40, 0.4); }
                    50% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(85, 181, 40, 0); }
                }
                .animate-pulse-cta {
                    animation: pulse-cta 2s infinite;
                }
            `}</style>
        </div>
    );
};