import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import {EquipmentService} from '../../../../../services/dto-services/equipment/equipment.service';
import {ImageViewerComponent} from '../../../../image/image-viewer/image-viewer.component';
import {TableTypeEnum} from '../../../../../dto/table-type-enum';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';

@Component({
  selector: 'equipment-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailEquipmentComponent implements OnInit {


  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set zdata(data) {
    if (data) {
      const datmodel = JSON.parse(JSON.stringify(data));
      this.equipment = datmodel;
    }
  };
  equipment;


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _equipmentSvc: EquipmentService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {
    /*  this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._equipmentSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.equipment = result;

      })
      // .then(() =>
      // this.imageViewerComponent.initImages(this.id, TableTypeEnum.EQUIPMENT))
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }

  ngOnInit() {
  }

  // goPage(id) {
  //   if (id === -1) {
  //     this._router.navigate(['/settings/equipments/new']);
  //   } else {
  //     this._router.navigate(['/settings/equipments/edit/' + this.id]);
  //   }
  // }

}

