"use client";
import React from "react";
import { Typography } from "antd";
import ArtWork from "./Artwork";
import { EvolutionChainLink } from "../app/types";
import { RightSquareFilled } from "@ant-design/icons";

const { Text } = Typography;

interface EvolutionViewProps {
  chain?: EvolutionChainLink;
  onSelectName: (name: string) => void;
}
const EvolutionView: React.FC<EvolutionViewProps> = ({
  chain,
  onSelectName,
}) => {
  if (!chain) return <Text type="secondary">No evolution data.</Text>;

  const flatten = (node: EvolutionChainLink, acc: string[] = []): string[] => {
    if (!node) return acc;
    acc.push(node.species.name);
    node.evolves_to?.forEach((child) => flatten(child, acc));
    return acc;
  };

  const names = flatten(chain);

  return (
    <div className="flex gap-4 items-center flex-wrap">
      {names.map((n, i) => (
        <div key={n} className="flex items-center gap-2">
          <span
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onSelectName(n)}
          >
            <ArtWork name={n} />
            <Text className="capitalize mt-1">{n}</Text>
          </span>
          {i < names.length - 1 && (
            <RightSquareFilled style={{ color: "blue" }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default EvolutionView;
