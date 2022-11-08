import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {ConfirmationService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeDetailService } from 'app/services/dto-services/product-tree/prod-tree-detail.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ConvertUtil } from 'app/util/convert-util';
import domToPdf from 'dom-to-pdf';
import {OverlayPanel, Tree} from 'primeng';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import {createBundleIndexHost} from '@angular/compiler-cli';
@Component({
  selector: 'product-tree-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewProductTreeComponent implements OnInit {
  @ViewChild(ImageAdderComponent) imageAdder: ImageAdderComponent;
  @ViewChild(Tree) ptree: Tree ;
  @Output() saveAction = new EventEmitter<any>();
  hideFilterBody;
  preSelectedPlant: any;
  tableType = TableTypeEnum.PRODUCTTREE;
  stockNotHaveProductTree;
  plantName = null;
  isPlantdisable = true;
  editMode = false;
  isReverse = false;
  showComponentChecked = false;
  isProcessMaterial = true;
  isSemiFinished = true;
  isRawMaterial = true;
  selectedProcessMaterial = undefined;
  @Input('data') set x(data) {
    if (data) {
      this.editMode = true;
      this.initialize(data);
    }
  }
  @Input('id') set xw(id) {
    if (id) {
      this.loaderService.showLoader();
      this.productTreeSvc.get(id).then(result => {
        this.initialize(result);
        this.loaderService.hideLoader();
      }).catch(err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }


  dialog = { visible: false }
  TreeViewFiles = [];
  selectedTreeViewFile = null;



  productTreeStatusList: any[] = [];
  dataModel = {
    productTreeId: null,
    materialId: null,
    material: null,
    revisionNo: null,
    autoFillProcess: null,
    startDate: null,
    expiryDate: null,
    estimatedCost: null,
    finalCost: null,
    lastModeDate: null,
    autoFillMaterials: false,
    description: null,
    reverse: false,
    status: 'ACTIVE',
    productTreeDetailList: [{
      productTreeId: null,
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
          neededPerson : 1,
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
      orderNo: null
    }],
    plant: null,
    plantId: null,
    workstation: null,
    workstationId: null
  }

  deletedProdDetaiItems = [];
  // component
  // {
  //   quantity: 1,
  //   quantityUnit: null,
  //   direction: 1,
  //   productTreeDetailComponentId: null,
  //   productTreeDetailId: null,
  //   componentId: null,
  //   component: null,
  //   auxfeature: null,
  //   numberOfEdge: null,
  //   productTreeDetailComponentFeatureList: []
  // }

  constructor(private _stockSvc: StockCardService,
              private loaderService: LoaderService,
              private userSvc: UsersService,
              private _translateSvc: TranslateService,
              private _confirmationSvc: ConfirmationService,
              private productTreeSvc: ProductTreeService,
              private productTreeDetailSvc: ProductTreeDetailService,
              private utilities: UtilitiesService) {
                this.preSelectedPlant = this.userSvc.getPlant();
                this.setPlant(JSON.parse(this.preSelectedPlant));
  }


  ngOnInit() {
    this._stockSvc.filterStockNotHaveProductTreeByPlantId(this.dataModel.plantId).then(res => {
      this.stockNotHaveProductTree = res;
    });
    this.getProductTreeStatusList();

  }

  getProductTreeStatusList() {
    this.productTreeSvc.getProductTreeStatus().then((res: any) => {
      this.productTreeStatusList = res;
    });
  }


  onTreeViewClicked() {
    this.TreeViewFiles = this.detailList2Node(this.dataModel.productTreeDetailList);
    // this.TreeViewFiles[0].expanded = false;

    (this.TreeViewFiles[0].children as any[]).forEach( child => {
      const childsChild = {
        children: [],
        data: {} as any,
        expanded: true,
        leaf: true,
        key: Math.abs(Math.random() * 10000).toString(),
        label: '',
      }
      const comp = child.data.operationList[0].componentList[0];


      childsChild.data.stockNo   = comp.component.stockNo;
      childsChild.data.stockName = comp.component.stockName;
      childsChild.label = `PT${comp.component.defaultProductTreeId}`;

      child.children = [ ...child.children, childsChild ];
    })

    this.dialog.visible = true;
  }

  getInputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction < 0) || [] : [];
  }
  getOutputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction > 0) || [] : [];
  }

  selectedIteration(event) {
    console.log('@event', event);
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
        this.plantName = data.plant.plantName;
      }
      if (data.workstation) {
        data.workstationId = data.workstation.workStationId;
      }
      this.dataModel = Object.assign({}, data);
      if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length > 0) {
        if(!this.dataModel.productTreeDetailList[0].operationList || this.dataModel.productTreeDetailList[0].operationList.length === 0) {
          this.dataModel.productTreeDetailList[0].operationList =  [
            {
              defaultStockId : null,
              defaultStock : null,
              description : null,
              maxSingleStandbyDuration : null,
              neededPerson : 1,
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
          ]
        } else {
          this.dataModel.productTreeDetailList[0].operationList.forEach(op => {
            if (op['productTreeDetailComponentList']) {
              op.componentList = op['productTreeDetailComponentList'] || [] ;
              delete op['productTreeDetailComponentList'];
            }
          })
        }

        if(this.dataModel.productTreeDetailList.length === 1 &&
          this.dataModel.productTreeDetailList[0].componentList &&
          this.dataModel.productTreeDetailList[0].componentList.length &&
          this.dataModel.productTreeDetailList[0].operationList.length &&
          this.dataModel.productTreeDetailList[0].operationList[0].componentList &&
          this.dataModel.productTreeDetailList[0].operationList[0].componentList.length === 0) {
            this.dataModel.productTreeDetailList[0].operationList[0].componentList =
            [...this.dataModel.productTreeDetailList[0]
              .componentList.filter(it => it.direction === 1).map((itm) => {
                return {...itm,
                  productTreeDetailId: this.dataModel.productTreeDetailList[0].productTreeDetailId}
              })]
            this.dataModel.productTreeDetailList[0].operationList[0].productTreeDetailId = this.dataModel.productTreeDetailList[0].productTreeDetailId;
        }
      } else {
        this.dataModel.productTreeDetailList = [{
          productTreeId: data.productTreeId,
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
              neededPerson : 1,
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
          orderNo: null
        }]
      }


      if (this.dataModel.productTreeId) {
        setTimeout(() => {
          this.imageAdder.initImages(this.dataModel.productTreeId, TableTypeEnum.PRODUCTTREE);
        }, 1500);
      }

      // console.log(this.dataModel);
  }

  setSelectedWorkstation(event) {
    this.dataModel.workstation = event;
    if (event) {
      this.dataModel.workstationId = event.workStationId;
    } else {
      this.dataModel.workstationId = null;

    }
  }
  setSelectedStock(event) {
    if (this.dataModel.materialId && event && this.dataModel.materialId === event.stockId) {
      return 0;
    }
    this.dataModel.material = event;
    if (event && event.hasOwnProperty('stockId')) {
      this.productTreeSvc.setProductTreeMaterial(event);
      // this.imageViewer.initImages(event.stockId, TableTypeEnum.STOCK);
      this.dataModel.materialId = event.stockId;
      this.dataModel.plantId = event.plantId;
      this.dataModel.plant = event;
      this.plantName = event.plantName;
      if (!this.dataModel.plantId) {
        this.isPlantdisable = false;
      }
      if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length === 0) {
        const itemDetailTree = {
          productTreeId: null,
          productTreeDetailId: null,
          operationRepeat: 1,
          processControlFrequency: 1,
          parentId: null,
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
              componentList: [
                {
                  quantity: 1,
                  quantityUnit: event.baseUnit,
                  direction: 1,
                  productTreeDetailComponentId: null,
                  productTreeDetailId: null,
                  componentId: event.stockId,
                  component: event,
                  auxfeature: null,
                  numberOfEdge: null,
                  productTreeDetailComponentFeatureList: []
                }
              ],
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

        const dtDetailTree = [];
        dtDetailTree.push(itemDetailTree);
        this.dataModel.productTreeDetailList = dtDetailTree;
      } else if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length > 0
        && this.dataModel.productTreeDetailList[0].operationList
        && this.dataModel.productTreeDetailList[0].operationList.length > 0
        && this.dataModel.productTreeDetailList[0].operationList[0].componentList
        && this.dataModel.productTreeDetailList[0].operationList[0].componentList.length > 0) {
        this.dataModel.productTreeDetailList[0].operationList[0].componentList.some(comp => {
          if (comp.direction > 0) {
            comp.quantityUnit = event.baseUnit;
            comp.componentId = event.stockId;
            comp.component = event;
            return true;
          }
        });
        // this.dataModel.productTreeDetailList[0].componentList[0].quantityUnit = event.baseUnit;
        // this.dataModel.productTreeDetailList[0].componentList[0].componentId = event.stockId;
        // this.dataModel.productTreeDetailList[0].componentList[0].component = event;
      } else {
        this.dataModel.productTreeDetailList[0].operationList[0].componentList = [{
            quantity: 1,
            quantityUnit: event.baseUnit,
            direction: 1,
            productTreeDetailComponentId: null,
            productTreeDetailId: null,
            componentId: event.stockId,
            component: event,
            auxfeature: null,
            numberOfEdge: null,
            productTreeDetailComponentFeatureList: []
          }
        ];
      }
    } else {
      this.dataModel.materialId = null;
      this.productTreeSvc.setProductTreeMaterial(null);
    }


  }

  openMaterialModal(mymodal) {
    if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length > 0
        && this.dataModel.productTreeDetailList[0].operationList
        && this.dataModel.productTreeDetailList[0].operationList.length > 0
        && this.dataModel.productTreeDetailList[0].operationList[0].componentList) {
          let i = 0;
          this.dataModel.productTreeDetailList[0].operationList[0].componentList.forEach(itm => {
            if (+itm.direction === 1) {
              i = i + 1;
            }
          });
          if (i === 1 || i === 0) {
            mymodal.show();
          }
      }
  }
  setPlant(plant) {
    this.dataModel.plant = plant;
    if (plant && plant.hasOwnProperty('plantId')) {
      this.dataModel.plantId = plant.plantId;
      this.plantName = plant.plantName;
    } else {
      this.dataModel.plantId = null;
    }
  }

  onAutoFillMaterialChecked(event) {
    if(this.dataModel.autoFillMaterials) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-auto-fill-materials'),
        header: this._translateSvc.instant('auto-fill-confirmation'),
        icon: 'fa fa-plus',
        accept: () => {

        },
        reject: () => {
          setTimeout(() => {
            this.dataModel.autoFillMaterials = false;
          }, 50);
        }
      })
    }
  }

  onAutoFillProcessChecked(event) {
    if(this.dataModel.autoFillProcess) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-auto-fill-process'),
        header: this._translateSvc.instant('auto-fill-confirmation'),
        icon: 'fa fa-plus',
        accept: () => {

        },
        reject: () => {
          setTimeout(() => {
            this.dataModel.autoFillProcess = false;
          }, 50);
        }
      })
    } else {
      this.selectedProcessMaterial = null;
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
    if(this.dataModel.status==='ACTIVE' && !this.dataModel.autoFillMaterials) {
      const validate = await this.validateProductTreeDetailList(newDto.productTreeDetailList);
      if ( validate === 0) {
        return ;
      }
    } else {
      const validate = await this.validateProductTreeOperationAndSingleDurationList(newDto.productTreeDetailList);
      if ( validate === 0) {
        return ;
      }
    }
    const parentData = this.dataModel.productTreeDetailList[0].operationList.find(e => e.parent === true);
    if (!parentData) {
      const lbl = this._translateSvc.instant('please-select-operation-as-parent-for-level-1');
      this.utilities.showWarningToast(lbl);
      return;
    }
    // else {
    //   if (this.dataModel.reverse) {
    //     newDto.materialId = this.dataModel.productTreeDetailList[0].componentList.find(itm => itm.direction === 1).componentId;
    //   }
    // }
    this.loaderService.showLoader();
    // newDto.productTreeDetailList.forEach((item, index) => {
    //   item.orderNo = index + 1;
    // });
    this.productTreeSvc.save(newDto).then((result:any) => {
      this.loaderService.hideLoader();
      this.imageAdder.updateMedia(result.productTreeId, TableTypeEnum.PRODUCTTREE).then(() => {}).catch(error => this.utilities.showErrorToast(error));
      this.utilities.showSuccessToast('save-success');
      if(this.deletedProdDetaiItems.length > 0) {
        from([...this.deletedProdDetaiItems]).pipe(
          mergeMap(prDtId => {
            console.log('Deleting Prd detail ID: ' + prDtId);
            return this.productTreeDetailSvc.delete(prDtId);
          })
        ).subscribe(res => {
          console.log("Response Completed");
          this.saveAction.next(result);
        })
      } else {
        this.saveAction.next(result);
      }
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });


  }

  // cleanproductTreeListDto (PrtreeList) {
  //   PrtreeList.forEach(treeList => {
  //     if (treeList.componentList) {
  //       treeList.componentList.forEach(comp => {
  //         if (comp.component) {
  //           comp.componentId = comp.component.stockId;
  //           delete comp.component;
  //         }
  //       });
  //     }
  //     if (treeList.operationList) {
  //       treeList.operationList.forEach(opr => {
  //         if (opr.operation) {
  //           opr.operationId = opr.operation.operationId;
  //           delete opr.operation;
  //         }
  //       });
  //     }
  //     if (treeList.equipmentList) {
  //       treeList.equipmentList.forEach(eqpt => {
  //         if (eqpt.equipment) {
  //           eqpt.equipmentId = eqpt.equipment.equipmentId;
  //           delete eqpt.equipment;
  //         }
  //       });
  //     }
  //     if (treeList.workstationProgramList) {
  //       treeList.workstationProgramList.forEach(wrkprgm => {
  //         if (wrkprgm.workstationProgram) {
  //           wrkprgm.workstationProgramId = wrkprgm.workstationProgram.workstationProgramId;
  //           delete wrkprgm.workstationProgram;
  //         }
  //       });
  //     }
  //     if (treeList.workstation) {
  //       treeList.workstationId = treeList.workstation.workStationId;
  //       delete treeList.workstation;
  //     }
  //     if (treeList.productTreeDetailList && treeList.productTreeDetailList.length > 0) {
  //       this.cleanproductTreeListDto(treeList.productTreeDetailList);
  //     }
  //   });
  // }
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
  async validateProductTreeOperationAndSingleDurationList (treedetailist) {
    return new Promise (async (res) => {
      const allvalidate = new Promise<number> (async (response, rej) => {
        await treedetailist.forEach(async productreedetail => {
          const vld = await this.validateProductTreeOperationAndSingleDurationItem(productreedetail);
          if ( vld === 0) {
            return rej(0);
          } else if (productreedetail.productTreeDetailList && productreedetail.productTreeDetailList.length > 0) {
            const result = await this.validateProductTreeOperationAndSingleDurationList(productreedetail.productTreeDetailList);
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
  // async validateProductTreeDetailChildItemList (treedetailist) {
  //   return new Promise (async (res) => {
  //     const allvalidate = new Promise<number> (async (response, rej) => {
  //       await treedetailist.forEach(async productreedetail => {
  //         const vld = await this.validateProductTreeDetailItem(productreedetail);
  //         if ( vld === 0) {
  //           return rej(0);
  //         } else if (productreedetail.productTreeDetailList && productreedetail.productTreeDetailList.length > 0) {
  //           const result = await this.validateProductTreeDetailChildItemList(productreedetail.productTreeDetailList);
  //           if ( result === 0) {
  //             return rej(0);
  //           }
  //         } else {
  //           return response(1);
  //         }
  //       });
  //       // response(1);
  //     });
  //     const valid = await allvalidate;
  //     res(valid);
  //   });
  // }
  validateProductTreeDetailItem (productTreeDetailitem) {
    return new Promise ((res) => {
      // if (!productTreeDetailitem.componentList || productTreeDetailitem.componentList.filter(itm => itm.direction > 0).length === 0) {
      //   this.utilities.showWarningToast('add minimum one output');
      //   return res(0);
      // } else {
      //   productTreeDetailitem.componentList.forEach(comp => {
      //     if (comp.component) {
      //       comp.componentId = comp.component.stockId;
      //       delete comp.component;
      //     }
      //   });
      // }
      // if (!productTreeDetailitem.componentList || productTreeDetailitem.componentList.filter(itm => itm.direction < 0).length === 0) {
      //   this.utilities.showWarningToast('add minimum one input');
      //   return res(0);
      // } else {
      //   productTreeDetailitem.componentList.forEach(comp => {
      //     if (comp.component) {
      //       comp.componentId = comp.component.stockId;
      //       delete comp.component;
      //     }
      //   });
      // }
      if (!productTreeDetailitem.operationList || productTreeDetailitem.operationList.length === 0) {
        this.utilities.showWarningToast('add minimum one operation');
        return res(0);
      } else {
        for (let i = 0; i < productTreeDetailitem.operationList.length; i++) {
          if (productTreeDetailitem.operationList[i].operation) {
            productTreeDetailitem.operationList[i].operationId = productTreeDetailitem.operationList[i].operation.operationId;
            delete productTreeDetailitem.operationList[i].operation;
          }
          if (productTreeDetailitem.operationList[i].defaultStock) {
            productTreeDetailitem.operationList[i].defaultStockId = productTreeDetailitem.operationList[i].defaultStock.stockId;
            delete productTreeDetailitem.operationList[i].defaultStock;
          }
          if (productTreeDetailitem.operationList[i].workStation) {
            productTreeDetailitem.operationList[i].workStationId = productTreeDetailitem.operationList[i].workStation.workStationId;
            delete productTreeDetailitem.operationList[i].workStation;
          }
          if (productTreeDetailitem.operationList[i].componentList) {
            productTreeDetailitem.operationList[i].componentList.forEach(comp => {
              if (comp.component) {
                comp.componentId = comp.component.stockId;
                delete comp.component;
              }
              if (comp.productTreeDetailOperation) {
                comp.productTreeDetailOperationId = comp.productTreeDetailOperation.productTreeDetailOperationId;
                delete comp.productTreeDetailOperation;
              }

            });
            const outputList = productTreeDetailitem.operationList[i].componentList.filter(itm => +itm.direction === 1);
            // const inputList = productTreeDetailitem.operationList[i].componentList.filter(itm => +itm.direction === -1);
            if (!outputList || outputList.length === 0) {
              this.utilities.showWarningToast('add-minimum-one-output', productTreeDetailitem.stepFNo);
              return res(0);
            }
            // else if(!inputList || inputList.length === 0) {
            //   this.utilities.showWarningToast('add-minimum-one-input', productTreeDetailitem.stepFNo);
            //   return res(0);
            // }
          }
          if (!this.validateDuration('single-duration', productTreeDetailitem.operationList[i].singleDuration)) {
            return res(0);
          }
          if (!this.validateDuration('max-single-standby-duration', productTreeDetailitem.operationList[i].maxSingleStandbyDuration)) {
            return res(0);
          }
        }
      }
      // if (!this.validateDuration('single-duration', productTreeDetailitem.singleDuration)) {
      //   return res(0);
      // }
      // if (!this.validateDuration('single-setup-duration', productTreeDetailitem.singleSetupDuration)) {
      //   return res(0);
      // }
      // if (!this.validateDuration('single-total-duration', productTreeDetailitem.singleTotalDuration)) {
      //   return res(0);
      // }
      // if (!this.validateDuration('max-single-standby-duration', productTreeDetailitem.maxSingleStandbyDuration)) {
      //   return res(0);
      // } else {
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

  validateProductTreeOperationAndSingleDurationItem (productTreeDetailitem) {
    return new Promise ((res) => {
      if (!productTreeDetailitem.operationList || productTreeDetailitem.operationList.length === 0) {
        this.utilities.showWarningToast('add minimum one operation');
        return res(0);
      } else {
        for (let i = 0; i < productTreeDetailitem.operationList.length; i++) {
          if (productTreeDetailitem.operationList[i].operation) {
            productTreeDetailitem.operationList[i].operationId = productTreeDetailitem.operationList[i].operation.operationId;
            delete productTreeDetailitem.operationList[i].operation;
          }
          if (productTreeDetailitem.operationList[i].defaultStock) {
            productTreeDetailitem.operationList[i].defaultStockId = productTreeDetailitem.operationList[i].defaultStock.stockId;
            delete productTreeDetailitem.operationList[i].defaultStock;
          }
          if (productTreeDetailitem.operationList[i].workStation) {
            productTreeDetailitem.operationList[i].workStationId = productTreeDetailitem.operationList[i].workStation.workStationId;
            delete productTreeDetailitem.operationList[i].workStation;
          }
          if (productTreeDetailitem.operationList[i].componentList) {
            productTreeDetailitem.operationList[i].componentList.forEach(comp => {
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
          if (!this.validateDuration('single-duration', productTreeDetailitem.operationList[i].singleDuration)) {
            return res(0);
          }
          if (!this.validateDuration('max-single-standby-duration', productTreeDetailitem.operationList[i].maxSingleStandbyDuration)) {
            return res(0);
          }
        }
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

  validateDuration(label, value) {
    if (!value || value === 0) {
      const lbl = this._translateSvc.instant(label);
      this.utilities.showWarningToast(lbl + ' must be bigger then 0');
      return false;
    }
    return true;
  }


  onReverseProductTreeChanged(event) {
    if (event) {

      if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length > 0
        && this.dataModel.productTreeDetailList[0].componentList && this.dataModel.productTreeDetailList[0].componentList.length > 0
        && this.dataModel.productTreeDetailList[0].componentList[0].component) {
          this._confirmationSvc.confirm({
            message: this._translateSvc.instant('reset-the-changes-and-continue-as-a-normal-product-tree'),
            header: this._translateSvc.instant('reset-confirmation'),
            icon: 'fa fa-eraser',
            accept: () => {
              this.dataModel.reverse = event;
              this.isReverse = event;
              this.dataModel.material = null;
              this.dataModel.materialId = null;
              this.dataModel.productTreeDetailList = [{
                productTreeId: this.dataModel.productTreeId,
                productTreeDetailId: null,
                operationRepeat: 1,
                processControlFrequency: 1,
                plannedCycleQuantity : 1,
                productionType: 'STANDARD',
                parentId: null,
                singleDuration: 0,
                singleSetupDuration: 0,
                singleTotalDuration: 0,
                maxSingleStandbyDuration: 0,
                componentList: [{
                  quantity: 1,
                  quantityUnit: null,
                  direction: 1,
                  productTreeDetailComponentId: null,
                  productTreeDetailId: null,
                  componentId: null,
                  component: null,
                  auxfeature: null,
                  numberOfEdge: null,
                  productTreeDetailComponentFeatureList: []
                }],
                operationList: null,
                equipmentList: null,
                workstationProgramList: null,
                workstationId: null,
                workstation: null,
                orderNo: null,
              }];

            },
            reject: () => {
              setTimeout(() => {
                this.dataModel.reverse = false;
                this.isReverse = false;
              }, 100);
            }
          })
      } else {
        this.dataModel.reverse = event;
        this.isReverse = event;
      }
    } else {
      if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length > 0
        && this.dataModel.productTreeDetailList[0].componentList && this.dataModel.productTreeDetailList[0].componentList.length > 0
        && this.dataModel.productTreeDetailList[0].componentList[0].component) {

          this._confirmationSvc.confirm({
            message: this._translateSvc.instant('reset-the-changes-and-continue-as-a-normal-product-tree'),
            header: this._translateSvc.instant('reset-confirmation'),
            icon: 'fa fa-eraser',
            accept: () => {
              this.dataModel.reverse = event;
              this.isReverse = event;
              this.dataModel.productTreeDetailList = [{
                productTreeId: this.dataModel.productTreeId,
                productTreeDetailId: null,
                operationRepeat: 1,
                processControlFrequency: 1,
                plannedCycleQuantity : 1,
                parentId: null,
                singleDuration: 0,
                productionType: 'STANDARD',
                singleSetupDuration: 0,
                singleTotalDuration: 0,
                maxSingleStandbyDuration: 0,
                componentList: [{
                  quantity: 1,
                  quantityUnit: null,
                  direction: 1,
                  productTreeDetailComponentId: null,
                  productTreeDetailId: null,
                  componentId: null,
                  component: null,
                  auxfeature: null,
                  numberOfEdge: null,
                  productTreeDetailComponentFeatureList: []
                }],
                operationList: null,
                equipmentList: null,
                workstationProgramList: null,
                workstationId: null,
                workstation: null,
                orderNo: null,
              }];

            },
            reject: () => {
              setTimeout(() => {
                this.dataModel.reverse = true;
                this.isReverse = true;
              }, 100);
            }
          })
        } else {
          this.dataModel.reverse = event;
          this.isReverse = event;
        }

    }
  }


  onSaveProductDetails(event) {
    this.dataModel.productTreeDetailList = event;
    if (this.dataModel.productTreeDetailList && this.dataModel.productTreeDetailList.length > 0) {
      if (this.dataModel.productTreeDetailList[0].operationList && this.dataModel.productTreeDetailList[0].operationList.length > 0
        && this.dataModel.productTreeDetailList[0].operationList[0].componentList && this.dataModel.productTreeDetailList[0].operationList[0].componentList.length > 0) {
        let materialcomponent = null;
        let i = 0;
        this.dataModel.productTreeDetailList[0].operationList[0].componentList.forEach(itm => {
          if (+itm.direction === 1) {
            if (i === 0) {
              materialcomponent = itm;
            }
            i = i + 1;
          }
        });
        if (materialcomponent && materialcomponent.component) {

          if(!this.dataModel.materialId || this.dataModel.materialId !== materialcomponent.component.stockId) {
            this.dataModel.material = materialcomponent.component;
            this.dataModel.materialId = materialcomponent.component.stockId;
            // this.imageViewer.initImages(this.dataModel.materialId, TableTypeEnum.STOCK);
          } else {
            // this.imageViewer.initImages(this.dataModel.materialId, TableTypeEnum.STOCK);
          }

          // this.dataModel.material = this.dataModel.productTreeDetailList[0].componentList[0].component;
          // this.dataModel.materialId = this.dataModel.productTreeDetailList[0].componentList[0].component.stockId;
          // this.imageViewer.initImages(this.dataModel.materialId, TableTypeEnum.STOCK);
        }
        else {
          if(!this.dataModel.productTreeId) {
            this.dataModel.materialId = null;
            this.dataModel.material = null;
            // this.imageViewer.resetImages();
            this.productTreeSvc.setProductTreeMaterial(null);
          }
        }
      } else {
        if(!this.dataModel.productTreeId) {
          this.dataModel.materialId = null;
          this.dataModel.material = null;
          // this.imageViewer.resetImages();
          this.productTreeSvc.setProductTreeMaterial(null);
        }
      }

      this.dataModel.productTreeDetailList.forEach(itm => {
        if (itm.operationList) {
          itm.operationList = itm.operationList.sort((a , b) => a.operationOrder - b.operationOrder);
        }
      });
    }
  }

  onDeleteProductTreeDetailItem(event) {
    if(event) {
      this.deletedProdDetaiItems.push(event);
    }
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
  generatingLabelName(item, frntlevel?) {
    let label ='';
    // label+= '#lvl=(' + frntlevel + ')';
    item?.operationList?.forEach((op, index) => {
      if(index>0) {
        label+= ','
      }
      label+= op.operation?.operationName;

      // label+= '#on=(' +  op.orderNo + ')';
    });
    return label;
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

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time);
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

  showProductTreeDetail(productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }



  setSelectedProcessMaterial(event) {
    if(event) {
      this.selectedProcessMaterial = event;
    } else {
      this.selectedProcessMaterial = null;
    }
  }

  toggleProductPanel(node: any, $event: MouseEvent, openProductTreePanel: OverlayPanel) {
    if ( node.data?.stockNo ) {
      return;
    }
    this.selectedTreeViewFile = node;
    openProductTreePanel.toggle( $event );
  }
}
