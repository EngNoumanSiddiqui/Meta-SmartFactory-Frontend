import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { FunctionalLocationService } from 'app/services/dto-services/maintenance-equipment/functional-location.service';
/**
 * Created by reis on 31.07.2019.
 */


@Component({
  selector: 'functional-location-detail',
  templateUrl: './detail.component.html'
})
export class FunctionalLocationDetailComponent implements OnInit {

  showLoader = false;

  @Input('data') data: any;

  @Input('id') set functionDetails(id){
    if(id){
      this.functionalLocationService.getDetail(id).then((res)=> {
        this.data = res;
      });
    }
  }
  constructor(private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private functionalLocationService: FunctionalLocationService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
