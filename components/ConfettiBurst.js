"use client";

import { useEffect, useRef } from "react";

export default function ConfettiBurst({ onceKey = "default" }) {
  const fired = useRef(false);

  useEffect(() => {
    let interval;
    let container;

    function ensureStyles() {
      if (document.getElementById("confetti-styles")) return;

      const style = document.createElement("style");
      style.id = "confetti-styles";

      style.textContent = `
        .confetti-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 9999;
        }

        .confetti {
          position: absolute;
          top: -2vh;
          width: var(--w, 8px);
          height: var(--h, 12px);
          opacity: var(--op, 0.9);
          border-radius: var(--br, 2px);
          background: var(--color);

          animation:
            confetti-fall var(--dur, 2s) linear forwards;

          will-change: transform, opacity;
        }

        @keyframes confetti-fall {
          0% {
            transform:
              translate(var(--x0, 0), -6vh)
              rotate(var(--rz, 0deg));
          }

          100% {
            transform:
              translate(var(--x1, 0), 105vh)
              rotate(calc(var(--rz, 0deg) + var(--rot, 360deg)));
          }
        }
      `;

      document.head.appendChild(style);
    }

    function spawnConfettiPiece(container) {
      const colors = [
        "#ffd166",
        "#ef476f",
        "#06d6a0",
        "#118ab2",
        "#8338ec",
        "#ffbe0b",
      ];

      const piece = document.createElement("span");
      piece.className = "confetti";

      const startX = Math.random() * 100;
      const drift = (Math.random() * 2 - 1) * 35;
      const duration = 1.6 + Math.random() * 2.0;
      const rotation = 180 + Math.random() * 540;
      const opacity = 0.7 + Math.random() * 0.3;
      const width = 6 + Math.floor(Math.random() * 8);
      const height = 8 + Math.floor(Math.random() * 12);

      const rounded =
        Math.random() < 0.35
          ? `${width / 2}px`
          : "2px";

      piece.style.left = `${startX}vw`;

      piece.style.setProperty(
        "--color",
        colors[Math.floor(Math.random() * colors.length)]
      );

      piece.style.setProperty("--x0", "0vw");
      piece.style.setProperty("--x1", `${drift}vw`);
      piece.style.setProperty("--rz", `${Math.floor(Math.random() * 360)}deg`);
      piece.style.setProperty("--rot", `${rotation}deg`);
      piece.style.setProperty("--dur", `${duration}s`);
      piece.style.setProperty("--op", String(opacity));
      piece.style.setProperty("--w", `${width}px`);
      piece.style.setProperty("--h", `${height}px`);
      piece.style.setProperty("--br", rounded);

      container.appendChild(piece);

      setTimeout(() => {
        piece.remove();
      }, duration * 1000 + 500);
    }

    function startConfetti() {
      if (fired.current) return;

      fired.current = true;

      ensureStyles();

      container = document.createElement("div");
      container.className = "confetti-container";
      document.body.appendChild(container);

      interval = setInterval(() => {
        for (let i = 0; i < 6; i++) {
          spawnConfettiPiece(container);
        }
      }, 150);
    }

    startConfetti();

    return () => {
      clearInterval(interval);

      if (container) {
        container.remove();
      }

      fired.current = false;
    };
  }, [onceKey]);

  return null;
}