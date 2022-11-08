import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { ValuationModeService } from 'app/services/dto-services/valuation-mode/valuation-mode.service'
@Component({
  selector: 'detail-valuation-mode',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailValuationMode implements OnInit {

 
  
  id;
  showTable1 = true;

  @Input('data') set z(data) {
    if (data) {
      this.valuationMode = data;
    }
  };

  valuationMode;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    
    private _valuationModeService: ValuationModeService) {
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
