import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private http = inject(HttpClient);
  private baseUrl = "https://pokeapi.co/api/v2";

  getPokemons(limit = 20, offset = 0): Promise<PokemonsResponse> {
    return lastValueFrom(
      this.http.get<PokemonsResponse>(`${this.baseUrl}/pokemon/`, {
        params: { limit, offset },
      })
    );
  }

  getPokemonById(id: string): Promise<any> {
    return lastValueFrom(this.http.get<any>(`${this.baseUrl}/pokemon/${id}`));
  }
}

export interface Pokemon {
  name: string;
  url: string;
}
export interface PokemonsResponse {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}
