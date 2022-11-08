import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '../../../../../services/shared/loader.service';
import { ControlIndicatorDataService } from 'app/services/dto-services/inspection-charateristics/control-indicator-data/controlIndicatorData.service';

@Component({
  selector: 'detail-control-indicator-data',
  templateUrl: './detail.component.html',
})

export class DetailControlIndicatorData implements OnInit {
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  controlIndicatorData;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private _controlIndicatorData: ControlIndicatorDataService,
    private loaderService: LoaderService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._controlIndicatorData.detailControlIndicatorData(id).then(
      result => {
        this.controlIndicatorData = result;
        this.loaderService.hideLoader();
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
