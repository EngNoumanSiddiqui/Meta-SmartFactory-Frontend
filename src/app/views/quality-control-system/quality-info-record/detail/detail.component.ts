import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {QualityInfoRecordService} from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { ImageViewerComponent } from '../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../services/shared/loader.service';
@Component({
  selector: 'detail-quality-info-record',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityInfoRecord implements OnInit {

  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    } 
  };

  qualityInfoRecord;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _qualityInfoRecordService: QualityInfoRecordService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._qualityInfoRecordService.detailRecord(this.id).then(
      result => {
        this.qualityInfoRecord = result;
        this.loaderService.hideLoader();
      },
      error => {
        console.log(error);
      });


    // this._qualityInfoRecordService.getUpdateDetail(this.id).subscribe(
    //   result => {
    //     this.qualityInfoRecord = result;
    //     this.loaderService.hideLoader();
    //   },
    //   error => {
    //     console.log(error);
    //   });
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
