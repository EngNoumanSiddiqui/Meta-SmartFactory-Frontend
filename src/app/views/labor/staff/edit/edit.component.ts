import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Message, TreeNode} from 'primeng';
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';
import {EnumGenderService} from '../../../../services/dto-services/enum/gender.service';
import {EnumBloodGroupService} from '../../../../services/dto-services/enum/blood-group.service';
import {CityService} from '../../../../services/dto-services/city/city.service';
import {CountryService} from '../../../../services/dto-services/country/country.service';
import {EmployeeTitleService} from '../../../../services/dto-services/employee-title/employee-title.service';

import {RoleService} from '../../../../services/dto-services/permissions/role.service';
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {MediaService} from '../../../../services/media/media.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'staff-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditStaffComponent implements OnInit {

  selectedPlant:any;

  @ViewChild('chPwdModal') public chPwdModal: ModalDirective;

  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  newPassword;

  rePassword;

  GroupTypeList = [];
  msgs: Message[] = [];

  tableTypeForImg = TableTypeEnum.STAFF;

  picture: any;
  @Input() cloned = false;

  IsDisabledRFID = true;

  staff = {
    'employeeId': null,
    'address1': null,
    'address2': null,
    'birthDate': null,
    employeeCostRate: null,
    'bloodGroup': null,
    ccList: null,
    bccList: null,
    'cityId': null,
    password: null,
    'countryId': null,
    'departmentId': null,
    'groupType': null,
    'description': null,
    'email': null,
    'employeeTitleId': null,
    'employeeGroupId': null,
    'firstName': null,
    'gsm': null,
    'plantId': null,
    'phone': null,
    'jobEntryDate': null,
    'lastName': null,
    'employeeNo': null,
    'gender': null,
    'identity': null,
    'jobExitDate': null,
    'dummy': false,
    'mediaId': null,
    'rfid': null,
    'districtId': null,
    'employeeRoleDtoList': [],
    'employeePermissionDtoList': []
  };

  @Output() saveAction = new EventEmitter<any>();

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  EmployeeTitleList;

  CountryList;

  CityList;

  DepartmentList;

  BloodList;

  GenderList;

  params = {
    cityDisabled: false,
    dialog: {title: '', inputValue: ''}
  };

  // ---------- PERMISSION PANEL PARAMETERS ---------------- //
  AllPermissionTree: TreeNode[] = []; // Tum Permission Listesi (/permissionGroup/permissionGroups)

  RoleListTree: any = []; // tum Role List

  SelectedRolesTree: TreeNode[] = []; // Atanmis Roller ve Permissionlar

  AllOtherPermissions: TreeNode[] = [];

  AllOtherExtractedPermissions: TreeNode[] = [];

  PermissionList; // Tum Permission List  {permissionId, name, menuCompanentName, active, code}

  ExtractedPermissionsAfterUpdate: TreeNode[] = [];

  selectedroles: any;

  showPassword: boolean = false;
  showRFID = false;

  showPass: boolean = false;

  constructor(private _enumGenderSvc: EnumGenderService,
              private _enumBloodSvc: EnumBloodGroupService,
              private _citySvc: CityService,
              private _countrySvc: CountryService,
              private _empTitleSvc: EmployeeTitleService,
              private _empSvc: EmployeeService,
              private enumService: EnumService,
              private _roleSvc: RoleService,
              private _router: Router,
              private _userSvc: UsersService,
              private _mediaSvc: MediaService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                // if (this.selectedPlant) {
                //   this.staff.plantId = this.selectedPlant.plantId;
                // }

    /*this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.staff.employeeId = this.id;
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {

    // this.reset();
    this.loaderService.showLoader();
    this._empSvc.getDetail(id)
      .then((result: any) => {
        this.loaderService.hideLoader();
        // this.staff = result;
        if(!this.cloned) {
          this.staff.employeeId = this.id;
        } else {
          this.staff.employeeId = null;
          this.staff.employeeNo = null;
          this.id = null;
        }
        if ((result['address2'])) {
          this.staff['address2'] = result['address2'];
        }
        if ((result['dummy'])) {
          this.staff['dummy'] = result['dummy'];
        }
        if ((result['address1'])) {
          this.staff['address1'] = result['address1'];
        }
        if ((result['birthDate'])) {
          this.staff['birthDate'] = result['birthDate'];
        }
        if ((result['bloodGroup'])) {
          this.staff['bloodGroup'] = result['bloodGroup'];
        }
        if ((result['groupType'])) {
          this.staff['groupType'] = result['groupType'];
        }
        if ((result['country'])) {
          this.staff['countryId'] = result['country'].countryId;
        }
        if ((result['employeTitle'])) {
          this.staff['employeeTitleId'] = result['employeTitle'].employeeTitleId;
        }
        if ((result['city'])) {
          this.staff['city'] = result['city'].cityId;
          this.countrySelection(null);
        }
        if ((result['identity'])) {
          this.staff['identity'] = result['identity'];
        }
        if ((result['departmentId'])) {
          this.staff['departmentId'] = result['departmentId'];
        }
        if ((result['description'])) {
          this.staff['description'] = result['description'];
        }
        if ((result['plant'])) {
          this.staff['plantId'] = result['plant'].plantId;
        }
        if ((result['employeeGenericGroup'])) {
          this.staff['employeeGroupId'] = result['employeeGenericGroup'].plantId;
        }

        if ((result['email'])) {
          this.staff['email'] = result['email'];
        }
        if ((result['employeeTitleId'])) {
          this.staff['employeeTitleId'] = result['employeeTitleId'];
        }
        if ((result['firstName'])) {
          this.staff['firstName'] = result['firstName'];
        }
        if ((result['gsm'])) {
          this.staff['gsm'] = result['gsm'];
        }
        if ((result['phone'])) {
          this.staff['phone'] = result['phone'];
        }
        if ((result['jobEntryDate'])) {
          this.staff['jobEntryDate'] = new Date(result['jobEntryDate']);
        }
        if ((result['lastName'])) {
          this.staff['lastName'] = result['lastName'];
        }
        if(!this.cloned) {
          this.staff['employeeNo'] = result['employeeNo'];
        } else {
          this.staff.employeeNo = null;
        }
        if ((result['gender'])) {
          this.staff['gender'] = result['gender'];
        }
        if ((result['jobExitDate'])) {
          this.staff['jobExitDate'] = new Date(result['jobExitDate']);
        }

        if ((result['mediaId'])) {
          this.staff['mediaId'] = result['mediaId'];
          this._mediaSvc.getMedia(result['mediaId']).then(media =>
            this.initPicture(media));
        }
        if ((result['districtId'])) {
          this.staff['districtId'] = result['districtId'];
        }
        if ((result['userStatus'])) {
          this.staff['userStatus'] = result['userStatus'];
        }
        if ((result['employeeRoleDtoList'])) {
          this.staff['employeeRoleDtoList'] = result['employeeRoleDtoList'];
          this.selectedroles = Object.assign([], this.staff.employeeRoleDtoList);
        }
        if ((result['employeePermissionDtoList'])) {
          this.staff['employeePermissionDtoList'] = result['employeePermissionDtoList'];
        }
        this.staff.employeeCostRate = result['employeeCostRate'];
        this.staff.ccList = result['ccList'];
        this.staff.bccList = result['bccList'];
        if ((result['rfid'])) {
          this.staff['rfid'] = result['rfid'];
        }
        // if ((result['employeePermissionDtoList'])) {
        //   this.staff['employeePermissionDtoList'] = result['employeePermissionDtoList'];
        // }
        this.showImages();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  showImages() {
    if ((this.imageAdderComponent)) {
      if (this.staff && this.staff.employeeId || this.id) {
        this.imageAdderComponent.initImages(this.staff.employeeId || this.id, this.tableTypeForImg);
      }

    }
  }

  ngOnInit() {
    this._enumBloodSvc.getEnumList().then(result => this.BloodList = result).catch(error => console.log(error));
    this._countrySvc.getIdNameList().then(result => this.CountryList = result).catch(error => console.log(error));
    this.enumService.getEmployeeGenericGroupTypeEnum().then((result: any) => this.GroupTypeList = result).catch(error => console.log(error));
    this._enumGenderSvc.getEnumList().then(result => this.GenderList = result).catch(error => console.log(error));
    // this._departmentSvc.getIdNameList().then(result => this.DepartmentList = result).catch(error => console.log(error));
    this._empTitleSvc.getIdNameListByPlantId(this.selectedPlant?.plantId).then(result => this.EmployeeTitleList = result).catch(error => console.log(error));
    // this._permissionSvc.getList().then(result => this.AllPermissionTree = this.mapToTreeNode(result, 'permission')).catch(error => console.log(error));
    // this._permissionSvc.getPermissionList().then(result => this.PermissionList = result).catch(error => console.log(error));
    this._roleSvc.getList().then((result: any) => {
      this.RoleListTree = result;
    }).catch(error => console.log(error));
  }
  setSelectedPlant(event){
    // console.log("@plantId",event);
    this.selectedPlant = event;
    this.staff.plantId = event.plantId;
}
  reset() {
    this.staff = {
      'employeeId': this.id,
      'address1': null,
      'address2': null,
      'birthDate': null,
      'bloodGroup': null,
      'groupType': null,
      employeeCostRate: null,
      ccList: null,
      bccList:null,
      dummy: false,
      'employeeGroupId': null,
      password: null,
      'cityId': null,
      'countryId': null,
      'departmentId': null,
      'description': null,
      'email': null,
      'rfid': null,
      'plantId':null,
      'employeeTitleId': null,
      'firstName': null,
      'gsm': null,
      'phone': null,
      'jobEntryDate': null,
      'lastName': null,
      'employeeNo': null,
      'gender': null,
      'identity': null,
      'jobExitDate': null,
      'mediaId': null,
      'districtId': null,
      'employeeRoleDtoList': [],
      'employeePermissionDtoList': []
    };
    this.picture = null;
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


  setLoadedImage(media) {
    if (media.hasOwnProperty('path')) {

      this.staff.mediaId = media.mediaId;
      this.picture = media.path;
    } else {
      this.picture = null;
      this.staff.mediaId = null;
    }
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

  save() {
    this.loaderService.showLoader();
    // this.staff.employeeRoleDtoList = Object.assign([], this.selectedroles);

    this.staff.cityId = +this.staff.cityId;
    this.staff.countryId = +this.staff.countryId;
    this.staff.employeeTitleId = +this.staff.employeeTitleId;

    if (this.selectedroles && this.selectedroles.length > 0) {
      this.staff.employeeRoleDtoList = [];
      this.staff.employeePermissionDtoList = [];
      this.selectedroles.forEach(role => {
        this.onrolesAssingment(role);
      });
    }
    if(this.cloned) {
      this._empSvc.save(this.staff)
      .then((staffId) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        // setTimeout(() => {
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
        this.staff.employeeId = staffId;
        this.saveImages(this.staff.employeeId);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    } else {
    this._empSvc.update(this.staff)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        // setTimeout(() => {
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
        this.saveImages(this.staff.employeeId);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    }
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
    // this.staff.employeeRoleDtoList = [];
    // this.staff.employeePermissionDtoList = [];
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
  }
    onrolesAssingment(role: any) {
        this.staff.employeeRoleDtoList.push({roleId: role.roleId, isActive: true, defaultRoleName: role.defaultRoleName});
        if (role.rolePermissions) {
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
  }

  checkPermissionsandRoles() {

    // Once Rolleri ve altindaki permissionlari sonra rollerden cikarilan permissionlari sonrasinda rollere ait olmayan permissionlari ekleyecegiz
    this.staff.employeeRoleDtoList = [];
    this.staff.employeePermissionDtoList = [];

    for (const role of this.SelectedRolesTree) {
      this.staff.employeeRoleDtoList.push({roleId: role.data.item.roleId, defaultRoleName: role.data.item.defaultRoleName, isActive: true});
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
            name: child.data.item.permissionName,
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
      tempList.push({permissionId: perm.data.item.permissionId, name: perm.data.item.permissionName, isActive: false, isExternal: false, isInternal: true});
    }

    // simdide insereted Permissionlari ekleyelim
    for (const inserted of this.AllOtherExtractedPermissions) {
      console.log(inserted);
      tempList.push({
        permissionId: inserted.data.item.permissionId,
        isActive: true,
        isExternal: true,
        name: inserted.data.item.name,
        isInternal: false
      });
    }
    this.staff.employeePermissionDtoList = tempList;


  }

  private initPicture(media) {
    this.picture = media.path;

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

  changePassword() {


    const data = {
      employeeId: this.id,
      newPassword: this.newPassword
    };

    this._empSvc.resetPassword(data).then(() => {
      this.utilities.showSuccessToast('password-updated-success');
      this.closeChPwdModal();
    })
      .catch(error => this.utilities.showErrorToast(error));

  }

  private resetChModal() {
    this.newPassword = null;
    this.rePassword = null;
  }


  public closeChPwdModal() {
    this.chPwdModal.hide();
    this.resetChModal();
  }

  onShowPassword(){
    this.showPassword = !this.showPassword;
  }

  onShowPass(){
    this.showPass = !this.showPass;
  }
}
