import { TitleCasePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  injectInfiniteQuery,
  QueryClient,
} from "@tanstack/angular-query-experimental";
import { Pokemon, PokemonService } from "../../services/pokemon.service";

@Component({
  selector: "app-pokemon-list",
  standalone: true,
  template: `<h2>Pokémon List</h2>
    <ul class="pokemon-list">
      @if (query.isPending()) {
      <p>Loading...</p>
      } @else if (query.isError()) {
      <span>Error: {{ query.error().message }}</span>
      } @else { @for (page of query.data().pages; track $index) { @for (pokemon
      of page.results; track pokemon.url) {
      <li (click)="viewDetails(pokemon)">
        {{ pokemon.name | titlecase }}
      </li>
      } } } @if (query.hasNextPage()) {
      <li id="loading" #anchor>...loading more items...</li>
      }
    </ul>
    <button id="toTheTopButton" (click)="toTheTop()">Go Up</button>`,
  imports: [TitleCasePipe],
  styleUrls: ["./pokemon-list.component.css"],
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemonService = inject(PokemonService);
  router = inject(Router);
  queryClient = inject(QueryClient);

  private observer?: IntersectionObserver;
  private anchorEl?: HTMLElement;

  @ViewChild("anchor") set anchor(
    anchorElement: ElementRef<HTMLElement> | undefined
  ) {
    if (anchorElement) {
      this.anchorEl = anchorElement.nativeElement;
      this.startObserving();
    } else {
      this.stopObserving();
    }
  }

  query = injectInfiniteQuery(() => ({
    queryKey: ["pokemons"],
    queryFn: async ({ pageParam }) => {
      return await this.pokemonService.getPokemons(20, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const searchParams = new URL(lastPage.next).searchParams;
      return Number(searchParams.get("offset"));
    },
  }));

  pokemons: Pokemon[] = [];

  private startObserving() {
    this.stopObserving();
    if (!this.anchorEl) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (this.query.hasNextPage() && !this.query.isFetchingNextPage()) {
            this.query.fetchNextPage();
          }
        }
      },
      {
        root: null,
        rootMargin: "200px", // preload before visible
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
      const toTheTopButton = document.getElementById("toTheTopButton");
      return this.scrollFunction(toTheTopButton);
    };
  }

  ngOnDestroy() {
    this.stopObserving();
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
      if (this.query.hasNextPage() && !this.query.isFetchingNextPage()) {
        this.query.fetchNextPage();
      }
    }
  }

  viewDetails(pokemon: Pokemon) {
    const id = pokemon.url.split("/").filter(Boolean).pop();
    this.router.navigate(["/pokemon", id]);
  }

  scrollFunction(button: HTMLElement | null) {
    if (!button) return;
    if (window.scrollY > 200) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  }

  toTheTop() {
    console.log("toTheTop: ", document.documentElement.scrollTop);
    if (document.documentElement.scrollTop) {
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    document.body.scrollTop = 0; // For Safari
  }
}
