import useStore from "@/lib/store";
import { arenaToCoords } from "@/lib/utils";
import { Group, Text } from "react-konva";
import { useRef, useLayoutEffect } from "react";
import { keys } from "lodash";

interface HitsProps {
  data: Hit[];
}

export const Hits = ({ data }: HitsProps) => {
  const hitsRef = useRef({} as any);

  // useLayoutEffect(() => {
  //   data.forEach((hit) => {
  //     const hitRef = hitsRef.current[hit.id];

  //     if (hitRef) {
  //       if (hitRef.isAnimating) return;

  //       console.log("hit", hit);
  //       hitRef.to({
  //         scale: 1.5,
  //         opacity: 0,
  //         duration: 0.5,
  //         easing: "easeOut"
  //       });

  //       hitRef.isAnimating = true;
  //     }
  //   });
  // }, [data]);

  return (
    <Group>
      {data.map((hit) => {
        return (
          <Text
            // ref={(h) => {
            //   if (h) {
            //     hitsRef.current[hit.id] = h;
            //   } else {
            //     delete hitsRef.current[hit.id];
            //   }
            // }}
            key={hit.id}
            text={`Hit`}
            fill="white"
            x={arenaToCoords(hit.coordinates.x, hit.coordinates.y).x}
            y={arenaToCoords(hit.coordinates.x, hit.coordinates.y).y}
          />
        );
      })}
    </Group>
  );
};
