import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  hasMore: boolean;
  isLoading: boolean;
}

/**
 * A highly optimized performance hook utilizing the IntersectionObserver API.
 * Safely triggers pagination fetch cycles when a DOM sentinel element enters the viewport.
 */
export function useInfiniteScroll(
  onIntersect: () => void | Promise<void>,
  { threshold = 0.1, rootMargin = '0px', hasMore, isLoading }: UseInfiniteScrollOptions
) {
  // Capture a mutable reference to the target DOM element being tracked
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const currentTarget = observerRef.current;
    if (!currentTarget || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentTarget);

    // Strict cleanup pattern when components unmount or parameters change
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onIntersect, threshold, rootMargin, hasMore, isLoading]);

  return { observerRef, isIntersecting };
}
