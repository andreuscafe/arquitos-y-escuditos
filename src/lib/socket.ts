import { env } from "process";
import io from "socket.io-client";

export const socket = io(env.SOCKET_URL || "http://localhost:3002");
