/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { MaintenanceStrategyService } from 'app/services/dto-services/maintenance-equipment/maintenance-strategy.service';

@Component({
  selector: 'maintenance-strategy-detail',
  templateUrl: './detail.component.html'
})
export class MaintenanceStrategyDetailComponent implements OnInit {
  showLoader = false;
  id;
  data;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  constructor(private utilities: UtilitiesService,
    private mStrategyService: MaintenanceStrategyService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    // console.log("@shape",this.data);
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.mStrategyService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.data = result as any; // RequestmaintenanceStrategyUpdateDto;
          console.log('details', this.data);
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
   }

}
