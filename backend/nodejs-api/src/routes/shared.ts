import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { DBAdapter } from "../db/types";
import { ListType, PokemonItem } from "../models";

export function createListRouter(adapter: DBAdapter, list: ListType) {
  const router = Router();

  router.get("/", async (req, res) => {
    const items = await adapter.getAll(list);
    res.json(items);
  });

  router.post("/", async (req, res) => {
    const body = req.body as Partial<PokemonItem>;
    if (!body.name) return res.status(400).json({ error: "name is required" });
    const item: PokemonItem = {
      id: uuidv4(),
      name: body.name,
      meta: body.meta ?? {},
      addedAt: new Date().toISOString(),
    };
    await adapter.upsert(list, item);
    res.status(201).json(item);
  });

  router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const existing = await adapter.get(list, id);
    if (!existing) return res.status(404).json({ error: "not found" });
    const body = req.body as Partial<PokemonItem>;
    const updated: PokemonItem = { ...existing, ...body, id };
    await adapter.upsert(list, updated);
    res.json(updated);
  });

  router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const ok = await adapter.remove(list, id);
    if (!ok) return res.status(404).json({ error: "not found" });
    res.status(204).send();
  });

  return router;
}
