import { pad } from "./padding";

export const WIDTH = 800;
export const HEIGHT = 800;
export const ballRadius = 7;
export const obstacleRadius = 4;

export const gravity = pad(0.6);
export const horizontalFriction = 0.4;
export const verticalFriction = 0.8;

export const sinkWidth = 32;
export const NUM_SINKS = 17;

export const MULTIPLIERS: {[ key: number ]: number} = {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.4,
    5: 1.2,
    6: 1.1,
    7: 1,
    8: 0.5,
    9: 1,
    10: 1.1,
    11: 1.2,
    12: 1.4,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16
}

export const gridWidth = 590;