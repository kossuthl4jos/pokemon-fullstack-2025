import { Component } from "@angular/core";

@Component({
  selector: "app-not-found",
  standalone: true,
  template: `<h2>404 - Page Not Found</h2>
    <p>Sorry, the page you’re looking for doesn’t exist.</p>`,
  styleUrls: ["./not-found.component.css"],
})
export class NotFoundComponent {}
