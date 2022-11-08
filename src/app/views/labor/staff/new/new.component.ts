import {Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {TreeNode} from 'primeng';
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';
import {EnumGenderService} from '../../../../services/dto-services/enum/gender.service';
import {EnumBloodGroupService} from '../../../../services/dto-services/enum/blood-group.service';
import {CityService} from '../../../../services/dto-services/city/city.service';
import {CountryService} from '../../../../services/dto-services/country/country.service';
import {EmployeeTitleService} from '../../../../services/dto-services/employee-title/employee-title.service';
import {RoleService} from '../../../../services/dto-services/permissions/role.service';

import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'staff-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewStaffComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant:any;
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  staff = {
    'address1': null,
    'address2': null,
    'birthDate': null,
    ccList: null,
    bccList: null,
    'bloodGroup': null,
    'cityId': null,
    'countryId': null,
    'departmentId': null,
    'description': null,
    'dummy': false,
    'email': null,
    'plantId': null,
    'groupType': null,
    'employeeTitleId': null,
    'firstName': null,
    'gsm': null,
    'phone': null,
    'jobEntryDate': null,
    'jobExitDate': null,
    employeeCostRate: null,
    'lastName': null,
    'password': null,
    'employeeNo': null,
    'gender': null,
    'identity': null,
    'rfid': null,
    'mediaId': null,
    'employeeRoleDtoList': [],
    'employeePermissionDtoList': []
  };
  id;
  EmployeeTitleList;
  CountryList;
  CityList;
  DepartmentList;
  BloodList;
  GenderList;
  params = {
    cityDisabled: true,
    dialog: {title: '', inputValue: ''}
  };
  MenuRolList = [];
  MenuPermissionList = [];
  // ---------- PERMISSION PANEL PARAMETERS ---------------- //
  AllPermissionTree: TreeNode[] = []; // Tum Permission Listesi (/permissionGroup/permissionGroups)
  RoleListTree: any = []; // tum Role List
  SelectedRolesTree: TreeNode[] = []; // Atanmis Roller ve Permissionlar
  AllOtherPermissions: TreeNode[] = [];
  AllOtherExtractedPermissions: TreeNode[] = [];
  SelectedRolesToBeExtractedTree;     // Atanmis Rollerden Kaldirilacak Permissionlar yani isInternal = true, isActive : false olacaklar
  PermissionList; // Tum Permission List  {permissionId, name, menuCompanentName, active, code}
  ExtractedPermissionsAfterUpdate: TreeNode[] = [];
  picture: any;
  showPassword = false;
  showRFID = false;
  GroupTypeList = [];

  constructor(private _enumGenderSvc: EnumGenderService,
              private _enumBloodSvc: EnumBloodGroupService,
              private _citySvc: CityService,
              private _countrySvc: CountryService,
              private _empTitleSvc: EmployeeTitleService,
              private _empSvc: EmployeeService,
              private _roleSvc: RoleService,
              private _router: Router,
              private _userSvc: UsersService,
              private enumService: EnumService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.staff.plantId = this.selectedPlant.plantId;
                }
              }

  ngOnInit() {
    this._enumBloodSvc.getEnumList().then(result => this.BloodList = result).catch(error => console.log(error));
    this.enumService.getEmployeeGenericGroupTypeEnum().then((result: any) => this.GroupTypeList = result).catch(error => console.log(error));

    this._countrySvc.getIdNameList().then(result => this.CountryList = result).catch(error => console.log(error));
    this._enumGenderSvc.getEnumList().then(result => this.GenderList = result).catch(error => console.log(error));
    //this._enumGenderSvc.getEnumList().then(result => this.GenderList = result).catch(error => console.log(error));
    //this._departmentSvc.getIdNameList().then(result => this.DepartmentList = result).catch(error => console.log(error));
    // this._empTitleSvc.filter({pageNumber: 1 , pageSize: 1000}).then(result => this.EmployeeTitleList = result).catch(error => console.log(error));
    this._empTitleSvc.getIdNameListByPlantId(this.staff.plantId).then(result => this.EmployeeTitleList = result).catch(error => console.log(error));
    // this._permissionSvc.getList().then(result => this.AllPermissionTree = this.mapToTreeNode(result, 'permission')).catch(error => console.log(error));
    // this._permissionSvc.getPermissionList().then(result => this.PermissionList = result).catch(error => console.log(error));
    this._roleSvc.getList().then((result: any) => {
      // this.RoleListTree = this.mapToTreeNode(result, 'role');
      this.RoleListTree = result;
    }).catch(error => console.log(error));
  }

  reset() {
    this.staff = {
      'address1': null,
      'address2': null,
      'birthDate': null,
      'groupType': null,
      'bloodGroup': null,
      'cityId': null,
      'countryId': null,
      'departmentId': null,
      'description': null,
      dummy: false,
      ccList: null,
    bccList: null,
      'email': null,
      'plantId':null,
      'employeeTitleId': null,
      'firstName': null,
      'gsm': null,
      'phone': null,
      'jobEntryDate': null,
      'jobExitDate': null,
      employeeCostRate: null,
      'lastName': null,
      'password': null,
      'employeeNo': null,
      'gender': null,
      'mediaId': null,
      'rfid': null,
      'identity': null,
      'employeeRoleDtoList': [],
      'employeePermissionDtoList': []
    };
  }

  mapToTreeNode(data, type): TreeNode[] {
    const tempTree = [];
    for (const item of data) {
      if (type === 'role') {
        tempTree.push(<TreeNode>{
          label: item.defaultRoleName,
          data: {type: 'root', parentId: null, item: item},
          selectable: false,
          expanded: true,
          children: !(item.rolePermissions) ? [] : this.mapToNode(item.rolePermissions, type, item.roleId)
        });
      } else if (type === 'permission') {
        tempTree.push(<TreeNode>{
          label: item.permissionGroupName,
          data: {type: 'root', parentId: null, item: item},
          children: !(item.permissionList) ? [] : this.mapToNode(item.permissionList, type, item.permissionGroupId)
        });
      }
    }
    return tempTree;
  }

  mapToNode(data, type, parentId): TreeNode[] {
    const leafNodes = [];
    for (const item of data) {
      if (type === 'role') {
        leafNodes.push(<TreeNode>{
          label: item.permissionName,
          data: {type: 'leaf', parentId: parentId, item: item},
          children: []
        });
      } else if (type === 'permission') {
        leafNodes.push(<TreeNode>{
          label: item.name,
          data: {type: 'leaf', parentId: parentId, item: item},
          children: []
        });
      }
    }
    return leafNodes;
  }

  goPage() {
    this._router.navigate(['/general-settings/staff']);
  }

  countrySelection(event) {
    if (this.staff.countryId != null) {
      this._citySvc.getIdNameList(this.staff.countryId)
        .then(result => this.CityList = result)
        .catch(error => console.log(error));

      this.params.cityDisabled = false;
    } else {
      this.params.cityDisabled = true;
    }
  }

