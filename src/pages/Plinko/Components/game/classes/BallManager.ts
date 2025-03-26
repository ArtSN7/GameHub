import { HEIGHT, WIDTH, ballRadius, obstacleRadius, sinkWidth } from "../constants";
import { Obstacle, Sink, createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "./Ball";

export class BallManager {
  private balls: Ball[];
  private canvasRef: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private obstacles: Obstacle[];
  public sinks: Sink[];
  private onFinish?: (index: number, startX?: number) => void;
  private scale: number;

  constructor(canvasRef: HTMLCanvasElement, onFinish?: (index: number, startX?: number) => void) {
    this.balls = [];
    this.canvasRef = canvasRef;
    this.ctx = this.canvasRef.getContext("2d")!;
    if (!this.ctx) throw new Error("Failed to get canvas context");
    this.scale = canvasRef.width / WIDTH / (window.devicePixelRatio || 1); // Scale based on actual canvas width
    this.obstacles = createObstacles();
    this.sinks = createSinks();
    this.onFinish = onFinish;
  }

  addBall(startX?: number) {
    const x = startX || pad(WIDTH / 2);
    const minX = pad(128); // Adjusted bounds to match grid (800 - 544) / 2 = 128
    const maxX = pad(672); // 128 + 544
    if (x < minX || x > maxX) {
      console.warn("startX out of bounds:", x);
      return;
    }
    const newBall = new Ball(
      x,
      pad(50),
      ballRadius,
      "red",
      this.ctx,
      this.obstacles,
      this.sinks,
      (index) => {
        this.balls = this.balls.filter(ball => ball !== newBall);
        this.onFinish?.(index, x);
      },
      this.scale
    );
    this.balls.push(newBall);
  }

  getBallCount() {
    return this.balls.length;
  }

  drawObstacles() {
    this.obstacles.forEach((obstacle) => {
      this.ctx.beginPath();
      this.ctx.arc(
        unpad(obstacle.x) * this.scale,
        unpad(obstacle.y) * this.scale,
        obstacle.radius * this.scale,
        0,
        Math.PI * 2
      );
      this.ctx.fillStyle = "#64748b";
      this.ctx.fill();
      this.ctx.closePath();
    });
  }

  getColor(index: number) {
    const multiplier = this.sinks[index]?.multiplier || 0;
    if (multiplier >= 16) return { background: "#b91c1c", color: "white" };    // Deep red
    if (multiplier >= 9) return { background: "#dc2626", color: "white" };     // Bright red
    if (multiplier >= 2) return { background: "#ea580c", color: "white" };     // Vibrant orange
    if (multiplier >= 1.4) return { background: "#f97316", color: "white" };   // Warm orange
    if (multiplier >= 1.2) return { background: "#fbbf24", color: "black" };   // Amber
    if (multiplier >= 1.1) return { background: "#fcd34d", color: "black" };   // Soft yellow
    if (multiplier >= 1) return { background: "#fef08a", color: "black" };     // Light yellow
    return { background: "#e2e8f0", color: "#333333" };
  }

  drawSinks() {
    for (let i = 0; i < this.sinks.length; i++) {
      const sink = this.sinks[i];
      const { background, color } = this.getColor(i);
      this.ctx.fillStyle = background;
      this.ctx.beginPath();
      this.ctx.roundRect(
        sink.x * this.scale,
        sink.y * this.scale - (sink.height * this.scale) / 2,
        sink.width * this.scale,
        sink.height * this.scale,
        4 * this.scale
      );
      this.ctx.fill();
      this.ctx.fillStyle = color;
      this.ctx.font = `bold ${Math.max(10, 12 * this.scale)}px Arial`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(
        `${sink?.multiplier || 0}x`,
        sink.x * this.scale + (sink.width * this.scale) / 2,
        sink.y * this.scale
      );
    }
  }

  draw() {
    this.ctx.fillStyle = "#f1f5f9";
    this.ctx.fillRect(0, 0, this.canvasRef.width, this.canvasRef.height);
    this.drawObstacles();
    this.drawSinks();
    this.balls.forEach((ball) => {
      try {
        ball.draw();
        ball.update();
      } catch (error) {
        console.error("Error updating ball:", error);
      }
    });
  }

  stop() {
    console.log("BallManager stop called");
  }
}