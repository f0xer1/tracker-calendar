import {Component} from '@angular/core';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonToggleModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
