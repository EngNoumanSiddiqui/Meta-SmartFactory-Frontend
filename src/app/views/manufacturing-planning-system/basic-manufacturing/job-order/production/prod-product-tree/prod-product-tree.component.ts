import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { ConfirmationService, TreeTable } from 'primeng';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prod-product-tree',
  templateUrl: './prod-product-tree.component.html',
  styleUrls: ['./prod-product-tree.component.scss']
})
export class ProdProductTreeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('dt') public treeTable: TreeTable;
  dataModel = null;
  selectedProductTrees = null;
  selectedOperationForDuration = null;

  addDurationModal = {active: false};
  addProdOperationModal = {active: false};
  // addJobOperationmodal = {active: false};

  prodTreeSelectedRowData = null;
  // operationSelectedIndex = -1;

  @Input('productTreeId') productTreeId = null;
  @Input('orderQuantity') orderQuantity = null;
  operationSelectedIndex = -1;
  selectedProdItemOperation = null;
  sub: Subscription;
  counter: number = 1;
  tableData = [];

  constructor(private _loaderSvc: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private svcProductTree: ProductTreeService,
    private _prodOrderSvc: ProductionOrderService,
    private cdx: ChangeDetectorRef,
    private utilities: UtilitiesService) { }

  ngOnInit() {

    // this.sub = this._prodOrderSvc.saveEventFire.asObservable().subscribe(res => {
    //   if (res && this.counter === 1) {
    //     this.save();
    //   }
    // });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if(simpleChanges.productTreeId.currentValue) {
     this.detail(simpleChanges.productTreeId.currentValue);
    }
  }
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  expandORcollapse(nodes) {
    for (const node of nodes) {
      if (node.children) {
        if (node.expanded === true) {
          node.expanded = false;
        } else {
          node.expanded = true;
        }
        for (const cn of node.children) {
          this.expandORcollapse(node.children);
        }
      }
    }
  }

  detail(id) {
    this.svcProductTree.get(id).then(result => {
      this.initialize(result);
    }).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }
  initialize(dt) {
    let data = JSON.parse(JSON.stringify(dt));
      if (data.startDate) {
        data.startDate = new Date(data.startDate);
      }
      if (data.expiryDate) {
        data.expiryDate = new Date(data.expiryDate);
      }
      if (data.lastModeDate) {
        data.lastModeDate = new Date(data.lastModeDate);
      }
      if (data.material) {
        data.materialId = data.material.stockId;
      }
      if (data.plant) {
        data.plantId = data.plant.plantId;
        // this.plantName = data.plant.plantName;
      }
      if (data.workstation) {
        data.workstationId = data.workstation.workStationId;
      }
      this.dataModel = Object.assign({}, data);
      this.dataModel.productTreeDetailList.forEach(prdetail => {
        this.setWorkstationId(prdetail);
      });
      this.tableData = this.detailList2Node(this.dataModel.productTreeDetailList);
     

      setTimeout(() => {
        this.expandORcollapse(this.tableData);
        this.tableData = [...this.tableData];
      }, 200);

      console.log(this.dataModel);
  }

  setWorkstationId (prdetail) {
    if (prdetail.workstation) {
      prdetail.workstationId = prdetail.workstation.workStationId;
    } 
    if (prdetail.productTreeDetailList && prdetail.productTreeDetailList.length > 0) {
      prdetail.productTreeDetailList.forEach(dt => {
        this.setWorkstationId(dt);
      });
    }
    if (prdetail.productionType && typeof(prdetail.productionType) === 'object') {
      prdetail.productionType = prdetail.productionType.message;
    }
    if (prdetail.operationList && prdetail.operationList.length > 0) {
      prdetail.operationList = prdetail.operationList.sort((a, b) => a.operationOrder - b.operationOrder);
      prdetail.operationList.forEach(operation => {
        if(operation.variableCost) {
          operation.variableCostRate = operation.variableCost;
          operation.variableCost = parseFloat(
            (ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.variableCostRate)
            .toFixed(1));
        }
        
        if(operation.laborCost) {
          operation.laborCostRate = operation.laborCost;
          operation.laborCost = parseFloat(
            (ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.laborCostRate)
            .toFixed(1));
        }
        operation.componentList = operation.productTreeDetailComponentList || [] ;
        delete operation.productTreeDetailComponentList;
      });
    }
  }

  onToggle(event, rowNode) {
    rowNode.node.expanded = !rowNode.node.expanded;
    if (rowNode.node.expanded) {
      this.treeTable.onNodeExpand.emit({
        originalEvent: event,
        node: rowNode.node
      });
    } else {
      this.treeTable.onNodeCollapse.emit({
        originalEvent: event,
        node: rowNode.node
      });
    }
    this.treeTable.updateSerializedValue();
    this.treeTable.tableService.onUIUpdate(this.treeTable.value);
    event.preventDefault();
  }
  marginLeft = (level) => {
    if ((level * 5) > 90) {
      return 90;
    }
    return (level * 5);
  }
  detail2Node(detail, frntlevel?, apilevel?) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail, {productTreeDetailList: null}, {stepNo: apilevel, stepFNo: frntlevel}),
        children: (detail.productTreeDetailList && detail.productTreeDetailList.length) ? me.detailList2Node(detail.productTreeDetailList, frntlevel, apilevel) : [],
        key: ConvertUtil.getSimpleUId(),
        expanded: !!detail.expanded
      };
      return node;
    }
    return node;

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
        let frntlvl = ''
        let apilvl = ''
        if(index === 0) {
          frntlvl = frntlevel + 10;
          apilvl = apilevel + 10;
        } else {
          for (let i = 0; i <= index; i++) {
            frntlvl = i==0 ? frntlevel + 10 : (frntlvl + '.' + 10);
            apilvl = i==0 ? apilevel + 10 : apilvl + 10;
            // apilvl = apilevel + 10;
          }
        }
        // const frntlvl = (frntlevel + (index !== 0 ? (index + 10) : 10));
        // const apilvl = (apilevel + (index !== 0 ? (index + 10) : 10));
        const treeNode = me.detail2Node(item, frntlvl, apilvl);
        list.push(treeNode);
      });

    }
    return list;

  }
  nodeList2DetailData(nodes) {
    const me = this;
    const list = nodes.map(item => {
      return me.node2DetailData(item);
    });

    return list;

  }

  node2DetailData(node) {
    const me = this;
    let data = null;
    if (node) {
      data = Object.assign({}, node.data, {expanded: node.expanded});
      data.productTreeDetailList = me.nodeList2DetailData(node.children);
      return data;
    }
    return data;
  }


  showOperationDetail(opearationId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }
  showStockDetail(stockId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  addNewChild(rowNode, mode) {
    let component = null;
    if (rowNode.data.operationList && rowNode.data.operationList.length > 0
      && rowNode.data.operationList[0].componentList) {
      component = rowNode.data.operationList[0].componentList.find(itm => itm.direction === -1);
    }
    const dataDetailModel = {
      productTreeId: this.productTreeId,
      productTreeDetailId: null,
      operationRepeat: 1,
      processControlFrequency: 1,
      productionType: rowNode.data.productionType || 'STANDARD',
      plannedCycleQuantity : 1,
      parentId: rowNode.data.productTreeDetailId,
      singleDuration: 0,
      singleSetupDuration: 0,
      singleTotalDuration: 0,
      maxSingleStandbyDuration: 0,
      componentList: [],
      operationList: [
        {
          defaultStockId : null,
          defaultStock : null,
          description : null,
          maxSingleStandbyDuration : null,
          operationId : null,
          operationOrder : 1,
          operationRepeat : 1,
          parent : true,
          plannedCycleQuantity : 1,
          processControlFrequency : 1,
          productTreeDetailId : null,
          productTreeDetailOperationId : null,
          productTreeDetailWorkstationProgramList : null,
          quantity : this.orderQuantity,
          componentList: [],
          singleDuration : null,
          singleSetupDuration : null,
          singleTotalDuration : null,
          workStationId : null,
          workStation : null,
          operation: null
        }
      ],
      equipmentList: [],
      workstationProgramList: [],
      workstationId: null,
      workstation: null,
      orderNo: null,
    };
    if (component && (component.component.make || component.component.stockTypeCode === 'PROC')) {
      dataDetailModel.operationList[0].componentList.push({
        quantity: 1,
        quantityUnit: component.component.baseUnit,
        direction: 1,
        productTreeDetailComponentId: null,
        productTreeDetailId: null,
        componentId:  component.component.stockId,
        component:  component.component,
        auxfeature: null,
        numberOfEdge: null,
        productTreeDetailComponentFeatureList: []
      });
    }
    const detailchild = Object.assign({}, dataDetailModel);
    const node = this.detail2Node(detailchild);
    node.expanded = true;
    if (rowNode) {
      rowNode.expanded = true;
      rowNode.children = [node, ...rowNode.children];
      // this.tableData = [...this.tableData];
    } else {
      this.tableData = [...this.tableData, node];
    }
    this.onTableDataChange();
   
  }


  getTotalCostOfProductTreeItem = (joborder) => {
    let total = 0;
    joborder.operationList.forEach(op => {
      if(op.variableCost) {
        total = total + op.variableCost;
      }
      if(op.laborCost) {
        total = total + op.laborCost;
      }
      op.componentList.forEach(cmp => {
        if(cmp.materialCost) {
          total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
        }
      });
    });

    return total.toFixed(2);
  }
  getFinalCost = () => {
    let total = 0;
    if(this.dataModel && this.dataModel.productTreeDetailList) {
      this.dataModel.productTreeDetailList.forEach(prd => {
        prd.operationList.forEach(op => {
          if(op.variableCost) {
            total = total + op.variableCost;
          }
          if(op.laborCost) {
            total = total + op.laborCost;
          }
          op.componentList.forEach(cmp => {
            if(cmp.materialCost) {
              total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
            }
          });
          if(prd.productTreeDetailList && prd.productTreeDetailList.length) {
            total = total + this.countCost(prd.productTreeDetailList);
          }
        });
      });
    }

    return total.toFixed(2);
  }

  countCost(list) {
    let total = 0;
    if(!list || !list.length) {
      return total;
    }
    list.forEach(prd => {
      prd.operationList.forEach(op => {
        if(op.variableCost) {
          total = total + op.variableCost;
        }
        if(op.laborCost) {
          total = total + op.laborCost;
        }
        op.componentList.forEach(cmp => {
          if(cmp.materialCost) {
            total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
          }
        });
      });
      if(prd.productTreeDetailList && prd.productTreeDetailList.length) {
        total = total + this.countCost(prd.productTreeDetailList);
      }
    });
    return total;
  }

  addProdTreeLevelOperation(index) {
    // this.prodTreeSelectedIndex = index;
    // this.operationSelectedIndex = operationIndex;
    this.addProdOperationModal.active = true;
  }
  openOperationModal(operation, rowIndex, rowData) {
    // this.prodTreeSelectedIndex = rowIndex;
    this.prodTreeSelectedRowData = rowData;
    this.selectedProdItemOperation = operation;
    this.addProdOperationModal.active = true;
  }
  addOperation(event, myModal) {
    if(event) {
      event.variableCostRate = event.variableCost;
      event.laborCostRate = event.laborCost;
      this.prodTreeSelectedRowData.operationList.splice(0,1, {...event})
       myModal.hide();
      // if(this.operationSelectedIndex === -1) {
      //   // const productDetailDto  = {
      //   //   productTreeId: this.productTreeId,
      //   //   productTreeDetailId: null,
      //   //   operationRepeat: 1,
      //   //   processControlFrequency: 1,
      //   //   productionType: 'STANDARD',
      //   //   plannedCycleQuantity : 1,
      //   //   parentId: this.dataModel.productTreeDetailList[this.prodTreeSelectedIndex].productTreeDetailId,
      //   //   singleDuration: 0,
      //   //   singleSetupDuration: 0,
      //   //   singleTotalDuration: 0,
      //   //   maxSingleStandbyDuration: 0,
      //   //   componentList: [],
      //   //   operationList: [{...event}],
      //   //   equipmentList: [],
      //   //   workstationProgramList: [],
      //   //   workstationId: null,
      //   //   workstation: null,
      //   //   orderNo: (this.dataModel.productTreeDetailList[this.prodTreeSelectedIndex].stepNo + '.' + 10),
      //   // };
      //   // this.prodTreeSelectedRowData.
      // } else {
      //   this.prodTreeSelectedRowData.operationList.splice(this.operationSelectedIndex, 1, {...event});
      //   this.operationSelectedIndex = -1;
      //   this.selectedProdItemOperation = null;
      //   myModal.hide();
      // }
      
    }
  }


  // onTableDataChange() {
  //   const dataToSave = this.nodeList2DetailData(this.tableData);
  //   // this.saveEvent.next(dataToSave);
  // }
  delete(id, key, parent) {
    if (id) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          // this.mOrderTypeTypeSvc.delete(id)
          //   .then(() => {
          //     this.utilities.showSuccessToast('deleted-success');
              this.removeKey(key, parent);
              // this.deleteEvent.next(id);
            // })
            // .catch(error => this.utilities.showErrorToast(error));
        },
        reject: () => {
          this.utilities.showInfoToast('cancelled-operation');
        }
      })
    } else {
      this.removeKey(key, parent);
    }
  }
  private removeKey(key, parent) {

    let dataListRef;
    if (parent) {
      dataListRef = [...parent.children];
      dataListRef = dataListRef.filter(item => item.key !== key);
      parent.children = [...dataListRef];
    } else {
      dataListRef = this.tableData;
      dataListRef = dataListRef.find(item => item.key === key);
      if (dataListRef) {
        dataListRef.data  = {
          productTreeId: this.productTreeId,
          productTreeDetailId: null,
          operationRepeat: 1,
          processControlFrequency: 1,
          plannedCycleQuantity : 1,
          parentId: null,
          productionType: 'STANDARD',
          singleDuration: 0,
          singleSetupDuration: 0,
          singleTotalDuration: 0,
          maxSingleStandbyDuration: 0,
          componentList: [],
          operationList: [
            {
              defaultStockId : null,
              defaultStock : null,
              description : null,
              maxSingleStandbyDuration : null,
              operationId : null,
              operationOrder : 1,
              operationRepeat : 1,
              parent : true,
              plannedCycleQuantity : 1,
              processControlFrequency : 1,
              productTreeDetailId : null,
              productTreeDetailOperationId : null,
              productTreeDetailWorkstationProgramList : null,
              quantity : 1,
              componentList: [],
              singleDuration : null,
              singleSetupDuration : null,
              singleTotalDuration : null,
              workStationId : null,
              workStation : null,
              operation: null
            }
          ],
          equipmentList: null,
          workstationProgramList: null,
          workstationId: null,
          workstation: null,
          orderNo: null,
        };
        this.tableData = [{...dataListRef}];
      }
    }
    // if (parent) {

    // } else {
    //   // this.tableData = [...dataListRef];
    // }
    this.onTableDataChange();
    // this.dataModel.productTreeDetailList = this.nodeList2DetailData(this.tableData);
  }
  onTableDataChange() {
    this.dataModel.productTreeDetailList = this.nodeList2DetailData(this.tableData);
    this.tableData = this.detailList2Node(this.dataModel.productTreeDetailList);
    this.cdx.markForCheck();
    // this.initialize(this.dataModel);
  }

  removeProdTreeLevelOperation(index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        const productTreeDetailId = this.dataModel.productTreeDetailList[index].productTreeDetailId;
        if(productTreeDetailId) {
          this._loaderSvc.showLoader();
          this.svcProductTree.delete(productTreeDetailId).then(res => {
            this._loaderSvc.hideLoader();
            this.dataModel.productTreeDetailList.splice(index, 1);
          }).catch(err => {
            this._loaderSvc.hideLoader();
            this.utilities.showErrorToast(err);
          })
        } else {
          this.dataModel.productTreeDetailList.splice(index, 1);
        }
        
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }


  onChangeLaborCost(event, operation) {
    operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
    const hour = ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration);
    operation.laborCost = parseFloat((hour * operation.laborCostRate).toFixed(1));
  }
  onChangeVariableCost(event, operation) {
    operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
    operation.variableCost = parseFloat((ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.variableCostRate).toFixed(1));
  }

  getInputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction < 0) || [] : [];
  }

  getOutputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction > 0) || [] : [];
  }

  getOperationDataHeight(operation){
    var data = {
      height: 0,
      totalHeight: 0
    }
    if(this.getOutputList(operation).length >  this.getInputList(operation).length){
      data.height = (this.getOutputList(operation).length + 1) * 45;
      data.totalHeight =this.getOutputList(operation).length;
    } else if((this.getOutputList(operation).length !== 0) && (this.getOutputList(operation).length===this.getInputList(operation).length)){
      data.height = (this.getOutputList(operation).length + 1) * 45;
      data.totalHeight =this.getOutputList(operation).length;
    }else{
      data.height = (this.getInputList(operation).length + 1) * 45;
      data.totalHeight = this.getInputList(operation).length;
    }
    return data;
  }
  // getOperationComponentDataHeight(operation, num: number){
  //   var data = {
  //     height: 0,
  //     totalHeight: 0
  //   }
  //   // if(operation.jobOrderStockProduceList.length >  operation.jobOrderStockUseList.length){
  //   //   data.height = (operation.jobOrderStockProduceList.length + 1) * 36;
  //   //   data.totalHeight =operation.jobOrderStockProduceList.length;
  //   // } else if((operation.jobOrderStockProduceList.length !== 0) && (operation.jobOrderStockProduceList.length===operation.jobOrderStockUseList.length)){
  //   //   data.height = (operation.jobOrderStockProduceList.length + 1) * 36;
  //   //   data.totalHeight =operation.jobOrderStockProduceList.length;
  //   // }else{
  //     data.height =  (num === 1) ? (this.getOutputList(operation).length + 1) * 36 : (this.getInputList(operation).length + 1) * 36;
  //     data.totalHeight =  (num === 1) ? this.getOutputList(operation).length : this.getInputList(operation).length;
  //     // data.totalHeight = operation.componentList.length;
  //   // }
  //   return data;
  // }

  getReadableTime(time) {
    if(time) {
      return ConvertUtil.longDuration2DHHMMSSTime(time)
    }
  }



  async save() {
    // deep clone Object
    const newDto = JSON.parse(JSON.stringify(this.dataModel));
    delete newDto.plant;
    delete newDto.material;
    delete newDto.workstation;
    if (newDto.productTreeDetailList.length <= 0) {
      this.utilities.showWarningToast('add minimum one detail');
      return;
    } 
    const validate = await this.validateProductTreeDetailList(newDto.productTreeDetailList);
    if ( validate === 0) {
      return ;
    }
    const parentData = this.dataModel.productTreeDetailList[0].operationList.find(e => e.parent === true);
    if (!parentData) {
      const lbl = this._translateSvc.instant('please-select-operation-as-parent-for-level-1');
      this.utilities.showWarningToast(lbl);
      return;
    }
    
    this._loaderSvc.showLoader();
    newDto.status = 'ACTIVE';
    this.svcProductTree.save(newDto).then(result => {
      this._loaderSvc.hideLoader();
      this.utilities.showSuccessToast('save-success');
    }).catch(err => {
      this._loaderSvc.hideLoader();
      this.utilities.showErrorToast(err);
    });

    
  }

  async saveOrderModal() {
    if(this.counter === 1) {
      await this.save();
      this._prodOrderSvc.saveEventFire.next('save');
    }
    
    // this.sub = .asObservable().subscribe(res => {
    //   if (res && this.counter === 1) {
    //     this.save();
    //   }
    // });
  }

  async validateProductTreeDetailList (treedetailist) {
    return new Promise (async (res) => {
      const allvalidate = new Promise<number> (async (response, rej) => {
        await treedetailist.forEach(async productreedetail => {
          const vld = await this.validateProductTreeDetailItem(productreedetail);
          if ( vld === 0) {
            return rej(0);
          } else if (productreedetail.productTreeDetailList && productreedetail.productTreeDetailList.length > 0) {
            const result = await this.validateProductTreeDetailList(productreedetail.productTreeDetailList);
            if ( result === 0) {
              return rej(0);
            } else {
                response(1);
            }
          } else {
            response(1);
          }
        });
      });
      const valid = await allvalidate;
      res(valid);
    });
  }

  validateProductTreeDetailItem (productTreeDetailitem) {
    return new Promise ((res) => {
   
      if (!productTreeDetailitem.operationList || productTreeDetailitem.operationList.length === 0) {
        this.utilities.showWarningToast('add minimum one operation');
        return res(0);
      } else {
        productTreeDetailitem.operationList.forEach(opr => {
          if (opr.operation) {
            opr.operationId = opr.operation.operationId;
            delete opr.operation;
          }
          if (opr.defaultStock) {
            opr.defaultStockId = opr.defaultStock.stockId;
            delete opr.defaultStock;
          }
          if (opr.workStation) {
            opr.workStationId = opr.workStation.workStationId;
            delete opr.workStation;
          }
          if (opr.componentList) {
            opr.componentList.forEach(comp => {
              if (comp.component) {
                comp.componentId = comp.component.stockId;
                delete comp.component;
              }
              if (comp.productTreeDetailOperation) {
                comp.productTreeDetailOperationId = comp.productTreeDetailOperation.productTreeDetailOperationId;
                delete comp.productTreeDetailOperation;
              }
            });
          }
        });
      }
        if (productTreeDetailitem.equipmentList) {
          productTreeDetailitem.equipmentList.forEach(eqpt => {
            if (eqpt.stock) {
              eqpt.stockId = eqpt.stock.stockId;
              delete eqpt.stock;
            }
          });
        }
        if (productTreeDetailitem.workstationProgramList) {
          productTreeDetailitem.workstationProgramList.forEach(wrkprgm => {
            if (wrkprgm.workstationProgram) {
              wrkprgm.workstationProgramId = wrkprgm.workstationProgram.workstationProgramId;
              delete wrkprgm.workstationProgram;
            }
          });
        }
        if (productTreeDetailitem.workstation) {
          productTreeDetailitem.workstationId = productTreeDetailitem.workstation.workStationId;
          delete productTreeDetailitem.workstation;
        }
      // }
      return res(1);
    });
  }
}
