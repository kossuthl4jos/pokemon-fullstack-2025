import z from 'zod';

export type BaseStat = z.infer<typeof BaseStat>;
export const BaseStat = z.object({
    base_stat: z.number(),
    effort: z.number(),
    stat: z.object({
        name: z.string(),
        url: z.url(),
    }),
});

export type Move = z.infer<typeof Move>;
export const Move = z.object({
    move: z.object({
        name: z.string(),
        url: z.url(),
    }),
});

export type Pokemon = z.infer<typeof Pokemon>;
export const Pokemon = z.object({
    id: z.number().int().positive(),
    name: z.string().min(2).max(100),
    base_experience: z.number().min(0),
    height: z.number().min(0),
    weight: z.number().min(0),
    species: z.object({
        name: z.string().min(2).max(100),
        url: z.url(),
    }),
    moves: z.array(Move),
    stats: z.array(BaseStat),
    sprites: z.object({
        other: z.object({
            'official-artwork': z.object({
                front_default: z.string(),
            }),
            dream_world: z.object({
                front_default: z.string(),
            }),
        }),
    }),
});

export type PokemonsResponse = z.infer<typeof PokemonsResponse>;
export const PokemonsResponse = z.object({
    count: z.number(),
    results: z.array(
        z.object({
            name: z.string().min(2).max(100),
            url: z.url(),
        })
    ),
    next: z.url().nullable(),
    previous: z.url().nullable(),
});
