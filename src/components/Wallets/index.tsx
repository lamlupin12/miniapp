"use client";

import React, { useEffect, useState } from "react";
import Header from "../Header";

export default function Wallet() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState(0);

  const exchangeRate = 1000; // 1000 điểm = 1 USD

  const history = [
    { id: 1, amount: 5000, usd: 5, status: "success", date: "2025-10-12 14:30" },
    { id: 2, amount: 2000, usd: 2, status: "pending", date: "2025-10-13 09:20" },
    { id: 3, amount: 1000, usd: 1, status: "failed", date: "2025-10-14 08:55" },
  ];

  const convertedUSD = withdrawAmount
    ? (parseFloat(withdrawAmount) / exchangeRate).toFixed(2)
    : "0.00";

  // 🔹 Lấy dữ liệu điểm từ localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem("userPoints");
    if (savedPoints) {
      setBalance(parseInt(savedPoints));
    }
  }, []);

  return (
    <>
      <Header />
      <div className="mt-4 bg-gray-50 min-h-screen flex flex-col items-center py-10 px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300">
          {/* Tổng số điểm */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              💰 Ví Game của bạn
            </h1>
            <p className="text-5xl font-extrabold text-blue-600 drop-shadow-sm">
              {balance.toLocaleString()}
              <span className="text-gray-500 text-lg font-medium ml-1">điểm</span>
            </p>
            <p className="text-gray-500 mt-1 text-sm">
              ≈ {(balance / exchangeRate).toFixed(2)} USD
            </p>
          </div>

          {/* Khung rút tiền */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow-inner mb-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Rút điểm
            </h2>

            <label className="block text-gray-600 text-sm mb-1">
              Nhập số điểm muốn rút
            </label>
            <input
              type="number"
              min="0"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="VD: 1000"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 transition-all"
            />

            <div className="mt-3 text-gray-600 text-sm">
              <span className="font-medium">Quy đổi:</span>{" "}
              <span className="text-blue-600 font-semibold">{convertedUSD} USD</span>{" "}
              (tỷ lệ: <strong>1000 điểm = 1 USD</strong>)
            </div>

            <button
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Rút ngay
            </button>
          </div>

          {/* Lịch sử rút tiền */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              📜 Lịch sử rút tiền
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Số điểm</th>
                    <th className="py-3 px-4 text-left font-semibold">USD</th>
                    <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
                    <th className="py-3 px-4 text-left font-semibold">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-200 hover:bg-blue-50 transition"
                    >
                      <td className="py-2 px-4">{item.amount.toLocaleString()}</td>
                      <td className="py-2 px-4">{item.usd.toFixed(2)}</td>
                      <td className="py-2 px-4 font-medium">
                        {item.status === "success" && (
                          <span className="text-green-600">Thành công</span>
                        )}
                        {item.status === "pending" && (
                          <span className="text-yellow-500">Đang xử lý</span>
                        )}
                        {item.status === "failed" && (
                          <span className="text-red-500">Thất bại</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-gray-500">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ghi chú nhỏ */}
        <p className="text-gray-400 text-sm mt-6 text-center">
          * Tỷ lệ quy đổi có thể thay đổi tùy theo sự kiện trong game.
        </p>
      </div>
    </>
  );
}
