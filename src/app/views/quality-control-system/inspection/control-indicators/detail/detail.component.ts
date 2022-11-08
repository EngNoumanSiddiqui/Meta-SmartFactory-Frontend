import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '../../../../../services/shared/loader.service';
import { ControlIndicatorService } from 'app/services/dto-services/inspection-charateristics/control-indicator/controlIndicator.service';

@Component({
  selector: 'detail-control-indicator',
  templateUrl: './detail.component.html',
})

export class DetailControlIndicator implements OnInit {
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  controlIndicator;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private _controlIndicator: ControlIndicatorService,
    private loaderService: LoaderService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._controlIndicator.detailControlIndicator(id).then(
      result => {
        this.controlIndicator = result;
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
