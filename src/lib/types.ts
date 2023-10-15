type PlayerCoordinates = {
  x: number;
  y: number;
  itemRotation: number;
};

type Player = {
  id: string;
  username?: string;
  color?: string;
  coordinates: PlayerCoordinates;
  currentItem: "bow" | "shield";
};
