import React, { useMemo } from "react";
import { Arrow } from "./Arrow";
import useFrameloop from "@/lib/hooks/useFrameloop";
import { keys } from "lodash";
import { GAME_CONFIG } from "@/lib/settings";
import useStore from "@/lib/store";
import { coordsToArena } from "@/lib/utils";
import useSocket from "@/lib/hooks/useSocket";

interface ArrowsProps {
  data: Arrow[];
}

export const Arrows = ({ data }: ArrowsProps) => {
  const arrowsRef = React.useRef({} as any);
  // const playerArrows = useMemo(() => {
  //   return data.filter(
  //     (arrow) => arrow.player === useStore.getState().player.id
  //   );
  // }, [data]);

  const { emitHit } = useSocket();

  useFrameloop(() => {
    if (GAME_CONFIG.debug.preventCollision) return;

    const playerArrows = keys(arrowsRef.current).filter((key) => {
      return arrowsRef.current[key].player === useStore.getState().player.id;
    });

    playerArrows.forEach((key) => {
      const arr = arrowsRef.current[key];

      const arrowPosition = coordsToArena(
        arr.getClientRect().x,
        arr.getClientRect().y
      );

      useStore.getState().players.forEach((player) => {
        const playerPosition = {
          x: player.coordinates.x + GAME_CONFIG.ball.radius,
          y: player.coordinates.y + GAME_CONFIG.ball.radius
        };

        const distance = Math.sqrt(
          (arrowPosition.x - playerPosition.x) ** 2 +
            (arrowPosition.y - playerPosition.y) ** 2
        );

        if (distance < GAME_CONFIG.ball.radius) {
          emitHit({
            id: `hit_${Math.random() * 100000000000000000}`,
            coordinates: {
              x: arrowPosition.x,
              y: arrowPosition.y
            }
          });

          // console.log("Sent hit to player", player.id, {
          //   coordinates: {
          //     x: arrowPosition.x,
          //     y: arrowPosition.y
          //   }
          // });
        }
      });
    });
  });

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
                arrowsRef.current[arrow.id].player = arrow.player;
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
