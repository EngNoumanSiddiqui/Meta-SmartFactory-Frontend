import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
// Import navigation elements
import {navigation} from './../../_nav';
import {Router} from '@angular/router';
import {RoleAuthService} from '../../services/auth/role-auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sidebar-nav',
  template: `
    <nav class="sidebar-nav">
      <ul class="nav">
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]='navitem'></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem)&&!isTitle(navitem)">
            <app-sidebar-nav-item [item]='navitem'></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
      </ul>
    </nav>`
})
export class AppSidebarNavComponent {

  public navigation = navigation;

  public isDivider(item) {
    return item.divider ? true : false
  }

  public isTitle(item) {
    return item.title ? true : false
  }


  constructor(location: Location) {
    // const url = window.location.href;
    // if (url.includes('pusnik')) {
    //   const childrens = [];
    //   this.navigation[9].children.forEach((obj, index) => {
    //     if (index > 0) {
    //       childrens.push(obj);
    //     }
    //   });

    //   this.navigation[9].children = childrens;

    //   this.navigation = this.navigation.filter((nav, index) => {
    //     if ((nav.name !== 'sales-dashboard') && (nav.name !== 'maintenance-system')) {
    //       return nav;
    //     }
    //   });

    // }
    //  if (url.includes('turna')) {
    //   // quality management
    //   const childrens = [];
    //   this.navigation[9].children.forEach((obj, index) => {
    //     if (index === 1) {
    //       childrens.push(obj);
    //     }
    //   });
    //   this.navigation[9].children = childrens;

    //   // Report and analyze System
    //   const reportchildrens = [];
    //   this.navigation[8].children.forEach((obj, index) => {
    //     if ((index === 2) || (index === 4) || (index === 5) || (index === 7) || (index === 9)) {
    //       reportchildrens.push(obj);
    //     }
    //   });
    //   this.navigation[8].children = reportchildrens;

    //   this.navigation = this.navigation.filter(nav => (nav.name !== 'sales-dashboard') &&
    //    (nav.name !== 'maintenance-system') && (nav.name !== 'batch-management-system'));


    // }
}

}

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <ng-template [ngIf]="isAuthorized()">
      <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
        <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
      </li>
      <ng-template #dropdown>
        <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown' "
            [class.open]="isActive()"
            routerLinkActive="open"
            appNavDropdown>
          <app-sidebar-nav-dropdown [link]='item'></app-sidebar-nav-dropdown>
        </li>
      </ng-template>
    </ng-template>  
  `
})

export class AppSidebarNavItemComponent implements OnInit {
  @Input() item: any;

  // noOfChild = 0;
  public hasClass() {
    return this.item.class ? true : false
  }

  public isDropdown() {
    return this.item.children ? true : false
  }

  public thisUrl() {
    return this.item.url
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), false);
  }

  public isAuthorized() {
    // console.log(this.item);
    return this._roleSvc.isAuthorized(this.item.role);
  }
  constructor(private router: Router, private _roleSvc: RoleAuthService) {
  }

  ngOnInit() {
    // if (this.router.isActive(this.thisUrl(), false)) {
    //   this.noOfChild += 1;
    // }
  }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isExternalLink(); else external"
       [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
       routerLinkActive="active"
       [routerLink]="[link.url]">
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name | translate}}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text}}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{link.url}}">
        <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
        {{ link.name}}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any;
  public hasVariant() {
    return this.link.variant ? true : false
  }
  public isBadge() {
    return this.link.badge ? true : false
  }
  public isExternalLink() {
    return this.link.url.substring(0, 4) === 'http' ? true : false
  }
  public isIcon() {
    return this.link.icon ? true : false
  }
  constructor() {
  }
}


// [ngClass]="{
//   'active': isActive() && number == 0, 
//   'active-lighter1': isActive() && number == 1,
//   'active-lighter2': isActive() && number == 2,
//   'active-lighter3': isActive() && number == 3
// }"
@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle>
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name | translate }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text | translate }}</span>
    </a>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item [item]='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent {
  @Input() link: any;
  // number = 0;
  // @Input('number') set setNoOfChild(number) {
  //   this.number = number;
  // }
  public isBadge() {
    return this.link.badge ? true : false
  }
  public isIcon() {
    return this.link.icon ? true : false
  }
  public isActive() {
    return this.router.isActive(this.thisUrl(), false)
  }
  public thisUrl() {
    return this.link.url;
  }
  constructor(private router: Router) {
  }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if (this.title.class) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if (this.title.wrapper) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li)
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];
