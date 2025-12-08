import { useState, useEffect, useRef } from 'react';

const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState('up');
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine scroll direction
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up');
            }

            // Determine if scrolled significantly
            setIsScrolled(currentScrollY > 50);

            // Update last scroll position
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { scrollDirection, isScrolled };
};

export default useScrollDirection;
