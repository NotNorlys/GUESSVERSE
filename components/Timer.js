"use client";
import { useEffect, useState } from "react";

export default function Timer({ duration = 12, resetKey, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const id = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, onExpire]);

  const percent = Math.max(0, (timeLeft / duration) * 100);

  return (
    <div className="mt16">
      <div className="badgeRow">
        <div className="chip">⏱️ {timeLeft}s</div>
      </div>
      <div
        style={{
          height: 10,
          background: "#0b1220",
          borderRadius: 999,
          overflow: "hidden",
          marginTop: 10,
          border: "1px solid rgba(255,255,255,.08)"
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: "linear-gradient(135deg, #22c55e, #f59e0b, #ef4444)",
            transition: "width .9s linear"
          }}
        />
      </div>
    </div>
  );
}