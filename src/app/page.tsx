"use client";

import React from "react";
import GameCard from "@/components/GameCard";
import Header from "@/components/Header";

const games = [
  {
    id: 1,
    name: "Flappy Bird",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png",
    rating: 4,
    plays: 1023,
  },
  {
    id: 2,
    name: "2048",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/2048_logo.png",
    rating: 5,
    plays: 2045,
  },
  {
    id: 3,
    name: "Snake",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Snake_icon.png",
    rating: 4,
    plays: 876,
  },
  {
    id: 4,
    name: "Tetris",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Tetris_logo.png",
    rating: 5,
    plays: 1590,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            name={game.name}
            logo={game.logo}
            rating={game.rating}
            plays={game.plays}
          />
        ))}
      </main>
    </div>
  );
}
