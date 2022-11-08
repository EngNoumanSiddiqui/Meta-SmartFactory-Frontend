import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QualityCausesService} from 'app/services/dto-services/quality-causes/quality-causes.service'
@Component({
  selector: 'detail-quality-causes',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityCauses implements OnInit {
 
  @Input('data') set z(data) {
    if (data) {
      this.qualityCausesType = data;
    }
  };
  qualityCausesType;

  constructor(
    private _qualityCausesService: QualityCausesService) {
  }

  
  ngOnInit() {
  }

  handleChange(e) {
    // const index = e.index;
    // this.selectedTab.emit(index);
  }

}
