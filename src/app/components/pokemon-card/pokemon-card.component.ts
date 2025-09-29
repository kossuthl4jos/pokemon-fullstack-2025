import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Pokemon } from 'src/app/services/schemas';

@Component({
    selector: 'app-pokemon-card',
    standalone: true,
    template: `
        @if(pokemon(); as pokemon) {
        <div class="pokemon-card">
            <h2 class="pokemon-name">{{ pokemon.name | titlecase }}</h2>
            <img [src]="pokemon.sprites.front_default" [alt]="pokemon.name" class="pokemon-img" />

            <div class="pokemon-details">
                <p>
                    <strong>Weight:</strong>
                    {{ pokemon.weight }}
                </p>
                <p>
                    <strong>Height:</strong>
                    {{ pokemon.height }}
                </p>
                <p>
                    <strong>Base Exp:</strong>
                    {{ pokemon.base_experience }}
                </p>
                <p>
                    <strong>Attack:</strong>
                    {{ getStat('attack') }}
                </p>
                <p>
                    <strong>Defense:</strong>
                    {{ getStat('defense') }}
                </p>
            </div>
        </div>
        }
    `,
    imports: [TitleCasePipe],
    styleUrls: ['./pokemon-card.component.css'],
})
export class PokemonCardComponent {
    pokemon = input.required<Pokemon>();

    getStat(name: string): number {
        return this.pokemon().stats.find((s: any) => s.stat.name === name)?.base_stat ?? 0;
    }
}
