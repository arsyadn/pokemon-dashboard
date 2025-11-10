"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spin, Empty, Layout } from "antd";
import { Pokemon, PokemonSpecies, EvolutionChain } from "@/app/types";
import { TYPE_COLORS } from "@/app/data";
import LeftCard from "./LeftCard";
import CenterCard from "./CenterCard";
import RightCard from "./RightCard";
import axios from "axios";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";

const { Content } = Layout;

const PokedexPage = (): React.JSX.Element => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolution, setEvolution] = useState<EvolutionChain | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);

  const router = useRouter();

  const fetchList = async (limit = 25) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
      );
      const data = res.data;
      const details: Pokemon[] = await Promise.all(
        data.results.map(async (r: { url: string }) => {
          const d = await axios.get(r.url);
          return d.data;
        })
      );
      setPokemons(details);
      if (!selected && details.length > 0) setSelected(details[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullFor = async (p: Pokemon) => {
    setLoading(true);
    try {
      const speciesRes = await fetch(p.species.url).then((r) => r.json());
      setSpecies(speciesRes);

      if (speciesRes.evolution_chain?.url) {
        const evoRes = await fetch(speciesRes.evolution_chain.url).then((r) =>
          r.json()
        );
        setEvolution(evoRes);
      } else setEvolution(null);
    } catch (err) {
      console.error(err);
      setSpecies(null);
      setEvolution(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return fetchList(limit);

    setLoading(true);
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );
      const data: Pokemon = res.data;
      setPokemons([data]);
      setSelected(data);
      await fetchFullFor(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  useEffect(() => {
    fetchList(limit);
  }, [limit]);

  useEffect(() => {
    if (selected) fetchFullFor(selected);
  }, [selected]);

  const headerTypeColor = useMemo(() => {
    if (!selected) return "#fff";
    const t = selected.types[0]?.type.name ?? "normal";
    return TYPE_COLORS[t] ?? "#777";
  }, [selected]);

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Navbar logout={logout} />

      <Content className="w-full max-w-full md:max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
        <div className="mx-auto">
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
              <Spin size="large" />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
            <LeftCard
              pokemons={pokemons}
              selected={selected}
              setSelected={setSelected}
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              setLimit={setLimit}
            />

            <CenterCard
              selected={selected}
              species={species}
              evolution={evolution}
              headerTypeColor={headerTypeColor}
              setSelected={setSelected}
              setLoading={setLoading}
            />

            <RightCard selected={selected} />
          </div>

          {!loading && pokemons.length === 0 && (
            <div className="mt-8">
              <Empty description="No Pokémon Found" />
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default PokedexPage;
