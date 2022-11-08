import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-quality-control-key',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityControlKey implements OnInit {

  
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  qualityControlKey = {
    qmControlKeyId: null,
    qmControlKeyText: null,
    qmControlKeyCode: null,
  };

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _qualityControlKeyServiceService: QualityControlKeyServiceService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._qualityControlKeyServiceService.get(this.id).then(
      (result:any) => {
        this.qualityControlKey = result;
        this.loaderService.hideLoader();
      }).catch(error => {
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
