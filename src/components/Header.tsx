"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white flex items-center justify-between px-6 py-4">
      {/* Logo / Tên */}
      <Link href="/" className="text-2xl font-bold hover:text-gray-300">
        MiniApp Hub
      </Link>

      {/* Menu */}
      <nav className="space-x-4">
        <Link href="/" className="hover:text-gray-300">
          Trang chủ
        </Link>
        <Link href="/games" className="hover:text-gray-300">
          Games
        </Link>
      </nav>

      {/* Account */}
      <div>
        <button className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </div>
    </header>
  );
}
