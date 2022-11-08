import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OrganizationalEmployeeService } from 'app/services/dto-services/organizational-employee/organizational-employee.service';
import { TreeNode } from 'primeng/api';
import { environment } from 'environments/environment';
import { EmployeeTitleService } from 'app/services/dto-services/employee-title/employee-title.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganizationalEmployeeListComponent implements OnInit {

  organizationData: TreeNode[];
  filterModel = {
    "maxLevel":3,
    "titleId": 12
  };
  employeeTitleList: any[]=[];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  @ViewChild('myModal') public myModal: ModalDirective;
  staffModal = {
    modal: null,
    id: null,
    active: false
  };
  constructor(
    private _orgEmpService: OrganizationalEmployeeService,
    private empTitlService: EmployeeTitleService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService
    ) {}

  ngOnInit() {
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.empTitlService.filter(data)
      .then(result => {
        this.employeeTitleList=result['content'];
        this.filterChart(this.filterModel);
      })
      .catch(error => {
        this.utilities.showErrorToast(error)
      });
  }

  filterChart(data){
    this.loaderService.showLoader();
    this._orgEmpService.filterEmployeeOrganizationChart(data).
    then((res:any)=> {
       this.organizationData = res.children;
       if(this.organizationData.length > 0){
         this.organizationData[0].expanded = true;
         this.organizationData[0].type = 'person';
         this.organizationData[0].styleClass = 'ui-person';
         this.expandChildren(this.organizationData[0]);
       }
       this.loaderService.hideLoader();
    }).catch((err)=>{
       console.log(err);
       this.loaderService.hideLoader();
    });
  }
  modalShow(id, mod: string) {
    this.staffModal.id = id;
    this.staffModal.modal = mod;
    this.staffModal.active = true;
    // this.myModal.show();
  }
  analyze(){
    this.filterChart(this.filterModel);
  }
  /**
   * expand all child node by default
   * @param node
   */
  expandChildren(node:TreeNode){
    if(node.children){
      node.expanded=true;
      node.type= 'person';
      node.styleClass= 'ui-person';
      for(let cn of node.children){
        this.expandChildren(cn);
      }
    }
  }
}
