export const GAME_CONFIG = {
  debug: {
    laser: false,
    collision: false,
    arrow: false,
    preventCollision: false
  },

  width: 700,
  height: 700,
  backgroundColor: "#000000",
  movementSpeed: 5,
  arrowSpeed: 1500,
  cooldown: 500,

  arrowTravelDistance: 1000,

  // ball
  ball: {
    radius: 30,
    color: "#ffffff"
  },

  // item
  items: {
    bow: {
      width: 15,
      height: 50,
      color: "#ffffff"
    },
    shield: {
      width: 30,
      height: 50,
      color: "#ffffff"
    }
  },

  laser: {
    active: false,
    width: 1000,
    height: 3,
    color: "#ffffff",
    opacity: 0.3
  }
};
