import { OperationService } from './../../../../services/dto-services/operation/operation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  workstationCategories: any = [];
  
  workstationcategoryModal = {
    modal: null,
    data: null,
    id: null
  };


  cols = [
    {field: 'wsCatId', header: 'category-id'},
    {field: 'wsCatName', header: 'category-name'},
    {field: 'wsCatCode', header: 'category-code'},
    {field: 'wsCatDescription', header: 'description'}
  ];
  selectedColumns = [
    {field: 'wsCatId', header: 'category-id'},
    {field: 'wsCatName', header: 'category-name'},
    {field: 'wsCatCode', header: 'category-code'},
    {field: 'wsCatDescription', header: 'description'}
  ];

  constructor(
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _workStationSvc: WorkstationService,
             private _confirmationSvc: ConfirmationService,
             private _translateSvc: TranslateService,
             
              ) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {
    this._workStationSvc.getCategoryList().then(result => {
      this.loaderService.hideLoader();
      this.workstationCategories = result;
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  modalShow(id, mod: string, data) {
    this.workstationcategoryModal.id = id;
    this.workstationcategoryModal.modal = mod;
    this.workstationcategoryModal.data = data;
    this.myModal.show();
  }
  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._workStationSvc.deleteCategory(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter();
          })
          .catch(error => this.utilities.showErrorToast(error));

      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}
