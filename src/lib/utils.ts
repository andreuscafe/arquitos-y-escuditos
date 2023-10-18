import { GAME_CONFIG } from "./settings";
import useStore from "./store";

export const isPointInRectangle = (
  x: number,
  y: number,
  rect: { x: number; width: any; y: number; height: any }
) => {
  return (
    x > rect.x &&
    x < rect.x + rect.width &&
    y > rect.y &&
    y < rect.y + rect.height
  );
};

export const isPointInCircle = (
  x: number,
  y: number,
  circle: { x: number; y: number; radius: any }
) => {
  return Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2) < circle.radius;
};

export const coordsToArena = (x: number, y: number) => {
  const { x: cameraX, y: cameraY } = useStore.getState().camera;

  const arenaPosition = {
    x: window.innerWidth / 2 - GAME_CONFIG.width / 2 + cameraX,
    y: window.innerHeight / 2 - GAME_CONFIG.height / 2 + cameraY
  };

  return { x: x - arenaPosition.x, y: y - arenaPosition.y };
};

export const arenaToCoords = (x: number, y: number) => {
  const arenaPosition = {
    x: window.innerWidth / 2 - GAME_CONFIG.width / 2,
    y: window.innerHeight / 2 - GAME_CONFIG.height / 2
  };

  return { x: x + arenaPosition.x, y: y + arenaPosition.y };
};
