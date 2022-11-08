import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent implements AfterViewChecked {
  isLastScheduleDate: any;
  isJobSchedularPage = false;
  constructor(private router: Router) {

  }

  ngAfterViewChecked(): void {
    this.isLastScheduleDate= JSON.parse(localStorage.getItem('lastScheduleDate'));
    if (this.router.url == '/manufacturing-planning/advance/job-order-auto-scheduler') {
      this.isJobSchedularPage = true;
    } else {
      this.isJobSchedularPage = false;
    }
  }
}
