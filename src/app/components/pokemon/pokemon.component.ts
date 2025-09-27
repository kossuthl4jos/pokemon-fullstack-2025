import { TitleCasePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { injectQuery, QueryClient } from "@tanstack/angular-query-experimental";
import { PokemonService } from "../../services/pokemon.service";

@Component({
  selector: "app-pokemon",
  standalone: true,
  template: `
    @if (query.data()) {
    <h2>{{ pokemon.name | titlecase }}</h2>
    <img [src]="pokemon.sprites.front_default" alt="{{ pokemon.name }}" />
    <p><strong>Height:</strong> {{ pokemon.height }}</p>
    <p><strong>Weight:</strong> {{ pokemon.weight }}</p>
    <p><strong>Base Experience:</strong> {{ pokemon.base_experience }}</p>
    }
  `,
  imports: [TitleCasePipe],
  styleUrls: ["./pokemon.component.css"],
})
export class PokemonComponent {
  queryClient = inject(QueryClient);
  pokemonService = inject(PokemonService);
  activatedRoute = inject(ActivatedRoute);

  pokemon: any;

  query = injectQuery(() => ({
    queryKey: ["pokemons"],
    queryFn: () =>
      this.pokemonService.getPokemonById(
        this.activatedRoute.snapshot.paramMap.get("pokemonId")!
      ),
  }));
}
