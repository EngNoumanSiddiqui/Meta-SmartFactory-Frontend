import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JobOrderList, JobOrderStockUseList } from 'app/dto/porder/porder.model';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { ConfirmationService, TreeTable } from 'primeng';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prod-waiting-final-job-order',
  templateUrl: './prod-waiting-final-job-order.component.html',
  styleUrls: ['./prod-waiting-final-job-order.component.scss']
})
export class ProdWaitingFinalJobOrderComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren('operationItem') operationDivList: QueryList<ElementRef>;
  @ViewChildren('operationDescItem') operationDescItemList: QueryList<ElementRef>;
  @ViewChild('dt') public treeTable: TreeTable;
  selectedProductTrees = null;
  selectedOperationForDuration = null;
  overLayIndex = -1;
  singleComponent = true;
  showComponents = false;
  selectedProcessMaterial = null;
  showParallel = false;
  materialList: JobOrderStockUseList[] = [];
  prodData: any = {};

  addmodal = { active: false, rowData: null, stockIndex: null, title: null, mode: null, index: null, direction: null, data: null };
  addJobOrderOperationmodal = { active: false, rowData: null, index: null, data: null, tabIndex: null };

  @Output() saveProdEditAction = new EventEmitter<any>();

  addDurationModal = { active: false };
  addProdOperationModal = { active: false };
  addSetupDurationModal = { active: false };
  addJobOperationMaterialmodal = { active: false };
  // addJobOperationmodal = {active: false};
  addDocForOperation = { active: false };
  prodTreeSelectedRowData = null;

  selectedProdItemMaterial = null;
  selectedProdItemMaterialIndex = null;

  // operationSelectedIndex = -1;

  @Input('productTreeId') productTreeId = null;
  @Input('orderQuantity') orderQuantity = null;
  jobOrderls: any;
  selectedOperationMaterialType: any = null;

  @Input('prodData') set setprodData(prodData) {
    if (prodData) {
      this.prodData = prodData;
    }
  }
  @Input('jobOrderList') set setjobOrderList(jobOrderList) {
    if (jobOrderList) {
      //#region New Version Code
      this.assignJobOrderList(jobOrderList);

      //#endregion

      //#region Old Version Code
      // this.jobOrderList = JSON.parse(JSON.stringify(jobOrderList));
      // // this.jobOrderList.sort((a, b) => a.orderNo - b.orderNo);
      // this.jobOrderList = this.jobOrderList.sort((a, b) => {
      //   if (a.orderNo > b.orderNo) {
      //       return 1;
      //   }
      //   if (a.orderNo < b.orderNo) {
      //       return -1;
      //   }
      //   return 0;
      // });
      // this.jobOrderList.forEach((jb,jbIndex) => {
      //   if (jbIndex === 0) {
      //     jb.orderNo = '10';
      //     jb.orderFNo = '10';
      //   } else {
      //     jb.orderNo = this.jobOrderList[jbIndex - 1].orderNo + '10';
      //     jb.orderFNo = this.jobOrderList[jbIndex - 1].orderFNo + '.10';
      //   }

      // });
      // setTimeout(() => {
      //   this.jobOrderList = [...this.jobOrderList];
      //   if(this.jobOrderList && this.jobOrderList.length > 0) {
      //     if(this.jobOrderList[0].jobOrderOperations && this.jobOrderList[0].jobOrderOperations.length > 0) {
      //     } else {
      //       this.jobOrderList[0].jobOrderOperations.push( {
      //         actualFinishTime: null,
      //         actualStartTime: null,
      //         currentQuantity: null,
      //         defaultStockId: null,
      //         defaultStockName: null,
      //         direction: null,
      //         expectedSetupDuration: null,
      //         individualCapacity: null,
      //         jobOrder: null,
      //         jobOrderId: null,
      //         jobOrderOperationId: null,
      //         jobOrderStockAuxList: [],
      //         jobOrderStockProduceList: [],
      //         jobOrderStockUseList: [],
      //         maxSingleStandbyDuration: null,
      //         operation: null,
      //         operationId: null,
      //         operationName: null,
      //         laborCost: null,
      //         laborCostRate: null,
      //         referenceId: this.prodData?.referenceId,
      //         variableCost: null,
      //         variableCostRate: null,
      //         totalCost: null,
      //         fixedCost: null,
      //         operationOrder: 1,
      //         operationRepeat: 1,
      //         operationStatus: null,
      //         parent: null,
      //         plannedCycleQuantity: this.prodData.quantity,
      //         processControlFrequency: 1,
      //         prodOrderId: this.prodData.prodOrderId,
      //         quantity: this.prodData.quantity,
      //         singleDuration: null,
      //         singleSetupDuration: 0,
      //         singleTotalDuration: null,
      //         workStation: null,
      //         workStationId: null,
      //         workStationName: null,
      //         workstationProgramList: [],
      //       })
      //     }
      //     this.jobOrderList.forEach((jb, jbIndex) => {
      //       jb.jobOrderOperations.forEach((op, index) => {
      //         if(!op.operation && op.operationId) {
      //           op.operation = <any> {operationName: op.operationName, operationId: op.operationId}
      //         }
      //         op.jobOrderStockProduceList.forEach(st => {
      //           if(!st.stock && st.stockId) {
      //             st.stock = <any> {stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
      //                stockTypeId: st.stockTypeId, quantityUnit: st.unit};
      //           }
      //           if(!st.quantity) {
      //             st.quantity = st.neededQuantity;
      //           }
      //           if(!st['quantityUnit']) {
      //             st['quantityUnit'] = st.unit;
      //           }

      //         })
      //         op.jobOrderStockUseList.forEach(st => {
      //           if(!st.stock && st.stockId) {
      //             st.stock = <any> {stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
      //                stockTypeId: st.stockTypeId, quantityUnit: st.unit};
      //           }
      //           if(!st.quantity) {
      //             st.quantity = st.neededQuantity;
      //           }
      //           if(!st['quantityUnit']) {
      //             st['quantityUnit'] = st.unit;
      //           }
      //           if(st.materialCost && !st.materialCostRate) {
      //             st.materialCostRate = parseFloat((st.materialCost / st.neededQuantity).toFixed(2));
      //             st.materialCost = (st.quantity * this.orderQuantity * st.materialCostRate);
      //           }
      //           if(jbIndex == 0 && st.stock && st.stock['stockTypeId'] == 9 || (st.stock['stockTypeId'] == 2)) {
      //             this.selectedProcessMaterial = st.stock;
      //             if(!this.selectedProcessMaterial['baseUnit']) {
      //               this.selectedProcessMaterial['baseUnit'] = st.unit;
      //             }
      //           } else if(jbIndex === (this.jobOrderList.length - 1) &&
      //             st.stock && st.stock['stockTypeId'] == 1) {
      //             this.materialList.push({...st});

      //           }


      //         })
      //         op.jobOrderStockAuxList.forEach(st => {
      //           if(!st.stock && st.stockId) {
      //             st.stock = <any> {stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
      //                stockTypeId: st.stockTypeId, quantityUnit: st.unit};
      //           }
      //           if(!st.quantity) {
      //             st.quantity = st.neededQuantity;
      //           }
      //           if(!st['quantityUnit']) {
      //             st['quantityUnit'] = st.unit;
      //           }
      //         })
      //       });

      //       jb.productTreeId = jb['productTree']?.productTreeId || null;
      //       jb.productTreeDetailId = jb['productTreeDetail']?.productTreeDetailId || null;
      //     })
      //   } else {
      //     let jobOrder = {
      //       batch: null,
      //       customerJobOrderStatus: null,
      //       description: null,
      //       endDate: null,
      //       expectedQuantity: this.prodData.plannedQuantity,
      //       expectedSetupDuration: null,
      //       individualCapacity: null,
      //       item: null,
      //       jobOrderEquipmentList: [],
      //       jobOrderId: null,
      //       jobOrderOperations: [
      //         {
      //           actualFinishTime: null,
      //           actualStartTime: null,
      //           currentQuantity: null,
      //           defaultStockId: null,
      //           referenceId: this.prodData?.referenceId,
      //           defaultStockName: null,
      //           direction: null,
      //           expectedSetupDuration: null,
      //           individualCapacity: null,
      //           jobOrder: null,
      //           jobOrderId: null,
      //           jobOrderOperationId: null,
      //           jobOrderStockAuxList: [],
      //           jobOrderStockProduceList: [],
      //           jobOrderStockUseList: [],
      //           maxSingleStandbyDuration: null,
      //           operation: null,
      //           operationId: null,
      //           operationName: null,
      //           laborCost: null,
      //           laborCostRate: null,
      //           variableCost: null,
      //           variableCostRate: null,
      //           totalCost: null,
      //           fixedCost: null,
      //           operationOrder: 1,
      //           operationRepeat: 1 ,
      //           operationStatus: null,
      //           parent: null,
      //           plannedCycleQuantity: this.prodData.quantity,
      //           processControlFrequency: 1,
      //           prodOrderId: this.prodData.prodOrderId,
      //           quantity: this.prodData.quantity,
      //           singleDuration: null,
      //           singleSetupDuration: 0,
      //           singleTotalDuration: null,
      //           workStation: null,
      //           workStationId: null,
      //           workStationName: null,
      //           workstationProgramList: [],
      //         }
      //       ],
      //       jobOrderStatus: null,
      //       jobOrderStockAuxList: [],
      //       jobOrderStockProduceList: [],
      //       jobOrderStockUseList: [],
      //       maxSingleStandbyDuration: null,
      //       operationRepeat: null,
      //       orderDetailId: null,
      //       orderIndex: null,
      //       orderNo: '10',
      //       parentId: null,
      //       plannedCycleQuantity: this.prodData.quantity,
      //       plannedHeight: null,
      //       plannedWidth: null,
      //       position: 'STANDARD',
      //       processControlFrequency: 1,
      //       prodOrderId: this.prodData.prodOrderId,
      //       productTreeDetailId: null,
      //       productTreeId: null,
      //       productionType: 'STANDARD',
      //       receiptNo: null,
      //       reverse: null,
      //       singleDuration: null,
      //       singleSetupDuration: 0,
      //       singleStandbyDuration: null,
      //       startDate: null,
      //       totalDuration: null,
      //       wareHouseStockId: null,
      //       workstationId: null,
      //       workstationName: null,
      //     }
      //     this.jobOrderList.push(jobOrder);
      //   }
      //   this.processJobOrderForInputAndOutPut();
      // }, 200);

      //#endregion

    }
  }


  addButtonItems = [
    {
      label: 'Parent', icon: 'pi pi-plus',
      command: () => {
        this.addJobOrderParallelItem(this.selectedRowNode, false, true);
      }
    },
    {
      label: 'Parallel', icon: 'pi pi-plus',
      command: () => {
        // this.AddBottomNode();
        this.addJobOrderParallelItem(this.selectedRowNode.node, true);
      }
    },
    {
      label: 'Child', icon: 'pi pi-plus',
      command: () => {
        this.addJobOrderParallelItem(this.selectedRowNode.node);
      }
    }
  ];
  deleteButtonItems = [
    {
      label: 'This Level', icon: 'pi pi-minus',
      command: () => {
        this.deleteThisNode();
      }
    },
    {
      label: 'All Levels', icon: 'pi pi-trash',
      command: () => {
        this.deleteAllNodes();
      }
    }
  ];

  selectedRowNode = null;

  operationSelectedIndex = -1;
  selectedProdItemOperation = null;
  selectedProdMaterialItemOperation = null;

  sub: Subscription;
  counter: number = 1;
  jobOrderList: JobOrderList[] = [];
  tableData = [];
  isTreeViewDisable = false;

  constructor(private _loaderSvc: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private svcProductTree: ProductTreeService,
    private _prodOrderSvc: ProductionOrderService,
    private cdx: ChangeDetectorRef,
    private utilities: UtilitiesService) {
  }

  ngOnInit() {

    this.sub = this._prodOrderSvc.saveCompleteEventFire.asObservable().subscribe(async res => {
      if (res && this.counter === 1) {
        await this.save();
      }
    });
  }

  assignJobOrderList(jobOrderList: Array<any>) {
    const jobOrderls = JSON.parse(JSON.stringify(jobOrderList));
    this.jobOrderls = jobOrderls.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
    // this.jobOrderList = JSON.parse(JSON.stringify(jobOrderList));
    // this.jobOrderList = this.jobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
    setTimeout(() => {
      this.jobOrderls = [...this.jobOrderls];
      if (this.jobOrderls && this.jobOrderls.length > 0) {
        if (this.jobOrderls[0].jobOrderOperations && this.jobOrderls[0].jobOrderOperations.length > 0) {
        } else {
          this.jobOrderls[0].jobOrderOperations.push({
            actualFinishTime: null,
            actualStartTime: null,
            currentQuantity: null,
            defaultStockId: null,
            defaultStockName: null,
            direction: null,
            expectedSetupDuration: null,
            individualCapacity: null,
            jobOrder: null,
            fixedWorkstation: false,
            fixedEmployeeGroup: false,
            jobOrderId: null,
            jobOrderOperationId: null,
            jobOrderStockAuxList: [],
            jobOrderStockProduceList: [],
            jobOrderStockUseList: [],
            maxSingleStandbyDuration: null,
            operation: null,
            operationId: null,
            operationName: null,
            laborCost: null,
            laborCostRate: null,
            variableCost: null,
            variableCostRate: null,
            totalCost: null,
            fixedCost: null,
            operationOrder: 1,
            operationRepeat: 1,
            operationStatus: null,
            parent: true,
            plannedCycleQuantity: this.prodData.quantity,
            processControlFrequency: null,
            prodOrderId: null,
            quantity: this.prodData.quantity,
            singleDuration: null,
            singleSetupDuration: 0,
            singleTotalDuration: null,
            workStation: null,
            workStationId: null,
            workStationName: null,
            workstationProgramList: [],
          })
        }
        this.jobOrderls.forEach((jb, jbIndex) => {
          jb.jobOrderOperations.forEach((op, index) => {
            if (!op.operation && op.operationId) {
              op.operation = <any>{ operationName: op.operationName, operationId: op.operationId }
            }
            op.locationId = op.locationDto?.locationId || op.operation?.location?.locationId;
            op.jobOrderStockProduceList.forEach(st => {
              if (!st.stock && st.stockId) {
                st.stock = <any>{
                  stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
                  stockTypeId: st.stockTypeId, quantityUnit: st.unit
                };
              }
              // if(!st.quantity) {
              //   st.quantity = st.neededQuantity;
              // }
              if (!st['quantityUnit']) {
                st['quantityUnit'] = st.unit;
              }

            })
            op.jobOrderStockUseList.forEach(st => {
              if (!st.stock && st.stockId) {
                st.stock = <any>{
                  stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
                  stockTypeId: st.stockTypeId, quantityUnit: st.unit
                };
              }
              // if(!st.quantity) {
              //   st.quantity = st.neededQuantity;
              // }
              if (!st['quantityUnit']) {
                st['quantityUnit'] = st.unit;
              }
              if (st.materialCost && !st.materialCostRate) {
                st.materialCostRate = parseFloat((st.materialCost / st.neededQuantity).toFixed(2));
                st.materialCost = (st.neededQuantity * this.orderQuantity * st.materialCostRate);
              }
              if (jbIndex == (this.jobOrderls.length - 1) && st.stock && (st.stock['stockTypeId'] == 9) || (st.stock['stockTypeId'] == 2)) {
                this.selectedProcessMaterial = { ...st.stock };
              }
              else if (jbIndex === 0 && st.stock && !(st.stock['stockTypeId'] == 9) || (st.stock['stockTypeId'] == 2)) {
                // this.materialList = [];
                let raw = false;
                if (st.stock['stockTypeId'] == 1) {
                  raw = true;
                }
                this.materialList.push({ ...st, raw: raw });
              }
            })
            op.jobOrderStockAuxList.forEach(st => {
              if (!st.stock && st.stockId) {
                st.stock = <any>{
                  stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
                  stockTypeId: st.stockTypeId, quantityUnit: st.unit
                };
              }
              // if(!st.quantity) {
              //   st.quantity = st.neededQuantity;
              // }
              if (!st['quantityUnit']) {
                st['quantityUnit'] = st.unit;
              }
            })
          });
          jb.productTreeId = jb['productTree']?.productTreeId || null;
          jb.productTreeDetailId = jb['productTreeDetail']?.productTreeDetailId || null;
          const split = jb.orderNo.toString().match(/.{1,2}/g);
          jb.orderFNo = split.join(".");
        })
      } else {
        let jobOrder = {
          batch: null,
          customerJobOrderStatus: null,
          description: null,
          endDate: null,
          expectedQuantity: this.prodData.plannedQuantity,
          expectedSetupDuration: null,
          individualCapacity: null,
          item: null,
          jobOrderEquipmentList: [],
          jobOrderId: null,
          jobOrderOperations: [
            {
              actualFinishTime: null,
              actualStartTime: null,
              currentQuantity: null,
              defaultStockId: null,
              defaultStockName: null,
              direction: null,
              expectedSetupDuration: null,
              individualCapacity: null,
              jobOrder: null,

              jobOrderId: null,
              fixedWorkstation: false,
              fixedEmployeeGroup: false,
              jobOrderOperationId: null,
              jobOrderStockAuxList: [],
              jobOrderStockProduceList: [
                {
                  actualMaterialCost: null,
                  actualScrapCost: null,
                  batch: null,
                  componentList: null,
                  currency: null,
                  currentQuantity: null,
                  currentStockQuantity: null,
                  currentStockReservedQuantity: null,
                  cycleRate: null,
                  defectName: null,
                  defectQuantity: null,
                  density: null,
                  dimensionUnit: null,
                  direction: 1,
                  height: null,
                  innerDiameter: this.prodData?.innerDiameter,
                  jobOrder: null,
                  jobOrderId: null,
                  jobOrderOperation: null,
                  jobOrderOperationId: null,
                  jobOrderOperationName: null,
                  jobOrderStockId: null,
                  length: this.prodData?.length,
                  materialCost: null,
                  materialCostRate: null,
                  neededQuantity: this.orderQuantity,
                  neededToBuyQuantity: null,
                  outerDiameter: this.prodData?.outerDiameter,
                  plannedHeight: null,
                  plannedWidth: null,
                  quantity: 0,
                  requestJobOrderComponentFeatureList: null,
                  responseComponentFeature: null,
                  reworkQuantity: null,
                  scrapCost: null,
                  scrapCostRate: null,
                  setupDefectQuantity: null,
                  stock: { stockId: this.prodData.materialId, stockName: this.prodData.materialName, stockNo: this.prodData.materialNo },
                  stockId: this.prodData?.materialId,
                  stockName: this.prodData?.materialName,
                  stockNo: this.prodData?.materialNo,
                  stockTypeId: null,
                  totalDefectQuantity: null,
                  totalReworkQuantity: null,
                  totalSetupQuantity: null,
                  unit: this.prodData?.baseUnit,
                  useStock: null,
                  wareHouseStockId: null,
                  weight: this.prodData?.weight,
                  weightUnit: null,
                  width: null,
                }
              ],
              jobOrderStockUseList: [],
              maxSingleStandbyDuration: null,
              operation: null,
              operationId: null,
              operationName: null,
              laborCost: null,
              laborCostRate: null,
              variableCost: null,
              variableCostRate: null,
              totalCost: null,
              fixedCost: null,
              operationOrder: 1,
              operationRepeat: 1,
              operationStatus: null,
              parent: true,
              plannedCycleQuantity: this.prodData.quantity,
              processControlFrequency: null,
              prodOrderId: null,
              quantity: this.prodData.quantity,
              singleDuration: null,
              singleSetupDuration: 0,
              singleTotalDuration: null,
              workStation: null,
              workStationId: null,
              workStationName: null,
              workstationProgramList: [],
            }
          ],
          jobOrderStatus: null,
          jobOrderStockAuxList: [],
          jobOrderStockProduceList: [],
          jobOrderStockUseList: [],
          maxSingleStandbyDuration: null,
          operationRepeat: 1,
          orderDetailId: null,
          orderIndex: null,
          orderNo: '10',
          orderFNo: '10',
          parentId: null,
          plannedCycleQuantity: this.prodData.quantity,
          plannedHeight: null,
          plannedWidth: null,
          position: 'STANDARD',
          processControlFrequency: null,
          prodOrderId: this.prodData.prodOrderId,
          productTreeDetailId: null,
          productTreeId: null,
          productionType: 'STANDARD',
          receiptNo: null,
          reverse: null,
          singleDuration: null,
          singleSetupDuration: 0,
          singleStandbyDuration: null,
          startDate: null,
          totalDuration: null,
          wareHouseStockId: null,
          workstationId: null,
          workstationName: null,
        }
        this.jobOrderls.push(jobOrder);
      }

      this.jobOrderList = JSON.parse(JSON.stringify(this.jobOrderls));

      let abort = false;
      for (let index = 0; index < this.jobOrderList.length && !abort; index++) {
        const jobOrder = this.jobOrderList[index];
        if ((jobOrder.orderNo + '').includes('11')) {
          abort = true;
          this.isTreeViewDisable = true;
          this.showParallel = true;
          this.tableData = this.detailList2Node(this.listToTree(JSON.parse(JSON.stringify(this.jobOrderls))));
          // setTimeout(() => {
          //   this.expandORcollapse(this.tableData);
          //   this.tableData = [...this.tableData];
          //   console.log(this.tableData);
          // }, 150);
          this.showComponents = true;
          this.singleComponent = false;
        }
      }
    }, 200);
  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.productTreeId && simpleChanges.productTreeId.currentValue) {
      this.detail(simpleChanges.productTreeId.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onParallelChanged(event) {
    let message = '';
    if (!event) {
      message = 'are-you-sure-to-reset-changes-and-go-to-single-component-view';
    } else {
      message = 'are-you-sure-to-select-parallel-view';
    }
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant(message),
      header: this._translateSvc.instant('data-lost-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if (event) {
          this.tableData = this.detailList2Node(this.listToTree(JSON.parse(JSON.stringify(this.jobOrderls))));
          // setTimeout(() => {
          //   this.expandORcollapse(this.tableData);
          //   this.tableData = [...this.tableData];
          //   console.log(this.tableData);
          // }, 500);
        } else {
          this.tableData = [];
        }

        if (this.showParallel) {
          this.showComponents = true;
          this.singleComponent = false;
        } else {
          this.singleComponent = true;
        }
      },
      reject: () => {
        this.showParallel = !this.showParallel;
        if (this.showParallel) {
          this.showComponents = true;
          this.singleComponent = false;
        } else {
          this.showComponents = false;
          this.singleComponent = true;
        }
      }
    });

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
    data.productTreeDetailList.forEach(prdetail => {
      this.setWorkstationId(prdetail);
    });
    this.jobOrderList = this.flattenTreeArray(data.productTreeDetailList, 'productTreeDetailList', this.jobOrderList);
    // this.makeItInOrder();
    // this.processJobOrderForInputAndOutPut();
    // console.log('Job Order', this.jobOrderList);
  }


  mapToJobOrder(item) {
    let jobOrder: JobOrderList;
    jobOrder = {
      batch: null,
      customerJobOrderStatus: null,
      description: null,
      endDate: null,
      expectedQuantity: this.prodData.plannedQuantity,
      expectedSetupDuration: null,
      individualCapacity: null,
      item: null,
      jobOrderEquipmentList: null,
      jobOrderId: null,
      jobOrderOperations: null,
      jobOrderStatus: null,
      jobOrderStockAuxList: null,
      jobOrderStockProduceList: null,
      jobOrderStockUseList: null,
      maxSingleStandbyDuration: null,
      operationRepeat: 1,
      orderDetailId: null,
      orderIndex: null,
      orderNo: item.stepNo || '10',
      parentId: item.parentId,
      plannedCycleQuantity: this.prodData.quantity,
      plannedHeight: null,
      plannedWidth: null,
      position: 'STANDARD',
      processControlFrequency: null,
      prodOrderId: this.prodData.prodOrderId,
      productTreeDetailId: item.productTreeDetailId,
      productTreeId: item.productTreeId,
      productionType: 'STANDARD',
      receiptNo: null,
      reverse: null,
      singleDuration: null,
      singleSetupDuration: 0,
      singleStandbyDuration: null,
      startDate: null,
      totalDuration: null,
      wareHouseStockId: null,
      workstationId: null,
      workstationName: null,
    }
    jobOrder.jobOrderOperations = item.operationList.map(op => {
      return {
        description: op.description,
        maxSingleStandbyDuration: op.maxSingleStandbyDuration,
        operationId: op.operation?.operationId,
        operation: op.operation,
        operationOrder: op.operationOrder || 1,
        currency: op.currency,
        fixedCost: op.fixedCost,
        laborCost: op.laborCost,
        laborCostRate: op.laborCostRate,
        variableCost: op.variableCost,
        variableCostRate: op.variableCostRate,
        operationRepeat: op.operationRepeat || 1,
        parent: op.parent || true,
        plannedCycleQuantity: op.plannedCycleQuantity || op.quantity,
        processControlFrequency: op.processControlFrequency || 1,
        productTreeDetailId: op.productTreeDetailId,
        productTreeDetailOperationId: op.productTreeDetailOperationId,
        productTreeDetailWorkstationProgramList: op.productTreeDetailWorkstationProgramList,
        quantity: op.quantity,
        componentList: op.componentList,
        singleDuration: op.singleDuration,
        singleSetupDuration: op.singleSetupDuration,
        singleTotalDuration: op.singleTotalDuration,
        workStationId: op.workStationId,
        jobOrderStockAuxList: this.getAuxList(op).map(us => ({ ...us, stock: us.component, stockId: us.component?.stockId })),
        jobOrderStockUseList: this.getInputList(op).map(us => ({ ...us, stock: us.component, stockId: us.component?.stockId })),
        jobOrderStockProduceList: this.getOutputList(op).map(us => ({ ...us, stock: us.component, stockId: us.component?.stockId })),
        'workStationName': op.worStation?.workStationName,
        'workStation': op.workStation,
        'operationName': op.operation?.operationName,
        'operationStatus': op.operationStatus
      }
    });
    return jobOrder;
  }

  flattenTreeArray(items, prop, flat) {
    if (items) {
      items.forEach(item => {
        const jb = this.mapToJobOrder(item);
        flat.push(jb);
        if (item[prop] && item[prop].length > 0) {
          this.flattenTreeArray(item[prop], prop, flat);
        }
      });
    }
    return flat;

  }
  flattenTreeArray2(items, prop, flat) {
    if (items) {
      items.forEach(item => {
        const jb = item.data;
        flat.push(jb);
        if (item[prop] && item[prop].length > 0) {
          this.flattenTreeArray2(item[prop], prop, flat);
        }
      });
    }
    return flat;

  }

  getInputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction < 0) || [] : [];
  }

  getOutputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction > 0) || [] : [];
  }
  getAuxList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction === 0) || [] : [];
  }

  setWorkstationId(prdetail) {
    if (prdetail.workstation) {
      prdetail.workstationId = prdetail.workstation.workStationId;
    }
    if (prdetail.productTreeDetailList && prdetail.productTreeDetailList.length > 0) {
      prdetail.productTreeDetailList.forEach(dt => {
        this.setWorkstationId(dt);
      });
    }
    if (prdetail.productionType && typeof (prdetail.productionType) === 'object') {
      prdetail.productionType = prdetail.productionType.message;
    }
    if (prdetail.operationList && prdetail.operationList.length > 0) {
      // prdetail.operationList = prdetail.operationList.sort((a, b) => a.orderNo - b.orderNo);
      prdetail.operationList = prdetail.operationList.sort((a, b) => a.operationOrder - b.operationOrder);
      prdetail.operationList.forEach(operation => {
        if (operation.variableCost) {
          operation.variableCostRate = operation.variableCost;
          operation.variableCost = parseFloat(
            (ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.variableCostRate)
              .toFixed(1));
        }

        if (operation.laborCost) {
          operation.laborCostRate = operation.laborCost;
          operation.laborCost = parseFloat(
            (ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.laborCostRate)
              .toFixed(1));
        }
        operation.componentList = operation.productTreeDetailComponentList || [];
        delete operation.productTreeDetailComponentList;
      });
    }
  }


  showOperationDetail(opearationId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }

  showStockDetail(stockId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.STOCK, stockId);
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

  onSingleComponentSelected(event) {
    if (!this.singleComponent) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-revert-changes'),
        header: this._translateSvc.instant('back-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          this.selectedProcessMaterial = null;
          this.materialList = [];
          this.onautoFillMaterialsSelected(false);
          this.assignJobOrderList(this.prodData.jobOrderList);
        },
        reject: () => {
          setTimeout(() => {
            this.singleComponent = true;
          }, 400);
        }
      });

    } else {
      this.onautoFillMaterialsSelected(true);
    }
  }

  onautoFillMaterialsSelected(event) {


    if (event) {
      // Check if SingleComponent is not Selected



      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-auto-fill-materials'),
        header: this._translateSvc.instant('auto-fill-confirmation'),
        icon: 'fa fa-plus',
        accept: () => {
          if (!this.singleComponent) {
            setTimeout(() => {
              this.prodData.autoFillMaterials = false;
            }, 200);
          } else {
            // if Both are Selected then send api to set autofill true
            this.prodData.autoFillMaterials = true;
            this._loaderSvc.showLoader();
            this.saveProdOrder();

          }
        },
        reject: () => {
          this.utilities.showInfoToast('cancelled-operation');
        }
      })
    } else {
      // send api to set autofill false
      this.prodData.autoFillMaterials = false;
      this._loaderSvc.showLoader();
      this.saveProdOrder();

    }
  }

  saveProdOrder() {
    this._prodOrderSvc.save(this.prodData).then((res: any) => {
      // this.utilities.showSuccessToast('saved-success');
      this._loaderSvc.hideLoader();
    })
      .catch(error => {
        this.utilities.showErrorToast(error, 'error');
        this._loaderSvc.hideLoader();
      });
  }


  getTotalCostOfProductTreeItem = (joborder) => {
    let total = 0;
    joborder.jobOrderOperations.forEach(op => {
      if (op.variableCost) {
        total = total + parseFloat(op.variableCost + '');
      }
      if (op.laborCost) {
        total = total + parseFloat(op.laborCost + '');
      }
      op.jobOrderStockUseList.forEach(cmp => {
        if (cmp.materialCost) {
          // total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
          total = total + parseFloat(cmp.materialCost + '');
        }
      });
    });

    return parseFloat(total + '').toFixed(2);
  }
  get getFinalCost() {
    let total = 0;
    if (this.showParallel) {
      let populatedJobOrderList = []
      populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
      populatedJobOrderList.forEach(prd => {
        prd.jobOrderOperations.forEach(op => {
          if (op.variableCost) {
            total = total + parseFloat(op.variableCost + '');
          }
          if (op.laborCost) {
            total = total + parseFloat(op.laborCost + '');
          }
          op.jobOrderStockUseList.forEach(cmp => {
            if (cmp.materialCost) {
              // total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
              total = total + parseFloat(cmp.materialCost + '');
            }
          });
          // if(prd.productTreeDetailList && prd.productTreeDetailList.length) {
          //   total = total + this.countCost(prd.productTreeDetailList);
          // }
        });
      });
    } else {
      if (this.jobOrderList) {
        this.jobOrderList.forEach(prd => {
          prd.jobOrderOperations.forEach(op => {
            if (op.variableCost) {
              total = total + parseFloat(op.variableCost + '');
            }
            if (op.laborCost) {
              total = total + parseFloat(op.laborCost + '');
            }
            op.jobOrderStockUseList.forEach(cmp => {
              if (cmp.materialCost) {
                // total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
                total = total + parseFloat(cmp.materialCost + '');
              }
            });
            // if(prd.productTreeDetailList && prd.productTreeDetailList.length) {
            //   total = total + this.countCost(prd.productTreeDetailList);
            // }
          });
        });
      }
    }

    return parseFloat(parseFloat(total + '').toFixed(2));
  }

  get unitFinalCost() {
    this.prodData.unitFinalCost = parseFloat((this.getFinalCost / this.prodData.quantity).toFixed(2));
    return this.prodData.unitFinalCost;
  }

  countCost(list) {
    let total = 0;
    if (!list || !list.length) {
      return total;
    }
    list.forEach(prd => {
      prd.operationList.forEach(op => {
        if (op.variableCost) {
          total = total + parseFloat(op.variableCost + '');
        }
        if (op.laborCost) {
          total = total + parseFloat(op.laborCost + '');
        }
        // op.jobOrderStockUseList.forEach(cmp => {
        //   if (cmp.materialCost) {
        //     // total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
        //     total = total + parseFloat(cmp.materialCost +'');
        //   }
        // });
        op.componentList.forEach(cmp => {
          if (cmp.materialCost) {
            total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
          }
        });
      });
      if (prd.productTreeDetailList && prd.productTreeDetailList.length) {
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

  setSelectedProcessMaterial(event) {
    if (event) {
      this.selectedProcessMaterial = event;
      this.selectedProcessMaterial.unit = event.baseUnit;

      if (this.jobOrderList.length === 1) {
        return 0;
      }

      this.jobOrderList.forEach((job, jbIndex) => {
        job.jobOrderOperations.forEach((op, opIndex) => {
          if (jbIndex === 0) {
            op.jobOrderStockProduceList.forEach(st => {
              st.stock = { ...this.selectedProcessMaterial };
              st.stockId = this.selectedProcessMaterial.stockId;
              st.stockName = this.selectedProcessMaterial.stockName;
              st.stockNo = this.selectedProcessMaterial.stockNo;
            })
          } else if (jbIndex === (this.jobOrderList.length - 1)) {
            op.jobOrderStockUseList.forEach(st => {
              st.stock = { ...this.selectedProcessMaterial };
              st.stockId = this.selectedProcessMaterial.stockId;
              st.stockName = this.selectedProcessMaterial.stockName;
              st.stockNo = this.selectedProcessMaterial.stockNo;
            })
          } else {
            op.jobOrderStockProduceList.forEach(st => {
              st.stock = { ...this.selectedProcessMaterial };
              st.stockId = this.selectedProcessMaterial.stockId;
              st.stockName = this.selectedProcessMaterial.stockName;
              st.stockNo = this.selectedProcessMaterial.stockNo;
            });
            op.jobOrderStockUseList.forEach(st => {
              st.stock = { ...this.selectedProcessMaterial };
              st.stockId = this.selectedProcessMaterial.stockId;
              st.stockName = this.selectedProcessMaterial.stockName;
              st.stockNo = this.selectedProcessMaterial.stockNo;
            });
          }
        });
      });


      // this.processJobOrderForInputAndOutPut();

    } else {
      this.selectedProcessMaterial = null;
    }
  }

  processJobOrderForInputAndOutPut() {
    this.jobOrderList.forEach((jb, jbIndex) => {
      jb.jobOrderOperations.forEach((op, index) => {
        if (jbIndex === 0) {
          op.jobOrderStockProduceList.forEach(st => {
            st.stock = <any>{ stockId: this.prodData.materialId, stockNo: this.prodData.materialNo, stockName: this.prodData.materialName };
            st.stockId = this.prodData.materialId;
            st.stockName = this.prodData.materialName;
            st.stockNo = this.prodData.materialNo;
            st.unit = this.prodData.baseUnit;
            // st.stockTypeId = this.prodData.stockTypeId;
          });
        } else {
          op.jobOrderStockProduceList.forEach(st => {
            st.stock = this.selectedProcessMaterial;
            st.stockId = this.selectedProcessMaterial?.stockId || null;
            st.stockName = this.selectedProcessMaterial?.stockName || null;
            st.stockNo = this.selectedProcessMaterial?.stockNo || null;
            st.stockTypeId = this.selectedProcessMaterial?.stockTypeId || null;
          })
        }
        if (jbIndex === (this.jobOrderList.length - 1)) {
          let stckProcss = op.jobOrderStockUseList.filter(stus => stus.stockTypeId === 9);
          let stckRaw = op.jobOrderStockUseList.filter(stus => stus.stockTypeId === 1);
          if (stckProcss && stckProcss.length) {
            stckProcss.forEach(stPr => {
              stPr.stock = this.selectedProcessMaterial;
              stPr.stockId = this.selectedProcessMaterial?.stockId || null;
              stPr.stockName = this.selectedProcessMaterial?.stockName || null;
              stPr.stockNo = this.selectedProcessMaterial?.stockNo || null;
              stPr.stockTypeId = this.selectedProcessMaterial?.stockTypeId || null;
              stPr.unit = this.selectedProcessMaterial?.baseUnit || this.selectedProcessMaterial?.quantityUnit || null;

            })
          }
          if (stckRaw && stckRaw.length) {
            stckRaw.forEach((stRaw, index) => {
              if (this.materialList[index]) {
                const materialObj = { ...this.materialList[index] };
                stRaw.stock = materialObj.stock;
                stRaw.stockId = materialObj.stockId;
                stRaw.stockName = materialObj.stockName;
                stRaw.stockNo = materialObj.stockNo;
                stRaw.stockTypeId = materialObj.stockTypeId;
                stRaw.unit = materialObj.unit || materialObj['quantityUnit'];
                stRaw['quantityUnit'] = materialObj.unit || materialObj['quantityUnit'];
              }
            });
          }
        } else {
          const deletedStock = [];
          op.jobOrderStockUseList.forEach((st, index) => {
            if (st.stockTypeId === 9) {
              st.stock = this.selectedProcessMaterial;
              st.stockId = this.selectedProcessMaterial?.stockId;
              st.stockName = this.selectedProcessMaterial?.stockName;
              st.stockNo = this.selectedProcessMaterial?.stockNo;
              st.stockTypeId = this.selectedProcessMaterial?.stockTypeId;
              st.unit = this.selectedProcessMaterial?.baseUnit;
            } else {
              deletedStock.push({ ...st });
            }
          });
          deletedStock.forEach(dlst => {
            op.jobOrderStockUseList.splice(
              op.jobOrderStockUseList.findIndex(stf => stf.stockId === dlst.stockId)
              , 1);
          });

          if (op.jobOrderStockUseList.length > 0) {
            op.jobOrderStockUseList.forEach(st => {
              st.stock = this.selectedProcessMaterial;
              st.stockId = this.selectedProcessMaterial?.stockId;
              st.stockName = this.selectedProcessMaterial?.stockName;
              st.stockNo = this.selectedProcessMaterial?.stockNo;
              st.stockTypeId = this.selectedProcessMaterial?.stockTypeId;
              st.unit = this.selectedProcessMaterial?.baseUnit || this.selectedProcessMaterial?.quantityUnit;
              st.neededQuantity = this.orderQuantity;
              //st.quantity = this.orderQuantity;

            });
          } else {
            op.jobOrderStockUseList.push({
              componentList: null,
              currentQuantity: null,
              currentStockQuantity: null,
              processControlFrequency: 1,
              currentStockReservedQuantity: null,
              defectName: null,
              defectQuantity: null,
              dimensionUnit: null,
              materialCost: null,
              plannedCycleQuantity: this.orderQuantity,
              materialCostRate: null,
              description: null,
              scrapCost: null,
              scrapCostRate: null,
              direction: -1,
              height: null,
              jobOrder: null,
              jobOrderId: jb.jobOrderId,
              jobOrderOperationId: op.jobOrderOperationId,
              jobOrderOperationName: null,
              jobOrderStockId: null,
              neededQuantity: this.orderQuantity,
              neededToBuyQuantity: null,
              plannedHeight: null,
              plannedWidth: null,
              quantity: 0,
              requestJobOrderComponentFeatureList: null,
              responseComponentFeature: null,
              reworkQuantity: null,
              setupDefectQuantity: null,
              stock: this.selectedProcessMaterial,
              stockId: this.selectedProcessMaterial?.stockId,
              stockName: this.selectedProcessMaterial?.stockName,
              stockNo: this.selectedProcessMaterial?.stockNo,
              stockTypeId: this.selectedProcessMaterial?.stockTypeId,
              totalDefectQuantity: null,
              totalReworkQuantity: null,
              totalSetupQuantity: null,
              unit: this.selectedProcessMaterial?.baseUnit || this.selectedProcessMaterial?.quantityUnit,
              useStock: null,
              innerDiameter: null,
              outerDiameter: null,
              weight: null,
              length: null,
              quantityUnit: null,
              weightUnit: null,
              wareHouseStockId: null,
              width: null,
            });

          }
        }
      });

      if (jbIndex === 0) {
        jb.orderNo = '10';
        jb.orderFNo = '10';
      } else {
        jb.orderNo = this.jobOrderList[jbIndex - 1].orderNo + '10';
        jb.orderFNo = this.jobOrderList[jbIndex - 1].orderFNo + '.10';
      }
    });


    // let jobOrderOperations: any = this.jobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
    //   jop['orderNo'] = jb.orderNo;
    //   return jop;
    // }));
    // jobOrderOperations = jobOrderOperations.reduce((r, a) => r.concat(a), []);
    // console.log(jobOrderOperations);

    // this.invertedJobOrderList = this.jobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
  }


  openOperationModal(operation, rowIndex, rowData) {
    // this.prodTreeSelectedIndex = rowIndex;
    this.prodTreeSelectedRowData = rowData;
    this.selectedProdItemOperation = operation;
    this.addProdOperationModal.active = true;
  }

  setWorkstation(event, operation) {
    operation.workStation = event;
    operation.workStationId = event?.workStationId || null;
    operation.workStationName = event?.workStationName || null;
    operation.fixedWorkstation = event ? true : false;
  }
  addOperation(event, myModal) {
    if (event) {
      event.variableCostRate = event.variableCost;
      event.laborCostRate = event.laborCost;
      this.prodTreeSelectedRowData.jobOrderOperations.splice(0, 1, { ...event })
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

  setSelectedMaterial(event, index) {
    if (event) {
      this.materialList[index].stock = { ...event };
      this.materialList[index].stockId = event.stockId;
      this.materialList[index].stockNo = event?.stockNo;
      this.materialList[index].stockName = event?.stockName;
      this.materialList[index].height = event.height;
      this.materialList[index].innerDiameter = event.innerDiameter;
      this.materialList[index].length = event.length;
      this.materialList[index].outerDiameter = event.outerDiameter;
      this.materialList[index].stockTypeId = event.stockTypeId;
      if (event.stockTypeId === 1) {
        this.materialList[index].raw = true;
      } else {
        this.materialList[index].raw = false;
      }
      this.materialList[index].unit = event.baseUnit || event.quantityUnit;
      this.materialList[index].quantityUnit = event.baseUnit;
      this.materialList[index].weight = event.weight;
      this.materialList[index].weightUnit = event.weightUnit;
      this.materialList[index].width = event.width;
      // if(event.stockCostEstimate?.currentPrice && !this.materialList[index].materialCostRate) {
      this.materialList[index].materialCostRate = event.stockCostEstimate?.currentPrice || 0;
      // }

      this.jobOrderList[0].jobOrderOperations[0].jobOrderStockUseList
        .forEach((itm, i) => {
          if (i === index) {
            itm.stock = { ...this.materialList[index].stock };
            itm.stockId = this.materialList[index].stockId;
            itm.stockNo = this.materialList[index].stockNo;
            itm.stockName = this.materialList[index].stockName;
            itm.height = this.materialList[index].height;
            itm.innerDiameter = this.materialList[index].innerDiameter;
            itm.length = this.materialList[index].length;
            itm.outerDiameter = this.materialList[index].outerDiameter;
            itm.stockTypeId = this.materialList[index].stockTypeId;
            itm.unit = this.materialList[index].unit;
            itm.quantityUnit = this.materialList[index].quantityUnit;
            itm.weight = this.materialList[index].weight;
            itm.weightUnit = this.materialList[index].weightUnit;
            itm.width = this.materialList[index].width;
          }
        });
      // this.processJobOrderForInputAndOutPut();
      this.onMaterialChange(event, index);

    }
  }

  onMaterialChange(event, index) {

    if (!this.materialList[index].neededQuantity || (parseFloat(this.materialList[index].neededQuantity + "") <= 0)) {
      this.materialList[index].neededQuantity = 1;
    }
    this.materialList[index].materialCost = parseFloat((this.materialList[index].neededQuantity * this.materialList[index].materialCostRate).toFixed(2));
    // this.materialList[index].neededQuantity = this.materialList[index].quantity;
    // this.materialList[index].plannedCycleQuantity = this.materialList[index].quantity;
    this.materialList[index].description = this.materialList[index].description;
    if (this.jobOrderList && this.jobOrderList.length) {
      this.jobOrderList[0].jobOrderOperations[0].jobOrderStockUseList.filter(it => it.stockTypeId == 1).forEach((itm, i) => {
        if (itm.stockId === this.materialList[index].stockId && i === index) {

          itm.materialCost = this.materialList[index].materialCost;
          // if(this.jobOrderList[0].jobOrderOperations[0].operation.outsource) {

          // }

          itm.materialCostRate = this.materialList[index].materialCostRate;
          //itm.quantity = this.materialList[index].quantity;
          itm.neededQuantity = this.materialList[index].neededQuantity;
          itm.description = this.materialList[index].description;
          itm.weight = itm.neededQuantity;
        }
      });
    }
  }
  onchangeMaterialCostNotOutSource(item, itmIndex) {
    item.materialCost = (item.quantity * item.materialCostRate);
    this.materialList[itmIndex].materialCost = item.materialCost;
    this.materialList[itmIndex].materialCostRate = item.materialCostRate;
  }

  onChangeMaterialWeight(event, material, operation) {
    // material.materialCost = (material.quantity * material.materialCostRate);
    //material.neededQuantity = material.quantity;
    operation.variableCost = parseFloat(
      (material.neededQuantity * operation.variableCostRate).toFixed(1));
    // this.materialList.forEach(mt => {
    //   if(material.stockId === mt.stockId) {
    //     mt.quantity = material.quantity;
    //     mt.neededQuantity = material.neededQuantity;
    //     mt.materialCost = (mt.quantity * mt.materialCostRate);
    //   }
    // });
  }


  onSelectOperation(event, operation) {
    if (event) {
      operation.operation = event;
      operation.operationId = event?.operationId;
      operation.locationId = event?.location?.locationId;
      if (!operation.operation.outsource) {
        operation.singleDuration = event.singleDuration;
        operation.maxSingleStandbyDuration = event.maxSingleStandbyDuration || 0;
        operation.singleSetupDuration = event.singleSetupDuration || 0;
        if (operation.singleDuration) {
          operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
        }
      }

      operation.variableCostRate = event.operationCostRate || operation.variableCostRate;
      if (operation.variableCostRate) {
        this.onChangeVariableCost(event, operation);
      }
      // if(event.outsource) {
      //   operation.variableCost = ((operation.weight || 0) * operation.variableCostRate).toFixed(1);
      //   operation.laborCost = 0;
      // }
      operation.currency = event.currency || operation.currency;

      if (operation.operation.outsource) {
        operation.jobOrderStockProduceList.forEach(stk => {
          stk.outerDiameter = this.prodData.outerDiameter;
          stk.innerDiameter = this.prodData.innerDiameter;
          stk.length = this.prodData.length;
          stk.density = this.prodData.density;
          let weight = parseFloat((((stk.outerDiameter * stk.outerDiameter) -
            (stk.innerDiameter * stk.innerDiameter)) * (this.orderQuantity || 1) *
            stk.length * 3.14 * 8 / 4000000).toFixed(2));
          if (weight <= 0) {
            weight = 1;
          }
          if ((operation.operation.unit === 'pcs') || (operation.operation.unit === 'PCS')) {
            stk.weight = this.orderQuantity;
          } else {
            stk.weight = weight;
          }
          stk.weightUnit = operation.operation.unit;
          operation.variableCost = parseFloat((stk.weight * operation.variableCostRate).toFixed(2));
          operation.laborCost = parseFloat((stk.weight * operation.laborCostRate).toFixed(2));
          stk.materialCost = parseFloat((stk.weight * stk.materialCostRate).toFixed(2));
        });

        if (operation.myWorkstationList && operation.myWorkstationList.length === 1) {
          operation.workStation = operation.myWorkstationList[0];
          operation.workStationId = operation.myWorkstationList[0].workStationId || null;
          operation.workStationName = operation.myWorkstationList[0].workStationName || null;
          operation.fixedWorkstation = event ? true : false;
        }

        operation.singleCycleDuration = (1000 * 60 * 60 * 24) * 7;
        operation.singleSetupDuration = 0;
        operation.singleDuration = (1000 * 60 * 60 * 24) * 7;
        operation.singleTotalDuration = (1000 * 60 * 60 * 24) * 7;

      } else if (operation.operation.transfer) {
        if (operation.myWorkstationList && operation.myWorkstationList.length === 1) {
          operation.workStation = operation.myWorkstationList[0];
          operation.workStationId = operation.myWorkstationList[0].workStationId || null;
          operation.workStationName = operation.myWorkstationList[0].workStationName || null;
          operation.fixedWorkstation = event ? true : false;
        }
      } else {
        operation.jobOrderStockProduceList.forEach(stk => {
          stk.outerDiameter = null;
          stk.innerDiameter = null;
          stk.length = null;
          stk.density = null;
          stk.weight = null;
          stk.unit = null;
          operation.variableCost = null;
          operation.laborCost = null;
          stk.materialCost = null;
        });

        operation.workStation = null;
        operation.workStationId = null;
        operation.workStationName = null;
        operation.fixedWorkstation = false;
      }

    }
  }
  onOutsourceEvent(event, operation) {
    if (event) {
      operation.operation.outsource = event;
      // operation.location = event?.location?.locationNo;
      operation.variableCost = ((operation.weight || 0) * operation.variableCostRate).toFixed(1);
      operation.laborCost = 0;
      // operation.quantity = 1;

      operation.singleCycleDuration = (1000 * 60 * 60 * 24) * 7;
      operation.maxSingleStandbyDuration = (1000 * 60 * 60 * 24) * 7;
      operation.singleSetupDuration = 0;
      operation.singleDuration = (1000 * 60 * 60 * 24) * 7;
      operation.singleTotalDuration = (1000 * 60 * 60 * 24) * 7;
      if (operation.variableCostRate) {
        this.onChangeVariableCost(event, operation);
      }
      if (!operation.jobOrderOperationId) {
        operation.jobOrderStockUseList.forEach(stk => {
          stk.outerDiameter = this.prodData.outerDiameter;
          stk.innerDiameter = this.prodData.innerDiameter;
          stk.length = this.prodData.length;
          stk.density = this.prodData.density;
          stk.weight = parseFloat((((stk.outerDiameter * stk.outerDiameter) -
            (stk.innerDiameter * stk.innerDiameter)) * (this.orderQuantity || 1) *
            stk.length * 3.14 * 8 / 4000000).toFixed(2));
          stk.weight = stk.weight <= 0 ? 1 : stk.weight;

          operation.variableCost = parseFloat((stk.weight * operation.variableCostRate).toFixed(1));
          operation.laborCost = parseFloat((stk.weight * operation.laborCostRate).toFixed(1));
        });
      }

      operation.jobOrderStockProduceList.forEach(stk => {

        stk.outerDiameter = this.prodData.outerDiameter;
        stk.innerDiameter = this.prodData.innerDiameter;
        stk.length = this.prodData.length;
        stk.density = this.prodData.density;
        let weight = parseFloat((((stk.outerDiameter * stk.outerDiameter) -
          (stk.innerDiameter * stk.innerDiameter)) * (this.orderQuantity || 1) *
          stk.length * 3.14 * 8 / 4000000).toFixed(2));
        if (weight <= 0) {
          if (stk.weight) {
            weight = stk.weight;
          } else weight = 1

        }
        if ((operation.operation.unit === 'pcs') || (operation.operation.unit === 'PCS')) {
          stk.weight = this.orderQuantity;
        } else {
          stk.weight = weight;
        }
        stk.weightUnit = operation.operation.unit;
        // stk.neededQuantity=stk.weight;
        stk.quantity = 0;
        operation.variableCost = parseFloat((stk.weight * operation.variableCostRate).toFixed(2));
        operation.laborCost = parseFloat((stk.weight * operation.laborCostRate).toFixed(2));
        stk.materialCost = parseFloat((stk.weight * stk.materialCostRate).toFixed(2));
      });



    } else {
      operation.operation.outsource = event;
      // operation.variableCost = 0;
      // operation.laborCost = 0;
      // this.onChangeVariableCost(event, operation);
    }
  }
  onTransferEvent(event, operation) {
    if (event) {
      operation.operation.transfer = event;
    } else {
      operation.operation.transfer = event;
    }
  }

  okWeight(weightPanel?: any) {
    this.selectedProdItemMaterial.weight = parseFloat((((this.selectedProdItemMaterial.outerDiameter * this.selectedProdItemMaterial.outerDiameter) -
      (this.selectedProdItemMaterial.innerDiameter * this.selectedProdItemMaterial.innerDiameter)) * (this.orderQuantity || 1) *
      this.selectedProdItemMaterial.length * 3.14 * 8 / 4000000).toFixed(2));

    this.selectedProdItemOperation.variableCost = parseFloat((this.selectedProdItemMaterial.weight * this.selectedProdItemOperation.variableCostRate).toFixed(2));
    this.selectedProdItemOperation.laborCost = parseFloat((this.selectedProdItemMaterial.weight * this.selectedProdItemOperation.laborCostRate).toFixed(2));
    if (this.selectedProdItemMaterial.weight <= 0) {
      this.selectedProdItemMaterial.weight = 1;
    }
    if (weightPanel) weightPanel.hide();
  }

  okweightMaterialPanel(weightPanel) {

    this.selectedProdItemMaterial.weight = parseFloat((
      this.selectedProdItemMaterial.outerDiameter * this.selectedProdItemMaterial.outerDiameter * (this.orderQuantity || 1) *
      this.selectedProdItemMaterial.length * (this.selectedProdItemMaterial.density) * 3.14 / 4000000
    ).toFixed(2));

    if (this.selectedProdItemMaterial.weight <= 0) {
      this.selectedProdItemMaterial.weight = 1;
    }

    //  this.selectedProdItemMaterial.quantity = this.selectedProdItemMaterial.weight;
    //  this.selectedProdItemMaterial.neededQuantity = this.selectedProdItemMaterial.weight;
    this.selectedProdItemMaterial.materialCost = (this.selectedProdItemMaterial.weight * this.selectedProdItemMaterial.materialCostRate);

    if (this.selectedProdItemMaterialIndex !== null) {
      this.materialList[this.selectedProdItemMaterialIndex].weight = this.selectedProdItemMaterial.weight;
      // this.materialList[this.selectedProdItemMaterialIndex].quantity = this.selectedProdItemMaterial.weight;
      // this.materialList[this.selectedProdItemMaterialIndex].neededQuantity = this.selectedProdItemMaterial.weight;
      this.materialList[this.selectedProdItemMaterialIndex].outerDiameter = this.selectedProdItemMaterial.outerDiameter;
      this.materialList[this.selectedProdItemMaterialIndex].length = this.selectedProdItemMaterial.length;
      this.materialList[this.selectedProdItemMaterialIndex].density = this.selectedProdItemMaterial.density;


      this.jobOrderList[0].jobOrderOperations[0]
        .jobOrderStockUseList[this.selectedProdItemMaterialIndex].weight = this.selectedProdItemMaterial.weight;
      // this.jobOrderList[0].jobOrderOperations[0]
      // .jobOrderStockUseList[this.selectedProdItemMaterialIndex].quantity=this.selectedProdItemMaterial.weight;
      // this.jobOrderList[0].jobOrderOperations[0]
      // .jobOrderStockUseList[this.selectedProdItemMaterialIndex].neededQuantity=this.selectedProdItemMaterial.weight;
      this.jobOrderList[0].jobOrderOperations[0]
        .jobOrderStockUseList[this.selectedProdItemMaterialIndex].outerDiameter = this.selectedProdItemMaterial.outerDiameter;
      this.jobOrderList[0].jobOrderOperations[0]
        .jobOrderStockUseList[this.selectedProdItemMaterialIndex].length = this.selectedProdItemMaterial.length;
      this.jobOrderList[0].jobOrderOperations[0]
        .jobOrderStockUseList[this.selectedProdItemMaterialIndex].density = this.selectedProdItemMaterial.density;
    }
    this.onMaterialChange(event, this.selectedProdItemMaterialIndex);
    if (weightPanel) weightPanel.hide();
  }


  changeWeight(item, operation?: any) {

    // item.weight = (item.length * item.innerDiameter * item.outerDiameter * 3.14 * item.density) / 400000;
    // this.selectedProdItemOperation.variableCost = item.weight * this.selectedProdItemOperation.variableCostRate;
    operation.variableCost = parseFloat((item.weight * operation.variableCostRate).toFixed(2));
    operation.laborCost = parseFloat((item.weight * operation.laborCostRate).toFixed(2));
    item.materialCost = parseFloat((item.weight * item.materialCostRate).toFixed(2));
    // item.quantity = item.weight;
    // item.neededQuantity = item.weight;
    // if(weightPanel) weightPanel.hide();
  }
  removeMaterial(index) {

    if (this.jobOrderList && this.jobOrderList.length) {
      this.jobOrderList[0].jobOrderOperations.forEach(itm => {
        const stck = itm.jobOrderStockUseList.find(it => it.stockId === this.materialList[index].stockId)
        if (stck) {
          itm.jobOrderStockUseList.splice(itm.jobOrderStockUseList.findIndex(stus => stus.stockId === stck.stockId), 1);
        }
        this.materialList.splice(index, 1);
      })
    }
  }
  addMaterial() {
    let material = {
      actualMaterialCost: null,
      actualScrapCost: null,
      batch: null,
      componentList: null,
      currency: null,
      currentQuantity: null,
      currentStockQuantity: null,
      currentStockReservedQuantity: null,
      cycleRate: null,
      defectName: null,
      defectQuantity: null,
      raw: true,
      density: null,
      dimensionUnit: null,
      direction: -1,
      height: null,
      innerDiameter: null,
      jobOrder: null,
      jobOrderId: this.jobOrderList[0].jobOrderId,
      jobOrderOperation: null,
      jobOrderOperationId: this.jobOrderList[0].jobOrderOperations ? this.jobOrderList[0].jobOrderOperations[0].jobOrderOperationId : null,
      // jobOrderOperationId: this.jobOrderList[this.jobOrderList.length-1].jobOrderOperations ? this.jobOrderList[this.jobOrderList.length-1].jobOrderOperations[0].jobOrderOperationId : null,
      jobOrderOperationName: null,
      jobOrderStockId: null,
      length: null,
      materialCost: null,
      materialCostRate: null,
      neededQuantity: this.orderQuantity,
      neededToBuyQuantity: null,
      outerDiameter: null,
      plannedHeight: null,
      plannedWidth: null,
      quantity: 0,
      requestJobOrderComponentFeatureList: null,
      responseComponentFeature: null,
      reworkQuantity: null,
      scrapCost: null,
      scrapCostRate: null,
      setupDefectQuantity: null,
      stock: null,
      stockId: null,
      stockName: null,
      stockNo: null,
      stockTypeId: null,
      totalDefectQuantity: null,
      totalReworkQuantity: null,
      totalSetupQuantity: null,
      unit: null,
      useStock: null,
      wareHouseStockId: null,
      weight: null,
      weightUnit: null,
      plannedCycleQuantity: this.orderQuantity,
      quantityUnit: null,
      processControlFrequency: 1,
      width: null,
    }
    this.materialList.push({ ...material });
    if (this.jobOrderList && this.jobOrderList.length) {
      this.jobOrderList[0].jobOrderOperations.forEach(itm => {
        itm.jobOrderStockUseList = [...this.materialList];
        // const procStock = itm.jobOrderStockUseList.find(i => (i.stockTypeId == 9));
        // if(procStock) {
        //   const newPrcStck = Object.assign({}, procStock);
        //   newPrcStck.stock = material.stock;
        //   newPrcStck.stockId = material.stockId;
        //   newPrcStck.stockName = material.stockName;
        //   newPrcStck.stockNo = material.stockNo;
        //   newPrcStck.stockTypeId = material.stockTypeId;
        //   itm.jobOrderStockUseList.splice(itm.jobOrderStockUseList
        //     .findIndex(usStck => usStck.stockId === procStock.stockId), 1);
        //   itm.jobOrderStockUseList.push(newPrcStck);
        // } else {
        // itm.jobOrderStockUseList = [...itm.jobOrderStockUseList, ...this.materialList];
        itm.jobOrderStockUseList = itm.jobOrderStockUseList.reduce((arr, item) => {
          const removed = arr.filter(i => i['stockId'] !== item['stockId']);
          return [...removed, item];
        }, []);
        // }
      })
    }
  }

  onPrDimensionChanged(event) {

    this.prodData.weight = parseFloat((((this.prodData.outerDiameter * this.prodData.outerDiameter) -
      (this.prodData.innerDiameter * this.prodData.innerDiameter)) * (this.orderQuantity || 1) *
      this.prodData.length * 3.14 * 8 / 4000000).toFixed(2));
    if (this.prodData.weight <= 0) {
      this.prodData.weight = 1;
    }

    if (this.showParallel) {
      let populatedJobOrderList = []
      populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
      populatedJobOrderList.forEach((jb) => {
        jb.jobOrderOperations.forEach((op) => {
          if (op.operation.outsource) {
            op.jobOrderStockProduceList.forEach(stk => {
              stk.outerDiameter = this.prodData.outerDiameter;
              stk.innerDiameter = this.prodData.innerDiameter;
              stk.length = this.prodData.length;
              stk.density = this.prodData.density;
              let weight = parseFloat((((stk.outerDiameter * stk.outerDiameter) -
                (stk.innerDiameter * stk.innerDiameter)) * (this.orderQuantity) *
                stk.length * 3.14 * 8 / 4000000).toFixed(2));
              if (weight <= 0) {
                weight = 1;
              }
              if ((op.operation.unit === 'pcs') || (op.operation.unit === 'PCS')) {
                stk.weight = this.orderQuantity;
              } else {
                stk.weight = weight;
              }
              op.variableCost = parseFloat((stk.weight * op.variableCostRate).toFixed(2));
              op.laborCost = parseFloat((stk.weight * op.laborCostRate).toFixed(2));
              stk.materialCost = parseFloat((stk.weight * stk.materialCostRate).toFixed(2));
            });
          }
        })
      });
    } else {
      this.jobOrderList.forEach((jb) => {
        jb.jobOrderOperations.forEach((op) => {
          if (op.operation.outsource) {
            op.jobOrderStockProduceList.forEach(stk => {
              stk.outerDiameter = this.prodData.outerDiameter;
              stk.innerDiameter = this.prodData.innerDiameter;
              stk.length = this.prodData.length;
              stk.density = this.prodData.density;
              let weight = parseFloat((((stk.outerDiameter * stk.outerDiameter) -
                (stk.innerDiameter * stk.innerDiameter)) * (this.orderQuantity || 1) *
                stk.length * 3.14 * 8 / 4000000).toFixed(2));
              if (weight <= 0) {
                weight = 1;
              }
              if ((op.operation.unit === 'pcs') || (op.operation.unit === 'PCS')) {
                stk.weight = this.orderQuantity;
              } else {
                stk.weight = weight;
              }
              stk.materialCost = parseFloat((stk.weight * stk.materialCostRate).toFixed(2));
              op.variableCost = parseFloat((stk.weight * op.variableCostRate).toFixed(2));
              op.laborCost = parseFloat((stk.weight * op.laborCostRate).toFixed(2));
            });
          }
        })
      })
    }
  }

  // onMaterialQuantityChange(event, material) {
  //   if(event) {
  //     material.materialCost=(material.quantity * this.orderQuantity * material.materialCostRate);
  //     if(this.jobOrderList && this.jobOrderList.length) {
  //       this.jobOrderList[this.jobOrderList.length-1].jobOrderOperations.forEach(itm => {
  //         itm.jobOrderStockUseList.forEach(stk => {
  //           stk.quantity = material.quantity;
  //         })
  //       })
  //     }
  //   }
  // }







  addJobOrderItem(index) {
    if (!this.singleComponent) {
      this.utilities.showWarningToast("please-enable-single-component");
      return 0;
    }
    if (!this.selectedProcessMaterial) {
      this.utilities.showWarningToast("please-select-process-material");
      return 0;
    }
    let jobOrder = {
      batch: null,
      customerJobOrderStatus: null,
      description: null,
      endDate: null,
      expectedQuantity: this.prodData.plannedQuantity,
      expectedSetupDuration: null,
      individualCapacity: null,
      item: null,
      jobOrderEquipmentList: [],
      jobOrderId: null,
      jobOrderOperations: [
        {
          actualFinishTime: null,
          actualStartTime: null,
          currentQuantity: null,
          defaultStockId: null,
          defaultStockName: null,
          direction: null,
          expectedSetupDuration: null,
          individualCapacity: null,
          jobOrder: null,
          jobOrderId: null,
          jobOrderOperationId: null,
          referenceId: this.prodData?.referenceId,
          jobOrderStockAuxList: [],
          jobOrderStockProduceList: (index !== (this.jobOrderList.length - 1)) ?
            [
              {
                actualMaterialCost: null,
                actualScrapCost: null,
                batch: null,
                componentList: null,
                currency: null,
                currentQuantity: null,
                currentStockQuantity: null,
                currentStockReservedQuantity: null,
                cycleRate: null,
                defectName: null,
                defectQuantity: null,
                density: null,
                dimensionUnit: null,
                direction: 1,
                height: this.selectedProcessMaterial?.height,
                innerDiameter: this.selectedProcessMaterial?.innerDiameter,
                jobOrder: null,
                jobOrderId: null,
                jobOrderOperation: null,
                jobOrderOperationId: null,
                jobOrderOperationName: null,
                jobOrderStockId: null,
                length: this.selectedProcessMaterial?.length,
                materialCost: null,
                materialCostRate: null,
                neededQuantity: this.orderQuantity,
                neededToBuyQuantity: null,
                outerDiameter: this.selectedProcessMaterial?.outerDiameter,
                plannedHeight: null,
                plannedWidth: null,
                quantity: 0,
                requestJobOrderComponentFeatureList: null,
                responseComponentFeature: null,
                reworkQuantity: null,
                scrapCost: null,
                scrapCostRate: null,
                setupDefectQuantity: null,
                stock: this.selectedProcessMaterial,
                stockId: this.selectedProcessMaterial?.stockId,
                stockName: this.selectedProcessMaterial?.stockName,
                stockNo: this.selectedProcessMaterial?.stockNo,
                stockTypeId: this.selectedProcessMaterial?.stockTypeId,
                totalDefectQuantity: null,
                totalReworkQuantity: null,
                totalSetupQuantity: null,
                unit: this.selectedProcessMaterial?.baseUnit,
                useStock: null,
                wareHouseStockId: null,
                weight: this.selectedProcessMaterial?.weight,
                weightUnit: this.selectedProcessMaterial?.weightUnit,
                width: this.selectedProcessMaterial?.width,
              }
            ]
            :
            [] as any,
          jobOrderStockUseList: [],
          maxSingleStandbyDuration: null,
          operation: null,
          operationId: null,
          operationName: null,
          laborCost: null,
          laborCostRate: null,
          variableCost: null,
          variableCostRate: null,
          totalCost: null,
          fixedCost: null,
          fixedWorkstation: false,
          fixedEmployeeGroup: false,
          operationOrder: 1,
          operationRepeat: 1,
          operationStatus: null,
          parent: true,
          plannedCycleQuantity: this.prodData.quantity,
          processControlFrequency: 1,
          prodOrderId: this.prodData.prodOrderId,
          quantity: this.prodData.quantity,
          singleDuration: null,
          singleSetupDuration: 0,
          singleTotalDuration: null,
          workStation: null,
          workStationId: null,
          workStationName: null,
          workstationProgramList: [],
        }
      ],
      jobOrderStatus: null,
      jobOrderStockAuxList: [],
      jobOrderStockProduceList: [],
      jobOrderStockUseList: [],
      maxSingleStandbyDuration: null,
      operationRepeat: null,
      orderDetailId: null,
      orderIndex: null,
      orderNo: this.jobOrderList[index].orderNo,
      orderFNo: this.jobOrderList[index].orderFNo,
      parentId: this.jobOrderList[index]?.jobOrderId,
      plannedCycleQuantity: this.prodData.quantity,
      plannedHeight: null,
      plannedWidth: null,
      position: 'STANDARD',
      processControlFrequency: null,
      prodOrderId: this.prodData.prodOrderId,
      productTreeDetailId: this.jobOrderList[index]?.productTreeDetailId,
      productTreeId: this.jobOrderList[index]?.productTreeId,
      productionType: 'STANDARD',
      receiptNo: null,
      reverse: null,
      singleDuration: null,
      singleSetupDuration: 0,
      singleStandbyDuration: null,
      startDate: null,
      totalDuration: null,
      wareHouseStockId: null,
      workstationId: null,
      workstationName: null,
    }

    if (index !== (this.jobOrderList.length - 1)) {
      jobOrder.jobOrderOperations[0].jobOrderStockUseList = [
        {
          actualMaterialCost: null,
          actualScrapCost: null,
          batch: null,
          componentList: null,
          currency: null,
          currentQuantity: null,
          currentStockQuantity: null,
          currentStockReservedQuantity: null,
          cycleRate: null,
          defectName: null,
          defectQuantity: null,
          density: null,
          dimensionUnit: null,
          direction: -1,
          height: this.selectedProcessMaterial?.height,
          innerDiameter: this.selectedProcessMaterial?.innerDiameter,
          jobOrder: null,
          jobOrderId: null,
          jobOrderOperation: null,
          jobOrderOperationId: null,
          jobOrderOperationName: null,
          jobOrderStockId: null,
          length: this.selectedProcessMaterial?.length,
          materialCost: null,
          materialCostRate: null,
          neededQuantity: this.prodData.quantity,
          neededToBuyQuantity: null,
          outerDiameter: this.selectedProcessMaterial?.outerDiameter,
          plannedHeight: null,
          plannedWidth: null,
          quantity: 0,
          requestJobOrderComponentFeatureList: null,
          responseComponentFeature: null,
          reworkQuantity: null,
          scrapCost: null,
          scrapCostRate: null,
          setupDefectQuantity: null,
          stock: this.selectedProcessMaterial,
          stockId: this.selectedProcessMaterial?.stockId,
          stockName: this.selectedProcessMaterial?.stockName,
          stockNo: this.selectedProcessMaterial?.stockNo,
          stockTypeId: this.selectedProcessMaterial?.stockTypeId,
          totalDefectQuantity: null,
          totalReworkQuantity: null,
          totalSetupQuantity: null,
          unit: this.selectedProcessMaterial?.baseUnit,
          useStock: null,
          wareHouseStockId: null,
          weight: this.selectedProcessMaterial?.weight,
          weightUnit: this.selectedProcessMaterial?.weightUnit,
          width: this.selectedProcessMaterial?.width,
        }
      ];
    } else {

      if (index !== 0) {
        jobOrder.jobOrderOperations[0].jobOrderStockUseList = this.jobOrderList[this.jobOrderList.length - 1].jobOrderOperations[0]
          .jobOrderStockUseList.map(itm => ({
            ...itm,
            jobOrderId: null,
            jobOrder: null,
            jobOrderOperationId: null,
            jobOrderStockId: null
          }));
      } else {
        jobOrder.jobOrderOperations[0].jobOrderStockUseList = [
          {
            actualMaterialCost: null,
            actualScrapCost: null,
            batch: null,
            componentList: null,
            currency: null,
            currentQuantity: null,
            currentStockQuantity: null,
            currentStockReservedQuantity: null,
            cycleRate: null,
            defectName: null,
            defectQuantity: null,
            density: null,
            dimensionUnit: null,
            direction: -1,
            height: this.selectedProcessMaterial?.height,
            innerDiameter: this.selectedProcessMaterial?.innerDiameter,
            jobOrder: null,
            jobOrderId: null,
            jobOrderOperation: null,
            jobOrderOperationId: null,
            jobOrderOperationName: null,
            jobOrderStockId: null,
            length: this.selectedProcessMaterial?.length,
            materialCost: null,
            materialCostRate: null,
            neededQuantity: this.prodData.quantity,
            neededToBuyQuantity: null,
            outerDiameter: this.selectedProcessMaterial?.outerDiameter,
            plannedHeight: null,
            plannedWidth: null,
            quantity: 0,
            requestJobOrderComponentFeatureList: null,
            responseComponentFeature: null,
            reworkQuantity: null,
            scrapCost: null,
            scrapCostRate: null,
            setupDefectQuantity: null,
            stock: this.selectedProcessMaterial,
            stockId: this.selectedProcessMaterial?.stockId,
            stockName: this.selectedProcessMaterial?.stockName,
            stockNo: this.selectedProcessMaterial?.stockNo,
            stockTypeId: this.selectedProcessMaterial?.stockTypeId,
            totalDefectQuantity: null,
            totalReworkQuantity: null,
            totalSetupQuantity: null,
            unit: this.selectedProcessMaterial?.baseUnit,
            useStock: null,
            wareHouseStockId: null,
            weight: this.selectedProcessMaterial?.weight,
            weightUnit: this.selectedProcessMaterial?.weightUnit,
            width: this.selectedProcessMaterial?.width,
          }
        ];
      }


      jobOrder.jobOrderOperations[0].jobOrderStockProduceList = this.jobOrderList[this.jobOrderList.length - 1].jobOrderOperations[0]
        .jobOrderStockProduceList.map(itm => ({
          ...itm,
          jobOrderId: null,
          jobOrderOperationId: null,
          jobOrderStockId: null
        }));
      this.jobOrderList[this.jobOrderList.length - 1]
        .jobOrderOperations[0].jobOrderStockProduceList = this.jobOrderList[this.jobOrderList.length - 1].jobOrderOperations[0]
          .jobOrderStockProduceList.map(itm => ({
            ...itm,
            stock: this.selectedProcessMaterial ? { ...this.selectedProcessMaterial } : null,
            stockId: this.selectedProcessMaterial?.stockId,
            stockName: this.selectedProcessMaterial?.stockName,
            stockNo: this.selectedProcessMaterial?.stockNo,
            height: this.selectedProcessMaterial?.height,
            innerDiameter: this.selectedProcessMaterial?.innerDiameter,
            length: this.selectedProcessMaterial?.length,
            neededQuantity: this.prodData.quantity,
            outerDiameter: this.selectedProcessMaterial?.outerDiameter,
            quantity: 0,
            stockTypeId: this.selectedProcessMaterial?.stockTypeId,
            width: this.selectedProcessMaterial?.width,
            unit: this.selectedProcessMaterial?.baseUnit,
            jobOrderId: null,
            jobOrderOperationId: null,
            jobOrderOperationName: null,
            jobOrderStockId: null
          }));

      // jobOrder.jobOrderOperations[0].jobOrderStockUseList = [...this.materialList];
      // jobOrder.jobOrderOperations[0].jobOrderStockUseList.forEach(itm => {
      //   itm.direction = -1;
      //   itm.jobOrderOperationId = null;
      //   itm.jobOrderId= null;
      //   itm.jobOrderStockId = null;
      // })
    }
    if (index < this.jobOrderList.length) {
      this.jobOrderList.splice(index + 1, 0, { ...jobOrder });
    } else {
      this.jobOrderList.push({ ...jobOrder })
    }



    this.jobOrderList.forEach((jb, jbIndex) => {
      if (jbIndex <= index) {
        jb.orderNo = 10 + '' + jb.orderNo;
      }
      const split = jb.orderNo.toString().match(/.{1,2}/g);
      jb.orderFNo = split.join(".");
    });

    // this.processJobOrderForInputAndOutPut();

    // this.makeItInOrder();


  }


  onSelectWorkstation(event, operation) {
    if (event) {
      operation.myWorkstationList = event.filter(mw => mw.workStationName !== null);
      if ((operation.operation.transfer || operation.operation.outsource) && operation.myWorkstationList && operation.myWorkstationList.length === 1) {
        operation.workStation = operation.myWorkstationList[0];
        operation.workStationId = operation.myWorkstationList[0].workStationId || null;
        operation.workStationName = operation.myWorkstationList[0].workStationName || null;
        operation.fixedWorkstation = event ? true : false;
      }
    } else {
      operation.myWorkstationList = [];
    }
  }

  // makeItInOrder() {
  //   this.jobOrderList.forEach((itm, index) => {
  //     if (index === 0) {
  //       itm.orderNo = '10';
  //       itm.orderFNo = '10';
  //     } else {
  //       itm.orderNo = this.jobOrderList[index - 1].orderNo + '10';
  //       itm.orderFNo = this.jobOrderList[index - 1].orderFNo + '.10';
  //     }
  //   })

  //   // this.prodData.jobOrderList = this.jobOrderList;
  // }

  // onTableDataChange() {
  //   const dataToSave = this.nodeList2DetailData(this.tableData);
  //   // this.saveEvent.next(dataToSave);
  // }
  delete(id, index) {
    // if (id) {

    if (id === this.jobOrderList[this.jobOrderList.length - 1].jobOrderId) {
      this.utilities.showWarningToast('Cannot delete last job order operation');
      return 0;
    }


    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if (id) {
          this._loaderSvc.showLoader();
          this._prodOrderSvc.cancelJobOrder(id).then(() => {
            this.utilities.showSuccessToast('deleted');
            this._loaderSvc.hideLoader();
            this.removalList(index);
          }).catch((err) => {
            this.utilities.showErrorToast(err, 'error');
            this._loaderSvc.hideLoader();
          })
        } else {
          this.removalList(index);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  removalList(index) {
    if (this.jobOrderList.length > 1) {
      if (index == 0) {
        this.jobOrderList[index + 1].jobOrderOperations[0].jobOrderStockUseList = this.jobOrderList[index].jobOrderOperations[0].jobOrderStockUseList.map(st => {
          st.jobOrderId = this.jobOrderList[index + 1].jobOrderId;
          st.jobOrderOperationId = this.jobOrderList[index + 1].jobOrderOperations[0].jobOrderOperationId;
          st.jobOrderStockId = null;
          return st;
        })
      } else if (index === (this.jobOrderList.length - 1)) {
        this.jobOrderList[index - 1].jobOrderOperations[0].jobOrderStockProduceList.forEach(pr => {
          pr.stock = { stockId: this.prodData.materialId, stockName: this.prodData.materialName, stockNo: this.prodData.materialNo };
          pr.stockId = this.prodData.materialId;
          pr.stockName = this.prodData.materialName;
          pr.stockNo = this.prodData.materialNo;
        })
      }
    }
    this.jobOrderList.splice(index, 1);
    this.jobOrderList.forEach((jb, jbIndex) => {
      if (jbIndex < index) {
        jb.orderNo = '' + jb.orderNo;
        jb.orderNo = jb.orderNo.substring(2)
      }
      const split = jb.orderNo.toString().match(/.{1,2}/g);
      jb.orderFNo = split.join(".");
    });
  }


  async onlySaveAllOperations() {
    let jobOrderOperations: any = [];
    if (this.showParallel) {
      let populatedJobOrderList = []
      populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
      jobOrderOperations = populatedJobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
        jop['orderNo'] = jb.orderNo;
        if (jop['employeeGenericGroup']) {
          delete jop['employeeGenericGroup'];
        }
        if (jop['myWorkstationList']) {
          delete jop['myWorkstationList'];
        }
        jop.jobOrderStockProduceList.forEach(stP => {
          if (stP.componentId) {
            delete stP.componentId;
          }
          if (stP.component) {
            delete stP.component;
          }
          if (stP.productTreeDetailComponentFeatureList) {
            delete stP.productTreeDetailComponentFeatureList;
          }
          if (stP.baseQuantity) {
            delete stP.baseQuantity;
          }
          stP.currency = jop.currency;
          if (stP.stock) {
            stP.stockId = stP.stock.stockId;
            stP.stockName = stP.stock.stockName;
            stP.stockNo = stP.stock.stockNo;
          }
        });
        jop.jobOrderStockUseList.forEach(stP => {
          if (stP.componentId) {
            delete stP.componentId;
          }
          if (stP.component) {
            delete stP.component;
          }
          if (stP.productTreeDetailComponentFeatureList) {
            delete stP.productTreeDetailComponentFeatureList;
          }
          if (stP.baseQuantity) {
            delete stP.baseQuantity;
          }
          stP.currency = jop.currency;
          if (stP.stock) {
            stP.stockId = stP.stock.stockId;
            stP.stockName = stP.stock.stockName;
            stP.stockNo = stP.stock.stockNo;
          }
        });
        return jop;
      }));
    } else {
      jobOrderOperations = this.jobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
        jop['orderNo'] = jb.orderNo;
        if (jop['employeeGenericGroup']) {
          delete jop['employeeGenericGroup'];
        }
        if (jop['myWorkstationList']) {
          delete jop['myWorkstationList'];
        }
        jop.jobOrderStockProduceList.forEach(stP => {
          stP['currency'] = jop['currency'];
        });
        jop.jobOrderStockUseList.forEach(stP => {
          stP['currency'] = jop['currency'];
        });
        return jop;
      }));
    }
    jobOrderOperations = jobOrderOperations.reduce((r, a) => r.concat(a), []).filter(jb => jb.jobOrderOperationId !== null || jb.jobOrderOperationId !== undefined);
    jobOrderOperations.forEach((jbop) => {
      jbop.laborCost = jbop.laborCost ? parseFloat(parseFloat(jbop.laborCost).toFixed(2)) : 0;
      jbop.laborCostRate = jbop.laborCostRate ? parseFloat(parseFloat(jbop.laborCostRate).toFixed(2)) : 0;
      jbop.totalCost = jbop.totalCost ? parseFloat(parseFloat(jbop.totalCost).toFixed(2)) : 0;
      jbop.variableCost = jbop.variableCost ? parseFloat(parseFloat(jbop.variableCost).toFixed(2)) : 0;
      jbop.variableCostRate = jbop.variableCostRate ? parseFloat(parseFloat(jbop.variableCostRate).toFixed(2)) : 0;
      jbop.wastageRate = jbop.wastageRate ? parseFloat(parseFloat(jbop.wastageRate).toFixed(2)) : 0;
      jbop.jobOrderStockUseList.forEach((jbstck) => {
        jbstck.actualMaterialCost = jbstck.actualMaterialCost ? parseFloat(parseFloat(jbstck.actualMaterialCost).toFixed(2)) : 0;
        jbstck.actualScrapCost = jbstck.actualScrapCost ? parseFloat(parseFloat(jbstck.actualScrapCost).toFixed(2)) : 0;
        jbstck.scrapCost = jbstck.scrapCost ? parseFloat(parseFloat(jbstck.scrapCost).toFixed(2)) : 0;
        jbstck.scrapCostRate = jbstck.scrapCostRate ? parseFloat(parseFloat(jbstck.scrapCostRate).toFixed(2)) : 0;
        jbstck.height = jbstck.height ? parseFloat(parseFloat(jbstck.height).toFixed(2)) : 0;
        jbstck.innerDiameter = jbstck.innerDiameter ? parseFloat(parseFloat(jbstck.innerDiameter).toFixed(2)) : 0;
        jbstck.length = jbstck.length ? parseFloat(parseFloat(jbstck.length).toFixed(2)) : 0;
        jbstck.neededQuantity = jbstck.neededQuantity ? parseFloat(parseFloat(jbstck.neededQuantity).toFixed(2)) : 0;
        // jbstck.quantity = jbstck.quantity ? parseFloat(parseFloat(jbstck.quantity).toFixed(2)) : 0;
      });

    });
    if (this.prodData.referenceId) {
      jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);
    }
    await this._prodOrderSvc.saveAllJobOrderOperation(jobOrderOperations);
  }

  onTableDataChange() {
    // this.tableData = [...this.tableData];
    const newTable = this.convertToTableTree(this.tableData);
    this.tableData = this.detailList2Node(newTable);
    // this.expandORcollapse(anotherTable);
    // this.tableData = [...anotherTable];
    // this.dataModel.productTreeDetailList = this.nodeList2DetailData(this.tableData);
    // this.tableData = this.detailList2Node(this.dataModel.productTreeDetailList);
    // this.cdx.markForCheck();
    // this.initialize(this.dataModel);
  }

  convertToTableTree(tableData: any[]) {
    const list = [];
    tableData.forEach(element => {
      list.push(this.convertToTableTreeObject(element));
    });

    return list;
  }
  convertToTableTreeObject(tableObject: any) {
    let data = tableObject.data;
    if (tableObject.children && tableObject.children.length > 0) {
      return { ...data, children: this.convertToTableTree(tableObject.children) };
    } else {
      return { ...data, children: [] };
    }
  }




  onChangeLaborCost(event, operation) {
    if (operation?.operation?.outsource) {
      operation.laborCost = parseFloat((operation.jobOrderStockProduceList[0].weight * operation.laborCostRate).toFixed(2));
    } else {
      operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
      const hour = ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration);
      operation.laborCost = parseFloat((hour * operation.laborCostRate).toFixed(1));

    }

    // if(!operation?.operation?.outsource) {
    //   const hour = ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration);
    //   operation.laborCost = parseFloat((hour * operation.laborCostRate).toFixed(1));
    // }else {
    //   operation.variableCost = parseFloat(operation.jobOrderStockUseList[0]?.weight * operation.variableCostRate + '').toFixed(1);
    // }
  }

  onChangeVariableCost(event, operation) {

    operation.maxSingleStandbyDuration = operation.singleDuration;
    operation.expectedSetupDuration = 0;

    if (operation?.operation?.outsource) {
      operation.variableCost = parseFloat((operation.jobOrderStockProduceList[0].weight * operation.variableCostRate).toFixed(2));
    } else {
      operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
      const hour = ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration);
      operation.variableCost = parseFloat((hour * operation.variableCostRate).toFixed(1));

    }


    // if(!operation?.operation?.outsource) {
    //   operation.variableCost = parseFloat((ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.variableCostRate).toFixed(1));
    // }else {
    //   operation.variableCost = parseFloat((operation.jobOrderStockUseList[0]?.weight * operation.variableCostRate).toFixed(2));
    // }
  }


  getOperationDataHeight(operation, num: number) {
    var data = {
      height: 0,
      totalHeight: 0
    }
    if (operation.jobOrderStockProduceList.length > operation.jobOrderStockUseList.length) {
      data.height = (operation.jobOrderStockProduceList.length + 1) * 25;
      data.totalHeight = operation.jobOrderStockProduceList.length;
    } else if ((operation.jobOrderStockProduceList.length !== 0) && (operation.jobOrderStockProduceList.length === operation.jobOrderStockUseList.length)) {
      data.height = (operation.jobOrderStockProduceList.length + 1) * 25;
      data.totalHeight = operation.jobOrderStockProduceList.length;
    } else {
      data.height = (operation.jobOrderStockUseList.length + 1) * 25;
      data.totalHeight = operation.jobOrderStockUseList.length;
    }
    return data;
  }

  getReadableTime(time) {
    if (time) {
      return ConvertUtil.longDuration2DHHMMSSTime(time)
    }
  }

  async save() {
    if (!this.prodData.wareHouseId) {
      this.utilities.showWarningToast('please-select-warehouse');
      return;
    }
    if (!this.showParallel) {
      if (!this.materialList || !this.materialList.length) {
        this.utilities.showWarningToast('please-add-at-least-one-material');
        return;
      }
    }

    let jobOrderOperations: any = [];
    if (this.showParallel) {
      let populatedJobOrderList = []
      populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
      jobOrderOperations = populatedJobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
        jop['orderNo'] = jb.orderNo;
        if (jop['employeeGenericGroup']) {
          delete jop['employeeGenericGroup'];
        }
        if (jop['myWorkstationList']) {
          delete jop['myWorkstationList'];
        }
        jop.jobOrderStockProduceList.forEach(stP => {
          if (stP.componentId) {
            delete stP.componentId;
          }
          if (stP.component) {
            delete stP.component;
          }
          if (stP.productTreeDetailComponentFeatureList) {
            delete stP.productTreeDetailComponentFeatureList;
          }
          if (stP.baseQuantity) {
            delete stP.baseQuantity;
          }
          if (stP.stock) {
            stP.stockId = stP.stock.stockId;
            stP.stockName = stP.stock.stockName;
            stP.stockNo = stP.stock.stockNo;
          }
        });
        jop.jobOrderStockUseList.forEach(stP => {
          if (stP.componentId) {
            delete stP.componentId;
          }
          if (stP.component) {
            delete stP.component;
          }
          if (stP.productTreeDetailComponentFeatureList) {
            delete stP.productTreeDetailComponentFeatureList;
          }
          if (stP.baseQuantity) {
            delete stP.baseQuantity;
          }
          if (stP.stock) {
            stP.stockId = stP.stock.stockId;
            stP.stockName = stP.stock.stockName;
            stP.stockNo = stP.stock.stockNo;
            stP.stockTypeId = stP.stock.stockTypeId;
          }
        });
        return jop;
      }));
    } else {
      jobOrderOperations = this.jobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
        jop['orderNo'] = jb.orderNo;
        if (jop['employeeGenericGroup']) {
          delete jop['employeeGenericGroup'];
        }
        if (jop['myWorkstationList']) {
          delete jop['myWorkstationList'];
        }
        return jop;
      }));
    }
    // let jobOrderOperations: any = this.jobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
    //   jop['orderNo'] = jb.orderNo;
    //   if(jop['employeeGenericGroup']) {
    //     delete jop['employeeGenericGroup'];
    //   }
    //   if(jop['myWorkstationList']) {
    //     delete jop['myWorkstationList'];
    //   }
    //   return jop;
    // }));
    jobOrderOperations = jobOrderOperations.reduce((r, a) => r.concat(a), []);
    jobOrderOperations.forEach((jbop) => {
      jbop.laborCost = jbop.laborCost ? parseFloat(parseFloat(jbop.laborCost).toFixed(2)) : 0;
      jbop.laborCostRate = jbop.laborCostRate ? parseFloat(parseFloat(jbop.laborCostRate).toFixed(2)) : 0;
      jbop.totalCost = jbop.totalCost ? parseFloat(parseFloat(jbop.totalCost).toFixed(2)) : 0;
      jbop.variableCost = jbop.variableCost ? parseFloat(parseFloat(jbop.variableCost).toFixed(2)) : 0;
      jbop.variableCostRate = jbop.variableCostRate ? parseFloat(parseFloat(jbop.variableCostRate).toFixed(2)) : 0;
      jbop.wastageRate = jbop.wastageRate ? parseFloat(parseFloat(jbop.wastageRate).toFixed(2)) : 0;
      jbop.jobOrderStockUseList.forEach((jbstck) => {
        jbstck.actualMaterialCost = jbstck.actualMaterialCost ? parseFloat(parseFloat(jbstck.actualMaterialCost).toFixed(2)) : 0;
        jbstck.actualScrapCost = jbstck.actualScrapCost ? parseFloat(parseFloat(jbstck.actualScrapCost).toFixed(2)) : 0;
        jbstck.scrapCost = jbstck.scrapCost ? parseFloat(parseFloat(jbstck.scrapCost).toFixed(2)) : 0;
        jbstck.scrapCostRate = jbstck.scrapCostRate ? parseFloat(parseFloat(jbstck.scrapCostRate).toFixed(2)) : 0;
        jbstck.height = jbstck.height ? parseFloat(parseFloat(jbstck.height).toFixed(2)) : 0;
        jbstck.innerDiameter = jbstck.innerDiameter ? parseFloat(parseFloat(jbstck.innerDiameter).toFixed(2)) : 0;
        jbstck.length = jbstck.length ? parseFloat(parseFloat(jbstck.length).toFixed(2)) : 0;
        jbstck.neededQuantity = jbstck.neededQuantity ? parseFloat(parseFloat(jbstck.neededQuantity).toFixed(2)) : 0;
        // jbstck.quantity = jbstck.quantity ? parseFloat(parseFloat(jbstck.quantity).toFixed(2)) : 0;
      });

    });
    let isDescMissing = false;
    let isDescMissingIndex = -1;
    for (let i = 0; i < jobOrderOperations.length; i++) {
      if (!jobOrderOperations[i].operationId || !jobOrderOperations[i].operation) {
        this.utilities.showWarningToast('please-select-operation');
        return;
      } else if (jobOrderOperations[i].operation
        && (jobOrderOperations[i].operation.outsource || jobOrderOperations[i].operation.transfer)
        && (!jobOrderOperations[i].workStationId || !jobOrderOperations[i].workStation)) {
        this.utilities.showWarningToast('please-select-workstation-for-outsource-and-transfer-operation');
        return;
      } else if (!jobOrderOperations[i].jobOrderStockUseList || jobOrderOperations[i].jobOrderStockUseList.length === 0) {
        this.utilities.showWarningToast('please-add-input');
        return;
      } else if (!jobOrderOperations[i].jobOrderStockProduceList || jobOrderOperations[i].jobOrderStockProduceList.length === 0) {
        this.utilities.showWarningToast('please-add-output');
        return;
      } else if (!jobOrderOperations[i].singleDuration) {
        this.utilities.showWarningToast('please-select-single-duration');
        return;
      } else if (!jobOrderOperations[i].singleTotalDuration) {
        this.utilities.showWarningToast('please-select-single-total-duration');
        return;
      } else if (jobOrderOperations[i].operation && jobOrderOperations[i].operation.outsource
        && !jobOrderOperations[i].description) {
        isDescMissing = true;
        isDescMissingIndex = i;
      }
    }

    if (!isDescMissing) {
      await this.savingAllOperations(jobOrderOperations);
    } else {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('There are some outsource operations without description. Do you want to save changes'),
        header: this._translateSvc.instant('are-you-sure'),
        icon: 'fa fa-file',
        accept: async () => {
          await this.savingAllOperations(jobOrderOperations);
        },
        reject: () => {
          this.utilities.showInfoToast('canceled-operation');
          if (isDescMissingIndex !== -1) {
            const element: any = this.operationDivList.toArray()[isDescMissingIndex];
            element.isInvalid = true;
            const descelement: ElementRef<HTMLButtonElement> = this.operationDescItemList.toArray()[isDescMissingIndex];
            descelement.nativeElement.classList.remove('btn-outline-primary');
            descelement.nativeElement.classList.add('btn-danger');
            setTimeout(() => {
              element.isInvalid = false;
              descelement.nativeElement.classList.add('btn-outline-primary');
              descelement.nativeElement.classList.remove('btn-danger');
            }, 2000);
            // console.log(element);
          }
        }
      })
    }
  }


  async saveFinalReview() {
    if (!this.prodData.wareHouseId) {
      this.utilities.showWarningToast('please-select-warehouse');
      return;
    }
    if (!this.showParallel && (!this.materialList || !this.materialList.length)) {
      this.utilities.showWarningToast('please-add-atleast-one-material');
      return;
    }

    let jobOrderOperations: any = [];
    if (this.showParallel) {
      let populatedJobOrderList = []
      populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
      jobOrderOperations = populatedJobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
        jop['orderNo'] = jb.orderNo;
        if (jop['employeeGenericGroup']) {
          delete jop['employeeGenericGroup'];
        }
        if (jop['myWorkstationList']) {
          delete jop['myWorkstationList'];
        }
        jop.jobOrderStockProduceList.forEach(stP => {
          if (stP.componentId) {
            delete stP.componentId;
          }
          if (stP.component) {
            delete stP.component;
          }
          if (stP.productTreeDetailComponentFeatureList) {
            delete stP.productTreeDetailComponentFeatureList;
          }
          if (stP.baseQuantity) {
            delete stP.baseQuantity;
          }
          if (stP.stock) {
            stP.stockId = stP.stock.stockId;
            stP.stockName = stP.stock.stockName;
            stP.stockNo = stP.stock.stockNo;
          }
        });
        jop.jobOrderStockUseList.forEach(stP => {
          if (stP.componentId) {
            delete stP.componentId;
          }
          if (stP.component) {
            delete stP.component;
          }
          if (stP.productTreeDetailComponentFeatureList) {
            delete stP.productTreeDetailComponentFeatureList;
          }
          if (stP.baseQuantity) {
            delete stP.baseQuantity;
          }
          if (stP.stock) {
            stP.stockId = stP.stock.stockId;
            stP.stockName = stP.stock.stockName;
            stP.stockNo = stP.stock.stockNo;
            stP.stockTypeId = stP.stock.stockTypeId;
          }
        });
        return jop;
      }));
    } else {
      jobOrderOperations = this.jobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
        jop['orderNo'] = jb.orderNo;
        if (jop['employeeGenericGroup']) {
          delete jop['employeeGenericGroup'];
        }
        if (jop['myWorkstationList']) {
          delete jop['myWorkstationList'];
        }
        return jop;
      }));
    }
    // let jobOrderOperations: any = this.jobOrderList.map(jb => jb.jobOrderOperations.map(jop => {
    //   jop['orderNo'] = jb.orderNo;
    //   if(jop['employeeGenericGroup']) {
    //     delete jop['employeeGenericGroup'];
    //   }
    //   if(jop['myWorkstationList']) {
    //     delete jop['myWorkstationList'];
    //   }
    //   return jop;
    // }));
    jobOrderOperations = jobOrderOperations.reduce((r, a) => r.concat(a), []);
    jobOrderOperations.forEach((jbop) => {
      jbop.laborCost = jbop.laborCost ? parseFloat(parseFloat(jbop.laborCost).toFixed(2)) : 0;
      jbop.laborCostRate = jbop.laborCostRate ? parseFloat(parseFloat(jbop.laborCostRate).toFixed(2)) : 0;
      jbop.totalCost = jbop.totalCost ? parseFloat(parseFloat(jbop.totalCost).toFixed(2)) : 0;
      jbop.variableCost = jbop.variableCost ? parseFloat(parseFloat(jbop.variableCost).toFixed(2)) : 0;
      jbop.variableCostRate = jbop.variableCostRate ? parseFloat(parseFloat(jbop.variableCostRate).toFixed(2)) : 0;
      jbop.wastageRate = jbop.wastageRate ? parseFloat(parseFloat(jbop.wastageRate).toFixed(2)) : 0;
      jbop.jobOrderStockUseList.forEach((jbstck) => {
        jbstck.actualMaterialCost = jbstck.actualMaterialCost ? parseFloat(parseFloat(jbstck.actualMaterialCost).toFixed(2)) : 0;
        jbstck.actualScrapCost = jbstck.actualScrapCost ? parseFloat(parseFloat(jbstck.actualScrapCost).toFixed(2)) : 0;
        jbstck.scrapCost = jbstck.scrapCost ? parseFloat(parseFloat(jbstck.scrapCost).toFixed(2)) : 0;
        jbstck.scrapCostRate = jbstck.scrapCostRate ? parseFloat(parseFloat(jbstck.scrapCostRate).toFixed(2)) : 0;
        jbstck.height = jbstck.height ? parseFloat(parseFloat(jbstck.height).toFixed(2)) : 0;
        jbstck.innerDiameter = jbstck.innerDiameter ? parseFloat(parseFloat(jbstck.innerDiameter).toFixed(2)) : 0;
        jbstck.length = jbstck.length ? parseFloat(parseFloat(jbstck.length).toFixed(2)) : 0;
        jbstck.neededQuantity = jbstck.neededQuantity ? parseFloat(parseFloat(jbstck.neededQuantity).toFixed(2)) : 0;
        // jbstck.quantity = jbstck.quantity ? parseFloat(parseFloat(jbstck.quantity).toFixed(2)) : 0;
      });

    });
    let isDescMissing = false;
    let isDescMissingIndex = -1;
    for (let i = 0; i < jobOrderOperations.length; i++) {
      if (!jobOrderOperations[i].operationId || !jobOrderOperations[i].operation) {
        this.utilities.showWarningToast('please-select-operation');
        return;
      } else if (jobOrderOperations[i].operation
        && (jobOrderOperations[i].operation.outsource || jobOrderOperations[i].operation.transfer)
        && (!jobOrderOperations[i].workStationId || !jobOrderOperations[i].workStation)) {
        this.utilities.showWarningToast('please-select-workstation-for-outsource-and-transfer-operation');
        return;
      } else if (!jobOrderOperations[i].jobOrderStockUseList || jobOrderOperations[i].jobOrderStockUseList.length === 0) {
        this.utilities.showWarningToast('please-add-input');
        return;
      } else if (!jobOrderOperations[i].jobOrderStockProduceList || jobOrderOperations[i].jobOrderStockProduceList.length === 0) {
        this.utilities.showWarningToast('please-add-output');
        return;
      } else if (!jobOrderOperations[i].singleDuration) {
        this.utilities.showWarningToast('please-select-single-duration');
        return;
      } else if (!jobOrderOperations[i].singleTotalDuration) {
        this.utilities.showWarningToast('please-select-single-total-duration');
        return;
      } else if (jobOrderOperations[i].operation && jobOrderOperations[i].operation.outsource
        && !jobOrderOperations[i].description) {
        isDescMissing = true;
        isDescMissingIndex = i;
      }
    }

    if (!isDescMissing) {
      await this.savingAllOperationsOnly(jobOrderOperations);
    } else {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('There are some outsource operations without description. Do you want to save changes'),
        header: this._translateSvc.instant('are-you-sure'),
        icon: 'fa fa-file',
        accept: async () => {
          await this.savingAllOperationsOnly(jobOrderOperations);
        },
        reject: () => {
          this.utilities.showInfoToast('canceled-operation');
          if (isDescMissingIndex !== -1) {
            const element: any = this.operationDivList.toArray()[isDescMissingIndex];
            element.isInvalid = true;
            const descelement: ElementRef<HTMLButtonElement> = this.operationDescItemList.toArray()[isDescMissingIndex];
            descelement.nativeElement.classList.remove('btn-outline-primary');
            descelement.nativeElement.classList.add('btn-danger');
            setTimeout(() => {
              element.isInvalid = false;
              descelement.nativeElement.classList.add('btn-outline-primary');
              descelement.nativeElement.classList.remove('btn-danger');
            }, 2000);
            // console.log(element);
          }
        }
      })
    }
  }


  // savingAllOperations(jobOrderOperations) {
  //   if(this.showParallel) {
  //     let populatedJobOrderList = []
  //     populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
  //     this.prodData.jobOrderList = [...populatedJobOrderList];
  //   } else {
  //     this.prodData.jobOrderList = this.jobOrderList;
  //   }
  //   this._loaderSvc.showLoader();
  //   this.counter = this.counter + 1;
  //   Promise.all( [this._prodOrderSvc.saveAllJobOrderOperation(jobOrderOperations)])
  //     .then((res: any) => {
  //       this.utilities.showSuccessToast('saved-success');
  //       this.prodData.prodOrderStatus = 'CONFIRMED';
  //       this.prodData.jobOrderList = this.jobOrderList;
  //       this.prodData.jobOrderList.forEach(jb => {
  //         jb.jobOrderOperations.forEach(jop => {
  //           jop['orderNo'] = null;
  //           jop['operation'] = null;
  //         });
  //       });
  //       this.saveAction.emit();
  //       this._loaderSvc.hideLoader();
  //       this.counter = 1;
  //     }).catch(error => {
  //       this.utilities.showErrorToast(error, 'error');
  //       this._loaderSvc.hideLoader();
  //       this.counter = 1;
  //     });
  // }



  openOperationMaterialModal(rowData, operationIndex, type: any) {
    this.operationSelectedIndex = operationIndex;
    this.selectedProdItemOperation = rowData;
    this.selectedOperationMaterialType = type;
    this.addJobOperationMaterialmodal.active = true;
    if (type === 'output') {
      this.openChoosePaneComponentModal(rowData, type, operationIndex, 1);
    } else if (type === 'input') {
      this.openChoosePaneComponentModal(rowData, type, operationIndex, -1);
    }

  }
  openChoosePaneComponentModal(rowData, modaltype, operationIndex?, direction?, rowNode?) {
    this.addmodal.rowData = rowData;
    this.addmodal.index = operationIndex;
    this.addmodal.stockIndex = null;
    this.addmodal.direction = direction;
    if (modaltype === 'output') {
      this.addmodal.mode = 'material';
    } else if (modaltype === 'input') {
      this.addmodal.mode = 'component';
    }
  }

  openOperationMaterial(rowData, operationIndex, type: any, stockIndex) {
    this.addmodal.rowData = rowData;
    this.addmodal.index = operationIndex;
    this.addmodal.stockIndex = stockIndex;
    this.addmodal.data = {};
    if (type === 'output') {
      this.addmodal.mode = 'material';
      this.addmodal.data = this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderStockProduceList[stockIndex];
      this.addmodal.data.direction = 1;
      this.addmodal.title = 'material';
    } else if (type === 'input') {
      this.addmodal.mode = 'component';
      this.addmodal.data = this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderStockUseList[stockIndex];
      this.addmodal.data.direction = -1;
      this.addmodal.title = 'component';
    }
    this.addmodal.active = true;
  }


  setSelectedStock(stock: any) {
    if (stock) {
      //  if(this.selectedOperationMaterialType === 'input') {
      //    this.selectedProdItemOperation.jobOrderOperations[this.operationSelectedIndex].jobOrderStockUseList.push({
      //       actualMaterialCost: null,
      //       actualScrapCost: null,
      //       batch: null,
      //       componentList: null,
      //       currency: null,
      //       currentQuantity: null,
      //       currentStockQuantity: null,
      //       currentStockReservedQuantity: null,
      //       cycleRate: null,
      //       defectName: null,
      //       defectQuantity: null,
      //       density: null,
      //       dimensionUnit: null,
      //       direction: -1,
      //       height: stock?.height,
      //       innerDiameter: stock?.innerDiameter,
      //       jobOrder: null,
      //       jobOrderId: this.selectedProdItemOperation.jobOrderId,
      //       jobOrderOperation: null,
      //       jobOrderOperationId: this.selectedProdItemOperation.jobOrderOperations[this.operationSelectedIndex].jobOrderOperationId,
      //       jobOrderOperationName: this.selectedProdItemOperation.jobOrderOperations[this.operationSelectedIndex].jobOrderOperationName,
      //       jobOrderStockId: null,
      //       length: stock?.length,
      //       materialCost: null,
      //       materialCostRate: null,
      //       neededQuantity: this.prodData.quantity,
      //       neededToBuyQuantity: null,
      //       outerDiameter: stock?.outerDiameter,
      //       plannedHeight: null,
      //       plannedWidth: null,
      //       quantity: this.prodData.quantity,
      //       requestJobOrderComponentFeatureList: null,
      //       responseComponentFeature: null,
      //       reworkQuantity: null,
      //       scrapCost: null,
      //       scrapCostRate: null,
      //       setupDefectQuantity: null,
      //       stock: stock,
      //       stockId: stock?.stockId,
      //       stockName: stock?.stockName,
      //       stockNo: stock?.stockNo,
      //       stockTypeId: stock?.stockTypeId,
      //       totalDefectQuantity: null,
      //       totalReworkQuantity: null,
      //       totalSetupQuantity: null,
      //       unit: stock?.baseUnit,
      //       useStock: null,
      //       wareHouseStockId: null,
      //       weight: stock?.weight,
      //       weightUnit: stock?.weightUnit,
      //       width: stock?.width,
      //    })
      //  } else {
      //   this.selectedProdItemOperation.jobOrderOperations[this.operationSelectedIndex].jobOrderStockProduceList.push({
      //     actualMaterialCost: null,
      //     actualScrapCost: null,
      //     batch: null,
      //     componentList: null,
      //     currency: null,
      //     currentQuantity: null,
      //     currentStockQuantity: null,
      //     currentStockReservedQuantity: null,
      //     cycleRate: null,
      //     defectName: null,
      //     defectQuantity: null,
      //     density: null,
      //     dimensionUnit: null,
      //     direction: -1,
      //     height: stock?.height,
      //     innerDiameter: stock?.innerDiameter,
      //     jobOrder: null,
      //     jobOrderId: this.selectedProdItemOperation.jobOrderId,
      //     jobOrderOperation: null,
      //     jobOrderOperationId: this.selectedProdItemOperation.jobOrderOperations[this.operationSelectedIndex].jobOrderOperationId,
      //     jobOrderOperationName: this.selectedProdItemOperation.jobOrderOperations[this.operationSelectedIndex].jobOrderOperationName,
      //     jobOrderStockId: null,
      //     length: stock?.length,
      //     materialCost: null,
      //     materialCostRate: null,
      //     neededQuantity: this.prodData.quantity,
      //     neededToBuyQuantity: null,
      //     outerDiameter: stock?.outerDiameter,
      //     plannedHeight: null,
      //     plannedWidth: null,
      //     quantity: this.prodData.quantity,
      //     requestJobOrderComponentFeatureList: null,
      //     responseComponentFeature: null,
      //     reworkQuantity: null,
      //     scrapCost: null,
      //     scrapCostRate: null,
      //     setupDefectQuantity: null,
      //     stock: stock,
      //     stockId: stock?.stockId,
      //     stockName: stock?.stockName,
      //     stockNo: stock?.stockNo,
      //     stockTypeId: stock?.stockTypeId,
      //     totalDefectQuantity: null,
      //     totalReworkQuantity: null,
      //     totalSetupQuantity: null,
      //     unit: stock?.baseUnit,
      //     useStock: null,
      //     wareHouseStockId: null,
      //     weight: stock?.weight,
      //     weightUnit: stock?.weightUnit,
      //     width: stock?.width,
      //  })
      //  }
      this.addJobOperationMaterialmodal.active = false;
      this.addmodal.data = {};
      this.addmodal.data.componentId = stock.stockId;
      this.addmodal.data.component = stock;
      this.addmodal.data.quantityUnit = stock.baseUnit;
      this.addmodal.data.auxfeature = stock.auxfeature;
      this.addmodal.data.numberOfEdge = stock.numberOfEdge;
      this.addmodal.data.materialCost = stock.stockCostEstimate?.currentPrice || this.addmodal.data.materialCost;
      this.addmodal.data.currency = stock.stockCosting?.currencyCode || this.addmodal.data.currency;

      // this.addmodal.mode = this..modalType;
      if (this.addmodal.mode === 'component') {
        this.addmodal.data.direction = -1;
        this.addmodal.title = 'component';
      } else if (this.addmodal.mode === 'material') {
        this.addmodal.data.direction = 1;
        this.addmodal.title = 'material';
      } else if (this.addmodal.mode === 'auxiliary-material') {
        this.addmodal.data.direction = 0;
        this.addmodal.title = 'auxiliary-material';
      }
      this.addmodal.active = true;
    }
  }

  removeOperationMaterial(rowData, operationIndex, type, stockIndex) {
    if (type === 'input') {
      rowData.jobOrderOperations[operationIndex].jobOrderStockUseList.splice(stockIndex, 1);
    } else {
      rowData.jobOrderOperations[operationIndex].jobOrderStockProduceList.splice(stockIndex, 1);
    }
  }

  addJobOrderParallelItem(rowNode, parallel = false, parent = false) {
    if (!this.selectedProcessMaterial) {
      this.utilities.showWarningToast("please-select-process-material-first");
      return 0;
    }
    // if(!this.singleComponent) {
    //   this.utilities.showWarningToast("please-enable-single-component");
    //   return 0;
    // }
    if (!this.selectedProcessMaterial) {
      this.utilities.showWarningToast("please-select-process-material");
      return 0;
    }
    let jobOrder = {
      batch: null,
      customerJobOrderStatus: null,
      description: null,
      endDate: null,
      expectedQuantity: this.prodData.plannedQuantity,
      expectedSetupDuration: null,
      individualCapacity: null,
      item: null,
      jobOrderEquipmentList: [],
      jobOrderId: null,
      jobOrderOperations: [
        {
          actualFinishTime: null,
          actualStartTime: null,
          currentQuantity: null,
          defaultStockId: null,
          defaultStockName: null,
          direction: null,
          expectedSetupDuration: null,
          individualCapacity: null,
          jobOrder: null,
          jobOrderId: null,
          jobOrderOperationId: null,
          referenceId: this.prodData?.referenceId,
          jobOrderStockAuxList: [],
          jobOrderStockProduceList: (this.selectedRowNode.parent !== null) ?
            [
              {
                actualMaterialCost: null,
                actualScrapCost: null,
                batch: null,
                componentList: null,
                currency: null,
                currentQuantity: null,
                currentStockQuantity: null,
                currentStockReservedQuantity: null,
                cycleRate: null,
                defectName: null,
                defectQuantity: null,
                density: null,
                dimensionUnit: null,
                direction: 1,
                height: this.selectedProcessMaterial?.height,
                innerDiameter: this.selectedProcessMaterial?.innerDiameter,
                jobOrder: null,
                jobOrderId: null,
                jobOrderOperation: null,
                jobOrderOperationId: null,
                jobOrderOperationName: null,
                jobOrderStockId: null,
                length: this.selectedProcessMaterial?.length,
                materialCost: null,
                materialCostRate: null,
                neededQuantity: this.orderQuantity,
                neededToBuyQuantity: null,
                outerDiameter: this.selectedProcessMaterial?.outerDiameter,
                plannedHeight: null,
                plannedWidth: null,
                quantity: 0,
                requestJobOrderComponentFeatureList: null,
                responseComponentFeature: null,
                reworkQuantity: null,
                scrapCost: null,
                scrapCostRate: null,
                setupDefectQuantity: null,
                stock: this.selectedProcessMaterial,
                stockId: this.selectedProcessMaterial?.stockId,
                stockName: this.selectedProcessMaterial?.stockName,
                stockNo: this.selectedProcessMaterial?.stockNo,
                stockTypeId: this.selectedProcessMaterial?.stockTypeId,
                totalDefectQuantity: null,
                totalReworkQuantity: null,
                totalSetupQuantity: null,
                unit: this.selectedProcessMaterial?.baseUnit,
                useStock: null,
                wareHouseStockId: null,
                weight: this.selectedProcessMaterial?.weight,
                weightUnit: this.selectedProcessMaterial?.weightUnit,
                width: this.selectedProcessMaterial?.width,
              }
            ]
            :
            [] as any,
          jobOrderStockUseList: [],
          maxSingleStandbyDuration: null,
          operation: null,
          operationId: null,
          operationName: null,
          laborCost: null,
          laborCostRate: null,
          variableCost: null,
          variableCostRate: null,
          totalCost: null,
          fixedCost: null,
          fixedWorkstation: false,
          fixedEmployeeGroup: false,
          operationOrder: 1,
          operationRepeat: 1,
          operationStatus: null,
          parent: true,
          plannedCycleQuantity: this.prodData.quantity,
          processControlFrequency: 1,
          prodOrderId: this.prodData.prodOrderId,
          quantity: this.prodData.quantity,
          singleDuration: null,
          singleSetupDuration: 0,
          singleTotalDuration: null,
          workStation: null,
          workStationId: null,
          workStationName: null,
          workstationProgramList: [],
        }
      ],
      jobOrderStatus: null,
      jobOrderStockAuxList: [],
      jobOrderStockProduceList: [],
      jobOrderStockUseList: [],
      maxSingleStandbyDuration: null,
      operationRepeat: null,
      orderDetailId: null,
      orderIndex: null,
      orderNo: null,
      previousJobOrderId: null,
      plannedCycleQuantity: this.prodData.quantity,
      plannedHeight: null,
      plannedWidth: null,
      position: 'STANDARD',
      processControlFrequency: null,
      prodOrderId: this.prodData.prodOrderId,
      productTreeDetailId: null,
      productTreeId: null,
      productionType: 'STANDARD',
      receiptNo: null,
      reverse: null,
      singleDuration: null,
      singleSetupDuration: 0,
      singleStandbyDuration: null,
      startDate: null,
      totalDuration: null,
      wareHouseStockId: null,
      workstationId: null,
      workstationName: null,
    }
    if (this.selectedRowNode.node.data.orderNo !== '10') {
      jobOrder.jobOrderOperations[0].jobOrderStockUseList = [
        {
          actualMaterialCost: null,
          actualScrapCost: null,
          batch: null,
          componentList: null,
          currency: null,
          currentQuantity: null,
          currentStockQuantity: null,
          currentStockReservedQuantity: null,
          cycleRate: null,
          defectName: null,
          defectQuantity: null,
          density: null,
          dimensionUnit: null,
          direction: -1,
          height: this.selectedProcessMaterial?.height,
          innerDiameter: this.selectedProcessMaterial?.innerDiameter,
          jobOrder: null,
          jobOrderId: null,
          jobOrderOperation: null,
          jobOrderOperationId: null,
          jobOrderOperationName: null,
          jobOrderStockId: null,
          length: this.selectedProcessMaterial?.length,
          materialCost: null,
          materialCostRate: null,
          neededQuantity: this.prodData.quantity,
          neededToBuyQuantity: null,
          outerDiameter: this.selectedProcessMaterial?.outerDiameter,
          plannedHeight: null,
          plannedWidth: null,
          quantity: 0,
          requestJobOrderComponentFeatureList: null,
          responseComponentFeature: null,
          reworkQuantity: null,
          scrapCost: null,
          scrapCostRate: null,
          setupDefectQuantity: null,
          stock: this.selectedProcessMaterial,
          stockId: this.selectedProcessMaterial?.stockId,
          stockName: this.selectedProcessMaterial?.stockName,
          stockNo: this.selectedProcessMaterial?.stockNo,
          stockTypeId: this.selectedProcessMaterial?.stockTypeId,
          totalDefectQuantity: null,
          totalReworkQuantity: null,
          totalSetupQuantity: null,
          unit: this.selectedProcessMaterial?.baseUnit,
          useStock: null,
          wareHouseStockId: null,
          weight: this.selectedProcessMaterial?.weight,
          weightUnit: this.selectedProcessMaterial?.weightUnit,
          width: this.selectedProcessMaterial?.width,
        }
      ];
    } else {

      if (this.selectedRowNode.parent !== null) {
        jobOrder.jobOrderOperations[0].jobOrderStockUseList = this.jobOrderList[this.jobOrderList.length - 1].jobOrderOperations[0]
          .jobOrderStockUseList.map(itm => ({
            ...itm,
            jobOrderId: null,
            jobOrder: null,
            jobOrderOperationId: null,
            jobOrderStockId: null
          }));
      } else {
        jobOrder.jobOrderOperations[0].jobOrderStockUseList = [
          {
            actualMaterialCost: null,
            actualScrapCost: null,
            batch: null,
            componentList: null,
            currency: null,
            currentQuantity: null,
            currentStockQuantity: null,
            currentStockReservedQuantity: null,
            cycleRate: null,
            defectName: null,
            defectQuantity: null,
            density: null,
            dimensionUnit: null,
            direction: -1,
            height: this.selectedProcessMaterial?.height,
            innerDiameter: this.selectedProcessMaterial?.innerDiameter,
            jobOrder: null,
            jobOrderId: null,
            jobOrderOperation: null,
            jobOrderOperationId: null,
            jobOrderOperationName: null,
            jobOrderStockId: null,
            length: this.selectedProcessMaterial?.length,
            materialCost: null,
            materialCostRate: null,
            neededQuantity: this.prodData.quantity,
            neededToBuyQuantity: null,
            outerDiameter: this.selectedProcessMaterial?.outerDiameter,
            plannedHeight: null,
            plannedWidth: null,
            quantity: 0,
            requestJobOrderComponentFeatureList: null,
            responseComponentFeature: null,
            reworkQuantity: null,
            scrapCost: null,
            scrapCostRate: null,
            setupDefectQuantity: null,
            stock: this.selectedProcessMaterial,
            stockId: this.selectedProcessMaterial?.stockId,
            stockName: this.selectedProcessMaterial?.stockName,
            stockNo: this.selectedProcessMaterial?.stockNo,
            stockTypeId: this.selectedProcessMaterial?.stockTypeId,
            totalDefectQuantity: null,
            totalReworkQuantity: null,
            totalSetupQuantity: null,
            unit: this.selectedProcessMaterial?.baseUnit,
            useStock: null,
            wareHouseStockId: null,
            weight: this.selectedProcessMaterial?.weight,
            weightUnit: this.selectedProcessMaterial?.weightUnit,
            width: this.selectedProcessMaterial?.width,
          }
        ];
      }


      // jobOrder.jobOrderOperations[0].jobOrderStockProduceList = this.jobOrderList[this.jobOrderList.length -1].jobOrderOperations[0]
      //                               .jobOrderStockProduceList.map(itm => ({
      //                                 ...itm,
      //                                 jobOrderId: null,
      //                                 jobOrderOperationId:null,
      //                                 jobOrderStockId: null
      //                               }));
      // this.jobOrderList[this.jobOrderList.length -1]
      // .jobOrderOperations[0].jobOrderStockProduceList = this.jobOrderList[this.jobOrderList.length -1].jobOrderOperations[0]
      //                       .jobOrderStockProduceList.map(itm => ({
      //                         ...itm,
      //                         stock: this.selectedProcessMaterial ? {...this.selectedProcessMaterial} : null,
      //                         stockId: this.selectedProcessMaterial?.stockId,
      //                         stockName: this.selectedProcessMaterial?.stockName,
      //                         stockNo: this.selectedProcessMaterial?.stockNo,
      //                         height: this.selectedProcessMaterial?.height,
      //                         innerDiameter: this.selectedProcessMaterial?.innerDiameter,
      //                         length: this.selectedProcessMaterial?.length,
      //                         neededQuantity: this.prodData.quantity,
      //                         outerDiameter: this.selectedProcessMaterial?.outerDiameter,
      //                         quantity: this.prodData.quantity,
      //                         stockTypeId: this.selectedProcessMaterial?.stockTypeId,
      //                         weight: this.selectedProcessMaterial?.weight,
      //                         weightUnit: this.selectedProcessMaterial?.weightUnit,
      //                         width: this.selectedProcessMaterial?.width,
      //                         unit: this.selectedProcessMaterial?.baseUnit,
      //                         jobOrderId: null,
      //                         jobOrderOperationId:null,
      //                         jobOrderOperationName:null,
      //                         jobOrderStockId: null
      //                       }));
    }

    if (parallel) {
      jobOrder.orderNo = parseInt(this.selectedRowNode.parent
        .children[this.selectedRowNode.parent.children.length - 1].data.orderNo) + 1;
      const split = jobOrder.orderNo.toString().match(/.{1,2}/g);
      jobOrder['orderFNo'] = split.join(".");
      jobOrder.previousJobOrderId = this.selectedRowNode.parent.data?.jobOrderId;
    } else if (parent) {
      jobOrder.orderNo = this.selectedRowNode.node.data.orderNo;
      jobOrder.previousJobOrderId = this.selectedRowNode.parent?.data?.jobOrderId;
    } else {
      if (this.selectedRowNode.node.children.length === 0) {
        jobOrder.orderNo = this.selectedRowNode.node.data.orderNo + '10';
      } else {
        jobOrder.orderNo = parseInt(this.selectedRowNode.node
          .children[this.selectedRowNode.node.children.length - 1].data.orderNo) + 1;
      }
      const split = jobOrder.orderNo.toString().match(/.{1,2}/g);
      jobOrder['orderFNo'] = split.join(".");
      jobOrder.previousJobOrderId = this.selectedRowNode.node?.data?.jobOrderId;
    }

    const detailchild = Object.assign({}, jobOrder);
    const node = this.detail2Node(detailchild, detailchild['orderFNo'], detailchild.orderNo);
    node.expanded = true;
    if (rowNode) {
      if (parallel) {
        rowNode.parent.children = [...rowNode.parent.children, node];
      } else if (parent) {
        node.children = [...rowNode.parent.children];
        rowNode.parent.children = [node];
      } else {
        rowNode.children = [...rowNode.children, node];
      }
    } else {
      this.tableData = [...this.tableData, node];
    }

    this.onTableDataChange();
  }

  async savingAllOperations(jobOrderOperations) {

    if (this.showParallel) {
      let populatedJobOrderList = []
      populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
      this.prodData.jobOrderList = [...populatedJobOrderList];
    } else {
      this.prodData.jobOrderList = this.jobOrderList;
    }
    if (this.prodData.prodOrderMaterialList && this.prodData.prodOrderMaterialList.length > 0) {
      this.prodData.prodOrderMaterialList.forEach(item => {
        delete item['newlyAdded'];
      })
    }
    if (this.prodData.referenceId) {
      // this.prodData.referenceId = this.salesSelectedOrder.referenceId;
      jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);

      this.prodData.jobOrderList.forEach((jo) => {
        jo.jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);
      })
    }

    this._loaderSvc.showLoader();
    this.counter = this.counter + 1;
    if (this.prodData.referenceId) {
      // this.prodData.referenceId = this.salesSelectedOrder.referenceId;
      jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);

      this.prodData.jobOrderList.forEach((jo) => {
        jo.jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);
      })
    }
    try {

      const reqProdData = Object.assign({}, this.prodData);
      reqProdData.prodOrderStatus = 'CONFIRMED';
      await this._prodOrderSvc.saveAllJobOrderOperation(jobOrderOperations);
      this.utilities.showSuccessToast('saved-successfully');
      if (reqProdData.orderDetail && !reqProdData.orderDetailId) {
        reqProdData.orderDetailId = reqProdData.orderDetail?.orderId;
      }
      await this._prodOrderSvc.save(reqProdData);

      this._loaderSvc.hideLoader();
      this.saveProdEditAction.emit();
      this.counter = 1;

    } catch (error) {
      this.utilities.showErrorToast(error, 'error');
      this._loaderSvc.hideLoader();
      this.counter = 1;
    }


    // Promise.all([this._prodOrderSvc.saveAllJobOrderOperation(jobOrderOperations),
    //   this._prodOrderSvc.save(this.prodData)])
    // .then((res: any) => {
    //   this.utilities.showSuccessToast('saved-success');
    //   this.saveAction.emit();
    //   this._loaderSvc.hideLoader();
    //   this.counter = 1;
    // })
    // .catch(error => {
    //   this.utilities.showErrorToast(error, 'error');
    //   this._loaderSvc.hideLoader();
    //   this.counter = 1;
    // });
  }

  async savingAllOperationsOnly(jobOrderOperations) {

    if (this.showParallel) {
      let populatedJobOrderList = []
      populatedJobOrderList = this.flattenTreeArray2(this.tableData, 'children', populatedJobOrderList);
      this.prodData.jobOrderList = [...populatedJobOrderList];
    } else {
      this.prodData.jobOrderList = this.jobOrderList;
    }
    if (this.prodData.prodOrderMaterialList && this.prodData.prodOrderMaterialList.length > 0) {
      this.prodData.prodOrderMaterialList.forEach(item => {
        delete item['newlyAdded'];
      })
    }
    if (this.prodData.referenceId) {
      // this.prodData.referenceId = this.salesSelectedOrder.referenceId;
      jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);

      this.prodData.jobOrderList.forEach((jo) => {
        jo.jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);
      })
    }

    this._loaderSvc.showLoader();
    this.counter = this.counter + 1;
    if (this.prodData.referenceId) {
      // this.prodData.referenceId = this.salesSelectedOrder.referenceId;
      jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);

      this.prodData.jobOrderList.forEach((jo) => {
        jo.jobOrderOperations.forEach((jbop) => jbop.referenceId = this.prodData.referenceId);
      })
    }
    try {

      const reqProdData = Object.assign({}, this.prodData);
      reqProdData.prodOrderStatus = 'WAITING_FINAL_REVIEW';
      await this._prodOrderSvc.saveAllJobOrderOperation(jobOrderOperations);
      this.utilities.showSuccessToast('saved-successfully');
      if (reqProdData.orderDetail && !reqProdData.orderDetailId) {
        reqProdData.orderDetailId = reqProdData.orderDetail?.orderId;
      }
      await this._prodOrderSvc.save(reqProdData);

      this._loaderSvc.hideLoader();
      this.saveProdEditAction.emit();
      this.counter = 1;

    } catch (error) {
      this.utilities.showErrorToast(error, 'error');
      this._loaderSvc.hideLoader();
      this.counter = 1;
    }


    // Promise.all([this._prodOrderSvc.saveAllJobOrderOperation(jobOrderOperations),
    //   this._prodOrderSvc.save(this.prodData)])
    // .then((res: any) => {
    //   this.utilities.showSuccessToast('saved-success');
    //   this.saveAction.emit();
    //   this._loaderSvc.hideLoader();
    //   this.counter = 1;
    // })
    // .catch(error => {
    //   this.utilities.showErrorToast(error, 'error');
    //   this._loaderSvc.hideLoader();
    //   this.counter = 1;
    // });
  }

  openMenu(rowIndex, menu, event) {
    // this.operationSelectedIndex=rowIndex;
    menu.toggle(event);
  }



  expandORcollapse(nodes) {
    for (const node of nodes) {
      if (node.children) {
        // if (node.expanded === true) {
        //   node.expanded = false;
        // } else {
        node.expanded = true;
        // }
        for (const cn of node.children) {
          this.expandORcollapse(node.children);
        }
      }
    }
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

  detail2Node(detail, frntlevel?, apilevel?) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail, { children: null }, { orderNo: apilevel, orderFNo: frntlevel }),
        children: detail.children ? me.detailList2Node(detail.children, frntlevel, apilevel) : [],
        key: ConvertUtil.getSimpleUId(),
        expanded: true
      };
      return node;
    }
    return node;

  }

  // find duplicated Array Items
  findDuplicate(array) {
    const results = [];
    for (let i = 0; i < array.length - 1; i++) {
      if (parseInt(array[i + 1].orderNo) === parseInt(array[i].orderNo)) {
        results.push(array[i]);
      }
    }
    return results;
  }




  listToTree = (arr1 = []) => {
    let map = {}, node, res = [], i;
    let arr = [...arr1];
    let duplicatedArray = this.findDuplicate(arr1);
    if (duplicatedArray.length > 0) {
      duplicatedArray.forEach(item => {
        if (item.jobOrderStatus === 'COMPLETED') {
          arr.splice(arr1.indexOf(item), 1);
        }
      });
    }
    for (i = 0; i < arr.length; i++) {
      map[arr[i].jobOrderId] = i;
      arr[i].children = [];
    };
    for (i = 0; i < arr.length; i++) {
      node = arr[i];
      if (!(node.previousJobOrderId === null || node.previousJobOrderId == 0 || node.previousJobOrderId == '0')
        && arr[map[node.previousJobOrderId]]) {
        if (!arr[map[node.previousJobOrderId]]?.children) {
          arr[map[node.previousJobOrderId]].children = [];
        }
        arr[map[node.previousJobOrderId]].children.push(node);
      }
      else {
        res.push(node);
      };
    };
    res = this.sortArray(res);
    return res;
  };

  sortArray(arr: any) {
    arr.sort((a, b) => parseInt(a.orderNo) - parseInt(b.orderNo));
    arr.forEach((ar: any) => {
      if (ar.children && ar.children.length) {
        this.sortArray(ar.children);
      }
    });
    return arr;
  }



  deleteThisNode() {
    if (this.selectedRowNode && this.selectedRowNode.node?.data?.jobOrderId) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {

          this._loaderSvc.showLoader();
          this._prodOrderSvc.cancelJobOrder(this.selectedRowNode.node?.data?.jobOrderId).then(() => {
            const key = this.selectedRowNode.node.key;
            let parent = this.selectedRowNode.node.parent;
            if (parent) {
              const dataListRef = [...parent.children];
              const founddata = dataListRef.find(item => item.key == key);
              const founddataIndex = dataListRef.findIndex(item => item.key == key);
              if (founddata) {
                parent.children.splice(founddataIndex, 1);
                parent.children = [...parent.children,
                ...founddata?.children?.map(itm => {
                  itm.data.parentId = founddata?.data?.parentId
                  return itm;
                }) || []];

              }
              this.onTableDataChange();
            }

            this._loaderSvc.hideLoader();
          }).catch(error => { this.utilities.showErrorToast(error); this._loaderSvc.hideLoader(); });
        },
        reject: () => {
          // this.utilities.showInfoToast('cancelled-operation');
        }
      })
    } else {
      const key = this.selectedRowNode.node.key;
      const parent = this.selectedRowNode.node.parent;
      if (parent) {
        const dataListRef = [...parent.children];
        const founddata = dataListRef.find(item => item.key == key);
        const founddataIndex = dataListRef.findIndex(item => item.key == key);
        if (founddata) {
          parent.children.splice(founddataIndex, 1);
          parent.children = [...parent.children,
          ...founddata?.children?.map(itm => {
            itm.data.parentId = founddata?.data?.parentId
            return itm;
          }) || []];

        }
        this.onTableDataChange();
      }
    }

  }

  deleteAllNodes() {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: async () => {
        if (this.selectedRowNode) {
          if (this.selectedRowNode.node?.data?.jobOrderId) {
            this._loaderSvc.showLoader();
            await this.deleteJobOrder(this.selectedRowNode);
            this._loaderSvc.hideLoader();
          }
          this.removeKey(this.selectedRowNode.node.key, this.selectedRowNode.node.parent);
        }
      },
      reject: () => {
        // this.utilities.showInfoToast('cancelled-operation');
      }
    });
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
        dataListRef.data = {
          productTreeId: this.productTreeId,
          productTreeDetailId: null,
          operationRepeat: 1,
          processControlFrequency: 1,
          plannedCycleQuantity: 1,
          parentId: null,
          productionType: 'STANDARD',
          singleDuration: 0,
          singleSetupDuration: 0,
          singleTotalDuration: 0,
          maxSingleStandbyDuration: 0,
          componentList: [],
          operationList: [
            {
              defaultStockId: null,
              defaultStock: null,
              description: null,
              maxSingleStandbyDuration: null,
              operationId: null,
              operationOrder: 1,
              operationRepeat: 1,
              parent: true,
              plannedCycleQuantity: 1,
              processControlFrequency: 1,
              productTreeDetailId: null,
              productTreeDetailOperationId: null,
              productTreeDetailWorkstationProgramList: null,
              quantity: 1,
              componentList: [],
              singleDuration: null,
              singleSetupDuration: null,
              singleTotalDuration: null,
              workStationId: null,
              workStation: null,
              operation: null
            }
          ],
          equipmentList: null,
          workstationProgramList: null,
          workstationId: null,
          workstation: null,
          orderNo: null,
        };
        this.tableData = [{ ...dataListRef }];
      }
    }
    // if (parent) {

    // } else {
    //   // this.tableData = [...dataListRef];
    // }
    this.onTableDataChange();
  }

  async deleteJobOrder(item) {
    try {
      await this._prodOrderSvc.cancelJobOrder(item.node?.data?.jobOrderId).then(() => {
        if (item.node.children && item.node.children.length) {
          item.node.children.forEach(child => {
            this.deleteJobOrder(child);
          });
        }
      })
    } catch (error) {
      this.utilities.showErrorToast(error);
    }
  }


  addOrUpdatecomponent(item) {
    if (this.addmodal.data) {// edit event
      this.addmodal.data.quantity = item.quantity;
      this.addmodal.data.quantityUnit = item.quantityUnit;
      this.addmodal.data.direction = item.direction;
      this.addmodal.data.component = item.component;
      this.addmodal.data.materialCost = item.materialCost;
      this.addmodal.data.scrapCost = item.scrapCost;
      this.addmodal.data.currency = item.currency;
      this.addmodal.data.componentId = item.componentId;
      // this.addmodal.rowData.productTreeDetailComponentId = item.productTreeDetailComponentId;
      if (this.addmodal.mode === 'component') {
        this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderStockUseList.push({
          actualMaterialCost: null,
          actualScrapCost: null,
          batch: null,
          componentList: null,
          currency: null,
          currentQuantity: null,
          currentStockQuantity: null,
          currentStockReservedQuantity: null,
          cycleRate: null,
          defectName: null,
          defectQuantity: null,
          density: null,
          dimensionUnit: null,
          direction: -1,
          height: this.addmodal.data.component?.height,
          innerDiameter: this.addmodal.data.component?.innerDiameter,
          jobOrder: null,
          jobOrderId: this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderId,
          jobOrderOperation: null,
          jobOrderOperationId: this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderOperationId,
          jobOrderOperationName: this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderOperationName,
          jobOrderStockId: null,
          length: this.addmodal.data.component?.length,
          materialCost: null,
          materialCostRate: null,
          neededQuantity: this.addmodal.data.quantity,
          neededToBuyQuantity: null,
          outerDiameter: this.addmodal.data.component?.outerDiameter,
          plannedHeight: null,
          plannedWidth: null,
          quantity: 0,
          requestJobOrderComponentFeatureList: null,
          responseComponentFeature: null,
          reworkQuantity: null,
          scrapCost: null,
          scrapCostRate: null,
          setupDefectQuantity: null,
          description: item.description,
          stock: this.addmodal.data.component,
          stockId: this.addmodal.data.component?.stockId,
          stockName: this.addmodal.data.component?.stockName,
          stockNo: this.addmodal.data.component?.stockNo,
          stockTypeId: this.addmodal.data.component?.stockTypeId,
          totalDefectQuantity: null,
          totalReworkQuantity: null,
          totalSetupQuantity: null,
          unit: this.addmodal.data.component?.baseUnit,
          useStock: null,
          wareHouseStockId: null,
          weight: this.addmodal.data.component?.weight,
          weightUnit: this.addmodal.data.component?.weightUnit,
          width: this.addmodal.data.component?.width,
        })
      } else {
        this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderStockProduceList.push({
          actualMaterialCost: null,
          actualScrapCost: null,
          batch: null,
          componentList: null,
          currency: null,
          currentQuantity: null,
          currentStockQuantity: null,
          currentStockReservedQuantity: null,
          cycleRate: null,
          defectName: null,
          description: item.description,
          defectQuantity: null,
          density: null,
          dimensionUnit: null,
          direction: -1,
          height: this.addmodal.data.component?.height,
          innerDiameter: this.addmodal.data.component?.innerDiameter,
          jobOrder: null,
          jobOrderId: this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderId,
          jobOrderOperation: null,
          jobOrderOperationId: this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderOperationId,
          jobOrderOperationName: this.addmodal.rowData.jobOrderOperations[this.addmodal.index].jobOrderOperationName,
          jobOrderStockId: null,
          length: this.addmodal.data.component?.length,
          materialCost: null,
          materialCostRate: null,
          neededQuantity: this.addmodal.data.quantity,
          neededToBuyQuantity: null,
          outerDiameter: this.addmodal.data.component?.outerDiameter,
          plannedHeight: null,
          plannedWidth: null,
          quantity: 0,
          requestJobOrderComponentFeatureList: null,
          responseComponentFeature: null,
          reworkQuantity: null,
          scrapCost: null,
          scrapCostRate: null,
          setupDefectQuantity: null,
          stock: this.addmodal.data.component,
          stockId: this.addmodal.data.component?.stockId,
          stockName: this.addmodal.data.component?.stockName,
          stockNo: this.addmodal.data.component?.stockNo,
          stockTypeId: this.addmodal.data.component?.stockTypeId,
          totalDefectQuantity: null,
          totalReworkQuantity: null,
          totalSetupQuantity: null,
          unit: this.addmodal.data.component?.baseUnit,
          useStock: null,
          wareHouseStockId: null,
          weight: this.addmodal.data.component?.weight,
          weightUnit: this.addmodal.data.component?.weightUnit,
          width: this.addmodal.data.component?.width,
        })
      }
    }
    //  this.addmodal = {active: false, rowData: null, title: null,  mode: null, index: null, direction: null, data: null};
    // this.onTableDataChange();
  }


  showOperationRecord(jobOrder, jobOrderOperation, JobOrderOperationIndex, tabIndex = 0) {
    this.addJobOrderOperationmodal.rowData = jobOrder;
    this.addJobOrderOperationmodal.index = JobOrderOperationIndex;
    this.addJobOrderOperationmodal.data = jobOrderOperation;
    this.addJobOrderOperationmodal.active = true;
    this.addJobOrderOperationmodal.tabIndex = tabIndex;
  }


  addOrUpdateOperation(jobOrderOperation, myModal) {
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index] = jobOrderOperation;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].workStation = jobOrderOperation.workStation;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].workStationId = jobOrderOperation.workStation?.workStationId;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].workStationName = jobOrderOperation.workStation?.workStationName;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].operation = jobOrderOperation.operation;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].operationId = jobOrderOperation.operation.operationId;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].operationName = jobOrderOperation.operation.operationName;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].defaultStockId = jobOrderOperation.defaultStockId;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].quantity = jobOrderOperation.quantity;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].parent = jobOrderOperation.parent;
    this.addJobOrderOperationmodal.rowData.jobOrderOperations[this.addJobOrderOperationmodal.index].individualCapacity = jobOrderOperation.individualCapacity;
    myModal.hide();
  }

}
