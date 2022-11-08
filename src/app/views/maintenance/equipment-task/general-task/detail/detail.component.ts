/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { EquipmentTaskService } from 'app/services/dto-services/maintenance-equipment/equipment-task.service';

@Component({
  selector: 'equipment-task-detail',
  templateUrl: './detail.component.html'
})
export class EquipmentTaskDetailComponent implements OnInit {

  showLoader = false;

  @Input() data: any;

  constructor(private utilities: UtilitiesService, private mStrategyTypeSvc: EquipmentTaskService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
