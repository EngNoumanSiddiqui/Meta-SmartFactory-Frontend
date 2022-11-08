import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent {

  constructor(private location: Location) {

  }

  back() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  isLastEmitter(event) {
  }
}
