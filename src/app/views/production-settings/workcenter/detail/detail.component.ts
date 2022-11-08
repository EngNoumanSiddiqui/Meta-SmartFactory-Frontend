import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkcenterService} from '../../../../services/dto-services/workcenter/workcenter.service';
 
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {ImageViewerComponent} from '../../../image/image-viewer/image-viewer.component';
import {LoaderService} from '../../../../services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'workcenter-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailWorkcenterComponent implements OnInit {

  workcenter = {
    'description': null,
    'plant': null,
    'workCenterId': null,
    'workCenterName': null,
    'workCenterNo': null,
    'workCenterStatus': null,
    'workCenterTypeName': null,
    'maxChangeOverCount': null,
    'workStations': []
  }

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;

  constructor(private _workcenterSvc: WorkcenterService,
              private _route: ActivatedRoute,
              private _router: Router,
              private loaderService: LoaderService) {

 /*   this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.initializa(this.id);
    });*/
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._workcenterSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        const wc = result;
        if ((wc['description'])) {
          this.workcenter['description'] = wc['description'];
        }
        if ((wc['workCenterStatus'])) {
          this.workcenter['workCenterStatus'] = wc['workCenterStatus'];
        }
        if ((wc['plant'])) {
          this.workcenter['plant'] = wc['plant'];
        }
        if ((wc['workCenterId'])) {
          this.workcenter['workCenterId'] = wc['workCenterId'];
        }
        if ((wc['workCenterName'])) {
          this.workcenter['workCenterName'] = wc['workCenterName'];
        }
        if ((wc['workCenterNo'])) {
          this.workcenter['workCenterNo'] = wc['workCenterNo'];
        }
        if ((wc['workCenterTypeName'])) {
          this.workcenter['workCenterTypeName'] = wc['workCenterTypeName'];
        }
        if ((wc['maxChangeOverCount'])) {
          this.workcenter['maxChangeOverCount'] = wc['maxChangeOverCount'];
        }
        if ((wc['workStations'])) {
          this.workcenter['workStations'] = wc['workStations'];
        }
      }).then(() =>
      this.imageViewerComponent.initImages(this.id, TableTypeEnum.WORKCENTER))
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
  }

  ngOnInit() {
  }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/settings/workcenter/new']);
    } else {
      this._router.navigate(['/settings/workcenter/edit/' + id]);
    }
  }

  showWorkCenterTypeDetail(workCenterType: any){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTERTYPE, workCenterType);
  }

  showWorkStationDetail(workStationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workStationId);
  }
}
