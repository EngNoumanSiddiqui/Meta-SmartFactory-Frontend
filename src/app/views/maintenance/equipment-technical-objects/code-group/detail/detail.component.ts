/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { EquipmentCodeGroupService } from 'app/services/dto-services/maintenance-equipment/code-group.service';

@Component({
  selector: 'code-group-detail',
  templateUrl: './detail.component.html'
})
export class CodeGroupDetailComponent implements OnInit {

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
    private equipmentService: EquipmentCodeGroupService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }
  private initialize(id) {
    this.loaderService.showLoader();
    this.equipmentService.getDetail(this.id)
      .then((result: any) => {
        this.loaderService.hideLoader();
        if (result) {
         this.data = {
          active: result.active,
          category: result.category,
          createDate: result.createDate,
          equipmentCodeGroupHeaderList: result.equipmentCodeGroupHeaderList,
          equipmentCodeGroupId: result.equipmentCodeGroupId,
          shortText: result.shortText,
          updateDate: result.updateDate
         };
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
