import { ListType, PokemonItem } from "../models";

export interface DBAdapter {
  init(): Promise<void>;
  close(): Promise<void>;

  getAll(list: ListType): Promise<PokemonItem[]>;
  get(list: ListType, id: string): Promise<PokemonItem | null>;
  upsert(list: ListType, item: PokemonItem): Promise<void>;
  remove(list: ListType, id: string): Promise<boolean>;
  snapshotToDisk(path: string): Promise<void>;
  restoreFromDisk(path: string): Promise<void>;
}
