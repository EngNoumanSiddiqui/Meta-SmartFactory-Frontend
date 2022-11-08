import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QualityInfoRecordService } from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { ImageViewerComponent } from '../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-inspection-control-data',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailInspectionControlData implements OnInit {
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  inspectionControlData;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _qualityInfoRecordService: QualityInfoRecordService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._qualityInfoRecordService.detailRecord(this.id).then(
      result => {
        this.inspectionControlData = result;
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
