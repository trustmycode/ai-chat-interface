// hooks/useMediaQuery.js
import {useState, useEffect} from 'react';

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const media = window.matchMedia(query);

            const updateMatch = () => {
                setMatches(media.matches);
            };

            updateMatch();
            media.addEventListener('change', updateMatch);

            return () => {
                media.removeEventListener('change', updateMatch);
            };
        }
    }, [query]);

    return matches;
}
