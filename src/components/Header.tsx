"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-white shadow-md rounded-b-lg">
      <div
        className="text-2xl font-bold text-red-500 mb-2 md:mb-0 cursor-pointer"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        LVS GAMES
      </div>
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <input
          type="text"
          placeholder="Search a game"
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-300 focus:outline-none transition w-full md:w-auto"
        />
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
          Games
        </button>
        <button className="px-4 py-2 bg-orange-400 text-white rounded-lg shadow hover:bg-orange-500 transition">
          Hot
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
          Multiplayer
        </button>
        <button className="px-4 py-2 bg-yellow-400 text-white rounded-lg shadow hover:bg-yellow-500 transition">
          GAME PASS
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          onClick={() => {
            window.location.href = "/wallet";
          }}
        >
          Ví
        </button>
        <button className="px-4 py-2 bg-green-400 text-white rounded-lg shadow hover:bg-green-500 transition">
          Login
        </button>
      </div>
    </header>
  );
}
