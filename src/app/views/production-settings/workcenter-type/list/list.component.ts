import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'workcenter-type-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  // filteredPlantList: any[] = [];
  workcenterTypes: any = [];
  pageFilter = {
    plantId: null,
    plantName: null
  }
  workcentertypeModal ? = {
    modal: null,
    data: null,
    id: null
  };
  cols = [
    {field: 'workCenterTypeId', header: 'workcenter-type-id'},
    {field: 'workCenterTypeName', header: 'workcenter-type-name'},
    {field: 'plant', header: 'plant'}
  ];
  selectedColumns = [
    {field: 'workCenterTypeId', header: 'workcenter-type-id'},
    {field: 'workCenterTypeName', header: 'workcenter-type-name'},
    {field: 'plant', header: 'plant'}
  ];
  sub: Subscription;

  constructor(
    private wcTypesrv: WorkcenterTypeService,
              private loaderService: LoaderService,
              // private _plantSvc: PlantService, removed filtering by selection as suggested by Metaj
              private utilities: UtilitiesService,
             private _confirmationSvc: ConfirmationService,
             private _translateSvc: TranslateService,
             private appState: AppStateService,
             
              ) {
                
  }

  ngOnInit() {
    // this.filter();
    // this.getAllPlant();
    this.sub = this.appState.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.pageFilter.plantId = res.plantId;
        // this.get(this.pageFilter.plantId);
        this.workCentreTypeId(this.pageFilter.plantId);
      } else {
        this.pageFilter.plantId = null;
        // this.filter();
      }
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  // getAllPlant() {
  //   this._plantSvc.getAllPlants().then((res: any) => {
  //     this.filteredPlantList = res;
  //   })
  // }

  workCentreTypeId(plantId: any) {
    this.workcenterTypes = [];
    if ((plantId)) {
      this.wcTypesrv.getWorkCentreTypeByPlantId(plantId).then(result => {
        this.workcenterTypes = result;
      })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });
    } else {
      this.filter();
    }
    
  }

  filter() {
    this.wcTypesrv.getIdNameList().then(result => {
      this.loaderService.hideLoader();
      this.workcenterTypes = result;
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }

  modalShow(id, mod: string, data) {
    this.workcentertypeModal.id = id;
    this.workcentertypeModal.modal = mod;
    this.workcentertypeModal.data = data;
    this.myModal.show();
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.wcTypesrv.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.workCentreTypeId(this.pageFilter.plantId);
          })
          .catch(error => {
            if (error === 'THERE_ARE_RELATED_DATA_YOU_CAN_NOT_DELETE') {
              this.utilities.showWarningToast(error, 'Relation With WorkCenter');
            } else {
              this.utilities.showErrorToast(error);
            }
          });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}
