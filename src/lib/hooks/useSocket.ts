import { useRef } from "react";
import useStore from "../store";
import { useParams } from "next/navigation";

const useSocket = () => {
  const { socket } = useStore.getState();

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

  const emitArrow = (arrow: Arrow) => {
    const data = {
      roomId,
      arrow
    };

    socket.emit("send_arrow", data);
  };

  const emitHit = (hit: Hit) => {
    const data = {
      roomId,
      hit
    };

    socket.emit("send_hit", data);
  };

  const emitPing = () => {
    socket.emit("ping", {
      timestamp: Date.now()
    });
  };

  return { emitCoordinates, emitItem, emitArrow, emitPing, emitHit, socket };
};

export default useSocket;
