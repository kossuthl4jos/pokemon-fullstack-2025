import { Component } from "@angular/core";

@Component({
  selector: "app-contact",
  standalone: true,
  template: `<h2>Contact</h2>
    <form>
      <label>Name:</label>
      <input type="text" /><br /><br />
      <label>Email:</label>
      <input type="email" /><br /><br />
      <label>Message:</label>
      <textarea></textarea><br /><br />
      <button type="submit">Send</button>
    </form>`,
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent {
  constructor() {
    console.log(
      "📞 ContactComponent lazily loaded to keep initial bundle size smaller"
    );
  }
}
