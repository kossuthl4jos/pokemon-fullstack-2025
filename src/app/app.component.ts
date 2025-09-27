import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  template: `<nav>
      <a routerLink="/">Pokémon List</a> |
      <a routerLink="/pokemons-caught">Caught</a> |
      <a routerLink="/pokemons-wish-list">Wish List</a> |
      <a routerLink="/contact">Contact</a>
    </nav>
    <div id="router-wrapper">
      <router-outlet></router-outlet>
    </div>`,
  imports: [RouterOutlet, RouterLink],
  styleUrls: ["./app.component.css"],
})
export class AppComponent {}
