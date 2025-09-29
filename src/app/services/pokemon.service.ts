import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { Pokemon, PokemonsResponse } from './schemas';

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    private http = inject(HttpClient);
    private baseUrl = 'https://pokeapi.co/api/v2';

    getPokemons(limit = 20, offset = 0): Promise<PokemonsResponse> {
        return lastValueFrom(
            this.http
                .get<PokemonsResponse>(`${this.baseUrl}/pokemon/`, {
                    params: { limit, offset },
                })
                .pipe(map(response => PokemonsResponse.parse(response)))
        );
    }

    getPokemonById = (pokemonId: string) =>
        injectQuery(() => ({
            queryKey: ['pokemon', pokemonId],
            queryFn: () =>
                lastValueFrom(this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${pokemonId}`).pipe(map(response => Pokemon.parse(response)))),
        }));
}
