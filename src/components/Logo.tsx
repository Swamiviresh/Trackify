"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  className = "",
  href = "/dashboard",
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 28, text: "text-lg", viewBox: 28 },
    md: { icon: 36, text: "text-xl", viewBox: 36 },
    lg: { icon: 48, text: "text-2xl", viewBox: 48 },
  };

  const { icon, text, viewBox } = sizeMap[size];

  const logoSvg = (
    <svg
      width={icon}
      height={icon}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Background rounded square */}
      <rect
        width={viewBox}
        height={viewBox}
        rx={viewBox * 0.22}
        fill="url(#logoGradient)"
      />
      {/* Upward trending line/arrow representing tracking & growth */}
      <path
        d={
          size === "sm"
            ? "M7 19L12.5 12L16 15L22 8"
            : size === "md"
            ? "M8 25L15 16L20 20L28 10"
            : "M10 34L20 22L26 27L38 13"
        }
        stroke="white"
        strokeWidth={size === "lg" ? 3.5 : size === "md" ? 2.8 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow tip */}
      <path
        d={
          size === "sm"
            ? "M19 8H22V11"
            : size === "md"
            ? "M24.5 10H28V13.5"
            : "M34 13H38V17"
        }
        stroke="white"
        strokeWidth={size === "lg" ? 3.5 : size === "md" ? 2.8 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient
          id="logoGradient"
          x1="0"
          y1="0"
          x2={viewBox.toString()}
          y2={viewBox.toString()}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {logoSvg}
      {showText && (
        <span className={`${text} font-bold text-foreground tracking-tight`}>
          Trackify
        </span>
      )}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
