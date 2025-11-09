import { Routes } from "@angular/router";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { PokemonListComponent } from "./components/pokemon-list/pokemon-list.component";
import { PokemonComponent } from "./components/pokemon/pokemon.component";
import { PokemonsCaughtComponent } from "./components/pokemons-caught/pokemons-caught.component";
import { PokemonsWishListComponent } from "./components/pokemons-wish-list/pokemons-wish-list.component";

export const routes: Routes = [
  { path: "", component: PokemonListComponent },
  { path: "pokemon/:pokemonId", component: PokemonComponent },
  { path: "pokemons-caught", component: PokemonsCaughtComponent },
  { path: "pokemons-wish-list", component: PokemonsWishListComponent },
  {
    path: "contact",
    loadComponent: () =>
      import("./components/contact/contact.component").then(
        (m) => m.ContactComponent
      ),
  },
  { path: "**", component: NotFoundComponent },
];
