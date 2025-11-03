
import React, { useEffect, useState } from 'react';

const FooterLink = ({ href, text }: { href: string; text: string }) => {
    const isExternal = href.startsWith('http');
    const isPlaceholder = href === "#";
    
    return (
        <li>
            <a 
                href={href} 
                className={`transition-colors duration-300 flex items-center gap-2 group ${isPlaceholder ? 'text-zinc-500 cursor-default' : 'text-zinc-400 hover:text-[var(--primary)]'}`}
                target={!isPlaceholder && isExternal ? '_blank' : '_self'}
                rel={!isPlaceholder && isExternal ? 'noopener noreferrer' : ''}
                onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                title={isPlaceholder ? 'Coming Soon' : undefined}
            >
                <span className={`h-px ${isPlaceholder ? 'w-3 bg-zinc-600' : 'w-0 group-hover:w-3 bg-[var(--primary)]'} transition-all duration-300`}></span>
                <span>{text}</span>
            </a>
        </li>
    );
};

const FooterLinkColumn = ({ title, links }: { title: string; links: { href: string; text: string }[] }) => (
    <div>
        <h4 className="text-lg font-bold font-iowan text-white mb-4 tracking-wide">{title}</h4>
        <ul className="space-y-3">
            {links.map((link) => (
                <FooterLink key={link.text} href={link.href} text={link.text} />
            ))}
        </ul>
    </div>
);


const CollapsibleFooterLinks = ({ title, links }: { title: string; links: { href: string; text: string }[] }) => (
    <details className="border-b border-white/10 py-2 group">
        <summary className="font-semibold text-lg text-white list-none cursor-pointer flex justify-between items-center py-2">
            {title}
            <span className="group-open:rotate-45 transition-transform"><i className="fas fa-plus"></i></span>
        </summary>
        <ul className="space-y-3 pt-3 pb-4">
             {links.map(link => {
                const isExternal = link.href.startsWith('http');
                const isPlaceholder = link.href === "#";
                return (
                    <li key={link.text}>
                        <a 
                            href={link.href} 
                            className={`transition-colors ${isPlaceholder ? 'text-zinc-500 cursor-default' : 'text-zinc-400 hover:text-white'}`}
                            target={!isPlaceholder && isExternal ? '_blank' : '_self'}
                            rel={!isPlaceholder && isExternal ? 'noopener noreferrer' : ''}
                            onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                            title={isPlaceholder ? 'Coming Soon' : undefined}
                        >
                            {link.text}
                        </a>
                    </li>
                );
             })}
        </ul>
    </details>
);

const BusinessLinkButton: React.FC<{ href: string; brandName: string; brandColorClass: string; textColorClass?: string; }> = ({ href, brandName, brandColorClass, textColorClass = 'text-white' }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center justify-center px-4 py-3 rounded-lg ${brandColorClass} transition-all duration-300 hover:scale-105 hover:shadow-lg w-full`}
        aria-label={`Find us on ${brandName}`}
    >
        <span className={`font-bold ${textColorClass} transition-colors duration-300`}>{brandName}</span>
    </a>
);


const ContactItem: React.FC<{ href: string; icon: string; title: string; value: string; className?: string; isExternal?: boolean; }> = ({ href, icon, title, value, className = '', isExternal }) => (
    <a href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : ''} className={`group flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors shrink-0">
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <p className="font-bold text-white">{title}</p>
            <p className="text-zinc-400 group-hover:text-white transition-colors text-sm">{value}</p>
        </div>
    </a>
);

