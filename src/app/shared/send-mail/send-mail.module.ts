import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPublicClientApplication,
  PublicClientApplication,
  BrowserCacheLocation } from '@azure/msal-browser';
// import { MsalModule,
//   MsalService,
//   MSAL_INSTANCE } from '@azure/msal-angular';
import { SendMailComponent } from './send-mail.component';
import { DassSharedModule } from '../dass-shared.module';
import { FormsModule } from '@angular/forms';
import { OAuthSettings } from 'app/services/auth/oauth-microsoft';
import { AuthMicrosoftService } from 'app/services/auth/auth-microsoft.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';


// <MSALFactorySnippet>
let msalInstance: IPublicClientApplication | undefined = undefined;

export function MSALInstanceFactory(): IPublicClientApplication {
  msalInstance = msalInstance ?? new PublicClientApplication({
    auth: {
      clientId: OAuthSettings.appId,
      redirectUri: OAuthSettings.redirectUri,
      postLogoutRedirectUri: OAuthSettings.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    }
  });

  return msalInstance;
}
// </MSALFactorySnippet>

@NgModule({
  imports: [
    CommonModule,
    // MsalModule,
    ModalModule.forRoot(),
    DassSharedModule,
    PrintSharedModule,
    AngularEditorModule,
    FormsModule,
  ],
  // </ImportsSnippet>
  // <ProvidersSnippet>
  providers: [
    // {
    //   provide: MSAL_INSTANCE,
    //   useFactory: MSALInstanceFactory
    // },
    // MsalService,
    AuthMicrosoftService
  ],
  // </ProvidersSnippet>
  declarations: [SendMailComponent],
  exports: [SendMailComponent]
})
export class SendMailModule { }
