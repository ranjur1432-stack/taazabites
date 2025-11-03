import React from 'react';

const FaqItem = ({ question, answer, staggerDelay }: { question: string; answer: string; staggerDelay: string; }) => (
    <details className="bg-white rounded-xl group animate-on-scroll border border-zinc-200/80 transition-shadow hover:shadow-lg" data-animation="slide-fade-in-up" data-stagger-delay={staggerDelay}>
        <summary className="font-semibold text-lg text-[var(--primary-dark)] p-4 sm:p-5 cursor-pointer list-none flex justify-between items-center transition-colors hover:bg-zinc-50/50 rounded-lg">
            {question}
            <span className="text-[var(--primary)] transition-transform duration-300 group-open:rotate-45">
                 <i className="fas fa-plus"></i>
            </span>
        </summary>
        <div className="px-4 sm:px-5 pb-5 text-zinc-600">
            {answer}
        </div>
    </details>
);

export const Faq: React.FC = () => {
    const faqs = [
        { question: "What makes Taazabites™ the best healthy food delivery in Bengaluru?", answer: "Taazabites™ stands out as the best healthy food delivery option in Bengaluru due to our unique combination of chef-crafted, delicious meals, nutritionist-designed plans, and a powerful AI meal planner for personalization. We are committed to using fresh, local ingredients for optimal taste and health benefits." },
        { question: "How does Taazabites™ ensure meal freshness?", answer: "We prepare all meals daily using locally sourced ingredients and deliver in temperature-controlled packaging to maintain freshness and nutritional value." },
        { question: "Do you accommodate dietary restrictions?", answer: "Yes! We offer vegetarian, vegan, gluten-free, and keto options. Please specify your requirements when ordering." },
        { question: "What areas in Bengaluru do you deliver to?", answer: "We currently deliver to all major areas of Bengaluru including Whitefield, Indiranagar, Koramangala, HSR Layout, and surrounding regions." },
        { question: "How far in advance should I place my order?", answer: "We recommend ordering at least 4 hours in advance for same-day delivery. For larger orders or catering, please order 24 hours ahead." },
    ];
    return (
        <section id="faq" className="py-16 sm:py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                        Frequently Asked Questions
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => <FaqItem key={i} question={faq.question} answer={faq.answer} staggerDelay={`${i * 0.1}s`} />)}
                </div>
            </div>
        </section>
    );
};