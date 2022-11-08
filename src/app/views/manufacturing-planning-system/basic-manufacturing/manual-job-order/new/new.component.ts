import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import { ManualJobOrderDto } from 'app/dto/manual-job-order/manual-job-order.model';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ManualJobOrderService } from 'app/services/dto-services/manual-job-order/manual-job-order.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'manual-job-order-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewManualJobOrderComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: ManualJobOrderDto = new ManualJobOrderDto();

  plannedTime = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  };

  maxStandbyTime = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  };

  workStations = [
    { workStationId: 1, workStationName: 'work station1' },
    { workStationId: 2, workStationName: 'work station2' },
    { workStationId: 3, workStationName: 'work station3' },
  ];

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _manualJobOrderSvc: ManualJobOrderService) {

  }

  ngOnInit() {

  }

  save() {
    this.dataModel.plannedTime = this.plannedTime;
    this.dataModel.maxStandbyTime = this.maxStandbyTime;
    this.loaderService.showLoader();
    this._manualJobOrderSvc.save(this.dataModel)
      .subscribe(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

  }
}
