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
      className="bg-white rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
      onClick={() => router.push(`/games/${id}`)}
    >
      <img src={logo} alt={name} className="w-full h-40 object-cover rounded-t-lg" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <div className="text-yellow-500 mb-1">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
        <div className="text-gray-600 text-sm">{plays} lượt chơi</div>
      </div>
    </div>
  );
};

export default GameCard;
