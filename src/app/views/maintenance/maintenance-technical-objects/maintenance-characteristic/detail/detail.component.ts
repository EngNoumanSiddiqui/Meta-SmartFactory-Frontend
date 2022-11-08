import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
/**
 * Created by reis on 31.07.2019.
 */


@Component({
  selector: 'characteristic-detail',
  templateUrl: './detail.component.html'
})
export class CharacteristicDetailComponent implements OnInit {

  showLoader = false;

  @Input('data') detailCharacteristic: any;

  constructor(private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
