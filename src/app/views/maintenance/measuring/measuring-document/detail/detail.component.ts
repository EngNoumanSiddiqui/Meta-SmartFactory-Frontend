import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {MeasuringDocumentService} from '../../../../../services/dto-services/measuring/measuring-document.service';


@Component({
  selector: 'measuring-document-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailMeasuringDocumentComponent implements OnInit {
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input('data') set ze(data) {
    this.measuringDocument = data;
  };


  measuringDocument;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private utilities: UtilitiesService,
              private _measuringDocumentSvc: MeasuringDocumentService,
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
    this._measuringDocumentSvc.getDetail(id)
      .then(result => {
        this.measuringDocument = result;
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

