import { gravity, horizontalFriction, verticalFriction, HEIGHT } from "../constants";
import { Obstacle, Sink } from "../objects";
import { pad, unpad } from "../padding";

export class Ball {
  private x: number;
  private y: number;
  private radius: number;
  private color: string;
  private vx: number;
  private vy: number;
  private ctx: CanvasRenderingContext2D;
  private obstacles: Obstacle[];
  private sinks: Sink[];
  private onFinish: (index: number) => void;
  private scale: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    obstacles: Obstacle[],
    sinks: Sink[],
    onFinish: (index: number) => void,
    scale: number
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
    this.ctx = ctx;
    this.obstacles = obstacles;
    this.sinks = sinks;
    this.onFinish = onFinish;
    this.scale = scale;
  }

  draw() {
    const x = unpad(this.x) * this.scale;
    const y = unpad(this.y) * this.scale;
    const r = this.radius * this.scale;

    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fillStyle = "#dc2626";
    this.ctx.fill();
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    this.ctx.shadowBlur = 4;
    this.ctx.fill();
    this.ctx.shadowColor = "transparent";
    this.ctx.shadowBlur = 0;
    this.ctx.closePath();
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    this.obstacles.forEach((obstacle) => {
      const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
      if (dist < pad(this.radius + obstacle.radius)) {
        const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.vx = Math.cos(angle) * speed * horizontalFriction;
        this.vy = Math.sin(angle) * speed * verticalFriction;
        const overlap = this.radius + obstacle.radius - unpad(dist);
        const pushX = Math.cos(angle) * overlap;
        const pushY = Math.sin(angle) * overlap;
        const nudge = Math.random() * 2 - 1;
        this.x += pad(pushX + nudge);
        this.y += pad(pushY);
        if (this.vy < 0 && Math.abs(this.vy) < gravity) {
          this.vy = gravity * 0.5;
        }
      }
    });

    for (let i = 0; i < this.sinks.length; i++) {
      const sink = this.sinks[i];
      if (
        unpad(this.x) * this.scale > sink.x * this.scale &&
        unpad(this.x) * this.scale < (sink.x + sink.width) * this.scale &&
        unpad(this.y) * this.scale + this.radius * this.scale > sink.y * this.scale - (sink.height * this.scale) / 2
      ) {
        this.vx = 0;
        this.vy = 0;
        this.onFinish(i);
        break;
      }
    }

    const leftWall = 128; // Logical grid bounds
    const rightWall = 672;
    if (unpad(this.x) < leftWall) {
      this.x = pad(leftWall);
      this.vx = Math.abs(this.vx) * horizontalFriction;
    }
    if (unpad(this.x) > rightWall) {
      this.x = pad(rightWall);
      this.vx = -Math.abs(this.vx) * horizontalFriction;
    }
    if (unpad(this.y) > HEIGHT - this.radius) {
      this.y = pad(HEIGHT - this.radius);
      this.vy = 0;
    }
  }
}