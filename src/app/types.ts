export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: AbilitySlot[];
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  species: { name: string; url: string };
  moves: PokemonMove[];
}

export interface AbilitySlot {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    [key: string]: {
      front_default: string | null;
    };
  };
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonMoveVersionGroupDetail {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}
export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: PokemonMoveVersionGroupDetail[];
}

export interface PokemonSpeciesGenera {
  genus: string;
  language: { name: string };
}
export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: { name: string };
}
export interface PokemonSpecies {
  id: number;
  name: string;
  color?: { name: string };
  evolution_chain?: { url: string };
  habitat?: { name: string } | null;
  flavor_text_entries?: PokemonSpeciesFlavorText[];
  genera?: PokemonSpeciesGenera[];
  generation?: { name: string };
}
export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}
export interface EvolutionDetail {
  min_level?: number;
  trigger?: {
    name: string;
    url: string;
  };
  item?: {
    name: string;
    url: string;
  };
}

export interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
  evolution_details: EvolutionDetail[];
}
