import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {ImageViewerComponent} from '../../../image/image-viewer/image-viewer.component';
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: 'workstation-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailWorkstationComponent implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Output() saveAction = new EventEmitter();

  workstation: any;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _workstationSvc: WorkstationService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
    /*   this._route.params.subscribe((params) => {
     this.id = params['id'];
     });*/
  }

  ngOnInit() {
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._workstationSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.workstation = result;
      }).then(() =>
        this.imageViewerComponent.initImages(this.id, TableTypeEnum.WORKSTATION))
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }

  getReadableTime(time) {
    if (time) {

      return ConvertUtil.longDuration2DHHMMSSTime(time)
    }
    return '';
  }
  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/settings/workstation/new']);
    } else {
      this._router.navigate(['/settings/workstation/edit/' + id]);
    }
  }

  showWorkStationTypeDetail(workstationType) {
    let data = {
      workStationTypeId: workstationType.workStationTypeId,
      workStationTypeName: workstationType.workStationTypeName
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATIONTYPE, data);
  }

  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showWorkStationDetails(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showWarehouseDetail(warehouseId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  showWorkStationCategoryDetail(category){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATIONCATEGORY, category);
  }

  showWorkcenterDetail(workcenteId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTER, workcenteId);
  }
  showLocationDetail(id) { 
    this.loaderService.showDetailDialog(DialogTypeEnum.LOCATION, id);
  }
}
