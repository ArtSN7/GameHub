import { HEIGHT, NUM_SINKS, WIDTH, obstacleRadius, sinkWidth } from "./constants";
import { pad } from "./padding";

export interface Obstacle {
  x: number;
  y: number;
  radius: number;
}

export interface Sink {
  x: number;
  y: number;
  width: number;
  height: number;
  multiplier?: number;
}

const MULTIPLIERS: { [key: number]: number } = {
  1: 1000, 2: 130, 3: 26, 4: 9, 5: 4, 6: 2,
  7: 0.2, 8: 0.2, 9: 0.2, 10: 0.2, 11: 0.2,
  12: 2, 13: 4, 14: 9, 15: 26, 16: 130, 17: 1000
};

export const createObstacles = (): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const rows = 16;
  const gridWidth = 544; // Match the total width of the sinks (17 sinks * 32px)
  const startX = (WIDTH - gridWidth) / 2; // Center the grid
  const spacing = gridWidth / (rows + 2); // Spacing based on the widest row (18 pegs)

  for (let row = 0; row < rows; row++) {
    const numObstacles = row + 3; // Start with 3 pegs, increase to 18
    const y = 80 + row * (HEIGHT - 200) / rows; // Distribute pegs vertically, leave space at top and bottom
    const rowWidth = spacing * (numObstacles - 1); // Width of this row
    const rowStartX = (WIDTH - rowWidth) / 2; // Center each row
    for (let col = 0; col < numObstacles; col++) {
      const x = rowStartX + col * spacing;

      obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius });
    }
  }
  return obstacles;
};

export const createSinks = (): Sink[] => {
  const sinks = [];
  const gridWidth = 544; // 17 sinks * 32px
  const startX = (WIDTH - gridWidth) / 2; // Center the sinks under the grid
  const sinkWidthAdjusted = gridWidth / NUM_SINKS; // Should be 32px
  const y = HEIGHT - 40; // Position sinks at the bottom

  for (let i = 0; i < NUM_SINKS; i++) {
    const x = startX + sinkWidthAdjusted * i;
    const width = sinkWidthAdjusted;
    const height = width; // Square sinks
    sinks.push({ x, y, width, height, multiplier: MULTIPLIERS[i + 1] });
  }

  return sinks;
};