import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QualitySystemsService } from 'app/services/dto-services/quality-systems/quality-systems.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-quality-system',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityStstem implements OnInit {

  
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  qualitySystem;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _qualitySystemsService: QualitySystemsService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._qualitySystemsService.detail(this.id).then(
      result => {
        this.qualitySystem = result;
        this.loaderService.hideLoader();
      }).catch(      error => {
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
