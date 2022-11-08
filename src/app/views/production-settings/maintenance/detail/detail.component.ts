import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MaintenanceService} from '../../../../services/dto-services/maintenance/maintenance.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';

@Component({
  selector: 'maintenance-detail',
  templateUrl: './detail.component.html',
})
export class DetailMaintenanceComponent implements OnInit {
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  maintenance;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _maintenanceSvc: MaintenanceService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {

   /* this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.initialize(this.id);
    });*/
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._maintenanceSvc.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        this.maintenance = result;
      }).catch(error => {
      this.loaderService.hideLoader();
        console.log(error)
    });
  }

  ngOnInit() {
  }


  goPage(id) {
    if (id == -1) {
      this._router.navigate(['/settings/maintenance/new']);
    } else {
      this._router.navigate(['/settings/maintenance/edit/' + this.id]);
    }
  }

}
