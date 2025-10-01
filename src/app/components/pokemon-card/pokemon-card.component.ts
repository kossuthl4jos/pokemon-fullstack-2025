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

            <div class="pokemon-controls">
                <button (click)="toggleWishlist(pokemon); $event.stopPropagation()" class="wishlist-btn">
                    @if (isWishlisted(pokemon)) {
                    <img src="./assets/star_full.png" alt="Wishlist" class="control-icon" />
                    } @else {
                    <img src="./assets/star_hollow.png" alt="Wishlist" class="control-icon" />
                    }
                </button>

                <button (click)="catchPokemon(pokemon); $event.stopPropagation()" class="catch-btn">
                    <img src="./assets/pokeball_icon.png" alt="Catch" class="control-icon" />
                </button>
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

    wishlisted: Set<number> = new Set(); // store by pokemon id or name

    toggleWishlist(pokemon: any) {
        if (this.wishlisted.has(pokemon.id)) {
            this.wishlisted.delete(pokemon.id);
        } else {
            this.wishlisted.add(pokemon.id);
        }
    }

    isWishlisted(pokemon: any): boolean {
        return this.wishlisted.has(pokemon.id);
    }

    catchPokemon(pokemon: any) {
        alert(`${pokemon.name} was caught! 🎉`);
    }
}
