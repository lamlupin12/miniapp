"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface GameCardProps {
  id: number;
  name: string;
  logo: string;
  rating: number;
  plays: number;
}

const GameCard: React.FC<GameCardProps> = ({ id, name, logo, rating, plays }) => {
  const router = useRouter();

  return (
    <div
      className="bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
      onClick={() => router.push(`/game/${id}`)}
    >
      <div className="overflow-hidden rounded-t-2xl">
        <img src={logo} alt={name} className="w-full h-50 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-800">{name}</h3>
        <div className="text-yellow-400 mb-1">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
        <div className="text-gray-500 text-sm">{plays.toLocaleString()} lượt chơi</div>
      </div>
    </div>
  );
};

export default GameCard;
