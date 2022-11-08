import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {OrderExternalServiceService} from '../../../../../services/dto-services/maintenance-equipment/order-external-service.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'maintenance-order-external-service-edit',
  templateUrl: './edit.component.html'
})
export class EditOrderExternalServiceComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel = {
    maintenanceExternalServicId: null,
    plannedFinishDate: null,
    plannedStartDate: null,
    actualFinishDate: null,
    actualStartDate: null,
    currency: null,
    externalServiceId: null,
    grossPrice: null,
    maintenanceOrderIdId: null,
    quantity: null,
    quantityUnit: null
  };
  detailData;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private mStrategyService: OrderExternalServiceService) {

  }

  ngOnInit() {
    this.initialize(this.id);
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mStrategyService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        if (result) {
          if (result['plannedFinishDate']) {
            this.dataModel.plannedFinishDate = result['plannedFinishDate'];
          } if (result['plannedStartDate']) {
            this.dataModel.plannedStartDate = result['plannedStartDate'];
          } if (result['actualFinishDate']) {
            this.dataModel.actualFinishDate = result['actualFinishDate'];
          } if (result['actualStartDate']) {
            this.dataModel.actualStartDate = result['actualStartDate'];
          } if (result['currency']) {
            this.dataModel.currency = result['currency'];
          }
          if (result['grossPrice']) {
            this.dataModel.grossPrice = result['grossPrice'];
          }
          if (result['quantity']) {
            this.dataModel.quantity = result['quantity'];
          }
          if (result['quantityUnit']) {
            this.dataModel.quantityUnit = result['quantityUnit'];
          }
          if (result['externalService']) {
            this.dataModel.externalServiceId = result['externalService'].externalServiceId;
          }
          if (result['maintenanceExternalServicId']) {
            this.dataModel.maintenanceExternalServicId = result['maintenanceExternalServicId'];
          }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  setSelectedService(externalService) {
    if (externalService) {
      this.dataModel.externalServiceId = externalService.serviceId;
    } else {
      this.dataModel.externalServiceId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.cancel();
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.dataModel = {
      maintenanceExternalServicId: null,
      plannedFinishDate: null,
      plannedStartDate: null,
      actualFinishDate: null,
      actualStartDate: null,
      currency: null,
      externalServiceId: null,
      grossPrice: null,
      maintenanceOrderIdId: null,
      quantity: null,
      quantityUnit: null
    };
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
