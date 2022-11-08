import { EmployeeTitleService } from './../../../../services/dto-services/employee-title/employee-title.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'emp-new-title',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  employeeTitle =
    {
      "employeeTitleCode": null,
      "employeeTitleDescription": null,
      "employeeTitleId": null,
      "employeeTitleName": null,
      "employeeTitleParentId": null,
      panelMaster: null,
      maintenanceMaster: false,
      reworkMaster: false,
      scrapMaster: false,
      setupMaster: false,
      stopMaster: false,
      "plantId" : null,
    }
  employeeTitleList: any[]=[];

pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  selectedPlant: any;

  constructor(
    private empTitlService: EmployeeTitleService,
    private userSvc: UsersService,
    private utilities: UtilitiesService,
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

  save() {
    this.loaderService.showLoader();
    //console.log('@beforeSave', this.employeeTitle);
    this.empTitlService.saveEmployeeTitle(this.employeeTitle)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
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
      "employeeTitleName": null,
      panelMaster: null,
      maintenanceMaster: false,
      reworkMaster: false,
      scrapMaster: false,
      setupMaster: false,
      stopMaster: false,
      "employeeTitleParentId": null,
      "plantId": null
    }
  }

}
