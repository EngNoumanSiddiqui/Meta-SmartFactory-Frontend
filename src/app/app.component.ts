import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {UsersService} from './services/users/users.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./custom.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private translate: TranslateService, private activatedRoute: ActivatedRoute, private _userSvc: UsersService) {

    this.translate.addLangs(['en', 'tr', 'fr', 'mk', 'ru', 'es', 'sl', 'hu']);
    this.translate.setDefaultLang('en');

  }

  // @HostListener('window:mov', []) // for window scroll events
  // onScroll(event) {
  //   if(document.getElementsByClassName('b-float-root').length) {
  //     const el = document.getElementsByClassName('b-float-root')[0];
  //     el.parentNode.removeChild(el);
  //   }
  // }


  ngOnInit() {

    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        const locale = param['locale'];
        const storedLang = this._userSvc.getLanguage();
        let selectedLangCode;
        if (!storedLang) {
          const browserLang = this.translate.getBrowserLang();
          selectedLangCode = browserLang.match(/en|tr|fr|mk|ru|es|sl|hu/) ? browserLang : 'en';
        } else {
          selectedLangCode = storedLang.match(/en|tr|fr|mk|ru|es|sl|hu/) ? storedLang : 'en';
        }
        this.translate.use(selectedLangCode);
        this._userSvc.setLanguage(selectedLangCode);
      });

  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }
}
