import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {RoleService} from '../../../../services/dto-services/permissions/role.service';
import { PermissionGroupService } from 'app/services/dto-services/permissions/permission-group.service';
import {Message, TreeNode} from 'primeng';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'role-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailRoleComponent implements OnInit {

  role = {
    roleId: null,
    defaultRoleName: null,
    rolePermissions: null
  };

  dataArray = [];

  id;

  AllPermissionTree: TreeNode[] = []; // Tum Permission Listesi (/permissionGroup/permissionGroups)
  AllOtherPermissions: TreeNode[] = [];
  selectedPermissions: TreeNode[] = [];

  @Input('id') set z(id) {
    if (id) {
      this.id = id;
      this.initialize(this.id);
    }
  };

  constructor(private roleService: RoleService, private _permissionSvc: PermissionGroupService,
    private utilities: UtilitiesService,
              private loaderService: LoaderService) {

  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    Promise.all([this.roleService.getDetail(id), this._permissionSvc.getList()]).then(result => {
      this.role.roleId = result[0]['roleId'];
      this.role.defaultRoleName = result[0]['defaultRoleName'];
      this.role.rolePermissions = result[0]['rolePermissions'];

      this.AllPermissionTree = this.mapToTreeNode(result[1], 'permission');
      this.doSome();
      this.initdataArray(this.role.rolePermissions);
      this.loaderService.hideLoader();
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });;

  }

  ngOnInit() {
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



  // getRoleFormserver() {
  //   this._route.params.subscribe((params) => {
  //     const id = params['id'];
  //     if (id) {
  //       this.id = id;
  //       this.role.roleId = this.id;
  //       this.initialize(this.id);
  //     }
  //   });
  // }

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

    this.AllOtherPermissions.forEach(itm => {
      itm.selectable = false;

      // Disable the children nodes
      if ( !itm.leaf ) {
        itm.children.forEach( node => {
          node.selectable = false;
        })
      }
    });
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
