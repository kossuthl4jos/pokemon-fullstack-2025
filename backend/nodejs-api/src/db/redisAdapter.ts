import * as fs from "fs/promises";
import { createClient, RedisClientType } from "redis";
import { ListType, PokemonItem } from "../models";
import { DBAdapter } from "./types";

export class RedisAdapter implements DBAdapter {
  private client: RedisClientType;
  private prefix = "pokodex:";
  constructor(private url = "redis://localhost:6379") {
    this.client = createClient({ url: this.url });
  }

  async init() {
    this.client.on("error", (err) => console.error("Redis Client Error", err));
    await this.client.connect();
  }

  private key(list: ListType) {
    return `${this.prefix}${list}`;
  }

  async getAll(list: ListType) {
    const key = this.key(list);
    const raw = await this.client.hGetAll(key);
    return Object.values(raw).map((v) => JSON.parse(v) as PokemonItem);
  }

  async get(list: ListType, id: string) {
    const key = this.key(list);
    const raw = await this.client.hGet(key, id);
    return raw ? (JSON.parse(raw) as PokemonItem) : null;
  }

  async upsert(list: ListType, item: PokemonItem) {
    const key = this.key(list);
    await this.client.hSet(key, item.id, JSON.stringify(item));
  }

  async remove(list: ListType, id: string) {
    const key = this.key(list);
    const removed = await this.client.hDel(key, id);
    return removed > 0;
  }

  async snapshotToDisk(path: string) {
    const wishlist = await this.getAll("wishlist");
    const caught = await this.getAll("caught");
    const data = { wishlist, caught };
    await fs.writeFile(path, JSON.stringify(data, null, 2), "utf8");
  }

  async restoreFromDisk(path: string) {
    try {
      const content = await fs.readFile(path, "utf8");
      const data = JSON.parse(content) as {
        wishlist?: PokemonItem[];
        caught?: PokemonItem[];
      };
      if (data.wishlist) {
        const key = this.key("wishlist");
        await this.client.del(key);

        if (data.wishlist.length) {
          const mapping: Record<string, string> = {};
          data.wishlist.forEach((i) => (mapping[i.id] = JSON.stringify(i)));
          await this.client.hSet(key, mapping);
        }
      }
      if (data.caught) {
        const key = this.key("caught");
        await this.client.del(key);

        if (data.caught.length) {
          const mapping: Record<string, string> = {};
          data.caught.forEach((i) => (mapping[i.id] = JSON.stringify(i)));
          await this.client.hSet(key, mapping);
        }
      }
    } catch (err) {
      if ((err as any).code === "ENOENT") {
        return;
      }
      throw err;
    }
  }

  async close() {
    await this.client.disconnect();
  }
}
