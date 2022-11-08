import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
// Import containers
import {FullLayoutComponent, SimpleLayoutComponent} from './containers';
// Import components
import {APP_SIDEBAR_NAV, AppAsideComponent, AppBreadcrumbsComponent, AppFooterComponent, AppHeaderComponent, AppSidebarComponent, AppSidebarFooterComponent, AppSidebarFormComponent, AppSidebarHeaderComponent, AppSidebarMinimizerComponent} from './components';
// Import directives
import {AsideToggleDirective, NAV_DROPDOWN_DIRECTIVES, ReplaceDirective, SIDEBAR_TOGGLE_DIRECTIVES} from './directives';
// Import routing module
import {AppRoutingModule} from './app.routing';
// Import 3rd party components
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
// Prime NG Components
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// Services & Modules
import {CookieService} from './services/cookie/cookie.service';
import {OAuthService} from './services/auth/oAuth.service';
import {LoginControllerService} from './services/core/login-controller.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AdminGuard} from './guards/admin.guard';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

import {DassSharedModule} from './shared/dass-shared.module';
import {ProfileModule} from './views/profile/profile-module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {AppMissingTranslationHandler} from './app-missing-translation-handler';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ToastrModule} from 'ngx-toastr';
import {DetailDialogModule} from './components/common-dialogs/common-dialog.module';
import {CodeLangDropDownModule} from './components/code-lang-drop-down/code-lang-drop-down.module';
import {PlantAutoCompleteModule} from './views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { OrganizationService } from './services/dto-services/organization/organization.service';
import { CustomToastComponent } from './shared/custom-toast-component/custom-toast.component';

const APP_CONTAINERS = [FullLayoutComponent, SimpleLayoutComponent];
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
];


const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
];


@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    DassSharedModule,
    ConfirmDialogModule,
    FormsModule,
    PlantAutoCompleteModule,
    HttpClientModule,
    ProfileModule,
    DetailDialogModule,
    CodeLangDropDownModule,
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      toastComponent: CustomToastComponent,
      timeOut: 1000,
      closeButton: true,
      progressBar: true,
      tapToDismiss: false,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
  ],
  providers: [
    AdminGuard,
    CookieService,
    OrganizationService ,
    LoginControllerService,
    OAuthService, TranslateService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: MissingTranslationHandler, useClass: AppMissingTranslationHandler},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
