export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  other: {
    "official-artwork": {
      front_default: string;
    };
    showdown?: {
      front_default: string;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
  weight: number;
  height: number;
}