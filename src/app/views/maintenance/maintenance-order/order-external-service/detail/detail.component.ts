/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';

@Component({
  selector: 'maintenance-order-external-service-detail',
  templateUrl: './detail.component.html'
})
export class OrderExternalServiceDetailComponent implements OnInit {

  showLoader = false;

  @Input() data: any;

  constructor(private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
