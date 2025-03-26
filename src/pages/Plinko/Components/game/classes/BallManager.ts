import { HEIGHT, MULTIPLIERS, WIDTH, ballRadius, obstacleRadius, sinkWidth } from "../constants";
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
    this.scale = canvasRef.width / WIDTH / (window.devicePixelRatio || 1);
    this.obstacles = createObstacles();
    this.sinks = createSinks();
    this.onFinish = onFinish;
  }

  addBall(startX?: number) {
    const x = startX || pad(WIDTH / 2);
    const minX = pad(128);
    const maxX = pad(672);
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
    if (multiplier == MULTIPLIERS[0]) return { background: "#b91c1c", color: "white" };    // 16x
    if (multiplier == MULTIPLIERS[1]) return { background: "#dc2626", color: "white" };    // 8x
    if (multiplier == MULTIPLIERS[2]) return { background: "#ea580c", color: "white" };    // 4x
    if (multiplier == MULTIPLIERS[3]) return { background: "#f97316", color: "white" };    // 2x
    if (multiplier == MULTIPLIERS[4]) return { background: "#fbbf24", color: "black" };    // 1.5x
    if (multiplier == MULTIPLIERS[5]) return { background: "#fcd34d", color: "black" };    // 1x
    if (multiplier == MULTIPLIERS[6]) return { background: "#fef08a", color: "black" };    // 0.5x
    if (multiplier == MULTIPLIERS[7]) return { background: "#fff7b3", color: "black" };    // 0.2x
    return { background: "#e2e8f0", color: "#333333" }; // 0.1x
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

      // Calculate font size based on sink width
      const sinkWidthScaled = sink.width * this.scale;
      const maxFontSize = sinkWidthScaled * 0.5; // Font size should be ~50% of sink width for readability
      const minFontSize = 6; // Minimum font size to ensure readability
      let fontSize = Math.min(maxFontSize, Math.max(minFontSize, 10 * this.scale)); // Base font size scaled, but constrained

      this.ctx.fillStyle = color;
      this.ctx.font = `bold ${fontSize}px Arial`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // Ensure text fits within the sink
      let text = `${sink?.multiplier || 0}x`;
      let textWidth = this.ctx.measureText(text).width;
      const maxTextWidth = sinkWidthScaled * 0.8; // Allow text to take up 80% of sink width

      // Adjust font size if text is too wide
      while (textWidth > maxTextWidth && fontSize > minFontSize) {
        fontSize -= 1;
        this.ctx.font = `bold ${fontSize}px Arial`;
        textWidth = this.ctx.measureText(text).width;
      }

      // If text still doesn't fit, remove the "x" for very small sinks
      if (textWidth > maxTextWidth) {
        text = `${sink?.multiplier || 0}`; // Remove the "x"
        this.ctx.font = `bold ${fontSize}px Arial`;
        textWidth = this.ctx.measureText(text).width;
        // One final adjustment if still too wide
        while (textWidth > maxTextWidth && fontSize > minFontSize) {
          fontSize -= 1;
          this.ctx.font = `bold ${fontSize}px Arial`;
          textWidth = this.ctx.measureText(text).width;
        }
      }

      this.ctx.fillText(
        text,
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