const SocialIcon: React.FC<{ href: string; icon: string; label: string }> = ({ href, icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label={label}
        className="text-zinc-400 hover:text-[var(--primary)] text-xl transition-transform duration-300 transform hover:-translate-y-1"
    >
        <i className={`fab fa-${icon}`}></i>
    </a>
);

export const Footer: React.FC = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isOpenNow, setIsOpenNow] = useState(false);

    useEffect(() => {
        setYear(new Date().getFullYear());

        const checkBusinessHours = () => {
            const now = new Date();
            // Convert current time to IST (UTC+5:30) for accuracy
            const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const istHours = istTime.getHours();
            
            // Open from 9 AM to 10 PM (22:00)
            const open = istHours >= 9 && istHours < 22;
            setIsOpenNow(open);
        };

        checkBusinessHours();
        const intervalId = setInterval(checkBusinessHours, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, []);

    const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;

        setNewsletterStatus('submitting');
        
        // Simulate a backend call with a delay to mimic network latency
        setTimeout(() => {
            // Basic email validation for simulation purposes
            if (newsletterEmail.includes('@') && newsletterEmail.includes('.')) {
                setNewsletterStatus('success');
                setTimeout(() => {
                    setNewsletterStatus('idle');
                    setNewsletterEmail('');
                }, 4000); // Reset the form after 4 seconds
            } else {
                setNewsletterStatus('error');
                setTimeout(() => {
                    setNewsletterStatus('idle');
                }, 5000); // Reset after showing error
            }
        }, 1500);
    };
    
    const NewsletterForm = () => {
        let content;
        switch (newsletterStatus) {
            case 'success':
                content = (
                    <div className="w-full text-center bg-green-500/10 border border-green-500/30 text-green-300 font-semibold p-3 rounded-lg flex items-center justify-center gap-3">
                        <i className="fas fa-check-circle"></i> Thanks for subscribing!
                    </div>
                );
                break;
            case 'error':
                 content = (
                    <div className="w-full text-center bg-red-500/10 border border-red-500/30 text-red-400 font-semibold p-3 rounded-lg flex items-center justify-center gap-3">
                        <i className="fas fa-exclamation-triangle"></i> Please enter a valid email.
                    </div>
                );
                break;
            case 'submitting':
            case 'idle':
            default:
                content = (
                    <>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            required 
                            aria-label="Enter your email for our newsletter"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            disabled={newsletterStatus === 'submitting'}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none placeholder:text-zinc-500 transition-all disabled:opacity-50" 
                        />
                        <button 
                            type="submit" 
                            aria-label="Subscribe to newsletter"
                            disabled={newsletterStatus === 'submitting'}
                            className="bg-[var(--accent-secondary)] text-white font-bold w-14 h-14 rounded-lg hover:bg-[#F84D15] shadow-lg shadow-[var(--accent-secondary)]/20 hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0 disabled:bg-zinc-500 disabled:scale-100 disabled:shadow-none"
                        >
                            {newsletterStatus === 'submitting' ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <i className="fas fa-paper-plane"></i>}
                        </button>
                    </>
                );
        }

        return (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 relative h-14 items-center">
                {content}
            </form>
        );
    };

    const quickLinks = [
        { href: "#hero", text: "Home" },
        { href: "#menu", text: "Menu" },
        { href: "#about", text: "About Us" },
        { href: "#faq", text: "FAQ" }
    ];
    const servicesLinks = [
        { href: "#subscriptions", text: "Meal Plans" },
        { href: "#corporate-booking", text: "Corporate Catering" },
        { href: "#meal-planner", text: "AI Planner" },
        { href: "#nutrition-approach", text: "Our Approach" }
    ];
    const legalLinks = [
        { href: "#", text: "Privacy Policy" },
        { href: "#", text: "Terms of Service" },
        { href: "#", text: "Refund Policy" },
        { href: "#", text: "Shipping Policy" },
    ];
    
    const socialLinks = [
        { href: "https://www.facebook.com/taazabites", icon: 'facebook-f', label: 'Facebook' },
        { href: "https://www.instagram.com/taazabites", icon: 'instagram', label: 'Instagram' },
        { href: "https://twitter.com/taazabites", icon: 'twitter', label: 'Twitter' },
        { href: "#", icon: 'linkedin-in', label: 'LinkedIn' }
    ];

    const businessLinks = [
        { 
            href: "https://www.zomato.com/hi/bangalore/taaza-bites-hosur-road-bangalore", 
            brandName: 'Zomato', 
            brandColorClass: 'bg-[#EF4F5F] hover:bg-red-600' 
        },
        { 
            href: "https://www.swiggy.com/city/bangalore/taaza-bites-hosa-road-bellandur-sarjapur-rest826917", 
            brandName: 'Swiggy', 
            brandColorClass: 'bg-[#FC8019] hover:bg-orange-600' 
        },
        { 
            href: "https://jsdl.in/DT-15ZJTT2REVN", 
            brandName: 'Justdial', 
            brandColorClass: 'bg-[#ffc107] hover:bg-yellow-500',
            textColorClass: 'text-zinc-900' 
        }
    ];

    return (
        <footer className="bg-gradient-to-t from-gray-900 via-black to-black text-zinc-300 pt-20 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="lg:col-span-3">
                        <a href="#hero" className="flex items-center gap-2 text-3xl font-bold font-iowan mb-4">
                            <span className="text-[var(--primary)]">taaza</span>
                            <span className="text-[var(--accent-secondary)]">bites</span>
                            <sup className="text-xs top-[-1em] text-zinc-400">™</sup>
                        </a>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">Taazabites™ is Bengaluru's choice for the best healthy food delivery. We offer chef-crafted, nutritionist-designed meals for a healthier you, delivered fresh every day across Bengaluru.</p>
                        <div className="mb-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${isOpenNow ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                                <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                                {isOpenNow ? "We're currently open" : "We're currently closed"}
                            </div>
                        </div>
                         <div className="mt-6">
                            <h5 className="font-semibold text-white/80 mb-3">Find us on:</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                               {businessLinks.map(link => (
                                    <BusinessLinkButton 
                                        key={link.brandName} 
                                        href={link.href} 
                                        brandName={link.brandName} 
                                        brandColorClass={link.brandColorClass}
                                        textColorClass={link.textColorClass}
                                    />
                                ))}
                            </div>
                        </div>
                         <div className="mt-8">
                            <h5 className="font-semibold text-white/80 mb-3">Follow Us:</h5>
                            <div className="flex items-center gap-5">
                                {socialLinks.map(link => (
                                    <SocialIcon key={link.label} href={link.href} icon={link.icon} label={link.label} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden lg:block lg:col-span-2"><FooterLinkColumn title="Quick Links" links={quickLinks} /></div>
                    <div className="hidden lg:block lg:col-span-2"><FooterLinkColumn title="Our Services" links={servicesLinks} /></div>
                    <div className="hidden lg:block lg:col-span-2"><FooterLinkColumn title="Legal" links={legalLinks} /></div>
                    
                    {/* Newsletter */}
                    <div className="hidden lg:block lg:col-span-3">
                         <h4 id="newsletter-heading" className="text-lg font-bold font-iowan text-white mb-4 tracking-wide">Stay Fresh</h4>
                         <p className="text-zinc-400 text-sm mb-4">Get updates on new meals, exclusive offers, and health tips delivered to your inbox.</p>
                         <NewsletterForm />
                    </div>

                    {/* Mobile Links */}
                    <div className="lg:hidden">
                        <CollapsibleFooterLinks title="Quick Links" links={quickLinks} />
                        <CollapsibleFooterLinks title="Our Services" links={servicesLinks} />
                        <CollapsibleFooterLinks title="Legal" links={legalLinks} />
                    </div>
                </div>

                {/* Contact & Mobile Newsletter */}
                 <div className="space-y-8">
                     {/* Contact Info */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 py-8 border-y border-white/10">
                        <ContactItem href="https://share.google/QhJqtjedmoC0h7Hsr" icon="fa-map-marker-alt" title="Our Location" value="Kasavanahalli, Bengaluru" isExternal />
                        <ContactItem href="tel:+917975771457" icon="fa-phone" title="Call Us" value="+91 7975771457" />
                        <ContactItem href="mailto:Taazabitesindia@gmail.com" icon="fa-envelope" title="Email Us" value="Taazabitesindia@gmail.com" />
                     </div>
                     {/* Newsletter on Mobile */}
                     <div className="lg:hidden">
                          <h4 className="text-lg font-bold font-iowan text-white mb-4 tracking-wide text-center">Stay Fresh</h4>
                          <div className="max-w-sm mx-auto">
                            <NewsletterForm />
                          </div>
                     </div>
                 </div>

                <div className="text-center text-zinc-500 text-sm pt-8 mt-8 border-t border-white/10">
                    <p>© {year} Taazabites™. All rights reserved.</p>
                    <p className="mt-1">FSSAI Lic. No.: <a href="#" className="font-semibold text-zinc-400 hover:text-[var(--primary)] transition-colors">21223188002425</a></p>
                </div>
            </div>
        </footer>
    );
};
