"use client";
import React, { useEffect, useState, useRef } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };

interface Food {
  x: number;
  y: number;
  type: "small" | "big";
}

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState<Food>({ x: 10, y: 10, type: "small" });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);

  const randomFood = (): Food => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
    type: Math.random() < 0.8 ? "small" : "big",
  });

  // Game loop
  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setIsGameOver(true);
          setIsRunning(false);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check if eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(randomFood());
          setScore((s) => s + (food.type === "small" ? 1 : 5));
          // không pop => dài ra
          return newSnake;
        } else {
          newSnake.pop(); // di chuyển bình thường
          return newSnake;
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isRunning]);
  useEffect(() => {
  if (isGameOver) {
    const current = parseInt(localStorage.getItem("userPoints") || "0");
    const newTotal = current + score;
    localStorage.setItem("userPoints", newTotal.toString());
  }
}, [isGameOver]);

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();

      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case " ":
          setIsRunning((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(randomFood());
    setIsGameOver(false);
    setScore(0);
    setIsRunning(true);
  };

  const togglePause = () => setIsRunning((prev) => !prev);

  // Rotation logic cho đầu và đuôi
  const getRotation = (part: { x: number; y: number }, next?: any) => {
    if (!next) return "rotate(0deg)";
    const dx = part.x - next.x;
    const dy = part.y - next.y;
    if (dx === 1) return "rotate(90deg)";
    if (dx === -1) return "rotate(-90deg)";
    if (dy === 1) return "rotate(180deg)";
    return "rotate(0deg)";
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-green-50 to-emerald-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-2 text-green-700">🐍 Snake Game</h2>
      <p className="text-sm text-gray-700 mb-3">
        Điểm: <span className="font-semibold text-green-600">{score}</span>
      </p>

      <div
        ref={boardRef}
        className="relative border-2 border-green-700 bg-gradient-to-b from-green-100 to-green-200 rounded-lg shadow-inner"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Snake */}
        {snake.map((seg, index) => {
  const isHead = index === 0;
  const isTail = index === snake.length - 1;

  let imgSrc = "/thanran.png"; // thân
  let rotation = "rotate(0deg)";
  let size = CELL_SIZE; // mặc định = đầu

  if (isHead) {
    imgSrc =
      "https://png.pngtree.com/png-vector/20240612/ourmid/pngtree-head-cobra-with-fangs-outline-design-png-image_12698413.png"; // đầu
    rotation = getRotation(seg, snake[1]);
    size = CELL_SIZE; // đầu giữ nguyên
  } else if (isTail) {
    imgSrc = "/duoi.png"; // đuôi
    rotation = getRotation(snake[index - 1], seg);
    size = CELL_SIZE * 0.3; // đuôi nhỏ hơn
  } else {
    imgSrc = "/thanran.png"; // thân
    size = CELL_SIZE * 0.4; // thân hơi nhỏ hơn
  }

  return (
    <img
      key={index}
      src={imgSrc}
      alt={isHead ? "snake-head" : isTail ? "snake-tail" : "snake-body"}
      style={{
        position: "absolute",
        left: seg.x * CELL_SIZE + (CELL_SIZE - size) / 2,
        top: seg.y * CELL_SIZE + (CELL_SIZE - size) / 2,
        width: size,
        height: size,
        transform: rotation,
        transition: "all 0.1s linear",
      }}
    />
  );
})}


        {/* Food */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
          alt="coin"
          className="absolute"
          style={{
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            width: food.type === "small" ? CELL_SIZE - 6 : CELL_SIZE - 2,
            height: food.type === "small" ? CELL_SIZE - 6 : CELL_SIZE - 2,
            filter: "drop-shadow(0 0 4px gold)",
          }}
        />
      </div>

      <div className="mt-5 flex gap-3">
        {!isRunning && !isGameOver && (
          <button
            onClick={startGame}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow"
          >
            ▶️ Bắt đầu chơi
          </button>
        )}
        {isRunning && (
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow"
          >
            ⏸ Tạm dừng
          </button>
        )}
        {isGameOver && (
          <button
            onClick={startGame}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
          >
            🔁 Chơi lại
          </button>
        )}
      </div>

      {isGameOver && (
        <p className="mt-3 text-red-500 font-semibold animate-pulse">
          💀 Game Over!
        </p>
      )}
    </div>
  );
}
