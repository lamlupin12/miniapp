"use client";
import { useEffect, useRef, useState } from "react";

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isFlying: boolean;
}

export default function AngryBirdReact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bird, setBird] = useState<Bird>({ x: 100, y: 400, vx: 0, vy: 0, isFlying: false });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const gravity = 0.4;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      // Draw bird
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      // Update position if flying
      if (bird.isFlying) {
        setBird((prev) => ({
          ...prev,
          x: prev.x + prev.vx,
          y: prev.y + prev.vy,
          vy: prev.vy + gravity,
        }));
      }

      // Stop when hitting the ground
      if (bird.y > canvas.height - 65) {
        setBird((prev) => ({ ...prev, isFlying: false, vy: 0 }));
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrame);
  }, [bird]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStart) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const dx = dragStart.x - endX;
    const dy = dragStart.y - endY;

    setBird((prev) => ({
      ...prev,
      vx: dx * 0.2,
      vy: dy * 0.2,
      isFlying: true,
    }));
    setDragStart(null);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-2">Angry Bird React Edition 🐥</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ border: "2px solid #000", background: "#AEE2FF", cursor: "crosshair" }}
      />
    </div>
  );
}
