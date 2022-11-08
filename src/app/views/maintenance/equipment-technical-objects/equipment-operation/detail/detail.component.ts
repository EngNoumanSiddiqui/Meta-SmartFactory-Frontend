/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { EquipmentOperationService } from 'app/services/dto-services/maintenance-equipment/equipment-operation.service';

@Component({
  selector: 'equipment-operation-detail',
  templateUrl: './detail.component.html'
})
export class EquipmentOperationDetailComponent implements OnInit {

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
    private mStrategyService: EquipmentOperationService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
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
          this.data = result;
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

}
