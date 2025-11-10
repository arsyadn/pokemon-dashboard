"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface ArtWorkProps {
  name: string;
}
const ArtWork: React.FC<ArtWorkProps> = ({ name }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        if (!mounted) return;
        setSrc(
          res.data.sprites.other?.["official-artwork"]?.front_default ||
            res.data.sprites.front_default
        );
      } catch {
        console.log("Failed to load artwork for", name);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [name]);

  return (
    <div className="w-14 h-14 relative">
      {src ? (
        <Image src={src} alt={name} fill style={{ objectFit: "contain" }} />
      ) : (
        <div className="w-14 h-14 bg-gray-100 rounded-md" />
      )}
    </div>
  );
};

export default ArtWork;
