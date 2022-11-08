import { EmployeeTitleService } from './../../../../services/dto-services/employee-title/employee-title.service';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from '../../../../../environments/environment';

import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  employeeTitleList: any[]=[];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };


  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  employeeTitle =
    {
      "employeeTitleCode": null,
      "employeeTitleDescription": null,
      "employeeTitleId": null,
      panelMaster: null,
      maintenanceMaster: false,
      reworkMaster: false,
      scrapMaster: false,
      setupMaster: false,
      stopMaster: false,
      "employeeTitleName": null,
      "employeeTitleParentId": null,
      "plantId": null
    }

    selectedPlant: any;
  constructor(
    private empTitlService: EmployeeTitleService,
    private utilities: UtilitiesService,
    private userSvc: UsersService,
    private loaderService: LoaderService
) {
      this.selectedPlant = JSON.parse(this.userSvc.getPlant());
      this.employeeTitle.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    }
  ngOnInit() {
    // this.filter(this.pageFilter);
  }
  filter(data) {
    this.loaderService.showLoader();
    this.empTitlService.filter(data)
      .then(result => {
        this.employeeTitleList=result['content'];
        console.log("content",this.employeeTitleList);
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  private initialize(id) {
    this.loaderService.showLoader();
    this.employeeTitle.employeeTitleId = this.id;
    this.empTitlService.getEmployeeById(id)
      .then((result: any) => {
        this.loaderService.hideLoader();
          this.employeeTitle = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.empTitlService.saveEmployeeTitle(this.employeeTitle)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.employeeTitle = {
      "employeeTitleCode": null,
      "employeeTitleDescription": null,
      "employeeTitleId": null,
      panelMaster: null,
      maintenanceMaster: false,
      reworkMaster: false,
      scrapMaster: false,
      setupMaster: false,
      stopMaster: false,
      "employeeTitleName": null,
      "employeeTitleParentId": null,
      "plantId":null
    }
  }
}
