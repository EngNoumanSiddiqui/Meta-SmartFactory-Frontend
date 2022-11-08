import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styles: [
    `.sidebar .nav-dropdown.open > .nav-dropdown-items {
      max-height: 100% !important;
  }`
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppSidebarComponent { }
