/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { MaintenanceActivityTypeService } from 'app/services/dto-services/maintenance-equipment/maintenance-activity-type.service';

@Component({
  selector: 'maintenance-activity-type-detail',
  templateUrl: './detail.component.html'
})
export class MaintenanceActivityTypeDetailComponent implements OnInit {

  showLoader = false;

  @Input() data: any;
  id: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  constructor(private utilities: UtilitiesService,
    private mActivityTypeService: MaintenanceActivityTypeService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }
  private initialize(id) {

    this.loaderService.showLoader();
    this.mActivityTypeService.getDetail(this.id)
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

  isLoading() {
    return this.loaderService.isLoading();
  }


}
