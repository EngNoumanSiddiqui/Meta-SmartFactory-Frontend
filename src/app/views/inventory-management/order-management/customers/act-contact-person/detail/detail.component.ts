import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActService } from 'app/services/dto-services/act/act.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'contact-peron-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  actStatus;
  actTypes;
  cities;
  countries;
  myModal;
  detailResult: any[];
  constructor(private _actSvc: ActService,
    private _router: Router,
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {

  }
  private initialize(id) {
    this.loaderService.showLoader();
    this._actSvc.getActContactPersonDetail(id).then((result: any) => {
      this.loaderService.hideLoader();
      this.detailResult = result;
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

}
