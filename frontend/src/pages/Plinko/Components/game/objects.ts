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
  const gap = 4; // Space between sinks
  const totalGapsWidth = gap * (NUM_SINKS - 1);
  const availableWidth = gridWidth - totalGapsWidth;
  const minSinkWidth = 28; // Increased to 28px to give more room for text
  let sinkWidthAdjusted = availableWidth / NUM_SINKS;

  if (sinkWidthAdjusted < minSinkWidth) {
    sinkWidthAdjusted = minSinkWidth;
  }

  const totalSinksWidth = sinkWidthAdjusted * NUM_SINKS;
  const totalWidthWithGaps = totalSinksWidth + totalGapsWidth;
  const startX = (WIDTH - totalWidthWithGaps) / 2;
  const y = HEIGHT - 140;

  for (let i = 0; i < NUM_SINKS; i++) {
    const x = startX + (sinkWidthAdjusted + gap) * i;
    const width = sinkWidthAdjusted;
    const height = width;
    sinks.push({ x, y, width, height, multiplier: MULTIPLIERS[i] });
  }

  return sinks;
};