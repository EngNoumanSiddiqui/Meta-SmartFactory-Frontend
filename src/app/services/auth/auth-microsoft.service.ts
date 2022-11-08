// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { OAuthSettings } from './oauth-microsoft';

@Injectable()
export class AuthMicrosoftService {
  public authenticated: boolean;
  public user?: User;
  public graphClient?: Client;

  // <ConstructorSnippet>
  constructor(
    private msalService: MsalService,
  ) {
    // const accounts = this.msalService.instance.getAllAccounts();
    // this.authenticated = accounts.length > 0;
    // if (this.authenticated) {
    //   this.msalService.instance.setActiveAccount(accounts[0]);
    // }
    // this.getUser().then((user) => {
    //   this.user = user;
    // });
  }
  // </ConstructorSnippet>

  // <CheckGetUser>
  public async checkGetUser() {
    if (!this.authenticated) {
      await this.signIn();
      return this.getUser();
    } else {
      return this.getUser();
    }
  }
  // </CheckGetUser>

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<void> {
    const result = await this.msalService
      .loginPopup(OAuthSettings)
      .toPromise()
      .catch((reason) => {
        // this.alertsService.addError(
        //   'Login failed',
        //   JSON.stringify(reason, null, 2)
        // );
        console.error(reason);
      });

    if (result) {
      this.msalService.instance.setActiveAccount(result.account);
      this.authenticated = true;
      this.user = await this.getUser();
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    await this.msalService.logout().toPromise();
    this.user = undefined;
    this.graphClient = undefined;
    this.authenticated = false;
  }

  // <GetUserSnippet>
  private async getUser(): Promise<User | undefined> {
    if (!this.authenticated) return undefined;

    // Create an authentication provider for the current user
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalService.instance as PublicClientApplication,
      {
        account: this.msalService.instance.getActiveAccount()!,
        scopes: OAuthSettings.scopes,
        interactionType: InteractionType.Popup,
      }
    );

    // Initialize the Graph client
    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    // Get the user from Graph (GET /me)
    const graphUser: MicrosoftGraph.User = await this.graphClient
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();

    const user = new User();
    user.displayName = graphUser.displayName ?? '';
    // Prefer the mail property, but fall back to userPrincipalName
    user.email = graphUser.mail ?? graphUser.userPrincipalName ?? '';
    user.timeZone = graphUser.mailboxSettings?.timeZone ?? 'UTC';

    // Use default avatar
    // user.avatar = '../';

    return user;
  }
  // </GetUserSnippet>


 sendMail(data) {
  if (!this.graphClient) {
    console.log('Graph client is not initialized.');
    return undefined;
  }
   return this.graphClient.api('/me/sendMail')
    .post({
      message: {
          subject: data.subject,
          body: {
            contentType: 'Text',
            content: data.body
          },
          toRecipients: [
            {
              emailAddress: {
                address: data.to
              }
            }
          ],
          attachments: [
            { 
              '@odata.type': '#microsoft.graph.fileAttachment',
              name: data.attachment.name,
              contentBytes: data.base64file,
              contentType: data.attachment.type,
              isInline: false,
              lastModifiedDateTime: data.attachment.lastModifiedDate,
              size: data.attachment.size
            }
          ]
      }
    });
 }
 
}



 class User {
    displayName!: string;
    email!: string;
    avatar!: string;
    timeZone!: string;
}