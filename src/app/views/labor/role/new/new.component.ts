import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Message, TreeNode} from 'primeng';
import {PermissionGroupService} from '../../../../services/dto-services/permissions/permission-group.service';
import {RoleService} from '../../../../services/dto-services/permissions/role.service';
 
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'role-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewRoleComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  msgs: Message[] = [];
  id;
  role = {
    defaultRoleName: null,
    rolePermissions: [],
    active: true
  };
  params = {
    dialog: {title: '', inputValue: ''}
  };

  // ---------- PERMISSION PANEL PARAMETERS ---------------- //
  AllPermissionTree: TreeNode[] = []; // Tum Permission Listesi (/permissionGroup/permissionGroups)
  AllOtherPermissions: TreeNode[] = [];
  selectedPermissions: TreeNode[] = [];

  constructor(private _permissionSvc: PermissionGroupService,
              private _roleSvc: RoleService,
              private _router: Router, private utilities: UtilitiesService,
              private _translateSvc: TranslateService, private loaderService: LoaderService) {


  }

  ngOnInit() {
    this._permissionSvc.getList().then(result => this.AllPermissionTree = this.mapToTreeNode(result, 'permission'))
      .then(() => this.doSome())
      .catch(error => console.log(error));
  }


  doSome() {

    this.AllOtherPermissions = this.AllPermissionTree;

    const tempPermissionList = [];
    for (const node of this.AllOtherPermissions) {
      const tempNode = Object.assign({}, node);
      tempNode.children = [];

      for (const children of node.children) {
        children.data.isActive = false;
        tempNode.children.push(children);
      }

      if (tempNode.children.length > 0) {
        tempNode.selectable = true;
        tempPermissionList.push(tempNode);
      }
    }
    this.AllOtherPermissions = tempPermissionList;
  }

  reset() {
  }

  mapToTreeNode(data, type): TreeNode[] {
    const tempTree = [];

    for (const item of data) {
      if (type === 'permission') {
        tempTree.push(<TreeNode>{
          label: item.permissionGroupName,
          leaf: false,
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

      if (type === 'permission') {
        leafNodes.push(<TreeNode>{
          label: item.name,
          leaf: true,
          data: {type: 'leaf', parentId: parentId, item: item},
          children: []
        });
      }
    }
    return leafNodes;
  }

  goPage() {
    this._router.navigate(['/general-settings/role']);
  }


  save() {
    this.loaderService.showLoader();
    const tempList = [];

    // simdide insereted Permissionlari ekleyelim
    for (const inserted of this.dataArray) {
      console.log(inserted);
      tempList.push({
        permissionId: inserted.permissionId,
        permissionName: inserted.name,
        active: inserted.active,
        isActive: true,
      });
    }
    this.role.rolePermissions = tempList;
    this._roleSvc.save(this.role).then(() => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {
        this.reset();
        this.saveAction.emit('close');
      }, environment.DELAY);
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }


  /************************* TOASTR & PRIME NG Messages  *************************/
  // Prime NG Growl in other ways Toaster
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs.push({
      severity: severity,
      summary: this._translateSvc.instant(summary),
      detail: this._translateSvc.instant(detail)
    });
    setTimeout(() => {
      this.clearMessage();
    }, 4000);
  }

  clearMessage() {
    this.msgs = [];
  }

  showError(error) {
    let mess = '';
    if (error.toString().indexOf('fieldErrors') > 0) {
      error = JSON.parse(error);
    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += this.msgs + '<strong>' + msg['field'].toString() + '</strong> :' + msg['message'].toString() + '</br>';
      }
      this.showMessage('error', 'error', mess);
    } else if (error['errorCode']) {
      this.showMessage('error', 'error', error['errorCode']);
    } else {
      this.showMessage('error', 'error', error);
    }
  }

  // files: TreeNode[];
  // selectedFiles: TreeNode[] = [];
  dataArray = [];

  checkNode(nodes: TreeNode[], str) {
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].leaf && nodes[i].children[0].leaf) {
        for (let j = 0; j < nodes[i].children.length; j++) {
          if (str.includes(nodes[i].children[j].data.item)) {
            if (!this.selectedPermissions.includes(nodes[i].children[j])) {
              this.selectedPermissions.push(nodes[i].children[j]);
            }
          }
        }
      }
      if (nodes[i].leaf) {
        return;
      }
      this.checkNode(nodes[i].children, str);
      let count = nodes[i].children.length;
      let c = 0;
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (this.selectedPermissions.includes(nodes[i].children[j])) {
          c++;
        }
        if (nodes[i].children[j].partialSelected) nodes[i].partialSelected = true;
      }
      if (c == 0) {
      }
      else if (c == count) {
        nodes[i].partialSelected = false;
        if (!this.selectedPermissions.includes(nodes[i])) {
          this.selectedPermissions.push(nodes[i]);
        }
      }
      else {
        nodes[i].partialSelected = true;
      }
    }
  }

  nodeSelect(event) {
    this.addNode(event.node);
    this.selectedPermissions = [];
    this.checkNode(this.AllOtherPermissions, this.dataArray);
  }

  nodeUnselect(event) {
    this.removeNode(event.node);
    this.selectedPermissions = [];
    this.checkNode(this.AllOtherPermissions, this.dataArray);
  }

  removeNode(node: TreeNode) {
    if (node.leaf) {
      this.dataArray.splice(this.dataArray.indexOf(node.data.item), 1);
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      this.removeNode(node.children[i]);
    }
  }

  addNode(node: TreeNode) {
    if (node.leaf) {
      if (!this.dataArray.includes(node.data.item)) {
        this.dataArray.push(node.data.item);
      }
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      this.addNode(node.children[i]);
    }
  }


}



