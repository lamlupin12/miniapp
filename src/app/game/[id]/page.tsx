"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Game ID: {id}</h1>
      <p className="mb-6">Đây là trang game, bạn có thể chèn miniapp game ở đây.</p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}
