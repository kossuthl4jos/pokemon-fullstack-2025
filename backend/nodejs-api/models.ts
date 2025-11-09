export interface PokemonItem {
  id: string;
  name: string;
  meta?: Record<string, unknown>;
  addedAt: string; // ISO string
}

export type ListType = "wishlist" | "caught";
