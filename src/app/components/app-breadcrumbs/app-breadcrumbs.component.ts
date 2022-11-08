import { filter } from 'rxjs/operators';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './app-breadcrumbs.component.html',
  styles: [`
      body .ui-inputswitch.ui-inputswitch-checked .ui-inputswitch-slider {
        background-color: #60c559 !important;
    }
    .a-color {
      color:white;
      font-size: 15px;
      padding: 4px 8px 5px 8px;
    }
    .a-color-active {
      color: white;
    background-color: rgb(53, 97, 122);
    font-size: 15px;
      padding: 4px 8px 5px 8px;
      border-radius: 4px;
    }
    .a-color:hover {
      color: white;
      font-size: 15px;
      background-color: rgb(53, 97, 122);
      padding: 4px 8px 5px 8px;
      border-radius: 4px;
    }
  `],
  encapsulation: ViewEncapsulation.None
  // template: `
  //   <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last=last>
  //     <h3 class="breadcrumb-item text-white" *ngIf="last">{{breadcrumb.label.title|translate}}</h3>
  //     <!--<li class="breadcrumb-item"-->
  //     <!--*ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||breadcrumb.label.title&&last"-->
  //     <!--[ngClass]="{active: last}">-->
  //     <!--<a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>-->
  //     <!--<span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>-->
  //     <!--</li>-->
  //   </ng-template>`
})
export class AppBreadcrumbsComponent {
  breadcrumbs: Array<Object>;
  // last;

  constructor(
    private router: Router, 
    private _translateSvc: TranslateService,
    private route: ActivatedRoute,
    private _jobOrderSvc: JobOrderService,
    private _appStateSvc: AppStateService) {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      this.breadcrumbs = [];
      let currentRoute = this.route.root,
        url = '';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        // tslint:disable-next-line:no-shadowed-variable
        childrenRoutes.forEach(route => {
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
            this.breadcrumbs.push({
              label: route.snapshot.data,
              url: url
            });
            // this.last = route.snapshot.data;
            currentRoute = route;
          }
        });
      } while (currentRoute);
    });
  }

  handleChange(e) {
    let isChecked = e.checked;
    this._appStateSvc.withPanelSubject.next(isChecked);
  }
}
