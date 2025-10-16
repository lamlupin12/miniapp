"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  gap: number;
  passed: boolean;
}

// Responsive canvas dimensions for mobile
const getCanvasDimensions = () => {
  if (typeof window !== "undefined") {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? Math.min(window.innerWidth - 20, 350) : 400,
      height: isMobile ? Math.min(window.innerHeight * 0.7, 600) : 600,
    };
  }
  return { width: 350, height: 500 };
};

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasDimensions();
const BIRD_SIZE = 28;
const PIPE_WIDTH = 50;
const PIPE_GAP = 140;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -9;
const PIPE_SPEED = 3.5;
const PIPE_FREQUENCY = 85;

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">(
    "start"
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 350, height: 500 });

  const birdRef = useRef<Bird>({
    x: 80,
    y: canvasSize.height / 2,
    velocity: 0,
  });
  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; life: number }>
  >([]);

  // Initialize mobile detection and canvas size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const newSize = mobile
        ? {
            width: Math.min(window.innerWidth - 20, 350),
            height: Math.min(window.innerHeight * 0.7, 600),
          }
        : { width: 400, height: 600 };
      setCanvasSize(newSize);
      birdRef.current = { x: 80, y: newSize.height / 2, velocity: 0 };
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const resetGame = useCallback(() => {
    birdRef.current = { x: 80, y: canvasSize.height / 2, velocity: 0 };
    pipesRef.current = [];
    frameCountRef.current = 0;
    particlesRef.current = [];
    setScore(0);
  }, [canvasSize.height]);

  const jump = useCallback(() => {
    if (gameState === "start") {
      setGameState("playing");
      birdRef.current.velocity = JUMP_STRENGTH;
    } else if (gameState === "playing") {
      birdRef.current.velocity = JUMP_STRENGTH;
    } else if (gameState === "gameover") {
      resetGame();
      setGameState("playing");
      birdRef.current.velocity = JUMP_STRENGTH;
    }
  }, [gameState, resetGame]);

  const createParticles = useCallback((x: number, y: number) => {
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x: x + BIRD_SIZE / 2,
        y: y + BIRD_SIZE / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
      });
    }
  }, []);

  const checkCollision = useCallback(
    (bird: Bird, pipes: Pipe[]): boolean => {
      if (bird.y + BIRD_SIZE >= canvasSize.height || bird.y <= 0) return true;
      for (const pipe of pipes) {
        if (bird.x + BIRD_SIZE > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
          if (
            bird.y < pipe.topHeight ||
            bird.y + BIRD_SIZE > pipe.topHeight + pipe.gap
          ) {
            return true;
          }
        }
      }
      return false;
    },
    [canvasSize.height]
  );

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(0.7, "#98D8E8");
    gradient.addColorStop(1, "#B0E0E6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    const cloudOffset =
      (frameCountRef.current * 0.5) % (canvasSize.width + 100);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(cloudOffset - 50, 80, 30, 0, Math.PI * 2);
    ctx.arc(cloudOffset - 30, 80, 35, 0, Math.PI * 2);
    ctx.arc(cloudOffset - 10, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cloudOffset + 150, 120, 25, 0, Math.PI * 2);
    ctx.arc(cloudOffset + 170, 120, 30, 0, Math.PI * 2);
    ctx.arc(cloudOffset + 190, 120, 25, 0, Math.PI * 2);
    ctx.fill();

    if (gameState === "playing") {
      const bird = birdRef.current;
      bird.velocity += GRAVITY;
      bird.y += bird.velocity;

      frameCountRef.current++;
      if (frameCountRef.current % PIPE_FREQUENCY === 0) {
        const minHeight = 50;
        const maxHeight = canvasSize.height - PIPE_GAP - 50;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        pipesRef.current.push({
          x: canvasSize.width,
          topHeight,
          gap: PIPE_GAP,
          passed: false,
        });
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life--;
        return p.life > 0;
      });

      pipesRef.current = pipesRef.current.filter((pipe) => {
        pipe.x -= PIPE_SPEED;

        // ✅ Khi vượt qua ống => cộng điểm + lưu localStorage
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true;
          setScore((s) => {
            const newScore = s + 1;
            // Cộng điểm vào localStorage
            const storedPoints = parseInt(localStorage.getItem("userPoints") || "0", 10);
            const newTotal = storedPoints + 1;
            localStorage.setItem("userPoints", newTotal.toString());
            return newScore;
          });
        }

        return pipe.x > -PIPE_WIDTH;
      });

      if (checkCollision(bird, pipesRef.current)) {
        createParticles(bird.x, bird.y);
        setGameState("gameover");
        setHighScore((prev) => Math.max(prev, score));
      }
    }

    pipesRef.current.forEach((pipe) => {
      ctx.fillStyle = "#5CB85C";
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeStyle = "#4A934A";
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
      ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);

      const bottomPipeY = pipe.topHeight + pipe.gap;
      ctx.fillStyle = "#5CB85C";
      ctx.fillRect(pipe.x, bottomPipeY, PIPE_WIDTH, canvasSize.height - bottomPipeY);
      ctx.strokeStyle = "#4A934A";
      ctx.strokeRect(pipe.x, bottomPipeY, PIPE_WIDTH, canvasSize.height - bottomPipeY);

      ctx.fillRect(pipe.x - 5, bottomPipeY, PIPE_WIDTH + 10, 20);
      ctx.strokeRect(pipe.x - 5, bottomPipeY, PIPE_WIDTH + 10, 20);
    });

    particlesRef.current.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life / 30;
      ctx.fillStyle = "#FF6B6B";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    const bird = birdRef.current;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.arc(bird.x + BIRD_SIZE / 2 + 2, bird.y + BIRD_SIZE / 2 + 2, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    const birdGradient = ctx.createRadialGradient(
      bird.x + BIRD_SIZE / 2 - 5,
      bird.y + BIRD_SIZE / 2 - 5,
      0,
      bird.x + BIRD_SIZE / 2,
      bird.y + BIRD_SIZE / 2,
      BIRD_SIZE / 2
    );
    birdGradient.addColorStop(0, "#FFE55C");
    birdGradient.addColorStop(1, "#FFD700");
    ctx.fillStyle = birdGradient;
    ctx.beginPath();
    ctx.arc(bird.x + BIRD_SIZE / 2, bird.y + BIRD_SIZE / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFA500";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(bird.x + BIRD_SIZE / 2 + 5, bird.y + BIRD_SIZE / 2 - 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + BIRD_SIZE / 2 + 7, bird.y + BIRD_SIZE / 2 - 3, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FF6347";
    ctx.beginPath();
    ctx.moveTo(bird.x + BIRD_SIZE, bird.y + BIRD_SIZE / 2);
    ctx.lineTo(bird.x + BIRD_SIZE + 8, bird.y + BIRD_SIZE / 2 - 3);
    ctx.lineTo(bird.x + BIRD_SIZE + 8, bird.y + BIRD_SIZE / 2 + 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 4;
    ctx.font = isMobile ? "bold 32px Arial" : "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.strokeText(score.toString(), canvasSize.width / 2, isMobile ? 40 : 50);
    ctx.fillText(score.toString(), canvasSize.width / 2, isMobile ? 40 : 50);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, checkCollision]);

  useEffect(() => {
    gameLoop();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      jump();
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart, { passive: false });
      return () => window.removeEventListener("touchstart", handleTouchStart);
    }
  }, [jump, isMobile]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen p-4">
      <div className="text-center">
        <h1
          className={`${
            isMobile ? "text-4xl" : "text-5xl"
          } font-bold mb-2 text-yellow-400 drop-shadow-lg`}
        >
          Flappy Bird
        </h1>
        <p className={`${isMobile ? "text-base" : "text-lg"} text-gray-300`}>
          High Score: {highScore}
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={jump}
          className={`${
            isMobile ? "border-2" : "border-4"
          } border-yellow-400 rounded-lg shadow-2xl cursor-pointer touch-manipulation`}
          style={{ maxWidth: "100%", height: "auto" }}
        />

        {gameState === "start" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div
              className={`text-center text-white ${
                isMobile ? "p-4" : "p-8"
              } bg-black bg-opacity-70 rounded-xl mx-4`}
            >
              <h2
                className={`${
                  isMobile ? "text-2xl" : "text-3xl"
                } font-bold mb-4`}
              >
                Sẵn sàng chơi?
              </h2>
              <p className={`${isMobile ? "text-lg" : "text-xl"} mb-2`}>
                {isMobile
                  ? "Chạm màn hình để nhảy"
                  : "Click hoặc nhấn SPACE để nhảy"}
              </p>
              <p className={`${isMobile ? "text-xs" : "text-sm"} opacity-80`}>
                Tránh các ống!
              </p>
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-lg">
            <div
              className={`text-center text-white ${
                isMobile ? "p-4" : "p-8"
              } bg-red-600 bg-opacity-90 rounded-xl mx-4`}
            >
              <h2
                className={`${
                  isMobile ? "text-3xl" : "text-4xl"
                } font-bold mb-4`}
              >
                Game Over!
              </h2>
              <p className={`${isMobile ? "text-xl" : "text-2xl"} mb-2`}>
                Điểm: {score}
              </p>
              <p className={`${isMobile ? "text-lg" : "text-xl"} mb-4`}>
                Điểm cao nhất: {highScore}
              </p>
              <p className={`${isMobile ? "text-base" : "text-lg"}`}>
                {isMobile
                  ? "Chạm để chơi lại"
                  : "Click hoặc nhấn SPACE để chơi lại"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className={`text-center text-gray-300 ${
          isMobile ? "max-w-xs px-4" : "max-w-md"
        }`}
      >
        <h3
          className={`${isMobile ? "text-lg" : "text-xl"} font-semibold mb-2`}
        >
          Cách chơi
        </h3>
        <ul className={`${isMobile ? "text-xs" : "text-sm"} space-y-1`}>
          <li>
            🖱️ {isMobile ? "Chạm màn hình" : "Click hoặc nhấn SPACE"} để chim
            nhảy
          </li>
          <li>🚫 Tránh đụng vào ống hoặc đất</li>
          <li>⭐ Ghi điểm bằng cách bay qua ống</li>
          <li>🏆 Cố gắng phá kỷ lục!</li>
        </ul>
      </div>
    </div>
  );
}
