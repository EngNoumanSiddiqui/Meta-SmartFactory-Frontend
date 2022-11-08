import { environment } from "environments/environment";

export const OAuthSettings = {
    appId: 'aac839f1-b707-43ac-86e6-703a42d1cab8',
    redirectUri: environment.redirectUri,
    scopes: ['user.read', 'mailboxsettings.read',
    'Mail.Send','calendars.readwrite'],
};