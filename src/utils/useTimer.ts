import { useState, useEffect, useRef } from 'react';

export function useTimer(endTime: number | null | undefined, onTimeUp?: () => void): number {
  const [timeLeft, setTimeLeft] = useState(0);
  const requestRef = useRef<number>();
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!endTime) {
      setTimeLeft(0);
      return;
    }

    const animate = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      setTimeLeft(remaining);

      if (remaining > 0) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        if (onTimeUpRef.current) {
          onTimeUpRef.current();
        }
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [endTime]);

  return timeLeft;
}
