import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {ImageViewerComponent} from '../../../image/image-viewer/image-viewer.component';
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { OperationTypeToWSTypeService } from 'app/services/dto-services/operation/operation-type-to-ws-type.service';

@Component({
  selector: 'optype-to-wstype-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class OperationTypeWsDetailComponent implements OnInit {
  data: any;
  id: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  
  private initialize(id) {
    this.loaderService.showLoader();
    this.oprtypetowstypeService.getDetails(id)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.data = result;
      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }
  constructor(
    private _router: Router,
    private loaderService: LoaderService,
    private oprtypetowstypeService: OperationTypeToWSTypeService,
    private utilities: UtilitiesService) {
  }

  ngOnInit() {
  }
}
