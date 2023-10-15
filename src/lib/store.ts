import { create } from "zustand";

import io from "socket.io-client";

export const socket = io("http://10.0.0.130:3002");
socket.connect();

type Store = {
  socket: typeof socket;

  username: string;
  setUsername: (username: string) => void;

  player: Player;
  setPlayer: (player: Store["player"]) => void;

  players: Player[];
  setPlayers: (players: Store["players"]) => void;
};

const useStore = create<Store>((set) => ({
  socket,
  username: "",
  setUsername: (username) => set({ username }),

  player: {
    id: "player",
    coordinates: {
      x: 0,
      y: 0,
      itemRotation: 0
    },
    color: "#ffffff"
  },
  setPlayer: (player: Store["player"]) => set({ player }),

  players: [],
  setPlayers: (players: Store["players"]) => set({ players })
}));

export default useStore;
