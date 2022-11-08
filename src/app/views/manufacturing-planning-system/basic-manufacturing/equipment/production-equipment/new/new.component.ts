import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeEquipmentService } from 'app/services/dto-services/product-tree/prouduct-tree-equipment.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'product-tree-equipment-new',
  templateUrl: './new.component.html'
})
export class NewProductTreeEquipmentComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() saveAction = new EventEmitter<any>();

  @Input() productTreeDetailId;




  dataModel= {
    count: null,
    stockId: null,
    stock:null,
    capacity: null,
    productTreeDetailId: null,
    productTreeDetailEquipmentId: null
  };

  @Input('data') set x(data) {
    if (data) {
      if(data.stock) {
        data.stockId = data.stock.stockId;
      }
      // data.equipmentId = data.equipment.equipmentId;
      this.dataModel = data;
    }
  };

  @Input('openModalType') set onmodal(openModalType) {
    if (openModalType !== null && openModalType !== undefined) {
      setTimeout(() => {
        this.myModal.show();
      }, 1000);
    }
  }
  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeEquipmentService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  save() {

    if (!this.dataModel.stockId) {

      this.utilities.showWarningToast('equipment-must-be-selected');
      return;
    }

    this.loaderService.showLoader();

    // if productTreeDetailId  is not null, that mean this equipment will be saved  or update standalone
    if (this.productTreeDetailId) {
      this.dataModel.productTreeDetailId = this.productTreeDetailId;
      this._compSvc.save(this.dataModel)
        .then(result => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('saved-success');
          setTimeout(() => {
            this.saveAction.emit(result);
          }, environment.DELAY);
        })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });
    } else { // this mean equipment will be saved after detail saved
      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }


  }

  setSelectedStock(equipment) {
    if (equipment) {
      this.dataModel.stockId = equipment.stockId;
      this.dataModel.stock = equipment;
    } else {
      this.dataModel.stock = null;
      this.dataModel.stockId = null;
    }
  }

}
