"use client";
import React, { useEffect, useRef, useState } from "react";
import useStore from "@/lib/store";
import { useParams } from "next/navigation";
import GameCanvas from "@/components/GameCanvas";
import _ from "lodash";
import useSocket from "@/lib/hooks/useSocket";

const GamePage = () => {
  const params = useParams();

  const roomId = params.roomId as string;
  const intervalRef = useRef(null as any);

  const { players, player, arrows, hits } = useStore((state) => ({
    players: state.players,
    player: state.player,
    arrows: state.arrows,
    hits: state.hits
  }));

  const { socket, emitPing } = useSocket();

  const { setPlayers, setPlayer, setArrows, setHits } = useStore.getState();

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

    socket.on("arrows", (data: Arrow[]) => {
      setArrows(data);
    });

    socket.on("hits", (data: Hit[]) => {
      setHits(data);
    });

    socket.on("pong", (data: { timestamp: number }) => {
      useStore.getState().setPing(Date.now() - data.timestamp);
    });

    socket.emit("join_room", roomId);

    socket.on("connect", () => {
      socket.emit("join_room", roomId);
    });

    intervalRef.current = setInterval(() => {
      emitPing();
    }, 1000);

    return () => {
      socket.emit("exit_room", roomId);
      socket.off("receive_msg");
      socket.off("connect");

      clearInterval(intervalRef.current);
    };
  }, [roomId, setPlayers, setPlayer, setArrows]);

  return (
    <div className="h-screen w-screen bg-black">
      <GameCanvas
        players={players}
        player={player}
        arrows={arrows}
        hits={hits}
      />
    </div>
  );
};

export default GamePage;
