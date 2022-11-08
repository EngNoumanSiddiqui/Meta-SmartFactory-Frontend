import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {MeasuringPointService} from '../../../../../services/dto-services/measuring/measuring-point.service';


@Component({
  selector: 'measuring-point-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailMeasuringPointComponent implements OnInit {
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set zr(data) {
    this.measuringPoint = data;
  };
  measuringPoint;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private utilities: UtilitiesService,
              private _measuringPointSvc: MeasuringPointService,
              private loaderService: LoaderService) {

    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._measuringPointSvc.getDetail(id)
      .then(result => {
        this.measuringPoint = result;
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }



}

