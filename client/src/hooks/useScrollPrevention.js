import { useEffect } from 'react';

export const useScrollPrevention = () => {
  useEffect(() => {
    const preventScroll = (e) => {
      // Check if the scroll is happening inside a scrollable container
      let element = e.target;
      while (element && element !== document.body) {
        const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
        const overflowY = window.getComputedStyle(element).overflowY;

        if (hasVerticalScrollbar && (overflowY === 'auto' || overflowY === 'scroll')) {
          // Allow scrolling inside scrollable containers
          return;
        }
        element = element.parentElement;
      }

      // Prevent scrolling on the body
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventKeys = (e) => {
      // Check if the active element is inside a scrollable container
      let element = document.activeElement;
      while (element && element !== document.body) {
        const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
        const overflowY = window.getComputedStyle(element).overflowY;

        if (hasVerticalScrollbar && (overflowY === 'auto' || overflowY === 'scroll')) {
          // Allow keyboard scrolling inside scrollable containers
          return;
        }
        element = element.parentElement;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'End' || e.key === ' ') {
        e.preventDefault();
        return false;
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('keydown', preventKeys);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventKeys);
    };
  }, []);
};