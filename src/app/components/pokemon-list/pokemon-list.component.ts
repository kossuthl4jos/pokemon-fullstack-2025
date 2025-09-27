import { TitleCasePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { injectQuery, QueryClient } from "@tanstack/angular-query-experimental";
import { Pokemon, PokemonService } from "../../services/pokemon.service";

@Component({
  selector: "app-pokemon-list",
  standalone: true,
  template: `<h2>Pokémon List</h2>
    <ul class="pokemon-list">
      @if (query.data(); as data) { @for (pokemon of data; track pokemon.url) {
      <li (click)="viewDetails(pokemon)">
        {{ pokemon.name | titlecase }}
      </li>
      } } @else {
      <li>There are no items.</li>
      }
    </ul>`,
  imports: [TitleCasePipe],
  styleUrls: ["./pokemon-list.component.css"],
})
export class PokemonListComponent {
  pokemonService = inject(PokemonService);
  router = inject(Router);
  queryClient = inject(QueryClient);

  query = injectQuery(() => ({
    queryKey: ["pokemons"],
    queryFn: async () => ({ data: await this.pokemonService.getPokemons() }),
    select: ({ data }) => data.results,
  }));

  pokemons: Pokemon[] = [];

  viewDetails(pokemon: Pokemon) {
    const id = pokemon.url.split("/").filter(Boolean).pop();
    this.router.navigate(["/pokemon", id]);
  }
}
