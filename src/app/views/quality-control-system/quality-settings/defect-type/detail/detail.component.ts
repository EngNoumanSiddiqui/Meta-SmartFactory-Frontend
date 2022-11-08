import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service' 
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-defect-type',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailDefectType implements OnInit {

  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  defectType;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _defectTypeService: DefectTypeService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._defectTypeService.detailDefectType(this.id).then(
      result => {
        this.defectType = result;
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
