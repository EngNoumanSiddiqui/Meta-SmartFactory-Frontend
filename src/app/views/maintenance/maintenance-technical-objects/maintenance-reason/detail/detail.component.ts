/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { MaintenanceReasonService } from 'app/services/dto-services/maintenance-equipment/maintenance-reason.service';

@Component({
  selector: 'maintenance-reason-detail',
  templateUrl: './detail.component.html'
})
export class MaintenanceReasonDetailComponent implements OnInit {

  showLoader = false;

  @Input() data: any;

  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(private utilities: UtilitiesService,
    private mReasonService: MaintenanceReasonService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mReasonService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.data = result;
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }



}
