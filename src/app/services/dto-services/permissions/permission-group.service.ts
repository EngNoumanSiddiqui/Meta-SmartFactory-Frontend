import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class PermissionGroupService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }


  getList() { return this._httpSvc.get('permissionGroup/permissionGroups', this._opt.getHeader()); }

  getPermissionList() { return this._httpSvc.get('permission/permissions', this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('permissionGroup/save', data, this._opt.getHeader()); }
}

