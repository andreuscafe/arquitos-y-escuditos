import { useCallback, useEffect, useRef } from "react";

const FPS = 60;

const useFrameloop = (callback: () => void) => {
  const requestRef = useRef<number>();
  const lastTime = useRef<number>(0);

  const animate = useCallback(
    (now: number) => {
      callback();
      requestRef.current = requestAnimationFrame(animate);
      // if (!(now - lastTime.current < 1000 / FPS)) {
      //   lastTime.current = now;
      // }
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate, callback]);

  return requestRef.current;
};

export default useFrameloop;
