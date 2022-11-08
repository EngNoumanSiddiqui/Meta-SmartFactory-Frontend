import { Injectable } from '@angular/core';
import { AuthService} from './auth-service';

@Injectable()
export class RoleAuthService {

  constructor(private _auth: AuthService) { }

  isAuthorized(role: string): boolean {
    return this._auth.isAuthor(role);
  }

}
