"use client";

import { useEffect, useRef } from "react";

interface JackpotWheelProps {
  isSpinning: boolean;
}

const SEGMENTS = [
  { label: "10", color: "#FF6B6B", points: 10 },
  { label: "25", color: "#4ECDC4", points: 25 },
  { label: "50", color: "#FFE66D", points: 50 },
  { label: "100", color: "#95E1D3", points: 100 },
  { label: "250", color: "#F38181", points: 250 },
  { label: "500", color: "#AA96DA", points: 500 },
  { label: "JACKPOT!", color: "#FCBAD3", points: 1000 },
  { label: "0", color: "#A8E6CF", points: 0 },
];

export function JackpotWheel({ isSpinning }: JackpotWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation.current * Math.PI) / 180);

      const segmentAngle = (2 * Math.PI) / SEGMENTS.length;

      // Draw segments
      SEGMENTS.forEach((segment, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = segment.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        ctx.font = "bold 18px Arial";
        ctx.fillText(segment.label, radius * 0.7, 0);
        ctx.restore();
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();

      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX + radius - 5, centerY);
      ctx.lineTo(centerX + radius - 30, centerY - 15);
      ctx.lineTo(centerX + radius - 30, centerY + 15);
      ctx.closePath();
      ctx.fillStyle = "#FF0000";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      if (isSpinning) {
        rotation.current += 15; // Spin speed
        if (rotation.current >= 360) {
          rotation.current -= 360;
        }
      } else {
        // Slow down
        if (rotation.current % 360 !== 0) {
          rotation.current += 2;
          if (rotation.current >= 360) {
            rotation.current = 0;
          }
        }
      }

      drawWheel();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          className="drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
