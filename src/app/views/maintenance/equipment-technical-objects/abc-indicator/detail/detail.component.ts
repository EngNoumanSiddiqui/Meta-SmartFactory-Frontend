import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { EquipmentAbcIndicatorService } from 'app/services/dto-services/maintenance-equipment/abc-indicator.service';
/**
 * Created by reis on 31.07.2019.
 */


@Component({
  selector: 'abcindicator-detail',
  templateUrl: './detail.component.html'
})
export class AbcIndicatorDetailComponent implements OnInit {

  showLoader = false;

  @Input('veriler') veriler: any;
  id: any;

  @Input('id') set z(id) {
    
    if (id) {
      this.id = id;
      this.initialize(this.id);
    }
  };
  constructor(private utilities: UtilitiesService,
    private equipmentService: EquipmentAbcIndicatorService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.equipmentService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.veriler = result;
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }


}
