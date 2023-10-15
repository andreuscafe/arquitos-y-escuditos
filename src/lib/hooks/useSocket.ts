import { useRef } from "react";
import useStore from "../store";
import { useParams } from "next/navigation";

const useSocket = () => {
  const { socket } = useStore((s) => ({ socket: s.socket }));

  const params = useParams();
  const roomId = params.roomId as string;

  const lastCoordinatesEmited = useRef<PlayerCoordinates>({
    x: 0,
    y: 0,
    itemRotation: 0
  });

  const emitCoordinates = (coordinates: PlayerCoordinates) => {
    if (
      coordinates.x === lastCoordinatesEmited.current.x &&
      coordinates.y === lastCoordinatesEmited.current.y &&
      coordinates.itemRotation === lastCoordinatesEmited.current.itemRotation
    ) {
      return;
    }

    const data = {
      roomId,
      coordinates
    };

    socket.emit("send_coordinates", data);

    lastCoordinatesEmited.current = coordinates;
  };

  const emitItem = (currentItem: Player["currentItem"]) => {
    const data = {
      roomId,
      currentItem
    };

    socket.emit("send_item", data);
  };

  return { emitCoordinates, emitItem };
};

export default useSocket;
