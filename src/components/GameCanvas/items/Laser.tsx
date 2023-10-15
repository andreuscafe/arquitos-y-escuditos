import { GAME_CONFIG } from "@/lib/settings";
import { Arc, Rect } from "react-konva";

interface LaserProps {
  position: { x: number; y: number };
  itemRotation: number;
}

const Laser: React.FC<LaserProps> = ({ position, itemRotation }) => {
  return (
    <Rect
      x={
        position.x +
        Math.cos((itemRotation * Math.PI) / 180) *
          (GAME_CONFIG.ball.radius + GAME_CONFIG.laser.width / 2)
      }
      y={
        position.y +
        Math.sin((itemRotation * Math.PI) / 180) *
          (GAME_CONFIG.ball.radius + GAME_CONFIG.laser.width / 2)
      }
      width={GAME_CONFIG.laser.width}
      height={GAME_CONFIG.laser.height}
      fill={GAME_CONFIG.laser.color}
      opacity={GAME_CONFIG.laser.opacity}
      offsetX={GAME_CONFIG.laser.width / 2}
      offsetY={GAME_CONFIG.laser.height / 2}
      rotation={itemRotation}
    />
  );
};

export default Laser;
