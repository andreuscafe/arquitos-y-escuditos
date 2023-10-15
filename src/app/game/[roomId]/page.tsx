"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/lib/store";
import { useParams } from "next/navigation";
import GameCanvas from "@/components/GameCanvas";

const GamePage = () => {
  const params = useParams();

  const roomId = params.roomId as string;

  const { socket, players } = useStore((state) => ({
    socket: state.socket,
    players: state.players
  }));

  const { setPlayers, setPlayer } = useStore.getState();

  useEffect(() => {
    socket.on("players", (data: Player[]) => {
      const filteredPlayers = data.filter((player) => player.id !== socket.id);
      setPlayers(filteredPlayers);

      const currentPlayer = data.find(
        (player) => player.id === socket.id
      ) as Player;
      setPlayer(currentPlayer);

      if (useStore.getState().player.id !== socket.id) {
        console.log("setting player");
        setPlayer(data.find((player) => player.id === socket.id) as Player);
      }
    });

    socket.emit("join_room", roomId);

    socket.on("connect", () => {
      socket.emit("join_room", roomId);
    });

    return () => {
      socket.emit("exit_room", roomId);
      socket.off("receive_msg");
      socket.off("connect");
    };
  }, [socket, roomId, setPlayers]);

  return (
    <div className="h-screen w-screen bg-black">
      <GameCanvas players={players} />
    </div>
  );
};

export default GamePage;
