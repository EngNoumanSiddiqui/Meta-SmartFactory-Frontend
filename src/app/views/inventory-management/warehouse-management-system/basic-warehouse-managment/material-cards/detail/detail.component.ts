import { AfterViewInit, Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ImageViewerComponent } from 'app/views/image/image-viewer/image-viewer.component';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';

@Component({
  selector: 'material-card-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.css']
})

export class DetailMaterialCardComponent implements OnInit, AfterViewInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  purchasingScreen = {
    baseUnit: null,
    batchManagement: null,
    orderUnit: null,
    plantId: null,
    plantName: null,
    wareHouseName: null,
    stockId: null,
    stockName: null,
    stockPurchasingCode: null,
    stockPurchasingId: null,
    supplierLeadTimeDay: null,
    maxOrderSizePerWeek: null
  };
  infoRecordsList: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set zdata(data) {
    // console.log('@DetailData', data)
    if (data) {
      this.id = data.stockId;
      this.stock = JSON.parse(JSON.stringify(data));
      if (this.stock.defaultProductTreeId && this.stock.productTreeList && this.stock.productTreeList.length > 0) {
        const productTree = this.stock.productTreeList.find(itm => this.stock.defaultProductTreeId === itm.productTreeId);
        this.stock.defaultProductTreereVisionNo = productTree ? productTree.revisionNo : '';
      }
      if (data.productionOrderWareHouseId) {
        this.stock.productionOrderWareHouseName = data.productionOrderWareHouseId.wareHouseName;
        this.stock.productionOrderWareHouseId = data.productionOrderWareHouseId.wareHouseId;
        
      }
      if (this.stock.stockPurchasing) {
        this.purchasingScreen = this.stock.stockPurchasing;
        this.purchasingScreen.wareHouseName = this.stock.purchaseOrderWarehouseId?.wareHouseName;
      }
      console.log('@stockPurchasing', this.purchasingScreen);
    }
  };

  stock;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _stockSvc: StockCardService,
    private loaderService: LoaderService) {

    /* this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.initialize(this.id);
     });*/
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._stockSvc.getDetail(this.id)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.stock = result;
        if (this.stock.defaultProductTreeId && this.stock.productTreeList && this.stock.productTreeList.length > 0) {
          const productTree = this.stock.productTreeList.find(itm => this.stock.defaultProductTreeId === itm.productTreeId);
          this.stock.defaultProductTreereVisionNo = productTree ? productTree.revisionNo : '';
          // if (result.productionOrderWareHouseId) {
          //   this.stock.productionOrderWareHouseId = result.productionOrderWareHouseId.wareHouseId;
          // }
        }
        if (this.stock.productionOrderWareHouseId) {
          this.stock.productionOrderWareHouseName = this.stock.productionOrderWareHouseId.wareHouseName;
          this.stock.productionOrderWareHouseId = this.stock.productionOrderWareHouseId.wareHouseId;
          
        }
        if (this.stock.stockPurchasing) {
          this.purchasingScreen = this.stock.stockPurchasing;
          // this.purchasingScreen.wareHouseName = this.stock.purchaseOrderWarehouseId?.wareHouseName;
        }


        console.log('stock',this.stock)
      }).catch(err => {
        console.log(err);
      })
  }

  ngOnInit() {
  }


  ngAfterViewInit() {

    if (this.id) {
      this.imageViewerComponent.initImages(this.id, TableTypeEnum.STOCK);
    }
  }
  handleChange(e) {
    let index = e.index;
    this.selectedTab.emit(index);
  }
  // goPage(id) {
  //   if (id === -1) {
  //     this._router.navigate(['/stocks/stockcards/new']);
  //   } else {
  //     this._router.navigate(['/stocks/stockcards/edit/' + id]);
  //   }
  // }

  showDetailDialog(id, type:string){
    
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }
}
