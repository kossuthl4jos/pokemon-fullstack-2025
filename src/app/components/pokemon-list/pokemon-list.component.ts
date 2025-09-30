import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Pokemon } from 'src/app/services/schemas';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
    selector: 'app-pokemon-list',
    standalone: true,
    template: `
        <h2>Pokémons List</h2>
        <input type="text" placeholder="Filter by name" [value]="searchText()" (input)="searchText.set($any($event.target).value)" />
        <div class="pokemon-list">
            @if (pokemonQuery.isPending()) {
            <p>Loading in list component...</p>
            } @else if (pokemonQuery.isError()) {
            <span>Error: {{ pokemonQuery.error().message }}</span>
            } @else { @for (pokemon of filteredItems(); track pokemon.id) {
            <app-pokemon-card [pokemon]="pokemon" (click)="viewDetails(pokemon.id.toString())" />
            } } @if (!this.searchText() && this.pokemonQuery.hasNextPage()) {
            <div id="loading" #anchor>...loading more items...</div>
            }
        </div>
        <button id="toTheTopButton" (click)="toTheTop()">Go Up</button>
    `,
    imports: [PokemonCardComponent],
    styleUrls: ['./pokemon-list.component.css'],
})
export class PokemonListComponent implements OnInit, OnDestroy {
    pokemonService = inject(PokemonService);
    router = inject(Router);
    queryClient = inject(QueryClient);

    private observer?: IntersectionObserver;
    private anchorEl?: HTMLElement;

    searchText = signal('');
    filteredPokemons = signal<Pokemon[]>([]);

    @ViewChild('anchor') set anchor(anchorElement: ElementRef<HTMLElement> | undefined) {
        if (anchorElement) {
            this.anchorEl = anchorElement.nativeElement;
            this.startObserving();
        } else {
            this.stopObserving();
        }
    }

    pokemonQuery = this.pokemonService.getPokemons();

    filteredItems = computed(() => {
        const text = this.searchText().toLowerCase();
        const currentResults = this.pokemonQuery?.data()?.pages.flatMap(page => page.results) || [];
        return currentResults.filter(pokemon => pokemon.name.toLowerCase().includes(text));
    });

    private startObserving() {
        this.stopObserving();
        if (!this.anchorEl) return;

        this.observer = new IntersectionObserver(
            entries => {
                if (entries.some(e => e.isIntersecting)) {
                    if (this.pokemonQuery.hasNextPage() && !this.pokemonQuery.isFetchingNextPage()) {
                        this.pokemonQuery.fetchNextPage();
                    }
                }
            },
            {
                root: null,
                rootMargin: '200px', // preload before visible
                threshold: 0.1,
            }
        );

        this.observer.observe(this.anchorEl);
    }

    private stopObserving() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
        }
    }

    ngOnInit(): void {
        window.onscroll = () => {
            const toTheTopButton = document.getElementById('toTheTopButton');
            return this.scrollFunction(toTheTopButton);
        };
    }

    ngOnDestroy() {
        this.stopObserving();
    }

    onScroll(event: Event) {
        const target = event.target as HTMLElement;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
            if (this.pokemonQuery.hasNextPage() && !this.pokemonQuery.isFetchingNextPage()) {
                this.pokemonQuery.fetchNextPage();
            }
        }
    }

    viewDetails(pokemonId: string) {
        this.router.navigate(['/pokemon', pokemonId]);
    }

    scrollFunction(button: HTMLElement | null) {
        if (!button) return;
        if (window.scrollY > 200) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    }

    toTheTop() {
        if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
        document.body.scrollTop = 0; // For Safari
    }
}
