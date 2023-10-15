import { GAME_CONFIG } from "@/lib/settings";
import { Arc } from "react-konva";

interface BowProps {
  position: { x: number; y: number };
  itemRotation: number;
}

const Bow: React.FC<BowProps> = ({ position, itemRotation }) => {
  return (
    <Arc
      angle={180}
      outerRadius={30}
      innerRadius={0}
      stroke={"#FFFFFF"}
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

export default Bow;
