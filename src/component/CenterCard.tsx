"use client";
import React from "react";
import Image from "next/image";
import { Typography, Tabs, Tag, Divider, Progress, List } from "antd";
import {
  Pokemon,
  PokemonSpecies,
  EvolutionChain,
  PokemonSpeciesGenera,
  PokemonSpeciesFlavorText,
} from "../app/types";
import EvolutionView from "./EvolutionView";
import axios from "axios";

const { Title, Text } = Typography;

interface CenterCardProps {
  selected: Pokemon | null;
  species: PokemonSpecies | null;
  evolution: EvolutionChain | null;
  headerTypeColor: string;
  setSelected: (p: Pokemon) => void;
  setLoading: (v: boolean) => void;
}

const CenterCard: React.FC<CenterCardProps> = ({
  selected,
  species,
  evolution,
  headerTypeColor,
  setSelected,
  setLoading,
}) => {
  if (!selected) return null;

  const artwork =
    selected.sprites.other?.["official-artwork"]?.front_default ||
    selected.sprites.front_default ||
    "";

  return (
    <div className="w-full lg:w-3/6 ">
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        {/* Header */}
        <div
          className="h-56 w-full p-6 flex items-start justify-between"
          style={{
            background: `linear-gradient(135deg, ${headerTypeColor} 0%, #ffffff 60%)`,
          }}
        >
          <div>
            <Title level={2} className="capitalize text-white m-0">
              {selected.name}
            </Title>
            <Text style={{ color: "#fff", fontWeight: 600 }}>
              #{String(selected.id).padStart(3, "0")}
            </Text>
            <div className="mt-3">
              {selected.types.map((t) => (
                <Tag
                  key={t.type.name}
                  className="capitalize"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    marginRight: 8,
                  }}
                >
                  {t.type.name}
                </Tag>
              ))}
            </div>
          </div>

          <div className="relative w-48 h-48 -mt-8 -mr-6">
            <Image
              src={artwork}
              alt={selected.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="bg-white p-6">
          <Tabs
            defaultActiveKey="1"
            type="card"
            items={[
              {
                key: "1",
                label: "About",
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Title level={5}>Species</Title>
                      <Text>
                        {species?.genera?.find(
                          (g: PokemonSpeciesGenera) => g.language.name === "en"
                        )?.genus ?? selected.name}
                      </Text>
                      <Divider />
                      <Title level={5}>Height</Title>
                      <Text>{(selected.height / 10).toFixed(1)} m</Text>
                      <Title level={5} className="block mt-2">
                        Weight
                      </Title>
                      <Text>{(selected.weight / 10).toFixed(1)} kg</Text>
                      <Divider />
                      <Title level={5}>Abilities</Title>
                      <div>
                        {selected.abilities.map((a) => (
                          <Tag key={a.ability.name} className="capitalize">
                            {a.ability.name}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Title level={5}>Flavor Text</Title>
                      <Text type="secondary">
                        {species?.flavor_text_entries
                          ?.find(
                            (f: PokemonSpeciesFlavorText) =>
                              f.language.name === "en"
                          )
                          ?.flavor_text?.replace(/\n|\f/g, " ") ??
                          "No description."}
                      </Text>
                      <Divider />
                      <Title level={5}>Habitat</Title>
                      <Text className="capitalize">
                        {species?.habitat?.name ?? "-"}
                      </Text>
                      <Title level={5} className="block mt-2">
                        Generation
                      </Title>
                      <Text>{species?.generation?.name ?? "-"}</Text>
                    </div>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Base Stats",
                children: (
                  <div className="space-y-4">
                    {selected.stats.map((s) => (
                      <div key={s.stat.name}>
                        <div className="flex justify-between">
                          <Text className="capitalize">{s.stat.name}</Text>
                          <Text>{s.base_stat}</Text>
                        </div>
                        <Progress
                          percent={Math.min(
                            Math.round((s.base_stat / 100) * 100),
                            100
                          )}
                          showInfo={false}
                          strokeColor={
                            s.base_stat < 50
                              ? "#ff4d4f"
                              : s.base_stat >= 100
                              ? "#52c41a"
                              : "#1890ff"
                          }
                        />
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: "3",
                label: "Evolution",
                children: (
                  <EvolutionView
                    chain={evolution?.chain}
                    onSelectName={async (name) => {
                      setLoading(true);
                      try {
                        const { data } = await axios.get(
                          `https://pokeapi.co/api/v2/pokemon/${name}`
                        );
                        setSelected(data);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                ),
              },
              {
                key: "4",
                label: "Moves",
                children: (
                  <List
                    size="small"
                    dataSource={selected.moves.slice(0, 30)}
                    renderItem={(m) => (
                      <List.Item>
                        <Text className="capitalize">
                          {m.move.name.replace("-", " ")}
                        </Text>
                      </List.Item>
                    )}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CenterCard;
