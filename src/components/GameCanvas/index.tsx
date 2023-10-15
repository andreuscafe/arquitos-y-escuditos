"use client";

import useFrameloop from "@/lib/hooks/useFrameloop";
import useSocket from "@/lib/hooks/useSocket";
import { useWASD } from "@/lib/hooks/useWASD";
import React, { useMemo, useState } from "react";

import { Stage, Layer, Circle, Group, Rect, Text } from "react-konva";

const gameConfig = {
  width: 800,
  height: 800,
  backgroundColor: "#000000",
  movementSpeed: 5,

  // ball
  ball: {
    radius: 30,
    color: "#ffffff"
  },

  // item
  item: {
    width: 15,
    height: 60,
    color: "#ffffff"
  }
};

interface GameCanvasProps {
  players: Player[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ players }) => {
  const { a, s, d, w } = useWASD();
  const { emitCoordinates } = useSocket();

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
      (window.innerWidth / 2 - gameConfig.width / 2) -
      gameConfig.ball.radius;
    const y =
      position.y -
      (window.innerHeight / 2 - gameConfig.height / 2) -
      gameConfig.ball.radius;

    return { x, y, itemRotation };
  }, [position, itemRotation]);

  const handlePointerMove = ({ evt }: { evt: PointerEvent }) => {
    setMousePosition({ x: evt.clientX, y: evt.clientY });
  };

  useFrameloop(async () => {
    if (a)
      setPosition((p) => ({
        ...p,
        x: Math.max(
          p.x - gameConfig.movementSpeed,
          window.innerWidth / 2 - gameConfig.width / 2 + gameConfig.ball.radius
        )
      }));
    if (d)
      setPosition((p) => ({
        ...p,
        x: Math.min(
          p.x + gameConfig.movementSpeed,
          window.innerWidth / 2 + gameConfig.width / 2 - gameConfig.ball.radius
        )
      }));
    if (w)
      setPosition((p) => ({
        ...p,
        y: Math.max(
          p.y - gameConfig.movementSpeed,
          window.innerHeight / 2 -
            gameConfig.height / 2 +
            gameConfig.ball.radius
        )
      }));
    if (s)
      setPosition((p) => ({
        ...p,
        y: Math.min(
          p.y + gameConfig.movementSpeed,
          window.innerHeight / 2 +
            gameConfig.height / 2 -
            gameConfig.ball.radius
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
          text={`Players: ${players.length + 1}`}
          x={10}
          y={30}
          fill="white"
        />

        <Group
          x={window.innerWidth / 2 - position.x}
          y={window.innerHeight / 2 - position.y}
        >
          <Group>
            <Rect
              x={window.innerWidth / 2 - gameConfig.width / 2}
              y={window.innerHeight / 2 - gameConfig.height / 2}
              width={gameConfig.width}
              height={gameConfig.height}
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
                radius={gameConfig.ball.radius}
                fill="white"
              />
              <Rect
                key="item"
                x={
                  position.x +
                  Math.cos((itemRotation * Math.PI) / 180) *
                    (gameConfig.ball.radius + gameConfig.item.width / 2)
                }
                y={
                  position.y +
                  Math.sin((itemRotation * Math.PI) / 180) *
                    (gameConfig.ball.radius + gameConfig.item.width / 2)
                }
                width={gameConfig.item.width}
                height={gameConfig.item.height}
                fill="red"
                offsetX={gameConfig.item.width / 2}
                offsetY={gameConfig.item.height / 2}
                rotation={itemRotation}
              />
            </Group>
          </Group>

          <Group>
            {players.map((player) => {
              const position = {
                x:
                  window.innerWidth / 2 -
                  gameConfig.width / 2 +
                  player.coordinates.x +
                  gameConfig.ball.radius,
                y:
                  window.innerHeight / 2 -
                  gameConfig.height / 2 +
                  player.coordinates.y +
                  gameConfig.ball.radius
              };

              return (
                <Group key={player.id}>
                  <Circle
                    x={position.x}
                    y={position.y}
                    radius={gameConfig.ball.radius}
                    fill={player.color || "#EC5454"}
                  />
                  <Rect
                    x={
                      position.x +
                      Math.cos(
                        (player.coordinates.itemRotation * Math.PI) / 180
                      ) *
                        (gameConfig.ball.radius + gameConfig.item.width / 2)
                    }
                    y={
                      position.y +
                      Math.sin(
                        (player.coordinates.itemRotation * Math.PI) / 180
                      ) *
                        (gameConfig.ball.radius + gameConfig.item.width / 2)
                    }
                    width={gameConfig.item.width}
                    height={gameConfig.item.height}
                    fill="red"
                    offsetX={gameConfig.item.width / 2}
                    offsetY={gameConfig.item.height / 2}
                    rotation={player.coordinates.itemRotation}
                  />
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
