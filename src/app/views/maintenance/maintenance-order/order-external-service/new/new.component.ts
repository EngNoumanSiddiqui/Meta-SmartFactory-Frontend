import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {OrderExternalServiceService} from '../../../../../services/dto-services/maintenance-equipment/order-external-service.service';
@Component({
  selector: 'maintenance-order-external-service-new',
  templateUrl: './new.component.html'
})
export class NewOrderExternalServiceComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    plannedFinishDate: null,
    plannedStartDate: null,
    actualFinishDate: null,
    actualStartDate: null,
    currency: null,
    externalServiceId: null,
    grossPrice: null,
    maintenanceOrderOperaionId: null,
    quantity: null,
    quantityUnit: null
  };

  @Input() maintenanceOrderOperaionId;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private mStrategyService: OrderExternalServiceService) {

  }

  ngOnInit() {
  }

  setSelectedService(externalService) {
    if (externalService) {
      this.dataModel.externalServiceId = externalService.serviceId;
    } else {
      this.dataModel.externalServiceId = null;
    }
  }

  save() {
    this.dataModel.maintenanceOrderOperaionId = this.maintenanceOrderOperaionId;
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.maintenanceOrderId = null;
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      plannedFinishDate: null,
      plannedStartDate: null,
      actualFinishDate: null,
      actualStartDate: null,
      currency: null,
      externalServiceId: null,
      grossPrice: null,
      maintenanceOrderOperaionId: null,
      quantity: null,
      quantityUnit: null
    }
  }
}
