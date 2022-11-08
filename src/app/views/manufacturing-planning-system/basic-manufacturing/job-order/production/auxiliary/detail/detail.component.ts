import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'auxiliary-component-detail',
  templateUrl: './detail.component.html'
})

export class DetailAuxiliaryComponent implements OnInit {


  @Input('data') set x(data) {
    console.log('DetailAuxCompon',data)
    if (data) {

      if (!data.requestJobOrderComponentFeatureList) {
        data.requestJobOrderComponentFeatureLis = [];
      }
      this.dataModel = data;
    }
  };


  dataModel;

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }


  featuresUpdated(event) {
    this.dataModel.requestJobOrderComponentFeatureList = event;
  }
}
