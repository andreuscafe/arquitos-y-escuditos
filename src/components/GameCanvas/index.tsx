"use client";

import useFrameloop from "@/lib/hooks/useFrameloop";
import useSocket from "@/lib/hooks/useSocket";
import { useWASD } from "@/lib/hooks/useWASD";
import useStore from "@/lib/store";
import React, { useMemo, useState } from "react";

import { Stage, Layer, Circle, Group, Rect, Text } from "react-konva";

const gameConfig = {
  width: 500,
  height: 500,
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
  },

  laser: {
    active: true,
    width: 1000,
    height: 3,
    color: "#ffffff",
    opacity: 0.3
  }
};

interface GameCanvasProps {
  players: Player[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ players }) => {
  const { a, s, d, w } = useWASD();
  const { emitCoordinates } = useSocket();

  const { setPlayer } = useStore.getState();

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

    // setPlayer({ ...useStore.getState().player, coordinates });
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
                fill={useStore.getState().player.color || "#FFFFFF"}
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

              {/* laser */}
              {gameConfig.laser.active && (
                <Rect
                  key="playerLaser"
                  x={
                    position.x +
                    Math.cos((itemRotation * Math.PI) / 180) *
                      (gameConfig.ball.radius + gameConfig.laser.width / 2)
                  }
                  y={
                    position.y +
                    Math.sin((itemRotation * Math.PI) / 180) *
                      (gameConfig.ball.radius + gameConfig.laser.width / 2)
                  }
                  width={gameConfig.laser.width}
                  height={gameConfig.laser.height}
                  fill={gameConfig.laser.color}
                  opacity={gameConfig.laser.opacity}
                  offsetX={gameConfig.laser.width / 2}
                  offsetY={gameConfig.laser.height / 2}
                  rotation={itemRotation}
                />
              )}
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
                    key={`ball_${player.id}`}
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

                  {gameConfig.laser.active && (
                    <Rect
                      key={`laser_${player.id}`}
                      x={
                        position.x +
                        Math.cos(
                          (player.coordinates.itemRotation * Math.PI) / 180
                        ) *
                          (gameConfig.ball.radius + gameConfig.laser.width / 2)
                      }
                      y={
                        position.y +
                        Math.sin(
                          (player.coordinates.itemRotation * Math.PI) / 180
                        ) *
                          (gameConfig.ball.radius + gameConfig.laser.width / 2)
                      }
                      width={gameConfig.laser.width}
                      height={gameConfig.laser.height}
                      fill={gameConfig.laser.color}
                      opacity={gameConfig.laser.opacity}
                      offsetX={gameConfig.laser.width / 2}
                      offsetY={gameConfig.laser.height / 2}
                      rotation={player.coordinates.itemRotation}
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
