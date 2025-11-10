"use client";
import React, { useMemo } from "react";
import { Card, Input, Typography, Button, Space, Tag, Avatar } from "antd";
import { Pokemon } from "../app/types";
import { TYPE_COLORS } from "@/app/data";

const { Title, Text } = Typography;

interface LeftCardProps {
  pokemons: Pokemon[];
  selected: Pokemon | null;
  setSelected: (p: Pokemon) => void;
  search: string;
  setSearch: (s: string) => void;
  handleSearch: () => void;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

const LeftCard: React.FC<LeftCardProps> = ({
  pokemons,
  selected,
  setSelected,
  search,
  setSearch,
  handleSearch,
  setLimit,
}) => {
  const headerTypeColor = (items) => {
    if (!items) return "#fff";
    const t = items.types[0]?.type.name ?? "normal";
    return TYPE_COLORS[t] ?? "#777";
  };
  return (
    <div className="w-full lg:w-2/6 ">
      <Card
        className="rounded-2xl overflow-hidden"
        styles={{ body: { padding: 12 } }}
      >
        <div className="flex gap-2 items-center mb-3">
          <Title level={4} className="m-0">
            Pokedex
          </Title>
          <div className="flex-1" />
          <Button size="small" onClick={() => setLimit((l) => l + 25)}>
            Load more
          </Button>
        </div>

        <Space.Compact className="mb-3 w-full">
          <Input
            placeholder="Search by name or id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Space.Compact>

        <div className="grid gap-2 md:grid-cols-2">
          {pokemons.map((p) => (
            <Card
              key={p.id}
              onClick={() => setSelected(p)}
              hoverable
              styles={{
                body: {
                  padding: 8,
                  background: `linear-gradient(135deg, ${headerTypeColor(
                    p
                  )} 0%, #ffffff 60%)`,
                },
              }}
              className={`p-0 rounded-xl cursor-pointer ${
                selected?.id === p.id
                  ? "ring-2 ring-offset-2 ring-indigo-300"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 p-2">
                <div>
                  <Text strong className="capitalize block">
                    {p.name}
                  </Text>
                  <Text type="secondary">#{String(p.id).padStart(3, "0")}</Text>
                  <div className="mt-1">
                    {p.types.map((t) => (
                      <Tag
                        key={t.type.name}
                        className="capitalize"
                        style={{
                          background: TYPE_COLORS[t.type.name] ?? "#ccc",
                          color: "#fff",
                        }}
                      >
                        {t.type.name}
                      </Tag>
                    ))}
                  </div>
                </div>
                <Avatar
                  size={56}
                  shape="square"
                  style={{ background: "transparent" }}
                  src={
                    p.sprites.other?.["official-artwork"]?.front_default ||
                    p.sprites.front_default ||
                    undefined
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LeftCard;
