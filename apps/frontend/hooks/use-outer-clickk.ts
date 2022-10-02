import { useEffect, useRef } from 'react';

export function useOuterClick(callback) {
  const callbackRef = useRef(); // initialize mutable ref, which stores callback
  const innerRef = useRef(); // returned to client, who marks "border" element

  // update cb on each render, so second useEffect has access to current value
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
    function handleClick(e) {
      if (
        innerRef.current &&
        callbackRef.current &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        !innerRef.current.contains(e.target)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callbackRef.current(e);
    }
  }, []); // no dependencies -> stable click listener

  return innerRef; // convenience for client (doesn't need to init ref himself)
}