setSelectedPlant(event){
    //console.log("@plantId",event);
    this.staff.plantId = event.plantId;
}

  setLoadedImage(media) {
    if (media.hasOwnProperty('path')) {

      this.staff.mediaId = media.mediaId;
      this.picture = media.path;
    } else {
      this.picture = null;
      this.staff.mediaId = null;
    }
  }

  save() {
    this.loaderService.showLoader();

    this.staff.cityId = +this.staff.cityId;
    this.staff.countryId = +this.staff.countryId;
    this.staff.employeeTitleId = +this.staff.employeeTitleId;

    this._empSvc.save(this.staff)
      .then(staffId => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        // setTimeout(() => {
        //   this.reset();
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
        this.saveImages(staffId);
        // if (this.staff.mediaId) {

        //   this._mediaSvc.updateMedias([this.staff.mediaId], staffId, TableTypeEnum.STAFF);
        // }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  private saveImages(staffId) {
    this.imageAdderComponent.updateMedia(staffId, TableTypeEnum.STAFF).then(() => {
        // this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit();
          this.reset();
        }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));
  }


  changeRoleList(event) {
    this.ExtractedPermissionsAfterUpdate = [];
    const tempList: TreeNode[] = [];

    for (const node of this.SelectedRolesTree) {
      const updatedChildren: TreeNode[] = [];
      for (const children of node.children) {
        children.data.isActive = true;
        children.data.isExternal = false;
        children.data.isInternal = true;
        updatedChildren.push(children);
      }
      node.children = updatedChildren;
      tempList.push(node);
    }
    this.SelectedRolesTree = tempList;
    // console.log(this.SelectedRolesTree);

    // Ust Paneli olusturuyoruz -----------------------------

    this.AllOtherPermissions = this.AllPermissionTree;

    const tempPermissionList = [];
    for (const node of this.AllOtherPermissions) {
      const tempNode = Object.assign({}, node);
      tempNode.children = [];

      for (const children of node.children) {
        let state = false;
        for (const nodeSelect of this.SelectedRolesTree) {
          for (const childrenSelect of nodeSelect.children) {
            // console.log(childrenSelect);
            if (children.data.item.permissionId === childrenSelect.data.item.permissionId) {
              state = true;
            }
          }
        }

        if (!state) {
          children.data.isActive = false;
          children.data.isExternal = true;
          children.data.isInternal = false;
          tempNode.children.push(children);
        }
      }

      if (tempNode.children.length > 0) {
        tempNode.selectable = false;
        tempPermissionList.push(tempNode);
      }
    }
    this.AllOtherPermissions = tempPermissionList;
  }


  //  Role Tree Methods -------------------------------------------------------//

  nodeSelectFromRoleTree(event) {
    this.ExtractedPermissionsAfterUpdate.push(event.node);

    const SelectedRolesTreeAfterUpdate: TreeNode[] = [];

    for (const node of this.SelectedRolesTree) {
      const updatedChildren: TreeNode[] = [];
      for (const children of node.children) {
        if (children.data.item.permissionId !== event.node.data.item.permissionId) {
          children.data.isActive = false;
          updatedChildren.push(children);
        }
        node.children = updatedChildren;
      }
      SelectedRolesTreeAfterUpdate.push(node);
    }
  }

  nodeSelectFromExtractedRoles(event) {
    // First remove from ExtractedPermissionsAfterUpdate list  and add to SelectedRolesTree
    for (const node of this.SelectedRolesTree) {
      if (node.data.item.roleId === event.node.data.parentId) {
        event.node.data.isActive = true;
        node.children.push(event.node);
      }
    }

    const tempList: TreeNode[] = [];

    for (const node of this.ExtractedPermissionsAfterUpdate) {
      if (node.data.item.permissionId !== event.node.data.item.permissionId) {
        tempList.push(node);
      }
    }
    this.ExtractedPermissionsAfterUpdate = tempList;

  }


  //  Permission Tree Methods -------------------------------------------------------//

  nodeSelectFromPermissionTree(event) {
    this.AllOtherExtractedPermissions.push(event.node);

    const SelectedPermissionsTreeAfterUpdate: TreeNode[] = [];

    for (const node of this.AllOtherPermissions) {
      const updatedChildren: TreeNode[] = [];
      for (const children of node.children) {
        if (children.data.item.permissionId !== event.node.data.item.permissionId) {
          children.data.isActive = false;
          updatedChildren.push(children);
        }
        node.children = updatedChildren;
      }
      SelectedPermissionsTreeAfterUpdate.push(node);
    }
  }

  nodeSelectFromExtractedPermissions(event) {
    for (const node of this.AllOtherPermissions) {
      if (node.data.item.permissionGroupId === event.node.data.parentId) {
        event.node.data.isActive = true;
        node.children.push(event.node);
      }
    }

    const tempList: TreeNode[] = [];

    for (const node of this.AllOtherExtractedPermissions) {
      if (node.data.item.permissionId !== event.node.data.item.permissionId) {
        tempList.push(node);
      }
    }
    this.AllOtherExtractedPermissions = tempList;

  }
  onrolesChanged(event) {
    // const roleObject = event.itemValue;
    // this.staff.employeeRoleDtoList.push({roleId: roleObject.roleId, isActive: true, defaultRoleName: roleObject.defaultRoleName});
    this.staff.employeeRoleDtoList = [];
    this.staff.employeePermissionDtoList = [];
    const roleList: any = event.value;
    for (const role of roleList) {
      this.staff.employeeRoleDtoList.push({roleId: role.roleId, isActive: true, defaultRoleName: role.defaultRoleName});

      for (const permission of role.rolePermissions) {
        this.staff.employeePermissionDtoList.push({
          permissionId: permission.permissionId,
          name: permission.permissionName,
          isActive: true,
          isExternal: false,
          isInternal: true
        });
      }

    }

    // console.log('roles', this.staff.employeeRoleDtoList);
    // console.log('permissions', this.staff.employeePermissionDtoList);
  }

  checkPermissionsandRoles() {
    // Once Rolleri ve altindaki permissionlari sonra rollerden cikarilan permissionlari sonrasinda rollere ait olmayan permissionlari ekleyecegiz
    this.staff.employeeRoleDtoList = [];
    this.staff.employeePermissionDtoList = [];
    for (const role of this.SelectedRolesTree) {
      this.staff.employeeRoleDtoList.push({roleId: role.data.item.roleId, isActive: true});
    }
    // Role dahil olanlari ekleyelim ama ikileme olmamasi lazim
    for (const role of this.SelectedRolesTree) {
      for (const child of role.children) {
        let state = false;
        for (const inListData of this.staff.employeePermissionDtoList) {
          if (inListData.permissionId === child.data.item.permissionId) {
            state = true;
          }
        }
        if (!state) {
          this.staff.employeePermissionDtoList.push({
            permissionId: child.data.item.permissionId,
            isActive: true,
            isExternal: false,
            isInternal: true
          });
        }
      }
    }


    // Role dahil olmayanlari ekleyelim fakat burda soyle bir sikinti var ayni rol altinda birden fazla ayni permission var ve
    // birisi dahil digeri dahil degilse conflict olusuyor. Bunu soyle cozduk dahil olmayana adam eklediyse o zaman
    // yukaridaki listede var ise onu listeden cikariyoruz
    const tempList = [];

    for (const node of this.staff.employeePermissionDtoList) {
      let state = false; // listede var ise onu eklemeyecegiz
      for (const perm of this.ExtractedPermissionsAfterUpdate) {
        if (perm.data.item.permissionId === node.permissionId) {
          state = true;
        }
      }
      if (!state) {
        tempList.push(node);
      }
    }

    // Extract edilmisleri ekleyelim
    for (const perm of this.ExtractedPermissionsAfterUpdate) {
      tempList.push({permissionId: perm.data.item.permissionId, isActive: false, isExternal: false, isInternal: true});
    }

    // simdide insereted Permissionlari ekleyelim
    for (const inserted of this.AllOtherExtractedPermissions) {
      console.log(inserted);
      tempList.push({
        permissionId: inserted.data.item.permissionId,
        isActive: true,
        isExternal: true,
        isInternal: false
      });
    }
    this.staff.employeePermissionDtoList = tempList;

    // Alt Menude gozukecek Rol ve Permissionlari duzenleyelim
    this.MenuRolList = [];
    for (const role of this.staff.employeeRoleDtoList) {

      this.MenuRolList.push(
        {
          name: this.RoleListTree.filter(function (x: any) {
            return x.data.item.roleId === role.roleId;
          })[0].label
        }
      );
    }

    this.MenuPermissionList = [];
    for (const permission of this.staff.employeePermissionDtoList) {
      this.MenuPermissionList.push(
        {
          name: this.PermissionList.filter(function (x) {
            return x.permissionId === permission.permissionId;
          })[0].name,
          isActive: permission.isActive,
          isExternal: permission.isExternal,
          isInternal: permission.isInternal
        }
      );
    }
  }

  onShowPassword(){
    this.showPassword = !this.showPassword;
  }


}



