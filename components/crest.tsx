"use client";

import Image from "next/image";
import { useState } from "react";

export function Crest({
  src,
  name,
  size = 54,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const fallbackChar = name.trim().slice(0, 1).toUpperCase() || "U";
    return (
      <span className="crest-placeholder" style={{ width: size, height: size }}>
        {fallbackChar}
      </span>
    );
  }

  return (
    <Image
      className="team-crest"
      src={src}
      alt=""
      width={size}
      height={size}
      onError={() => setError(true)}
    />
  );
}
