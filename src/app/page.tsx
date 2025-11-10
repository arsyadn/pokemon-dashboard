"use client";

import dynamic from "next/dynamic";

const PokedexPage = dynamic(() => import("@/component/PokedexPage"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-50">
      <PokedexPage />
    </main>
  );
}
