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
    0: 20,
    1: 16,
    2: 4,
    3: 2,
    4: 1.5,
    5: 1,
    6: 0.8,
    7: 0.5,
    8: 0,
    9: 0.5,
    10: 0.8,
    11: 1,
    12: 1.5,
    13: 2,
    14: 4,
    15: 16,
    16: 20
}

export const gridWidth = 590;