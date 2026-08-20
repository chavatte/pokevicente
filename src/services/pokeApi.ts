import type { Pokemon } from "../types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export const GENERATIONS = [
  { id: 1, name: "Kanto", start: 1, end: 151, total: 151 },
  { id: 2, name: "Johto", start: 152, end: 251, total: 100 },
  { id: 3, name: "Hoenn", start: 252, end: 386, total: 135 },
  { id: 4, name: "Sinnoh", start: 387, end: 493, total: 107 },
  { id: 5, name: "Unova", start: 494, end: 649, total: 156 },
  { id: 6, name: "Kalos", start: 650, end: 721, total: 72 },
  { id: 7, name: "Alola", start: 722, end: 809, total: 88 },
  { id: 8, name: "Galar", start: 810, end: 905, total: 96 },
  { id: 9, name: "Paldea", start: 906, end: 1025, total: 120 },
];

export const fetchGenerationList = async (start: number, total: number) => {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${total}&offset=${start - 1}`,
  );
  const data = await response.json();
  return data.results as { name: string; url: string }[];
};

export const fetchPokemonData = async (id: number): Promise<Pokemon> => {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!response.ok) throw new Error("Falha ao buscar o Pokémon");
  return response.json();
};

export type EvolutionNode = {
  id: number;
  name: string;
};

export const fetchEvolutionChain = async (
  pokemonId: number,
): Promise<EvolutionNode[]> => {
  try {
    const speciesRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`,
    );
    if (!speciesRes.ok) throw new Error("Espécie não encontrada");
    const speciesData = await speciesRes.json();
    const chainRes = await fetch(speciesData.evolution_chain.url);
    const chainData = await chainRes.json();
    const evolutions: EvolutionNode[] = [];
    let current = chainData.chain;

    while (current) {
      const urlParts = current.species.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 2], 10);

      evolutions.push({
        id,
        name: current.species.name,
      });
      current = current.evolves_to[0];
    }

    return evolutions;
  } catch (error) {
    console.error("Erro ao buscar evoluções:", error);
    return [];
  }
};
