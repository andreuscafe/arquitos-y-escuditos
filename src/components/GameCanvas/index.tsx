"use client";

import useFrameloop from "@/lib/hooks/useFrameloop";
import useSocket from "@/lib/hooks/useSocket";
import { useWASD } from "@/lib/hooks/useWASD";
import useStore from "@/lib/store";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";

import { Stage, Layer, Circle, Group, Rect, Text, Arc } from "react-konva";
import Konva from "konva";
import Bow from "./items/Bow";
import { GAME_CONFIG } from "@/lib/settings";
import Shield from "./items/Shield";
import Laser from "./items/Laser";
import { Arrow } from "./actors/Arrow";
import { Arrows } from "./actors/Arrows";
import { arenaToCoords } from "@/lib/utils";
import { Hits } from "./actors/Hits";

interface GameCanvasProps {
  players: Player[];
  player: Player;
  arrows: Arrow[];
  hits: Hit[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  players,
  player,
  arrows,
  hits
}) => {
  const cameraRef = React.useRef(null as any);

  const { a, s, d, w } = useWASD();
  const { emitCoordinates, emitItem, emitArrow } = useSocket();

  // Player position in viewport units
  const [playerPosition, setPlayerPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const [mousePosition, setMousePosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const [isShooting, setIsShooting] = useState(false);

  const itemRotation = useMemo(() => {
    const deg = Math.atan2(
      mousePosition.y - window.innerHeight / 2,
      mousePosition.x - window.innerWidth / 2
    );
    return (deg * 180) / Math.PI;
  }, [mousePosition]);

  // Player position in arena units
  const coordinates = useMemo(() => {
    const x =
      playerPosition.x -
      (window.innerWidth / 2 - GAME_CONFIG.width / 2) -
      GAME_CONFIG.ball.radius;
    const y =
      playerPosition.y -
      (window.innerHeight / 2 - GAME_CONFIG.height / 2) -
      GAME_CONFIG.ball.radius;

    return { x, y, itemRotation };
  }, [playerPosition, itemRotation]);

  const handlePointerMove = ({ evt }: { evt: PointerEvent }) => {
    setMousePosition({ x: evt.clientX, y: evt.clientY });
  };

  const handleClick = (e: MouseEvent) => {
    // on tab press, toggle player item between bow and shield
    e.preventDefault();
    if (e.button === 2) {
      emitItem(player.currentItem === "bow" ? "shield" : "bow");
    }

    if (e.button === 0 && player.currentItem === "bow") {
      const arrow = {
        coordinates: {
          start: {
            x: coordinates.x,
            y: coordinates.y
          },
          degree: itemRotation
        },
        player: player.id,
        id: `arrow_${Math.random() * 100000000000000000}`
      } as Arrow;

      emitArrow(arrow);
    }
  };

  useLayoutEffect(() => {
    const handleShift = (e: KeyboardEvent) => {
      // on tab press, toggle player item between bow and shield
      if (e.key === "Shift") {
        emitItem(player.currentItem === "bow" ? "shield" : "bow");
      }
    };

    window.addEventListener("keydown", handleShift);

    return () => {
      window.removeEventListener("keydown", handleShift);
    };
  }, [emitItem, player]);

  useFrameloop(async () => {
    if (a)
      setPlayerPosition((p) => ({
        ...p,
        x: Math.max(
          p.x - GAME_CONFIG.movementSpeed,
          window.innerWidth / 2 -
            GAME_CONFIG.width / 2 +
            GAME_CONFIG.ball.radius
        )
      }));
    if (d)
      setPlayerPosition((p) => ({
        ...p,
        x: Math.min(
          p.x + GAME_CONFIG.movementSpeed,
          window.innerWidth / 2 +
            GAME_CONFIG.width / 2 -
            GAME_CONFIG.ball.radius
        )
      }));
    if (w)
      setPlayerPosition((p) => ({
        ...p,
        y: Math.max(
          p.y - GAME_CONFIG.movementSpeed,
          window.innerHeight / 2 -
            GAME_CONFIG.height / 2 +
            GAME_CONFIG.ball.radius
        )
      }));
    if (s)
      setPlayerPosition((p) => ({
        ...p,
        y: Math.min(
          p.y + GAME_CONFIG.movementSpeed,
          window.innerHeight / 2 +
            GAME_CONFIG.height / 2 -
            GAME_CONFIG.ball.radius
        )
      }));

    useStore.getState().setCamera({
      x: cameraRef.current.x(),
      y: cameraRef.current.y()
    });

    // if (isShooting) {
    //   const arrow = {
    //     coordinates: {
    //       start: {
    //         x: coordinates.x,
    //         y: coordinates.y
    //       },
    //       degree: itemRotation
    //     },
    //     color: player.color,
    //     id: `arrow_${Math.random() * 100000000000000000}`
    //   } as Arrow;
    //   emitArrow(arrow);
    // }

    emitCoordinates(coordinates);
  });

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      className="bg-neutral-900"
      onPointerMove={handlePointerMove}
      onMouseDown={(e) => {
        setIsShooting(true);
        handleClick(e.evt);
      }}
      onMouseUp={() => setIsShooting(false)}
      onContextMenu={(e) => e.evt.preventDefault()}
    >
      <Layer>
        <Text
          text={`x: ${coordinates.x}, y: ${coordinates.y}, rotation: ${coordinates.itemRotation}`}
          fill="white"
          x={10}
          y={10}
        />
        <Text
          text={`Current item: ${player.currentItem}`}
          x={10}
          y={30}
          fill="white"
        />
        <Text
          text={`Players: ${players.length + 1}`}
          x={10}
          y={50}
          fill="white"
        />
        <Text
          text={`Ping: ${useStore.getState().ping}`}
          x={10}
          y={70}
          fill="white"
        />

        <Group
          x={window.innerWidth / 2 - playerPosition.x}
          y={window.innerHeight / 2 - playerPosition.y}
          ref={cameraRef}
        >
          <Group>
            <Rect
              key="arena"
              x={window.innerWidth / 2 - GAME_CONFIG.width / 2}
              y={window.innerHeight / 2 - GAME_CONFIG.height / 2}
              width={GAME_CONFIG.width}
              height={GAME_CONFIG.height}
              fill="white"
              opacity={0.05}
            />

            {/* Arrows */}
            <Arrows data={arrows} />
          </Group>

          <Group>
            <Group>
              <Circle
                key="player"
                x={playerPosition.x}
                y={playerPosition.y}
                radius={GAME_CONFIG.ball.radius}
                fill={player.color || "#FFFFFF"}
              />

              {/* item */}
              {player.currentItem === "bow" ? (
                <Bow
                  key="player-bow"
                  position={playerPosition}
                  itemRotation={itemRotation}
                />
              ) : (
                <Shield
                  key="player-shield"
                  position={playerPosition}
                  itemRotation={itemRotation}
                />
              )}

              {/* laser */}
              {GAME_CONFIG.laser.active && (
                <Laser
                  key="player-laser"
                  position={playerPosition}
                  itemRotation={itemRotation}
                />
              )}
            </Group>
          </Group>

          {/* Other players */}
          <Group>
            {players.map((player) => {
              const position = {
                x:
                  window.innerWidth / 2 -
                  GAME_CONFIG.width / 2 +
                  player.coordinates.x +
                  GAME_CONFIG.ball.radius,
                y:
                  window.innerHeight / 2 -
                  GAME_CONFIG.height / 2 +
                  player.coordinates.y +
                  GAME_CONFIG.ball.radius
              };

              return (
                <Group key={player.id}>
                  <Circle
                    key={`ball_${player.id}`}
                    x={position.x}
                    y={position.y}
                    radius={GAME_CONFIG.ball.radius}
                    fill={player.color || "#EC5454"}
                  />

                  {player.currentItem === "bow" ? (
                    <Bow
                      key={`${player.id}-bow`}
                      position={position}
                      itemRotation={player.coordinates.itemRotation}
                    />
                  ) : (
                    <Shield
                      key={`${player.id}-shield`}
                      position={position}
                      itemRotation={player.coordinates.itemRotation}
                    />
                  )}

                  {GAME_CONFIG.laser.active && (
                    <Laser
                      key={`${player.id}-laser`}
                      position={position}
                      itemRotation={player.coordinates.itemRotation}
                    />
                  )}
                </Group>
              );
            })}
          </Group>

          {/* Hits */}
          <Hits data={hits} />
        </Group>
      </Layer>
    </Stage>
  );
};

export default GameCanvas;
