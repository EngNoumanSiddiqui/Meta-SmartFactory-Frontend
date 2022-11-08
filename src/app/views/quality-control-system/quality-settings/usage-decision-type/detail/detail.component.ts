import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service' 
import { LoaderService } from 'app/services/shared/loader.service';
import { UsageDecisionTypeService } from 'app/services/dto-services/usage-decision-type/usage.decision.type.service';

@Component({
  selector: 'detail-usage-decision-type',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailUsageDecisionType implements OnInit {

  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  usageDecisionType = {
    qmQualityUsageDecisionTypeCode: null,
    qmQualityUsageDecisionTypeDescription: null,
    qmQualityUsageDecisionTypeId: null,
  };

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private _loaderService: LoaderService,
    private _usageDecisionTypeService: UsageDecisionTypeService
    ) {
  }

  private initialize(id: string) {
    this._loaderService.showLoader();
    this._usageDecisionTypeService.detail(this.id).then(
      (result:any) => {
        this.usageDecisionType = result;
        this._loaderService.hideLoader();
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
