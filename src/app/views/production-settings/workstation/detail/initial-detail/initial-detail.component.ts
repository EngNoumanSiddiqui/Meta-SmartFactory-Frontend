import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'app-initial-detail',
  templateUrl: './initial-detail.component.html',
  styleUrls: ['./initial-detail.component.scss']
})
export class InitialDetailComponent implements OnInit {
  id;
  workstation: any;

  constructor(private loaderService: LoaderService, private _workstationSvc: WorkstationService) {
  }
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  ngOnInit() {
  }
  private initialize(id) {
    this.loaderService.showLoader();
    this.workstation = this._workstationSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.workstation = result;
        console.log("@detailStation",this.workstation);
      }).catch(error =>
      {
        this.loaderService.hideLoader();
        console.log(error)
      });
}
}
