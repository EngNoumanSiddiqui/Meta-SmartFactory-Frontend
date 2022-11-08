import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DefectLocationsService } from 'app/services/dto-services/defect-location/defect-locations.service'
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'detail-defect-location', 
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'] 
})
export class DetailDefectLocation implements OnInit {

  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  defectLocationType;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _defectLocationsService: DefectLocationsService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._defectLocationsService.detail(this.id).then(
      result => {
        this.defectLocationType = result;
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
