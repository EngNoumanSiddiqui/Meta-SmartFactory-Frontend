import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SamplingTypeService } from 'app/services/dto-services/sampling-type/sampling-type.service'
import { LoaderService } from 'app/services/shared/loader.service';


@Component({
  selector: 'detail-sampling-type',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailSamplingType implements OnInit {

  
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  samplingType;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _SamplingTypeService: SamplingTypeService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._SamplingTypeService.detailSamplingType(this.id).then(
      result => {
        this.samplingType = result;
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
