import * as fs from "fs/promises";
import { ListType, PokemonItem } from "../models";
import { DBAdapter } from "./types";

export class FileAdapter implements DBAdapter {
  private data: { wishlist: PokemonItem[]; caught: PokemonItem[] } = {
    wishlist: [],
    caught: [],
  };
  constructor(private path = "./data.json") {}

  //TODO check logic with restoreFromDisk should be simplified
  async init() {
    try {
      const raw = await fs.readFile(this.path, "utf8");
      this.data = JSON.parse(raw);
    } catch (err) {
      if ((err as any).code === "ENOENT") {
        await this.flush();
      } else {
        throw err;
      }
    }
  }

  private async flush() {
    await fs.writeFile(this.path, JSON.stringify(this.data, null, 2), "utf8");
  }

  async getAll(list: ListType) {
    return this.data[list];
  }
  async get(list: ListType, id: string) {
    return this.data[list].find((i) => i.id === id) ?? null;
  }
  async upsert(list: ListType, item: PokemonItem) {
    const arr = this.data[list];
    const idx = arr.findIndex((i) => i.id === item.id);
    if (idx >= 0) arr[idx] = item;
    else arr.push(item);
    await this.flush();
  }
  async remove(list: ListType, id: string) {
    const arr = this.data[list];
    const before = arr.length;
    this.data[list] = arr.filter((i) => i.id !== id);
    await this.flush();
    return this.data[list].length < before;
  }
  async snapshotToDisk(path: string) {
    await fs.writeFile(path, JSON.stringify(this.data, null, 2), "utf8");
  }
  async restoreFromDisk(path: string) {
    try {
      const content = await fs.readFile(path, "utf8");
      this.data = JSON.parse(content);
      await this.flush();
    } catch (err) {
      if ((err as any).code === "ENOENT") return;
      throw err;
    }
  }
  async close() {
    /* nothing to do */
  }
}
