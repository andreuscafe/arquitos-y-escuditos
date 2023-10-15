import { create } from "zustand";

import io from "socket.io-client";

export const socket = io("http://10.0.0.130:3002");
socket.connect();

type Store = {
  username: string;
  setUsername: (username: string) => void;
  socket: typeof socket;
};

const useStore = create<Store>((set) => ({
  socket,
  username: "",
  setUsername: (username) => set({ username })
}));

export default useStore;
