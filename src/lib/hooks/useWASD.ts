import { useState, useEffect } from "react";

export const useWASD = () => {
  const [keysPressed, setKeysPressed] = useState({
    w: false,
    a: false,
    s: false,
    d: false
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
        case "W":
        case "ArrowUp":
          setKeysPressed((prevState) => ({ ...prevState, w: true }));
          break;

        case "a":
        case "A":
        case "ArrowLeft":
          setKeysPressed((prevState) => ({ ...prevState, a: true }));
          break;

        case "s":
        case "S":
        case "ArrowDown":
          setKeysPressed((prevState) => ({ ...prevState, s: true }));
          break;

        case "d":
        case "D":
        case "ArrowRight":
          setKeysPressed((prevState) => ({ ...prevState, d: true }));
          break;

        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
        case "W":
        case "ArrowUp":
          setKeysPressed((prevState) => ({ ...prevState, w: false }));
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          setKeysPressed((prevState) => ({ ...prevState, a: false }));
          break;
        case "s":
        case "S":
        case "ArrowDown":
          setKeysPressed((prevState) => ({ ...prevState, s: false }));
          break;
        case "d":
        case "D":
        case "ArrowRight":
          setKeysPressed((prevState) => ({ ...prevState, d: false }));
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keysPressed;
};
