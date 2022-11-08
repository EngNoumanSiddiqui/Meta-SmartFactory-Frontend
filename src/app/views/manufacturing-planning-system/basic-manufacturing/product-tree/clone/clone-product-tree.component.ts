import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { UsersService } from 'app/services/users/users.service';
import { TranslateService } from '@ngx-translate/core';
import {ConfirmationService, TreeNode} from 'primeng/api';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { ConvertUtil } from 'app/util/convert-util';
import domToPdf from 'dom-to-pdf';
import { Tree } from 'primeng/tree';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';


@Component({
  selector: 'clone-product-tree',
  templateUrl: './clone-product-tree.component.html'
})
export class CloneProductTreeComponent implements OnInit {

  @ViewChild(ImageAdderComponent) imageAdder: ImageAdderComponent;
  @ViewChild(Tree) ptree: Tree ;
  @Output() saveAction = new EventEmitter<any>();
  hideFilterBody;
  preSelectedPlant: any;
  tableType = TableTypeEnum.PRODUCTTREE;
  stockNotHaveProductTree;
  plantName = null;
  isPlantdisable = true;
  selectedProcessMaterial = undefined;
  editMode = false;
  isReverse = false;

  showComponentChecked = false;
  isProcessMaterial = true;
  isSemiFinished = true;
  isRawMaterial = true;

  @Input('data') set x(data) {
    if (data) {
      this.editMode = true;
      this.initData(data);
    }
  }

  productTreeStatusList: any[] = [];
  dataModel = {
    productTreeId: null,
    materialId: null,
    autoFillProcess: false,
    autoFillMaterials: false,
    material: null,
    revisionNo: null,
    startDate: null,
    expiryDate: null,
    lastModeDate: null,
    estimatedCost: null,
    finalCost: null,
    description: null,
    reverse: false,
    status: null,
    productTreeDetailList: [{
      productTreeId: null,
      productTreeDetailId: null,
      operationRepeat: 1,
      processControlFrequency: 1,
      plannedCycleQuantity : 1,
      parentId: null,
      productionType: null,
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
          operationOrder : null,
          operationRepeat : 1,
          parent : null,
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
    }],
    plant: null,
    plantId: null,
    workstation: null,
    workstationId: null
  }


  dialog = { visible: false }
  TreeViewFiles = [];
  selectedTreeViewFile = null;

