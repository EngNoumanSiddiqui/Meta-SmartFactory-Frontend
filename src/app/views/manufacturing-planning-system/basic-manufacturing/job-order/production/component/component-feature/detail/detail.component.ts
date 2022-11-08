import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-component-feature-detail',
  templateUrl: './detail.component.html'
})
export class DetailJobOrderComponentFeatureComponent implements OnInit {


  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };


  dataModel;

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }
}
