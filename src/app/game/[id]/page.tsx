"use client";

import FlappyBird from "@/components/FlapyBirth/FlappyBird";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import { useRouter, useParams } from "next/navigation";
import { mostAddictingGames, newGames } from "@/data/games";
import SnakeGame from "@/components/Snacks/SnakeGame";
import AngryBirdReact from "@/components/AngryBirds/AngryBirdsGame";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const allGames = [...mostAddictingGames, ...newGames];
  const currentGame = allGames.find((g) => g.id.toString() === id);
  const similarGames = allGames
    .filter((g) => g.id.toString() !== id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Game area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-xl font-bold mb-3 text-gray-800">
            🎮 {currentGame?.name || "Game đang chơi"}
          </h2>

          <div className="flex flex-col items-center">
            {currentGame?.name === "Flappy Birds" ? (
              <FlappyBird />
            ) : currentGame?.name === "Snacks" ? (
              <SnakeGame />
            ) : currentGame?.name === "Angry Birds" ? (
              <AngryBirdReact />
            ) : (
              <img
                src={currentGame?.logo}
                alt={currentGame?.name}
                className="w-full max-w-lg rounded-xl border border-gray-200"
              />
            )}
          </div>
        </div>

        {/* RIGHT: Similar games */}
        {currentGame?.name !== "Angry Birds" && (
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              🕹 Game tương tự
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {similarGames.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  name={game.name}
                  logo={game.logo}
                  rating={4}
                  plays={500}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* REVIEW SECTION */}
      {currentGame?.name !== "Angry Birds" && (
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <div className="bg-white rounded-2xl shadow-md p-5 mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              💬 Đánh giá của người chơi
            </h2>
            <div className="space-y-4">
              {[
                {
                  user: "Người chơi 1",
                  comment: "Game rất thú vị, khó nhưng gây nghiện!",
                },
                {
                  user: "Người chơi 2",
                  comment: "Đồ họa đơn giản nhưng gameplay hấp dẫn.",
                },
                {
                  user: "Người chơi 3",
                  comment: "Thích hợp để giải trí nhanh sau giờ học.",
                },
              ].map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-b border-gray-100 pb-3"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${r.user}`}
                    alt={r.user}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{r.user}</p>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
