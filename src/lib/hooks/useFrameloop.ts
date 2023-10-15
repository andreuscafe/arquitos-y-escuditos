import { useCallback, useEffect, useRef } from "react";

const useFrameloop = (callback: () => void) => {
  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate, callback]);

  return requestRef.current;
};

export default useFrameloop;
