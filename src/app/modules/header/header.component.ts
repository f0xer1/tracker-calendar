import {Component} from '@angular/core';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonToggleModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
