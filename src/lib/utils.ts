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
