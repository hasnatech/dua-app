import { useEffect, useRef } from 'react';

export function useOutsideClick<T extends HTMLElement>(callback: () => void) {
    const ref = useRef<T>(null);
    // console.log('useOutsideClick ref:', ref.current);
    const id = ref.current?.id || 'unknown';

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            const target = event.target as HTMLElement;

            if (isParentOrSelf(target, id)) {
                // Click was inside ref or one of its parents
                return;
            }

            // Outside click → trigger callback
            callback();
        }

        function isParentOrSelf(target: HTMLElement, id:string) {
            let node: HTMLElement | null = target;
            let ref = document.getElementById(id);
            if (!ref) return false;
            while (node) {
                if (node.id === id) {
                    return true; // found the ref in parent chain
                }
                node = node.parentElement;
            }
            return false;
        }

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [callback]);

    return ref;
}
