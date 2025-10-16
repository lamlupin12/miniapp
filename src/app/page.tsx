"use client";

import React from "react";
import GameCard from "@/components/GameCard";
import Header from "@/components/Header";
import { mostAddictingGames, newGames } from "@/data/games";

const categories = ["Clicker", "Puzzle", "Action", "Shooting", "Zombie"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <Header />

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 px-6 py-4 mt-4">
        {categories.map((cat) => (
          <div
            key={cat}
            className="flex-shrink-0 px-5 py-2 bg-red-100 text-red-600 font-medium rounded-full cursor-pointer hover:bg-red-200 transition"
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Most Addicting Games */}
      <section className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">MOST LVS GAMES</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {mostAddictingGames.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              name={game.name}
              logo={game.logo}
              rating={5}
              plays={1000}
            />
          ))}
        </div>
      </section>

      {/* New Games */}
      <section className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">NEW GAMES</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {newGames.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              name={game.name}
              logo={game.logo}
              rating={5}
              plays={1000}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
