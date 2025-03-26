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
    1: 8,
    2: 4,
    3: 2,
    4: 1.5,
    5: 1,
    6: 0.5,
    7: 0.2,
    8: 0.1,
    9: 0.2,
    10: 0.5,
    11: 1,
    12: 1.5,
    13: 2,
    14: 4,
    15: 8,
    16: 16
}

export const gridWidth = 590;