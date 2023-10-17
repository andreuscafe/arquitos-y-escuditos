import { create } from "zustand";

import io from "socket.io-client";
import { env } from "process";

export const socket = io(env.SOCKET_URL || "http://localhost:3002");
socket.connect();

type Store = {
  socket: typeof socket;

  username: string;
  setUsername: (username: string) => void;

  player: Player;
  setPlayer: (player: Store["player"]) => void;

  players: Player[];
  setPlayers: (players: Store["players"]) => void;

  arrows: Arrow[];
  setArrows: (arrows: Store["arrows"]) => void;
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
    color: "#ffffff",
    currentItem: "bow"
  },
  setPlayer: (player: Store["player"]) => set({ player }),

  players: [],
  setPlayers: (players: Store["players"]) => set({ players }),

  arrows: [],
  setArrows: (arrows: Store["arrows"]) => set({ arrows })
}));

export default useStore;
