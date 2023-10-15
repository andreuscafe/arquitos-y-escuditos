"use client";

import useFrameloop from "@/lib/hooks/useFrameloop";
import useSocket from "@/lib/hooks/useSocket";
import { useWASD } from "@/lib/hooks/useWASD";
import useStore from "@/lib/store";
import React, { useLayoutEffect, useMemo, useState } from "react";

import { Stage, Layer, Circle, Group, Rect, Text, Arc } from "react-konva";
import Bow from "./items/Bow";
import { GAME_CONFIG } from "@/lib/settings";
import Shield from "./items/Shield";
import Laser from "./items/Laser";

interface GameCanvasProps {
  players: Player[];
  player: Player;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ players, player }) => {
  const { a, s, d, w } = useWASD();
  const { emitCoordinates, emitItem } = useSocket();

  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const [mousePosition, setMousePosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  const itemRotation = useMemo(() => {
    const deg = Math.atan2(
      mousePosition.y - window.innerHeight / 2,
      mousePosition.x - window.innerWidth / 2
    );
    return (deg * 180) / Math.PI;
  }, [mousePosition]);

  const coordinates = useMemo(() => {
    const x =
      position.x -
      (window.innerWidth / 2 - GAME_CONFIG.width / 2) -
      GAME_CONFIG.ball.radius;
    const y =
      position.y -
      (window.innerHeight / 2 - GAME_CONFIG.height / 2) -
      GAME_CONFIG.ball.radius;

    return { x, y, itemRotation };
  }, [position, itemRotation]);

  const handlePointerMove = ({ evt }: { evt: PointerEvent }) => {
    setMousePosition({ x: evt.clientX, y: evt.clientY });
  };

  const handleClick = (e: MouseEvent) => {
    // on tab press, toggle player item between bow and shield
    e.preventDefault();
    if (e.button === 2) {
      emitItem(player.currentItem === "bow" ? "shield" : "bow");
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
      setPosition((p) => ({
        ...p,
        x: Math.max(
          p.x - GAME_CONFIG.movementSpeed,
          window.innerWidth / 2 -
            GAME_CONFIG.width / 2 +
            GAME_CONFIG.ball.radius
        )
      }));
    if (d)
      setPosition((p) => ({
        ...p,
        x: Math.min(
          p.x + GAME_CONFIG.movementSpeed,
          window.innerWidth / 2 +
            GAME_CONFIG.width / 2 -
            GAME_CONFIG.ball.radius
        )
      }));
    if (w)
      setPosition((p) => ({
        ...p,
        y: Math.max(
          p.y - GAME_CONFIG.movementSpeed,
          window.innerHeight / 2 -
            GAME_CONFIG.height / 2 +
            GAME_CONFIG.ball.radius
        )
      }));
    if (s)
      setPosition((p) => ({
        ...p,
        y: Math.min(
          p.y + GAME_CONFIG.movementSpeed,
          window.innerHeight / 2 +
            GAME_CONFIG.height / 2 -
            GAME_CONFIG.ball.radius
        )
      }));

    emitCoordinates(coordinates);
  });

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      className="bg-black"
      onPointerMove={handlePointerMove}
      onMouseDown={(e) => handleClick(e.evt)}
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

        <Group
          x={window.innerWidth / 2 - position.x}
          y={window.innerHeight / 2 - position.y}
        >
          <Group>
            <Rect
              x={window.innerWidth / 2 - GAME_CONFIG.width / 2}
              y={window.innerHeight / 2 - GAME_CONFIG.height / 2}
              width={GAME_CONFIG.width}
              height={GAME_CONFIG.height}
              fill="white"
              opacity={0.05}
            />
          </Group>

          <Group>
            <Group>
              <Circle
                key="player"
                x={position.x}
                y={position.y}
                radius={GAME_CONFIG.ball.radius}
                fill={player.color || "#FFFFFF"}
              />

              {/* item */}
              {player.currentItem === "bow" ? (
                <Bow position={position} itemRotation={itemRotation} />
              ) : (
                <Shield position={position} itemRotation={itemRotation} />
              )}

              {/* laser */}
              {GAME_CONFIG.laser.active && (
                <Laser
                  key="playerLaser"
                  position={position}
                  itemRotation={itemRotation}
                />
              )}
            </Group>
          </Group>

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
                      position={position}
                      itemRotation={player.coordinates.itemRotation}
                    />
                  ) : (
                    <Shield
                      position={position}
                      itemRotation={player.coordinates.itemRotation}
                    />
                  )}

                  {GAME_CONFIG.laser.active && (
                    <Laser
                      key={`laser_${player.id}`}
                      position={position}
                      itemRotation={player.coordinates.itemRotation}
                    />
                  )}
                </Group>
              );
            })}
          </Group>
        </Group>
      </Layer>
    </Stage>
  );
};

export default GameCanvas;
