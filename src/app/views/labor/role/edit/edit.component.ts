import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TreeNode} from 'primeng';
import {PermissionGroupService} from '../../../../services/dto-services/permissions/permission-group.service';
import {RoleService} from '../../../../services/dto-services/permissions/role.service';
 
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'role-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditRoleComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    if (id) {
      this.id = id;
      // this.initialize(this.id);
    }
  };

  // files: TreeNode[];
  // selectedFiles: TreeNode[] = [];
  dataArray = [];
  role = {
    roleId: null,
    defaultRoleName: null,
    rolePermissions: [],
    active: true
  };

  // ---------- PERMISSION PANEL PARAMETERS ---------------- //
  AllPermissionTree: TreeNode[] = []; // Tum Permission Listesi (/permissionGroup/permissionGroups)
  AllOtherPermissions: TreeNode[] = [];
  selectedPermissions: TreeNode[] = [];

  constructor(private _permissionSvc: PermissionGroupService,
              private _roleSvc: RoleService,
              private _route: ActivatedRoute,
              private _router: Router, private utilities: UtilitiesService,
              private loaderService: LoaderService) {


  }

  initialize(id) {
    this.role.roleId = this.id;
    this.loaderService.showLoader();
    this._roleSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        // this.role.roleId = result['roleId'];
        this.role.defaultRoleName = result['defaultRoleName'];
        this.role.rolePermissions = result['rolePermissions'];
      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
  }

  initdataArray(res) {
    const me = this;
    res.forEach(it => {
      for (let i = 0; i < me.AllOtherPermissions.length; i++) {

        const n = me.AllOtherPermissions[i];
        for (let j = 0; j < n.children.length; j++) {
          const ch = n.children[j];
          if (ch.data.item.permissionId === it.permissionId) {
            me.nodeSelecst(ch);
          }
        }

      }
    });
  }

  ngOnInit() {
    this.loaderService.showLoader();
    if(this.id) {
      Promise.all([this._roleSvc.getDetail(this.id), this._permissionSvc.getList()]).then(result => {
        this.loaderService.hideLoader();
        this.role.roleId = result[0]['roleId'];
        this.role.defaultRoleName = result[0]['defaultRoleName'];
        this.role.rolePermissions = result[0]['rolePermissions'];

        this.AllPermissionTree = this.mapToTreeNode(result[1], 'permission')
        this.doSome();
        this.initdataArray(this.role.rolePermissions);
      })
    }
    // this._permissionSvc.getList().then(result => {
      
    //   this.AllPermissionTree = this.mapToTreeNode(result, 'permission')
    //   this.loaderService.hideLoader();
    // }).then(() => {
    //     this.doSome();
    //     this.initdataArray(this.role.rolePermissions);
    //   }).then(() => {
    //   this.getRoleFormserver();
    // })
    //   .catch(error => {
    //     this.loaderService.hideLoader();
    //     this.utilities.showErrorToast(error)
    //   });
  
  
    // this._permissionSvc.getList().then(result => {
    //   this.AllPermissionTree = this.mapToTreeNode(result, 'permission')
    //   this.loaderService.hideLoader();
    // }).then(() => {
    //     this.doSome();
    //     this.initdataArray(this.role.rolePermissions);
    //   }).then(() => {
    //   // this.getRoleFormserver();
    // })
    //   .catch(error => {
    //     this.loaderService.hideLoader();
    //     this.utilities.showErrorToast(error)
    //   });
  
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
    this._roleSvc.update(this.role).then(() => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('updated-success');
      setTimeout(() => {
        this.saveAction.emit('close');
      }, environment.DELAY);
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }


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
      const count = nodes[i].children.length;
      let c = 0;
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (this.selectedPermissions.includes(nodes[i].children[j])) {
          c++;
        }
        if (nodes[i].children[j].partialSelected) {
          nodes[i].partialSelected = true;
        }
      }
      if (c === 0) {
      } else if (c === count) {
        nodes[i].partialSelected = false;
        if (!this.selectedPermissions.includes(nodes[i])) {
          this.selectedPermissions.push(nodes[i]);
        }
      } else {
        nodes[i].partialSelected = true;
      }
    }
  }


  nodeSelecst(node) {
    this.addNode(node);
    this.selectedPermissions = [];
    this.checkNode(this.AllOtherPermissions, this.dataArray);
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
