import { GAME_CONFIG } from "@/lib/settings";
import { Arc, Rect } from "react-konva";

interface ShieldProps {
  position: { x: number; y: number };
  itemRotation: number;
}

const Shield: React.FC<ShieldProps> = ({ position, itemRotation }) => {
  return (
    <Arc
      angle={180}
      outerRadius={30}
      innerRadius={0}
      fill="#FFFFFF"
      strokeWidth={3}
      strokeScaleEnabled={false}
      scaleY={0.5}
      x={
        position.x +
        Math.cos((itemRotation * Math.PI) / 180) *
          (GAME_CONFIG.ball.radius + 15 / 2)
      }
      y={
        position.y +
        Math.sin((itemRotation * Math.PI) / 180) *
          (GAME_CONFIG.ball.radius + 15 / 2)
      }
      width={GAME_CONFIG.items.bow.width}
      height={GAME_CONFIG.items.bow.height}
      offsetX={0}
      offsetY={0}
      rotation={itemRotation - 90}
    />
  );
};

export default Shield;
