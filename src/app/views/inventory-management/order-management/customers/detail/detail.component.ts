import {Component, Input, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { OrderDetailDto } from 'app/dto/sale-order/sale-order.model';
import { ContactPerson } from 'app/dto/customer/customer.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ImageViewerComponent } from 'app/views/image/image-viewer/image-viewer.component';

@Component({
  selector: 'customer-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailCustomerComponent implements OnInit, AfterViewInit {

  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;

  // tableTypeForImg = TableTypeEnum.COMPANY;
  orderDetail: OrderDetailDto;
  
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  // @ViewChild(ImageAdderComponent, {static: false}) imageAdderComponent: ImageAdderComponent;
  customer;
  contactPersons = new Array<ContactPerson>();
  constructor(private _actSvc: ActService,
              private _route: ActivatedRoute,
              private _router: Router,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.initialize(this.id);
      }
    });
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._actSvc.getDetail(this.id)
      .then(result => {
        this.customer = result;
        this.loaderService.hideLoader();
        this.imageViewerComponent.initImages(this.id, TableTypeEnum.ACCOUNT);
        this._actSvc.accountContactPersonfilter({pageNumber: 1,
          pageSize: 100, actId: this.customer.actId}).then(res => {
            this.contactPersons = res['content'];
          }).catch(error => {
          this.utilities.showErrorToast(error)
        });
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }
  modalPlantShow(plantId) {
    if(plantId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
    }
  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.showImages();  
    // }, 1000);
    
  }
  setSelectedOrderDetail(orderDetail: OrderDetailDto) {
    this.orderDetail = orderDetail;
  }

  // showImages() {
  //   if ((this.imageAdderComponent)) {
  //     if (this.customer && this.customer.actId || this.id) {
  //       this.imageAdderComponent.initImages(this.customer.actId || this.id, this.tableTypeForImg);
  //     }

  //   }
  // }
  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/customers/new']);
    } else {
      this._router.navigate(['/customers/edit/' + id]);
    }
  }

}
