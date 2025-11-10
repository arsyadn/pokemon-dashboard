"use client";
import React from "react";
import { Card, Typography, Progress, Tag, Divider } from "antd";
import { Pokemon } from "../app/types";
import { TYPE_COLORS } from "@/app/data";

const { Title, Text } = Typography;

interface RightCardProps {
  selected: Pokemon | null;
}
const RightCard: React.FC<RightCardProps> = ({ selected }) => {
  if (!selected) return null;

  return (
    <div className="w-full lg:w-1/6 ">
      <Card
        className="rounded-2xl overflow-hidden"
        styles={{ body: { padding: 16 } }}
      >
        <Title level={4}>Quick Stats</Title>
        <div className="mt-3 space-y-3">
          {selected.stats.map((s) => (
            <div key={s.stat.name}>
              <div className="flex justify-between">
                <Text className="capitalize">{s.stat.name}</Text>
                <Text>{s.base_stat}</Text>
              </div>
              <Progress
                percent={Math.min(Math.round((s.base_stat / 100) * 100), 100)}
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

        <Divider />

        <div>
          <Text strong>Type Effectiveness</Text>
          <div className="mt-2">
            {selected.types.map((t) => (
              <Tag
                key={t.type.name}
                className="capitalize"
                style={{
                  background: TYPE_COLORS[t.type.name] ?? "#ddd",
                  color: "#fff",
                  marginRight: 6,
                }}
              >
                {t.type.name}
              </Tag>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RightCard;
