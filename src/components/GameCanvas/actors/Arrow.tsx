import { GAME_CONFIG } from "@/lib/settings";
import { Circle, Group, Rect as KonvaRect, Rect } from "react-konva";
import { forwardRef, useLayoutEffect, useRef } from "react";
import useFrameloop from "@/lib/hooks/useFrameloop";
import Konva from "konva";

interface ArrowProps {
  data: Arrow;
}

const ARROW_SIZE = 30;

export const Arrow = forwardRef<any, ArrowProps>(({ data }, ref) => {
  const groupRef = useRef(null as any);
  const circleRef = useRef(null as any);
  const debugCircleRef = useRef(null as any);

  // useFrameloop(() => {
  //   // if (groupRef.current)
  //   //   console.log(groupRef.current.y() - groupRef.current.getClientRect().y);
  // });

  useLayoutEffect(() => {
    if (circleRef.current) {
      // calculate the end coordinates of the arrow based on the GAME_CONFIG.arrowTravelDistance and the degree of the arrow
      const endX =
        circleRef.current.x() +
        Math.cos((data.coordinates.degree * Math.PI) / 180) *
          GAME_CONFIG.arrowTravelDistance;

      const endY =
        circleRef.current.y() +
        Math.sin((data.coordinates.degree * Math.PI) / 180) *
          GAME_CONFIG.arrowTravelDistance;

      circleRef.current.to({
        x: endX,
        y: endY,
        duration: 1,
        easing: Konva.Easings.EaseOut
      });

      if (GAME_CONFIG.debug.arrow) {
        debugCircleRef.current.to({
          radius: GAME_CONFIG.arrowTravelDistance,
          duration: 1,
          opacity: 0.001,
          easing: Konva.Easings.EaseOut
        });
      }
    }
  }, [data.coordinates.degree]);

  return (
    <>
      <Group
        ref={groupRef}
        key={data.id}
        x={
          data.coordinates.start.x +
          window.innerWidth / 2 -
          GAME_CONFIG.width / 2 +
          GAME_CONFIG.ball.radius
        }
        y={
          data.coordinates.start.y +
          window.innerHeight / 2 -
          GAME_CONFIG.height / 2 +
          GAME_CONFIG.ball.radius
        }
      >
        {GAME_CONFIG.debug.arrow && (
          <Circle
            ref={debugCircleRef}
            radius={0}
            stroke={"white"}
            strokeWidth={3}
            fillAfterStrokeEnabled={true}
          />
        )}
        <KonvaRect
          ref={ref}
          width={0}
          height={3}
          fill="white"
          rotation={data.coordinates.degree}
        />

        <Group ref={circleRef}>
          <Rect
            width={ARROW_SIZE}
            height={ARROW_SIZE}
            fill="white"
            x={
              Math.sin((data.coordinates.degree * Math.PI) / 180) *
              (ARROW_SIZE / 2)
            }
            y={
              Math.cos((data.coordinates.degree * Math.PI) / 180) *
              (-ARROW_SIZE / 2)
            }
            rotation={data.coordinates.degree}
          />
        </Group>
      </Group>
    </>
  );
});

Arrow.displayName = "Arrow";