  constructor(private _stockSvc: StockCardService,
    private loaderService: LoaderService,
    private userSvc: UsersService,
    private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private productTreeSvc: ProductTreeService,
    private utilities: UtilitiesService) {
      this.preSelectedPlant = this.userSvc.getPlant();
      this.setPlant(JSON.parse(this.preSelectedPlant));
}
  private async initData(prData) {
    let data = JSON.parse(JSON.stringify(prData));
    if (data) {
      data.startDate = data.startDate? new Date(data.startDate): null;
      data.expiryDate = data.expiryDate? new Date(data.expiryDate): null;
      data.lastModeDate = data.lastModeDate ? new Date(data.lastModeDate) : null;
      if (data.material) {
        data.materialId = data.material.stockId;
      }
      if (data.plant) {
        data.plantId = data.plant.plantId;
        this.plantName = data.plant.plantName;
        // delete data.plant;
      }
      
      data.productTreeId = null;
      data.revisionNo = null;
      if (data.productTreeDetailList) {
        this.removeProductTreeIDs(data.productTreeDetailList);
        // const validate = await this.removeProductTreeIdAndRelations(data.productTreeDetailList);
        // setTimeout(() => {
        //   productTreeDetailList = data.productTreeDetailList;
        //   this.dataModel = {
        //     material: data.material,
        //     plant: data.plant,
        //     estimatedCost: data.estimatedCost,
        //     finalCost: data.finalCost,
        //     reverse: data.reverse,
        //     productTreeId: null,
        //     description: data.description,
        //     expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        //     lastModeDate: data.lastModeDate ? new Date(data.lastModeDate) : null,
        //     materialId: data.materialId,
        //     plantId: data.plantId,
        //     revisionNo: null,
        //     startDate: data.startDate ? new Date(data.startDate) : null,
        //     status: data.status,
        //     productTreeDetailList: productTreeDetailList,
        //     workstationId: data.workstation ? data.workstation.workStationId : null,
        //     workstation: data.workstation ? data.workstation : null,
        //   }
        // }, 1200);
      } else {
        data = {
          material: data.material,
          plant: data.plant,
          estimatedCost: data.estimatedCost,
          finalCost: data.finalCost,
          productTreeId: null,
          reverse: data.reverse,
          autoFillMaterials: data.autoFillMaterials,
          autoFillProcess: data.autoFillProcess,
          description: data.description,
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
          lastModeDate: data.lastModeDate ? new Date(data.lastModeDate) : null,
          materialId: data.materialId,
          plantId: data.plantId,
          revisionNo: data.revisionNo,
          startDate: data.startDate ? new Date(data.startDate) : null,
          status: data.status,
          productTreeDetailList: [{
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
          workstationId: data.workstation ? data.workstation.workStationId : null,
          workstation: data.workstation ? data.workstation : null,
        }
      }
      this.dataModel = JSON.parse(JSON.stringify(data));
      this.showImages();
    }
  }


  removeProductTreeIDs (prTreeList) {
    prTreeList.forEach(productTreeDetailitem => {
      delete productTreeDetailitem.productTreeDetailId;
      productTreeDetailitem.parentId = null;
      delete productTreeDetailitem.productTree;
      if (productTreeDetailitem.equipmentList) {
        productTreeDetailitem.equipmentList.forEach(eqp => {
          delete eqp.productTreeDetailEquipmentId;
          delete eqp.productTreeDetail;
          delete eqp.productTreeDetailId;
          eqp.equipmentId = eqp.stock?.stockId;
          eqp.stockId = eqp.stock?.stockId;
          // delete eqp.equipment;
        });
      }

      if (productTreeDetailitem.componentList) {
        productTreeDetailitem.componentList.forEach(cmp => {
          delete cmp.productTreeDetailComponentId;
          delete cmp.productTreeDetailOperationId;
          delete cmp.component.productTreeId;
          delete cmp.component.productTreeList;
          delete cmp.productTreeDetail;
          delete cmp.productTreeId;
          cmp.componentId = cmp.component.stockId;
          // delete cmp.component;
          cmp.productTreeDetailComponentFeatureList.forEach(cmpfeatureitm => {
            delete cmpfeatureitm.productTreeDetailComponentFeatureId;
            // delete cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
            cmpfeatureitm.productTreeCriteriaId = cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
            // delete cmpfeatureitm.productTreeCriteria;
          });
        });
      }

      if (productTreeDetailitem.operationList) {
        productTreeDetailitem.operationList.forEach(opr => {
          delete opr.productTreeDetailOperationId;
          delete opr.productTreeDetail;
          opr.productTreeDetailWorkstationProgramList.forEach(wrkprmitm => {
            delete wrkprmitm.productTreeDetailWorkstationProgramId;
            delete wrkprmitm.productTreeDetailId;
            delete wrkprmitm.productTreeDetailOperationId;
            wrkprmitm.workstationProgramId = wrkprmitm.workstationProgram.workstationProgramId;
          });
          opr.operationId = opr.operation.operationId;
          delete opr.productTreeDetailOperationId;

          // if (opr.equipmentList) {
          //   productTreeDetailitem.equipmentList.forEach(eqp => {
          //     delete eqp.productTreeDetailEquipmentId;
          //     delete eqp.productTreeDetail;
          //     eqp.equipmentId = eqp.equipment.equipmentId;
          //     // delete eqp.equipment;
          //   });
          // }
          if (opr.productTreeDetailComponentList) {
            opr.productTreeDetailComponentList.forEach(cmp => {
              delete cmp.productTreeDetailComponentId;
              delete cmp.productTreeDetailOperationId;
              delete cmp.component.productTreeId;
              delete cmp.productTreeDetailComponentId;
              delete cmp.productTreeDetailOperation;
              delete cmp.component.productTreeList;
              delete cmp.productTreeDetail;
              delete cmp.productTreeId;
              cmp.componentId = cmp.component.stockId;
              // delete cmp.component;
              cmp.productTreeDetailComponentFeatureList.forEach(cmpfeatureitm => {
                delete cmpfeatureitm.productTreeDetailComponentFeatureId;
                // delete cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                cmpfeatureitm.productTreeCriteriaId = cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                // delete cmpfeatureitm.productTreeCriteria;
              });
            });
          } else if (opr.componentList) {
            opr.componentList.forEach(cmp => {
              delete cmp.productTreeDetailComponentId;
              delete cmp.productTreeDetailOperationId;
              delete cmp.component.productTreeId;
              delete cmp.productTreeDetailComponentId;
              delete cmp.productTreeDetailOperation;
              delete cmp.component.productTreeList;
              delete cmp.productTreeDetail;
              delete cmp.productTreeId;
              cmp.componentId = cmp.component.stockId;
              // delete cmp.component;
              cmp.productTreeDetailComponentFeatureList.forEach(cmpfeatureitm => {
                delete cmpfeatureitm.productTreeDetailComponentFeatureId;
                // delete cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                cmpfeatureitm.productTreeCriteriaId = cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                // delete cmpfeatureitm.productTreeCriteria;
              });
            });
          }
          
          if(opr.productTreeDetailWorkstationProgramList) {
            opr.productTreeDetailWorkstationProgramList.forEach(ptworkprg => {
              delete ptworkprg.productTreeDetailWorkstationProgramId;
              delete ptworkprg.productTreeDetailOperation;
            });
          }
          if(opr.workStation) {
            opr.workStationId = opr.workStation.workStationId;
          }
        });
      }
      productTreeDetailitem.workstationId = productTreeDetailitem.workstation ? productTreeDetailitem.workstation.workStationId : null;

      if (productTreeDetailitem.workstationProgramList) {
        productTreeDetailitem.workstationProgramList.forEach(work => {
          delete work.productTreeDetailWorkstationProgramId;
          delete work.productTreeDetailId;
          delete work.productTreeDetailOperationId;
          work.workstationProgramId = work.workstationProgram ? work.workstationProgram.workstationProgramId : null;
          // delete work.workstationProgram;
        });
      }


      if(productTreeDetailitem.productTreeDetailList) {
        this.removeProductTreeIDs(productTreeDetailitem.productTreeDetailList);
      }

    });
  }

  async removeProductTreeIdAndRelations(prTreeList) {
    return new Promise (async (res) => {
      const allResolved = new Promise<number> (async (response, rej) => {
        await prTreeList.forEach(async productreedetail => {
          const resolveItm = await this.RemoveProductTreeDetailIDItem(productreedetail);
          if ( resolveItm === 0) {
            return rej(0);
          } else if (productreedetail.productTreeDetailList && productreedetail.productTreeDetailList.length > 0) {
            const result = await this.removeProductTreeIdAndRelations(productreedetail.productTreeDetailList);
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
      const valid = await allResolved;
      res(valid);
    });
  }

  RemoveProductTreeDetailIDItem (productTreeDetailitem) {
    return new Promise ((res) => {
        try {
          delete productTreeDetailitem.productTreeDetailId;
          productTreeDetailitem.parentId = null;
          delete productTreeDetailitem.productTree;
          if (productTreeDetailitem.equipmentList) {
            productTreeDetailitem.equipmentList.forEach(eqp => {
              delete eqp.productTreeDetailEquipmentId;
              delete eqp.productTreeDetail;
              eqp.equipmentId = eqp.equipment.equipmentId;
              // delete eqp.equipment;
            });
          }

          if (productTreeDetailitem.componentList) {
            productTreeDetailitem.componentList.forEach(cmp => {
              delete cmp.productTreeDetailComponentId;
              delete cmp.component.productTreeId;
              delete cmp.component.productTreeList;
              delete cmp.productTreeDetail;
              delete cmp.productTreeId;
              cmp.componentId = cmp.component.stockId;
              // delete cmp.component;
              cmp.productTreeDetailComponentFeatureList.forEach(cmpfeatureitm => {
                delete cmpfeatureitm.productTreeDetailComponentFeatureId;
                // delete cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                cmpfeatureitm.productTreeCriteriaId = cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                // delete cmpfeatureitm.productTreeCriteria;
              });
            });
          }

          if (productTreeDetailitem.operationList) {
            productTreeDetailitem.operationList.forEach(opr => {
              delete opr.productTreeDetailOperationId;
              delete opr.productTreeDetail;
              opr.productTreeDetailWorkstationProgramList.forEach(wrkprmitm => {
                delete wrkprmitm.productTreeDetailWorkstationProgramId;
                delete wrkprmitm.productTreeDetailId;
                delete wrkprmitm.productTreeDetailOperationId;
                wrkprmitm.workstationProgramId = wrkprmitm.workstationProgram.workstationProgramId;
              });
              opr.operationId = opr.operation.operationId;

              if (opr.productTreeDetailComponentList) {
                opr.productTreeDetailComponentList.forEach(cmp => {
                  delete cmp.productTreeDetailComponentId;
                  delete cmp.productTreeDetailOperationId;
                  delete cmp.component.productTreeId;
                  delete cmp.productTreeDetailComponentId;
                  delete cmp.productTreeDetailOperation;
                  delete cmp.component.productTreeList;
                  delete cmp.productTreeDetail;
                  delete cmp.productTreeId;
                  cmp.componentId = cmp.component.stockId;
                  // delete cmp.component;
                  cmp.productTreeDetailComponentFeatureList.forEach(cmpfeatureitm => {
                    delete cmpfeatureitm.productTreeDetailComponentFeatureId;
                    // delete cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                    cmpfeatureitm.productTreeCriteriaId = cmpfeatureitm.productTreeCriteria.productTreeCriteriaId;
                    // delete cmpfeatureitm.productTreeCriteria;
                  });
                });
              }
              if(opr.productTreeDetailWorkstationProgramList) {
                opr.productTreeDetailWorkstationProgramList.forEach(ptworkprg => {
                  delete ptworkprg.productTreeDetailWorkstationProgramId;
                  delete ptworkprg.productTreeDetailOperation;
                });
              }
            });
          }
          productTreeDetailitem.workstationId = productTreeDetailitem.workstation ? productTreeDetailitem.workstation.workStationId : null;

          if (productTreeDetailitem.workstationProgramList) {
            productTreeDetailitem.workstationProgramList.forEach(work => {
              delete work.productTreeDetailWorkstationProgramId;
              delete work.productTreeDetailId;
              delete work.productTreeDetailOperationId;
              work.workstationProgramId = work.workstationProgram ? work.workstationProgram.workstationProgramId : null;
              // delete work.workstationProgram;
            });
          }
          res(1);
        } catch (error) {
          res(0);
        }
    });
  }
  showImages() {
    if ((this.imageAdder)) {
      if (this.dataModel && this.dataModel.productTreeId) {
        this.imageAdder.initImages(this.dataModel.productTreeId, this.tableType);
      }

    }
  }

  ngOnInit() {
    this._stockSvc.filterStockNotHaveProductTree().then(res => {
      this.stockNotHaveProductTree = res;
    });
    this.getProductTreeStatusList();
    // if (this.dataModel.materialId) {
    //   setTimeout(() => {
    //     this.imageViewer.initImages(this.dataModel.materialId, TableTypeEnum.STOCK);
    //   }, 1500);
    // }
  }

  getProductTreeStatusList() {
    this.productTreeSvc.getProductTreeStatus().then((res: any) => {
      this.productTreeStatusList = res;
    });
  }

  selectedIteration(event) {
    console.log('@event', event);
  }

  setSelectedWorkstation(event) {
    this.dataModel.workstation = event;
    if (event) {
      this.dataModel.workstationId = event.workStationId;
    } else {
      this.dataModel.workstationId = null;
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
              operationOrder : null,
              operationRepeat : 1,
              parent : null,
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
        && this.dataModel.productTreeDetailList[0].operationList[0].componentList
        && this.dataModel.productTreeDetailList[0].operationList[0].componentList.length > 0) {
          let i = 0;
        this.dataModel.productTreeDetailList[0].operationList[0].componentList.forEach(itm => {
          if (+itm.direction === 1) {
            i = i + 1;
          }
        });
        if (i === 1) {
          mymodal.show();
        }
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
      this.imageAdder.updateMedia(result.productTreeId, TableTypeEnum.PRODUCTTREE)
      .then(() => {}).catch(error => this.utilities.showErrorToast(error));
      this.utilities.showSuccessToast('save-success');
      this.saveAction.next(result);
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
              // if (comp.productTreeDetailOperation) {
              //   comp.productTreeDetailOperationId = comp.productTreeDetailOperation.productTreeDetailOperationId;
              //   delete comp.productTreeDetailOperation;
              // }

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

  validateDuration(label, value) {
    if (!value || value === 0) {
      const lbl = this._translateSvc.instant(label);
      this.utilities.showWarningToast(lbl + ' must be bigger then 0');
      return false;
    }
    return true;
  }

  detail2Node(detail) {
    const me = this;
    let node: TreeNode = null;

    if (detail) {

      node = {
        data: Object.assign({}, detail, {productTreeDetailList: null}),
        children: detail.productTreeDetailList ? me.detailList2Node(detail.productTreeDetailList) : null
      }
      return node;
    }
    return node;

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
                productionType: null,
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
                productionType: null,
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

  detailList2Node(detailList) {
    const me = this;

    let list;

    if (detailList) {
      list = [];

      detailList.forEach(item => {
        const treeNode: TreeNode = me.detail2Node(item);
        list.push(treeNode);
      });

      return list;
    }
    return list;

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
            if (i === 0) {materialcomponent = itm}
            i = i + 1;
          }
        });
        if (materialcomponent && materialcomponent.component && i === 1) {
            this.dataModel.material = materialcomponent.component;
            this.dataModel.materialId = materialcomponent.component.stockId;
            // this.imageViewer.initImages(this.dataModel.materialId, TableTypeEnum.STOCK);
          // this.dataModel.material = this.dataModel.productTreeDetailList[0].componentList[0].component;
          // this.dataModel.materialId = this.dataModel.productTreeDetailList[0].componentList[0].component.stockId;
          // this.imageViewer.initImages(this.dataModel.materialId, TableTypeEnum.STOCK);
        } else {
          this.dataModel.materialId = null;
          this.dataModel.material = null;
          // this.imageViewer.resetImages();
          this.productTreeSvc.setProductTreeMaterial(null);
        }
      } else {
        this.dataModel.materialId = null;
        this.dataModel.material = null;
        // this.imageViewer.resetImages();
        this.productTreeSvc.setProductTreeMaterial(null);
      }
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

  //#region Tree View Modal

  onTreeViewClicked() {
    this.TreeViewFiles = this.detailList3Node(this.dataModel.productTreeDetailList);
    this.dialog.visible = true;
  }
  detailList3Node(detailList, frntlevel?, apilevel?) {
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
        const treeNode = me.detail3Node(item, frntlvl, apilvl);
        list.push(treeNode);
      });

    }
    return list;

  }
  detail3Node(detail, frntlevel?, apilevel?) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail, {productTreeDetailList: null}, {stepNo: apilevel, stepFNo: frntlevel}),
        children: detail.productTreeDetailList ? me.detailList3Node(detail.productTreeDetailList, frntlevel, apilevel) : [],
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
  getInputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction < 0) || [] : [];
  }
  getOutputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction > 0) || [] : [];
  }
  showProductTreeDetail(productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }
  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time);
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

  //#endregion

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

  setSelectedProcessMaterial(event) {
    if(event) {
      this.selectedProcessMaterial = event;
    } else {
      this.selectedProcessMaterial = null;
    }
  }

}

