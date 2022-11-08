import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PartService} from '../../../../services/dto-services/part/part.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';

@Component({
  selector: 'part-detail',
  templateUrl: './detail.component.html'
})
export class DetailPartComponent implements OnInit {

  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  part;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private utilities: UtilitiesService,
              private _partSvc: PartService,
              private loaderService: LoaderService){
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.initialize(this.id);
      }
    });
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._partSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.part = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/settings/parts/new']);
    } else {
      this._router.navigate(['/settings/parts/edit/' + id]);
    }
  }

}
