import React from 'react';

export interface UseInfiniteScrollOptions extends IntersectionObserverInit {
    callback: () => Promise<void> | void;
    deps: React.DependencyList;
}

export const useInfiniteScroll = <T extends HTMLElement>({
    callback,
    root,
    rootMargin,
    threshold,
    deps
}: UseInfiniteScrollOptions) => {
    const observer = React.useRef<IntersectionObserver | null>(null);

    const ref = React.useCallback((node: T) => {
        if (deps.every(Boolean)) {
            observer.current?.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                entries[0].isIntersecting && callback();
            }, { root, rootMargin, threshold });
            
            node && observer.current.observe(node);
        }}, [deps, callback]);

    return ref;
};