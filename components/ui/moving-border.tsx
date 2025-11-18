"use client";
import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "0.5rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative h-6 p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-6 w-6 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-xs antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx = "30%",
  ry = "30%",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const progress = useMotionValue<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();
    if (length === 0) return;

    let frame: number;
    let startTime: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const currentProgress = (elapsed % duration) / duration;
      progress.set(currentProgress * length);
      frame = requestAnimationFrame(animate);
    };

    // Small delay to ensure SVG is rendered
    const timeoutId = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [duration, progress, isMounted]);

  const x = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      const point = pathRef.current.getPointAtLength(val);
      return point.x;
    }
  );

  const y = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      const point = pathRef.current.getPointAtLength(val);
      return point.y;
    }
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  // Create a rounded rectangle path
  const createRoundedRectPath = (width: number, height: number, rx: string, ry: string) => {
    const rxNum = parseFloat(rx);
    const ryNum = parseFloat(ry);
    const x = 0;
    const y = 0;
    
    return `M ${x + rxNum} ${y}
            L ${width - rxNum} ${y}
            Q ${width} ${y} ${width} ${y + ryNum}
            L ${width} ${height - ryNum}
            Q ${width} ${height} ${width - rxNum} ${height}
            L ${x + rxNum} ${height}
            Q ${x} ${height} ${x} ${height - ryNum}
            L ${x} ${y + ryNum}
            Q ${x} ${y} ${x + rxNum} ${y}
            Z`;
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <path
          ref={pathRef}
          fill="none"
          d={createRoundedRectPath(100, 100, rx, ry)}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}; 