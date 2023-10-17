import React, { useLayoutEffect } from "react";
import { Arrow } from "./Arrow";
import Konva from "konva";
import useFrameloop from "@/lib/hooks/useFrameloop";
import { keys } from "lodash";
import { GAME_CONFIG } from "@/lib/settings";

interface ArrowsProps {
  data: Arrow[];
}

export const Arrows = ({ data }: ArrowsProps) => {
  const arrowsRef = React.useRef({} as any);

  useLayoutEffect(() => {
    data.forEach((arrow) => {
      const arr = arrowsRef.current[arrow.id];

      if (arr && !arr.isAnimating) {
        arr.to({
          width: GAME_CONFIG.arrowTravelDistance,
          duration: 1,
          opacity: 0,
          easing: Konva.Easings.EaseOut
        });

        arr.isAnimating = true;
      }
    });
  }, [data]);

  // useFrameloop(() => {
  //   keys(arrowsRef.current).forEach((key) => {
  //     const arr = arrowsRef.current[key];

  //     console.log(arr.getClientRect());
  //   });
  // });

  return (
    <>
      {data.map((arrow) => {
        return (
          <Arrow
            data={arrow}
            key={arrow.id}
            ref={(arr) => {
              if (arr) {
                arrowsRef.current[arrow.id] = arr;
              } else {
                delete arrowsRef.current[arrow.id];
              }
            }}
          />
        );
      })}
    </>
  );
};
