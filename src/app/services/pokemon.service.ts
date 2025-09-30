import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectInfiniteQuery, injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { Pokemon, PokemonsResponse } from './schemas';

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    private http = inject(HttpClient);
    private baseUrl = 'https://pokeapi.co/api/v2';

    getPokemons = () =>
        injectInfiniteQuery(() => ({
            queryKey: ['pokemons'],
            queryFn: async ({ pageParam }) => {
                const pageData = await lastValueFrom(
                    this.http
                        .get<PokemonsResponse>(`${this.baseUrl}/pokemon/`, {
                            params: { limit: 20, offset: pageParam?.toString() || '0' },
                        })
                        .pipe(map(response => PokemonsResponse.parse(response)))
                );
                const detailedResults = await Promise.all(
                    pageData.results.map(async pokemon => {
                        const detailedData = await fetch(pokemon.url).then(res => res.json()); // replace it with the query
                        return detailedData;
                    })
                );
                return { ...pageData, results: detailedResults };
            },
            initialPageParam: 0,
            getNextPageParam: lastPage => {
                if (!lastPage.next) return undefined;
                const searchParams = new URL(lastPage.next).searchParams;
                return Number(searchParams.get('offset'));
            },
        }));

    getPokemonById = (pokemonId: string) =>
        injectQuery(() => ({
            queryKey: ['pokemon', pokemonId],
            queryFn: () =>
                lastValueFrom(this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${pokemonId}`).pipe(map(response => Pokemon.parse(response)))),
        }));
}
