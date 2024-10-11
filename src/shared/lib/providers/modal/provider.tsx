import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from '@/shared/ui/Modal';
import { useModal } from './store';
import { useEvents } from '@/shared/model/store';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const { modals, isModalDisabled, actions: { onCloseModal } } = useModal();
    
    const bodyRef = React.useRef<HTMLDivElement | null>(null);
    const focusableElements = React.useRef<Array<HTMLElement>>([]);
    const activeIndex = React.useRef(-1);
    
    const addEventListener = useEvents((state) => state.addEventListener);
    
    const handleTabDown = (event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
        event.preventDefault();

        if (!bodyRef.current) return;

        bodyRef.current.focus();

        focusableElements.current = Array.from(
            bodyRef.current.querySelectorAll(
                'a, button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
            )
        );

        const total = focusableElements.current.length;
        const currentIndex = activeIndex.current;
        
        activeIndex.current = total ? (currentIndex + (event.shiftKey ? -1 : 1) + total) % total : -1;

        focusableElements.current[activeIndex.current]?.focus?.();
    };

    const handleEscapeDown = (event: KeyboardEvent) => {
        !isModalDisabled && event.key === 'Escape' && onCloseModal();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        event.stopImmediatePropagation();

        const keyListeners = {
            Tab: handleTabDown,
            Escape: handleEscapeDown
        };

        keyListeners[event.key as keyof typeof keyListeners]?.(event);
    };

    React.useEffect(() => {
        if (!modals.length || !bodyRef.current) return;

        bodyRef.current.focus();

        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('overflow-hidden');

        const removeEventListener = addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.classList.remove('overflow-hidden');
            document.body.style.paddingRight = '0';

            removeEventListener();
        };
    }, [modals]);

    return (
        <>
            {modals.map((modal, index, array) =>
                ReactDOM.createPortal(
                    <Modal
                        key={index}
                        closeHandler={onCloseModal}
                        disabled={isModalDisabled}
                        ref={index === array.length - 1 ? bodyRef : null}
                        {...modal}
                    >
                        {modal.content}
                    </Modal>,
                    document.querySelector('#modal-root')!
                )
            )}
            {children}
        </>
    );
};