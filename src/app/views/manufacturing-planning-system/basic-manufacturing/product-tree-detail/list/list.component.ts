/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';
import { ProductDetailItemCommunicatingService } from '../../product-detail-item.service';
import { TreeTableToggler, TreeTable } from 'primeng';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeDetailService } from 'app/services/dto-services/product-tree/prod-tree-detail.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

const swapPositions = (array, a ,b) => {
  [array[a], array[b]] = [array[b], array[a]]
}


@Component({
  selector: 'product-tree-detail-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ProductTreeDetailListComponent implements OnInit, AfterViewInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('dt') public treeTable: TreeTable;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };
  showMaterialNo = false;
  productionTypeList = [];
  cols = [
    {field: 'stepNo', header: 'step-no'},
    {field: 'productTreeDetailId', header: 'product-tree-detail-id'},
    {field: 'operationList', header: 'operation'},
    {field: 'materialList', header: 'material-output'},
    {field: 'componentList', header: 'component-input'},
    {field: 'auxmaterialList', header: 'auxiliary-material'},
    {field: 'singleTotalDuration', header: 'single-total-duration'},
    {field: 'workstation', header: 'workstation'},
    {field: 'neededPerson', header: 'needed-person'},
    {field: 'operationOrder', header: 'op-order'},
    {field: 'parent', header: 'parent'},
    {field: 'equipmentList', header: 'equipment'},
    {field: 'productionType', header: 'production-type'},
    {field: 'parentId', header: 'parent-id'},
    // {field: 'status', header: 'status'},
  ];

  selectedRowNode = null;

  addButtonItems = [
    {label: 'Parent', icon: 'pi pi-plus',
      command: () => {
          this.AddTopNode();
      }
    },
    {label: 'Child', icon: 'pi pi-plus',
      command: () => {
        this.AddBottomNode();
      }
    }];

  deleteButtonItems = [
    {label: 'This Level', icon: 'pi pi-minus',
      command: () => {
          this.deleteThisNode();
      }
    },
    {label: 'All Levels', icon: 'pi pi-trash',
      command: () => {
        this.deleteAllNodes();
      }
    }];
  showFullComponents = -10;
  productTreeId;
  tableData = [];
  openModalType: any;
  selectedPlant: any;
  material: any;
  reverse = false;

  @Input('productTreeId') set x(productTreeId) {

    this.productTreeId = productTreeId;
  };
  @Input() plant;
  @Input('material') set mateiralx(material) {
    this.material = material;
  };
  @Input('tableData') set t(tableData) {
    if (tableData) {
      tableData.forEach(prdetail => {
        this.setWorkstationId(prdetail);
      });

    }
    this.tableData = this.detailList2Node(tableData);
  };

  @Input("selectedProcessMaterial") set setselectedProcessMaterial(selectedProcessMaterial) {
    setTimeout(() => {
      this.addProcessMaterial(selectedProcessMaterial);
    }, 1200);
  }

  @Input('reverse') set setreverse(reverse) {
    if (reverse) {
      swapPositions(this.cols, 3, 4);
      this.reverse = true;
    } else {
      if (this.reverse) {
        swapPositions(this.cols, 3, 4);
        this.reverse = false;
      }
    }
  }



  @Input() detailMode = false;
  @Output() saveEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();



  modal = {active: false, index: 0, openModalType: null};
  choosepaneModal = {active: false, modalType: null, isAuxMaterial: false, direction: null};
  addmodal = {active: false, tabIndex:null, rowData: null, rowNode: null, title: null, prDetailId: null, mode: null, index: null, data: null, openModalType: null};
  parent;
  isParent = true;

  treetableToggler: TreeTableToggler ;

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private mOrderTypeTypeSvc: ProductTreeDetailService,
              private userSvc: UsersService,
              private enumService: EnumService,
              public prodDetailCommunicatingService: ProductDetailItemCommunicatingService,
              private loaderService: LoaderService) {
    this.selectedPlant = JSON.parse(this.userSvc.getPlant());
  }

  ngOnInit() {
    // if (this.productTreeId) {
      setTimeout(() => {
        this.expandORcollapse(this.tableData);
        this.tableData = [...this.tableData];
        this.onTableDataChange();
      }, 500);
    // }

    this.enumService.getProductionTypeEnum().then((res: any) => {
      if (res && Array.isArray(res)) {
        this.productionTypeList = res;
      }
    }).catch(err => console.error(err));
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


  addProcessMaterial(selectedProcessMaterial) {
    if(selectedProcessMaterial === undefined) {
      return;
    }
    this.addProcessMaterialToTree(selectedProcessMaterial, this.tableData);
  }

  addProcessMaterialToTree(selectedProcessMaterial, tableData) {

    tableData.forEach(node => {
      node.data.operationList.forEach(operation => {
        if(!operation.componentList || operation.componentList.length === 0) {
          const component = {
            quantity: 1,
            neededQuantity: null,
            baseQuantity: 1,
            isProcessMaterial: true,
            quantityUnit: selectedProcessMaterial?.baseUnit || null,
            position: null,
            description: null,
            direction: null,
            productTreeDetailComponentId: null,
            productTreeDetailOperationId: null,
            productTreeDetailId: node.data.productTreeDetailId,
            componentId: selectedProcessMaterial?.stockId,
            scrapCost: null,
            component: selectedProcessMaterial,
            materialCostRate: null,
            auxfeature: selectedProcessMaterial?.auxfeature,
            numberOfEdge: selectedProcessMaterial?.numberOfEdge,
            materialCost: selectedProcessMaterial?.stockCostEstimate?.currentPrice,
            currency: selectedProcessMaterial?.stockCosting?.currencyCode,
            extraProductionPercentage: selectedProcessMaterial?.extraProductionPercentage || 0,
            productTreeDetailComponentFeatureList: []
          }
          operation.componentList = [];
          operation.componentList.push({...component, direction: -1});
          operation.componentList.push({...component, direction: 1});
        } else if(operation.componentList && operation.componentList.length === 1) {
          const component = {
            quantity: 1,
            neededQuantity: null,
            baseQuantity: 1,
            isProcessMaterial: true,
            quantityUnit: selectedProcessMaterial?.baseUnit || null,
            description: null,
            position: null,
            direction: null,
            productTreeDetailComponentId: null,
            productTreeDetailOperationId: null,
            productTreeDetailId: node.data.productTreeDetailId,
            componentId: selectedProcessMaterial?.stockId,
            scrapCost: null,
            component: selectedProcessMaterial,
            materialCostRate: null,
            auxfeature: selectedProcessMaterial?.auxfeature,
            numberOfEdge: selectedProcessMaterial?.numberOfEdge,
            materialCost: selectedProcessMaterial?.stockCostEstimate?.currentPrice,
            currency: selectedProcessMaterial?.stockCosting?.currencyCode,
            extraProductionPercentage: selectedProcessMaterial?.extraProductionPercentage || 0,
            productTreeDetailComponentFeatureList: []
          }
          const input = operation.componentList.find(c => c.direction === -1);
          operation.componentList.push({...component, direction: input? 1: -1});
        } else if (selectedProcessMaterial) {
          operation.componentList.forEach(c => {
            if(c.isProcessMaterial || c.component.stockTypeId === 9) {
              c.component = selectedProcessMaterial;
              c.componentId = selectedProcessMaterial?.stockId;
              c.materialCost = selectedProcessMaterial?.stockCostEstimate?.currentPrice;
              c.currency = selectedProcessMaterial?.stockCosting?.currencyCode;
              c.quantityUnit= selectedProcessMaterial?.baseUnit || null;
            }
          })
        } else {
          operation.componentList.forEach(c => {
            if(c.isProcessMaterial || c.component.stockTypeId === 9) {
              c.component = null;
              c.componentId = null;
              c.position= null;
              c.materialCost = null;
              c.materialCostRate = null;
              c.extraProductionPercentage = null;
              c.quantityUnit= null;
            }
          });
        }
        
      });
      if(node.children && node.children.length > 0) {
        this.addProcessMaterialToTree(selectedProcessMaterial, node.children);
      }
    })
  }

  setWorkstationId (prdetail) {
    if (prdetail.workstation) {
      prdetail.workstationId = prdetail.workstation.workStationId;
    } if (prdetail.productTreeDetailList && prdetail.productTreeDetailList.length > 0) {
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
        if (operation.productTreeDetailComponentList) {
          operation.componentList = operation.productTreeDetailComponentList || [] ;
          delete operation.productTreeDetailComponentList;
        }
      });
    }
  }
  onhideAddModal() {

    this.addmodal = {active: false, tabIndex:null, rowData: null,rowNode: null, title: null, prDetailId: null, mode: null, index: null, data: null, openModalType: null};
    this.prodDetailCommunicatingService.seletedProdDTItem = null;
  }
  openChoosePaneModal(rowData, modaltype, operationIndex?, isAuxMaterial?, direction?, rowNode?) {
    this.prodDetailCommunicatingService.seletedProdDTItem = rowData;
    this.addmodal.prDetailId = rowData.productTreeDetailId;
    this.addmodal.rowData = rowData;
    this.addmodal.rowNode = rowNode ? rowNode : null;
    this.addmodal.index = operationIndex;
    this.choosepaneModal.modalType = modaltype;
    this.choosepaneModal.direction = direction ? direction : null;
    this.choosepaneModal.isAuxMaterial = isAuxMaterial ? isAuxMaterial : null;
    this.choosepaneModal.active = true;

  }


  openOperationModal(rowData, modaltype, i?, isAuxMaterial?, direction?, rowNode?) {
    this.prodDetailCommunicatingService.seletedProdDTItem = rowData;
    this.addmodal.prDetailId = rowData.productTreeDetailId;
    this.addmodal.rowData = rowData;
    this.addmodal.index = i;
    this.addmodal.rowNode = rowNode ? rowNode : null;
    this.addmodal.data = this.addmodal.rowData.operationList[this.addmodal.index];
    this.addmodal.mode = modaltype;
    this.addmodal.title = modaltype;
    this.addmodal.active = true;
  }
  openSingleDurationModal(rowData, modaltype, i, tabIndex) {
    this.prodDetailCommunicatingService.seletedProdDTItem = rowData;
    this.addmodal.prDetailId = rowData.productTreeDetailId;
    this.addmodal.rowData = rowData;
    this.addmodal.index = i;
    this.addmodal.data = this.addmodal.rowData.operationList[this.addmodal.index];
    this.addmodal.mode = modaltype;
    this.addmodal.tabIndex = tabIndex;
    this.addmodal.title = modaltype;
    this.addmodal.active = true;
  }

  openChoosePaneComponentModal(rowData, modaltype, operationIndex?, direction?, rowNode?) {
    this.prodDetailCommunicatingService.seletedProdDTItem = rowData;
    this.addmodal.prDetailId = rowData.productTreeDetailId;
    this.addmodal.rowData = rowData;
    this.addmodal.index = operationIndex;
    this.addmodal.rowNode = rowNode ? rowNode : null;
    this.choosepaneModal.modalType = modaltype;
    this.choosepaneModal.direction = direction ? direction : null;
    this.choosepaneModal.active = true;
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.treetableToggler = new TreeTableToggler(this.treeTable);
    }, 1000);
    // setTimeout(() => {
    //         // get the first "p-tree" tag and find his first "toggler"
    //         const element: any = document.getElementsByTagName('p-treetabletoggler')[0].getElementsByClassName('ui-treetable-toggler')[0].getElementsByClassName;
    //         if (element && element.innerHTML === '<i class="pi pi-fw pi-chevron-right"></i>') {
    //                 // "click" the toggler using the angular2 renderer
    //               const event = new MouseEvent('click', {bubbles: true});
    //               this.renderer.invokeElementMethod(element, 'dispatchEvent', [event]);
    //               this.cdt.detectChanges();
    //               // setTimeout(() => {
    //               //   this.renderer.invokeElementMethod(element, 'dispatchEvent', [event]);
    //               //   this.renderer.invokeElementMethod(element, 'dispatchEvent', [event]);
    //               // }, 1200);
    //         }
    //     }, 600);
  }
  // expendItemsinTreelistManually(elements) {
  //   for (let index = 0; index < elements.length; index++) {
  //     const element = elements[index];
  //     if (element) {
  //         // "click" the toggler using the angular2 renderer
  //       const event = new MouseEvent('click', {bubbles: true});
  //       this.renderer.invokeElementMethod(element, 'dispatchEvent', [event]);
  //       // setTimeout(() => {
  //       //   const moreelements = document.getElementsByTagName('p-treetabletoggler')[0].getElementsByClassName('ui-treetable-toggler') as HTMLCollection;
  //       //   this.expendItemsinTreelistManually(moreelements);
  //       // }, 200);
  //     }
  //   }
  // }
  modalShow(id, mod: string, data, parent?, index = 0, openModaltype?) {
    this.prodDetailCommunicatingService.seletedProdDTItem = data;
    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;
    this.modal.index = index ? index : 0;
    this.modal.openModalType = openModaltype !== null ? openModaltype : null;
    this.modal.active = true;
    if (parent && parent.expanded) {
      this.parent = parent;
      // this.isParent = false;
    } else {
      this.parent = null;
      // this.isParent = true;
    }
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


  addNewModalShow(parent, mod: string) {
    this.equipmentModal.data = null;
    this.equipmentModal.id = null;
    this.equipmentModal.modal = mod;
    this.modal.index = 0;
    this.modal.openModalType = null;
    this.modal.active = true;
    if (parent) {
      this.parent = parent;
    } else {
      this.parent = null;
    }
    // this.addEvent(parent);
  }

  showWorkstationModal(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  marginLeft = (level) => {
    if ((level * 5) > 90) {
      return 90;
    }
    return (level * 5);
  }
  // this function written to test tree table
  // addEvent(parent) {
  //   const dataModel = {
  //     productTreeId: null,
  //     productTreeDetailId: null,
  //     operationRepeat: 1,
  //     processControlFrequency: 1,
  //     parentId: null,
  //     singleDuration: 1,
  //     singleSetupDuration: 1,
  //     singleTotalDuration: 1,
  //     maxSingleStandbyDuration: 0,
  //     componentList: null,
  //     operationList: null,
  //     equipmentList: null,
  //     workstationProgramList: null,
  //     workstationId: 1,
  //     workstation: null,
  //     orderNo: null,
  //   };
  //
  //   const node = this.detail2Node(dataModel);
  //   node.expanded = true;
  //   if (this.parent) {
  //     this.parent.expanded = true;
  //     this.parent.children = [node, ...this.parent.children];
  //   } else {
  //     this.tableData = [node, ...this.tableData];
  //   }
  //   this.tableData = [...this.tableData];
  //   this.onTableDataChange();
  // }

  // getauxlist = () => {
  //   return this.tableData.
  // }

  deleteThisNode() {
    if (this.selectedRowNode && this.selectedRowNode.node?.data?.productTreeDetailId) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          // this.mOrderTypeTypeSvc.delete(id)
          //   .then(() => {
          //     this.utilities.showSuccessToast('deleted-success');
              // this.removeKey(key, parent);
              this.deleteEvent.next(this.selectedRowNode.node.data.productTreeDetailId);
              const key = this.selectedRowNode.node.key;
              const parent = this.selectedRowNode.node.parent;
              if (parent) {
                const dataListRef = [...parent.children];
                const founddata = dataListRef.find(item => item.key == key);
                const founddataIndex = dataListRef.findIndex(item => item.key == key);
                if(founddata) {
                  parent.children.splice(founddataIndex, 1);
                  parent.children = [...parent.children,
                    ...founddata?.children?.map(itm=> {
                      itm.data.parentId = founddata?.data?.parentId
                      return itm;
                    }) || []];

                }
                this.onTableDataChange();
              }
            // })
            // .catch(error => this.utilities.showErrorToast(error));
        },
        reject: () => {
          this.utilities.showInfoToast('cancelled-operation');
        }
      })
    } else {
      const key = this.selectedRowNode.node.key;
      const parent = this.selectedRowNode.node.parent;
      if (parent) {
        const dataListRef = [...parent.children];
        const founddata = dataListRef.find(item => item.key == key);
        const founddataIndex = dataListRef.findIndex(item => item.key == key);
        if(founddata) {
          parent.children.splice(founddataIndex, 1);
          parent.children = [...parent.children,
            ...founddata?.children?.map(itm=> {
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
      accept: () => {
        if(this.selectedRowNode) {
          if(this.selectedRowNode.node?.data?.productTreeDetailId) {
            this.deleteEvent.next(this.selectedRowNode.node.data.productTreeDetailId);
          }
          if(this.selectedRowNode.node?.children?.length) {
            this.selectedRowNode.node.children.forEach(itm => {
              if(itm.data.productTreeDetailId) {
                this.deleteEvent.next(itm.data.productTreeDetailId);
              }
            });
          }
          this.removeKey(this.selectedRowNode.node.key, this.selectedRowNode.node.parent);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

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
              this.deleteEvent.next(id);
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
  }
  onclosePrdTreeDetailItem (myModal) {
    if (this.equipmentModal.modal !== 'DETAIL') {
      this.prodDetailCommunicatingService.onhide.next() ;
    } else {
      myModal.hide();
    }

    // setTimeout(() => {
    //   myModal.hide();
    // }, 1200);
  }

  onTableDataChange() {
    let dataToSave = this.nodeList2DetailData(this.tableData);
    this.tableData = this.detailList2Node(dataToSave);
    dataToSave = this.nodeList2DetailData(this.tableData);
    this.saveEvent.next(dataToSave);
  }


  addOrUpdate(item) {
    if ( item && this.equipmentModal.data) {// edit event
      this.equipmentModal.data.maxSingleStandbyDuration = item.maxSingleStandbyDuration;
      this.equipmentModal.data.singleDuration = item.singleDuration;
      this.equipmentModal.data.singleSetupDuration = item.singleSetupDuration;
      this.equipmentModal.data.singleTotalDuration = item.singleTotalDuration;
      this.equipmentModal.data.operationRepeat = item.operationRepeat;
      this.equipmentModal.data.processControlFrequency = item.processControlFrequency;
      this.equipmentModal.data.plannedCycleQuantity = item.plannedCycleQuantity;
      this.equipmentModal.data.workstation = item.workstation;
      this.equipmentModal.data.fixedCost = item.fixedCost;
      this.equipmentModal.data.neededPerson = item.neededPerson;
      this.equipmentModal.data.laborCost = item.laborCost;
      this.equipmentModal.data.currency = item.currency;
      this.equipmentModal.data.variableCost = item.variableCost;
      this.equipmentModal.data.workstationId = item.workstationId;
      this.equipmentModal.data.componentList = item.componentList;
      this.equipmentModal.data.operationList = item.operationList;
      this.equipmentModal.data.equipmentList = item.equipmentList;
      this.equipmentModal.data.productionType = item.productionType;
      this.equipmentModal.data.workstationProgramList = item.workstationProgramList;
    } else if (item) {// new event
      const node = this.detail2Node(item);
      node.expanded = true;
      if (this.parent) {
        this.parent.expanded = true;
        this.parent.children = [node, ...this.parent.children];
      } else {
        this.tableData = [node, ...this.tableData];
      }
    }
    this.onTableDataChange();
  }

  addNewParent() {
    if (!this.material) {
      this.utilities.showWarningToast('Please Select Material First');
      return 0;
    }
    const dataDetailModel = {
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
      componentList: [{
        quantity: 1,
        quantityUnit: this.material.baseUnit,
        direction: 1,
        productTreeDetailComponentId: null,
        productTreeDetailId: null,
        componentId: this.material.stockId,
        component: this.material,
        currency: null,
        materialCost: null,
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
    };
    if (this.productTreeId) {
      this.mOrderTypeTypeSvc.save(dataDetailModel)
        .then(result => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('saved-success');
          const saveNode = Object.assign({}, result);
          const newnode = this.detail2Node(saveNode);
          this.tableData = [newnode, ...this.tableData];
          this.onTableDataChange();
        })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });
    } else {
      const detailNode = Object.assign({}, dataDetailModel);
      const node = this.detail2Node(detailNode);
      this.tableData = [node, ...this.tableData];
      this.onTableDataChange();
    }
  }


  AddTopNode() {
    if(this.selectedRowNode) {
      this.addTopChild(this.selectedRowNode.parent);
    }
  }

  AddBottomNode() {
    if(this.selectedRowNode) {
      this.addNewChild(this.selectedRowNode.node);
    }
  }

  addTopChild(rowNode) {
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
      node.children = [...rowNode.children.map(itm => {
        if(itm.data) {
          itm.data.parentId = dataDetailModel.productTreeDetailId;
        }
        return itm;
      })];
      rowNode.expanded = true;
      rowNode.children = [node];
    } else {
      this.tableData = [...this.tableData, node];
    }
    this.onTableDataChange();
    //  }

    this.prodDetailCommunicatingService.seletedProdDTItem = null;

  }


  addNewChild(rowNode, mode?) {
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
      rowNode.children = [...rowNode.children, node];
    } else {
      this.tableData = [...this.tableData, node];
    }
    this.onTableDataChange();
    //  }

    this.prodDetailCommunicatingService.seletedProdDTItem = null;
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
      this.addmodal.data.extraProductionPercentage = item.extraProductionPercentage;
      this.addmodal.data.position = item.position;
      this.addmodal.data.componentId = item.componentId;
      this.addmodal.data.productTreeDetailComponentId = item.productTreeDetailComponentId;

      if (this.addmodal.rowData && this.addmodal.rowData.operationList ) {
        if (!this.addmodal.rowData.operationList[this.addmodal.index].componentList) {
          this.addmodal.rowData.operationList[this.addmodal.index].componentList = [];
        }
        this.addmodal.rowData.operationList[this.addmodal.index].componentList.push({...this.addmodal.data});
      }
      // if (!this.addmodal.rowData.componentList) {
      //   this.addmodal.rowData.componentList = [];
      // }
      // If a "make selected" material or "process material" is added as "output", it will be added as "input" in "parent level"
      // If a "make selected" material or "process material" is added as "input", it will be added as "input" in "child level"
      // if (this.addmodal.data.component && this.addmodal.rowNode &&
      //   (this.addmodal.data.component.make || this.addmodal.data.component.stockTypeCode === 'PROC')) {
      //     if (this.addmodal.data.direction === 1 && this.addmodal.rowNode.parent) {
      //       if (!this.addmodal.rowNode.parent.data.componentList) {
      //         this.addmodal.rowNode.parent.data.componentList = [];
      //       }
      //       const input = this.addmodal.rowNode.parent.data.componentList.find(itm => (this.addmodal.data.componentId === itm.component.stockId) && (itm.direction === -1));
      //       if (!input) {
      //         this.addmodal.rowNode.parent.data.componentList = [{...this.addmodal.data , direction: -1 }, ...this.addmodal.rowNode.parent.data.componentList];
      //       }

      //     } else if (this.addmodal.data.direction === -1) {
      //       if (this.addmodal.rowNode.node.children && this.addmodal.rowNode.node.children.length > 0) {
      //         if (!this.addmodal.rowNode.node.children[0].data.componentList) {
      //           this.addmodal.rowNode.node.children[0].data.componentList = [];
      //           this.addmodal.rowNode.node.children[0].data.componentList.push({...this.addmodal.data , direction: 1 });
      //         } else {
      //           // const output = this.addmodal.rowNode.node.children[0].data.componentList.find(itm => itm.direction === 1);
      //           // if (output) {
      //           //   this.addmodal.rowNode.node.children[0].data.componentList.splice(
      //           //     this.addmodal.rowNode.node.children[0].data.componentList.indexOf(output),
      //           //     1,
      //           //     {...this.addmodal.data , direction: 1 }
      //           //   )
      //           // } else {
      //             this.addmodal.rowNode.node.children[0].data.componentList = [{...this.addmodal.data , direction: 1 }, ...this.addmodal.rowNode.node.children[0].data.componentList];
      //           // }
      //         }

      //       }

      //     }
      // }
      // const component = this.addmodal.rowData.componentList.find(itm => itm.component && itm.component.stockId === this.addmodal.data.componentId);
      // if (!component) {
      //   this.addmodal.rowData.componentList = [this.addmodal.data, ...this.addmodal.rowData.componentList];
      // }

      // this.addmodal.rowData.componentList = this.addmodal.rowData.componentList.filter(itm => itm.componentId !== null);

    } else {// new event
      // const detailData =
      // this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }
  checkInputMaterial = (items) => {
    if (!items) {return false};
    const material = items.find(item => item.direction > 0);
    return material ? true : false;
  }
  setSelectedOperation(operation) {
    if (operation) {
      let operationold = this.addmodal.rowData ?
        this.addmodal.rowData.operationList.find(itm => itm.operation == null) : {};
      if(operationold) {
        this.addmodal.data = {...operationold};
      } else {
        this.addmodal.data = {...(this.addmodal.rowData.operationList[this.addmodal.index] || {})};
      }
      this.addmodal.data.operationId = operation.operationId;
      this.addmodal.data.operation = operation;
      this.addmodal.data.quantity = 1;
      this.addmodal.data.singleDuration = operation.singleDuration;
      this.addmodal.data.singleSetupDuration = operation.singleSetupDuration;
      this.addmodal.data.variableCost = operation.operationCostRate;
      this.addmodal.data.currency = operation.currency;
      this.addmodal.data.maxSingleStandbyDuration = operation.maxSingleStandbyDuration;
      this.addmodal.data.singleTotalDuration = (this.addmodal.data.quantity * this.addmodal.data.singleDuration) + this.addmodal.data.singleSetupDuration;
      if (this.addmodal.rowData.operationList[this.addmodal.index || 0].parent) {
        this.addmodal.data.parent = true;
      }
      this.addmodal.data.operationOrder = this.addmodal.rowData?.operationList[this.addmodal.index || 0]?.operationOrder;
      if (this.addmodal.index === null && !operationold) {
        this.addmodal.rowData.operationList = [...this.addmodal.rowData.operationList, {...this.addmodal.data}];
      } else {
        this.addmodal.rowData.operationList[this.addmodal.index||0] = {...this.addmodal.data};
      }
      // if (this.addmodal.index !== null) {
      //   this.addmodal.index = null;
      // }
      // this.addmodal.mode = this.choosepaneModal.modalType;
      // this.addmodal.title = this.choosepaneModal.modalType;
      // this.addmodal.active = true;
    } else {
      this.addmodal.data = null;
      this.addmodal.mode = this.choosepaneModal.modalType;
      this.addmodal.title = this.choosepaneModal.modalType;
      this.addmodal.active = true;
    }
  }
  addOrUpdateoperation(item) {
    if (!this.addmodal.rowData.operationList) {
      this.addmodal.rowData.operationList = [];
    } else {
      this.addmodal.rowData.operationList = this.addmodal.rowData.operationList.filter(itm => (itm.operationId !== null));
    }

    if (this.addmodal.index === null) {
      this.addmodal.rowData.operationList = [...this.addmodal.rowData.operationList, item];
    } else {
      this.addmodal.rowData.operationList[this.addmodal.index] = {...item};
    }
    this.onTableDataChange();
  }
  setSelectedEquipment(stock) {
    if (stock) {
      this.addmodal.data = {};
      this.addmodal.data.stockId = stock.stockId;
      this.addmodal.data.stock = stock;
      this.addmodal.mode = this.choosepaneModal.modalType;
      this.addmodal.title = this.choosepaneModal.modalType;
      this.addmodal.active = true;
    } else {
      this.addmodal.data = null;
    }
  }
  addOrUpdatequipment(item) {
    if (!this.addmodal.rowData.equipmentList) {
      this.addmodal.rowData.equipmentList = [];
    }
    this.addmodal.rowData.equipmentList = [item, ...this.addmodal.rowData.equipmentList];
    this.onTableDataChange();
  }
  addOrUpdateWorstationProgram(item) {
    if (this.addmodal.rowData && this.addmodal.rowData.operationList ) {
      if (!this.addmodal.rowData.operationList[this.addmodal.index].productTreeDetailWorkstationProgramList) {
        this.addmodal.rowData.operationList[this.addmodal.index].productTreeDetailWorkstationProgramList = [];
      }
      this.addmodal.rowData.operationList[this.addmodal.index].productTreeDetailWorkstationProgramList.push({...item});
    }
    // if (!this.addmodal.rowData.workstationProgramList) {
    //   this.addmodal.rowData.workstationProgramList = [];
    // }
    // this.addmodal.rowData.workstationProgramList = [item, ...this.addmodal.rowData.workstationProgramList];
    this.onTableDataChange();
  }
  setSelectedStock(stock) {
    if (stock) {
      this.addmodal.data = {};
      this.addmodal.data.componentId = stock.stockId;
      this.addmodal.data.component = stock;
      this.addmodal.data.quantityUnit = stock.baseUnit;
      this.addmodal.data.auxfeature = stock.auxfeature;
      this.addmodal.data.numberOfEdge = stock.numberOfEdge;
      this.addmodal.data.materialCost = stock.stockCostEstimate?.currentPrice || this.addmodal.data.materialCost;
      this.addmodal.data.currency = stock.stockCosting?.currencyCode || this.addmodal.data.currency;

      this.addmodal.mode = this.choosepaneModal.modalType;
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
    } else {
      this.addmodal.data = null;
      // this.addmodal.data.componentId = null;
      // this.addmodal.data.component = null;
      // this.addmodal.data.quantityUnit = null;
      // this.addmodal.data.auxfeature = null;
      // this.addmodal.data.numberOfEdge = null;
    }
  }
  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time);
  }

  // getComponentList(itemList) {
  //   // console.log(itemList);
  //   if (itemList) {
  //     const components = itemList.filter(item => item.direction === -1).map(o => o.component.stockName).join(', ');
  //     return components;
  //   }
  //   return '';
  // }
  //
  // getMaterialList(itemList) {
  //   // console.log(itemList);
  //   if (itemList) {
  //     const materials = itemList.filter(item => item.direction === 1).map(o => o.component.stockName).join(', ');
  //     return materials;
  //   }
  //   return '';
  // }
  //
  // getOperationList(itemList) {
  //   // console.log(itemList);
  //   if (itemList) {
  //     const operations = itemList.map(o => o.operation.operationName).join(', ');
  //     return operations;
  //   }
  //   return '';
  // }


  showOperationDetail(opearationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }

  showProductTreeDetail(productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);

  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  getlistlenght = (rowData, direction) => {
    return rowData.componentList ? rowData.componentList.filter(itm => direction === itm.direction) : [];
  }

  detail2Node(detail, frntlevel?, apilevel?) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail, {productTreeDetailList: null}, {stepNo: apilevel, stepFNo: frntlevel}),
        children: detail.productTreeDetailList ? me.detailList2Node(detail.productTreeDetailList, frntlevel, apilevel) : [],
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
        const frntlvl = (frntlevel + (index !== 0 ? (index + 10) : 10));
        const apilvl = (apilevel + (index !== 0 ? (index + 10) : 10));
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


}
