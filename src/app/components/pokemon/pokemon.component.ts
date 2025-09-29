import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { filter, map } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';

@Component({
    selector: 'app-pokemon',
    standalone: true,
    template: `
        @if(pokemon){ @if (pokemon.isPending()) {
        <p>Loading...</p>
        } @else if (pokemon.isError()) {
        <span>Error: {{ pokemon.error().message }}</span>
        } @else { @if(pokemon.data(); as pokemon) {
        <h2>{{ pokemon.name | titlecase }}</h2>
        <img [src]="pokemon.sprites.other['official-artwork'].front_default" alt="{{ pokemon.name }}" />
        <p>
            <strong>Height:</strong>
            {{ pokemon.height }}
        </p>
        <p>
            <strong>Weight:</strong>
            {{ pokemon.weight }}
        </p>
        <p>
            <strong>Base Experience:</strong>
            {{ pokemon.base_experience }}
        </p>
        } } }
    `,
    imports: [TitleCasePipe],
    styleUrls: ['./pokemon.component.css'],
})
export class PokemonComponent {
    queryClient = inject(QueryClient);
    pokemonService = inject(PokemonService);
    activatedRoute = inject(ActivatedRoute);

    pokemonId = toSignal(
        this.activatedRoute.paramMap.pipe(
            map(paramMap => paramMap.get('pokemonId')),
            filter(Boolean)
        ),
        { initialValue: '' }
    );

    pokemon = this.pokemonService.getPokemonById(this.pokemonId());
}
