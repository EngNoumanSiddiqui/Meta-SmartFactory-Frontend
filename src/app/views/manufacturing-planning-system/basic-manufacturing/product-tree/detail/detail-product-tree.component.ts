import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageViewerComponent } from 'app/views/image/image-viewer/image-viewer.component';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConvertUtil } from 'app/util/convert-util';
import { Tree } from 'primeng';
import domToPdf from 'dom-to-pdf';
@Component({
  selector: 'detail-product-tree',
  templateUrl: './detail-product-tree.component.html'
})
export class DetailProductTreeComponent implements OnInit {
  @ViewChild(Tree) ptree: Tree ;
  dialog = { visible: false };
  addDocModal = {active: false};
  TreeViewFiles = [];
  selectedTreeViewFile = null;

  showComponentChecked = false;
  isProcessMaterial = true;
  isSemiFinished = true;
  isRawMaterial = true;


  @Input('data') set x(data) {
    this.initData(data);
  }

  @Input('id') set xw(productTreeId) {
    if (productTreeId) {
      this.svcProductTree.get(productTreeId).then(result => {
        this.initData(result);
      }).catch(err => {
        this.utilities.showErrorToast(err);
      })
    }
  }

  @Input() fromList = false;


  stockId;
  hideFilterBody;
  hideBody= true;
  hideFilterAll;

  tableType = TableTypeEnum.PRODUCTTREE;
  imgViewer: ImageViewerComponent = null;

  @ViewChild(ImageViewerComponent)
  set ft(imgViewer: ImageViewerComponent) {
    // const isInit = this.imgViewer != null;
    this.imgViewer = imgViewer;

    // if (!isInit) {
    //   this.showImages();
    // }
  };

  dataModel;

  @Output() saveAction = new EventEmitter<any>();

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private svcProductTree: ProductTreeService) {

  }

  private  initData(data) {
    if (data) {
      if (data.material) {
        data.materialId = data.material.stockId;
        data.materialNo = data.material.stockNo;
        data.stockTypeCode = data.material.stockTypeCode;
        this.stockId = data.material.stockId;
      }
      if (data.plant) {
        data.plantId = data.plant.plantId;
      }
      this.dataModel = data;
      if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length > 0) {
        this.dataModel.productTreeDetailList.forEach(itm => {
          if (itm.operationList) {
            itm.operationList = itm.operationList.sort((a , b) => a.operationOrder - b.operationOrder);
          }
        })
      }
      this.showImages();
    }
  }

  showImages() {
    if ((this.imgViewer)) {
      if (this.dataModel && this.dataModel.productTreeId) {
        this.imgViewer.initImages(this.dataModel.productTreeId, this.tableType);
      }

    }
  }


  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time);
  }

  onTreeViewClicked() {
    this.TreeViewFiles = this.detailList2Node(this.dataModel.productTreeDetailList);
    this.dialog.visible = true;
  }


  detail2Node(detail, frntlevel?, apilevel?) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail, {productTreeDetailList: null}, {stepNo: apilevel, stepFNo: frntlevel}),
        children: detail.productTreeDetailList ? me.detailList2Node(detail.productTreeDetailList, frntlevel, apilevel) : [],
        key: ConvertUtil.getSimpleUId(),
        label: this.generatingLabelName(detail, frntlevel),
        expanded: true
      };
      return node;
    }
    return node;

  }

  exportPDF() {
    
    // const content = document.getElementsByTagName('p-dialog');
    // const content = document.getElementById('product-tree-content');
    var options = {
      filename: 'productTreeView.pdf'
    };
    domToPdf(this.ptree.el.nativeElement, options, function() {
      console.log('done');
    });
  }

  
  detailList2Node(detailList, frntlevel?, apilevel?) {
    const me = this;
    if (!apilevel) {
      apilevel = '';
    } else {
      apilevel = apilevel + '';
    }
    if (!frntlevel) {
      frntlevel = '';
    } else {
      frntlevel = frntlevel + '.';
    }
    const list = [];

    if (detailList) {

      detailList.forEach((item, index) => {
        const frntlvl = (frntlevel + (index !== 0 ? (index + 10) : 10));
        const apilvl = (apilevel + (index !== 0 ? (index + 10) : 10));
        const treeNode = me.detail2Node(item, frntlvl, apilvl);
        list.push(treeNode);
      });

    }
    return list;

  }

  getInputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction < 0) || [] : [];
  }
  getOutputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction > 0) || [] : [];
  }



  generatingLabelName(item, frntlevel?) {
    let label = '';
    // label+= '#lvl=(' + frntlevel + ')';
    item.operationList.forEach((op, index) => {

      label+= op.operation.operationName ;
    
      // label+= '#on=(' +  op.orderNo + ')';
    });
    return label;
  }


  ngOnInit(): void {
  }


  modalEditShow() {
    if(this.dataModel.productTreeId)
      this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREEEDIT, this.dataModel.productTreeId);
  }

  showProductTreeDetail(productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }

}

