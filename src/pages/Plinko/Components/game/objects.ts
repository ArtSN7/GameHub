import { HEIGHT, NUM_SINKS, WIDTH, obstacleRadius, sinkWidth } from "./constants";
import { pad } from "./padding";
import { MULTIPLIERS, gridWidth } from "./constants";


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

export const createObstacles = (): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const rows = 16;
  const startX = (WIDTH - gridWidth) / 2; // Center the grid
  const spacing = gridWidth / (rows + 2); // Spacing based on the widest row (18 pegs)

  for (let row = 0; row < rows; row++) {
    const numObstacles = row + 3; // Start with 3 pegs, increase to 18
    const y = 40 + row * (HEIGHT - 200) / rows; // Distribute pegs vertically, leave space at top and bottom
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
  const sinks: Sink[] = [];
  const gap = 4; // Space between sinks (adjustable)
  const totalGapsWidth = gap * (NUM_SINKS - 1); // Total width of gaps
  const availableWidth = gridWidth - totalGapsWidth; // Width available for sinks
  const sinkWidthAdjusted = availableWidth / NUM_SINKS; // Dynamic sink width
  const startX = (WIDTH - gridWidth) / 2; // Center the sinks
  const y = HEIGHT - 140; // Position sinks at the bottom

  for (let i = 0; i < NUM_SINKS; i++) {
    const x = startX + (sinkWidthAdjusted + gap) * i; // Position with gap
    const width = sinkWidthAdjusted;
    const height = width - 10 ; // Square sinks
    sinks.push({ x, y, width, height, multiplier: MULTIPLIERS[i] });
  }

  return sinks;
};