import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import { ManualJobOrderDto } from 'app/dto/manual-job-order/manual-job-order.model';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ManualJobOrderService } from 'app/services/dto-services/manual-job-order/manual-job-order.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'manual-job-order-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditManualJobOrderComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: ManualJobOrderDto = new ManualJobOrderDto();
  detailData;
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
    this.initialize(this.id);
  }


  private initialize(id) {
    this.loaderService.showLoader();
    this._manualJobOrderSvc.getUpdateDetail(id)
      .subscribe(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        if ((result['workStation'])) {
          this.dataModel.workStation = result['workStation'];
        }
        if ((result['quantity'])) {
          this.dataModel.quantity = result['quantity'];
        }
        if ((result['plannedTime'])) {
          this.dataModel.plannedTime = result['plannedTime'];
        }
        if ((result['maxStandbyTime'])) {
          this.dataModel.maxStandbyTime = result['maxStandbyTime'];
        }
        if ((result['description'])) {
          this.dataModel.description = result['description'];
        }
      },error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.loaderService.showLoader();
    this._manualJobOrderSvc.update(this.id, this.dataModel)
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

  cancel() {
    this.saveAction.emit('close');
  }

  reset() {

  }

}
