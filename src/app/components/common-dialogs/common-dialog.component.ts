import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogTypeEnum } from '../../services/shared/dialog-types.enum';
import { LoaderService } from '../../services/shared/loader.service';
import { Dialog } from 'primeng/dialog';
@Component({
  selector: 'detail-dialogs',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogsComponent implements OnDestroy, OnInit {

  @ViewChild('dJobOrder') dJobOrder: Dialog;
  @ViewChild('dStock') dStock: Dialog;
  @ViewChild('dOrderQuotation') dOrderQuotation: Dialog;
  @ViewChild('dOrderQuotationItem') dOrderQuotationItem: Dialog;
  @ViewChild('dWorkstation') dWorkstation: Dialog;
  
  @ViewChild('dOperation') dOperation: Dialog;
  @ViewChild('dEQUIPMENTOPERATION') dEQUIPMENTOPERATION: Dialog;
  @ViewChild('dCustomer') dCustomer: Dialog;
  @ViewChild('dJobProd') dJobProd: Dialog;
  @ViewChild('dBatch') dBatch: Dialog;
  @ViewChild('dProductTree') dProductTree: Dialog;
  @ViewChild('dProductTreeEdit') dProductTreeEdit: Dialog;
  @ViewChild('dCreateOrder') dCreateOrder: Dialog;
  @ViewChild('dGOODTRANSFER') dGOODTRANSFER: Dialog;
  @ViewChild('dMAINTENANCENOTIFICATIONTYPE') dMAINTENANCENOTIFICATIONTYPE: Dialog;
  @ViewChild('dMAINTENANCENOTIFICATION') dMAINTENANCENOTIFICATION: Dialog;
  @ViewChild('dProductionOrder') dProdOrder: Dialog;
  @ViewChild('dProductionListOrder') dProdOrderList: Dialog;
  @ViewChild('dPlant') dPlant: Dialog;
  @ViewChild('dWarehouse') dWarehouse: Dialog;
  @ViewChild('dPurchaseOrder') dPurchaseOrder: Dialog;
  @ViewChild('dPurchaseOrderItem') dPurchaseOrderItem: Dialog;
  @ViewChild('dScrapCause') dScrapCause: Dialog;
  @ViewChild('dScrapType') dScrapType: Dialog;
  @ViewChild('dScrapCauseRework') dScrapCauseRework: Dialog;
  @ViewChild('dCountry') dCountry: Dialog;
  @ViewChild('dWorkCenterType') dWorkCenterType: Dialog;
  @ViewChild('dWorkCenter') dWorkCenter: Dialog;
  @ViewChild('dWorkStationType') dWorkStationType: Dialog;
  @ViewChild('dWorkStationCategory') dWorkStationCategory: Dialog;
  @ViewChild('dOperationType') dOperationType: Dialog;
  @ViewChild('dOrder') dOrder: Dialog;
  @ViewChild('dOrderItem') dOrderItem: Dialog;
  @ViewChild('dStaff') dStaff: Dialog;
  @ViewChild('dFunctionalLocation') dFunctionalLocation: Dialog;
  @ViewChild('dEquipment') dEquipment: Dialog;
  @ViewChild('dMaintenanceSystemCondition') dMaintenanceSystemCondition: Dialog;
  @ViewChild('dMaintenanceActivityType') dMaintenanceActivityType: Dialog;
  @ViewChild('dMaintenanceCategoryType') dMaintenanceCategoryType: Dialog;
  @ViewChild('dMaintenanceReason') dMaintenanceReason: Dialog;
  @ViewChild('dMaintenancePlanningType') dMaintenancePlanningType: Dialog;
  @ViewChild('dEquipmentCategory') dEquipmentCategory: Dialog;
  @ViewChild('dPlannerGroup') dPlannerGroup: Dialog;
  @ViewChild('dABCIndicator') dABCIndicator: Dialog;
  @ViewChild('dMaintenanceStrategy') dMaintenanceStrategy: Dialog;
  @ViewChild('dCodeGroup') dCodeGroup: Dialog;
  @ViewChild('dCodeGroupHeader') dCodeGroupHeader: Dialog;
  @ViewChild('dCity') dCity: Dialog;
  @ViewChild('dEmployeeCabability') dEmployeeCabability: Dialog;
  @ViewChild('dReservation') dReservation: Dialog;
  @ViewChild('dProductionOrderReport') dProductionOrderReport: Dialog;
  @ViewChild('dMaintenanceOrder') dMaintenanceOrder: Dialog;
  @ViewChild('dTransferNotification') dTransferNotification: Dialog;
  @ViewChild('dPallet') dPallet: Dialog;
  @ViewChild('dPalletRecord') dPalletRecord: Dialog;
  @ViewChild('dShiftSetting') dShiftSetting: Dialog;
  @ViewChild('dStopCausesType') dStopCausesType: Dialog;
  @ViewChild('dStopCause') dStopCause: Dialog;
  @ViewChild('dCOSTCENTER') dCostCenter: Dialog;
  @ViewChild('dLocation') dLocation: Dialog;
  @ViewChild('dJobOrderOperation') dJobOrderOperation: Dialog;
  @ViewChild('dProject') dProject: Dialog;
  @ViewChild('dProjectTask') dProjectTask: Dialog;
  @ViewChild('dMilestone') dMilestone: Dialog;
  // @ViewChild('dMail') dMail: Dialog;
  @ViewChild('dBarcode') dBarcode: Dialog;
  @ViewChild('dSCRAP') dSCRAP: Dialog;
  @ViewChild('dREWORK') dREWORK: Dialog;
  @ViewChild('dFactoryCalender') dFactoryCalender: Dialog;

  dialogs = {
    BARCODE: {
      visible: false,
      extraProps: null,
      uniqueId: null,
    },
    FACTORYCALENDAR: {
      visible: false,
      extraProps: null,
      uniqueId: null,
    },
    JOBORDER: {
      visible: false,
      extraProps: null,
      uniqueId: null,
    },
    STOCK: {
      visible: false,
      uniqueId: null
    },
    ORDERQUOTATION: {
      visible: false,
      uniqueId: null
    },
    ORDERQUOTATIONITEM: {
      visible: false,
      uniqueId: null
    },
    PROJECT: {
      visible: false,
      uniqueId: null
    },
    PROJECTTASK: {
      visible: false,
      uniqueId: null
    },
    MILESTONE: {
      visible: false,
      uniqueId: null
    },
    WORKSTATION: {
      visible: false,
      uniqueId: null
    },
    COSTCENTER: {
      visible: false,
      uniqueId: null
    },
    OPERATION: {
      visible: false,
      uniqueId: null
    },
    EQUIPMENTOPERATION: {
      visible: false,
      uniqueId: null
    },
    CUSTOMER: {
      visible: false,
      uniqueId: null
    },
    PRODUCTION: {
      visible: false,
      uniqueId: null
    },
    BATCH: {
      visible: false,
      uniqueId: null
    },
    PALLET: {
      visible: false,
      uniqueId: null
    },
    PALLETRECORD: {
      visible: false,
      uniqueId: null
    },
    PRODUCTIONORDER: {
      visible: false,
      uniqueId: null,
      data: null
    },
    PRODUCTIONORDERLIST: {
      visible: false,
      uniqueId: null,
      data: null,
    },
    MAIL: {
      visible: false,
      uniqueId: null,
      data: null,
    },
    PRODUCTTREE: {
      visible: false,
      uniqueId: null
    },
    PRODUCTTREEEDIT: {
      visible: false,
      uniqueId: null
    },
    CREATEORDER: {
      visible: false,
      uniqueId: null
    },
    GOODTRANSFER: {
      visible: false,
      uniqueId: null
    },
    PLANT: {
      visible: false,
      uniqueId: null
    },
    WAREHOUSE: {
      visible: false,
      uniqueId: null
    },
    PURCHASEORDER: {
      visible: false,
      uniqueId: null
    },
    PURCHASEORDERITEM: {
      visible: false,
      uniqueId: null
    },
    SCRAPCAUSE: {
      visible: false,
      uniqueId: null
    },
    SCRAP: {
      visible: false,
      uniqueId: null
    },
    REWORK: {
      visible: false,
      uniqueId: null
    },
    SCRAPTYPE: {
      visible: false,
      uniqueId: null
    },
    SCRAPCAUSEREWORK: {
      visible: false,
      uniqueId: null
    },
    COUNTRY: {
      visible: false,
      uniqueId: null
    },
    WORKCENTERTYPE: {
      visible: false,
      uniqueId: null
    },
    WORKCENTER: {
      visible: false,
      uniqueId: null
    },
    WORKSTATIONTYPE: {
      visible: false,
      uniqueId: null
    },
    WORKSTATIONCATEGORY: {
      visible: false,
      uniqueId: null
    },
    OPERATIONTYPE: {
      visible: false,
      uniqueId: null
    },
    ORDER: {
      visible: false,
      uniqueId: null
    },
    ORDERITEM: {
      visible: false,
      uniqueId: null
    },
    STAFF: {
      visible: false,
      uniqueId: null
    },
    FUNCTIONALLOCATION: {
      visible: false,
      uniqueId: null
    },
    EQUIPMENT: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCESYSTEMCONDITION: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCEACTIVITYTYPE: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCECATEGORYTYPE: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCEREASON: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCPLANNINGTYPE: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCENOTIFICATIONTYPE: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCENOTIFICATION: {
      visible: false,
      uniqueId: null
    },
    EQUIPMENTCATEGORY: {
      visible: false,
      uniqueId: null
    },
    PLANNERGROUP: {
      visible: false,
      uniqueId: null
    },
    ABCINDICATOR: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCESTRATEGY: {
      visible: false,
      uniqueId: null
    },
    CODEGROUP: {
      visible: false,
      uniqueId: null
    },
    CODEGROUPHEADER: {
      visible: false,
      uniqueId: null
    },
    CITY: {
      visible: false,
      uniqueId: null
    },
    EMPLOYEECAPABILITY: {
      visible: false,
      uniqueId: null
    },
    RESERVATION: {
      visible: false,
      uniqueId: null
    },
    PRODUCTIONORDERREPORT: {
      visible: false,
      uniqueId: null
    },
    MAINTENANCEORDER: {
      visible: false,
      uniqueId: null
    },
    TRANSFERNOTIFICATION: {
      visible: false,
      uniqueId: null
    },
    SHIFTSETTING: {
      visible: false,
      uniqueId: null
    },
    STOPCAUSETYPE: {
      visible: false,
      uniqueId: null
    },
    STOPCAUSE: {
      visible: false,
      uniqueId: null
    },
    LOCATION: {
      visible: false,
      uniqueId: null
    },
    JOBORDEROPERATION: {
      visible: false,
      uniqueId: null
    }

  }

  constructor(private loaderService: LoaderService) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    const me = this;
    this.loaderService.subscriberDialog$.subscribe(state => {
      console.log('@gotcha', state);
      switch (state.dialogType) {
        case DialogTypeEnum.BARCODE:
          me.dialogs.BARCODE.uniqueId = state.uniqueId;
          me.dialogs.BARCODE.visible = true;
          me.dialogs.BARCODE.extraProps = state.extraProps;

          break;
        case DialogTypeEnum.FACTORYCALENDAR:
          me.dialogs.FACTORYCALENDAR.uniqueId = state.uniqueId;
          me.dialogs.FACTORYCALENDAR.visible = true;
          me.dialogs.FACTORYCALENDAR.extraProps = state.extraProps;

          break;
        case DialogTypeEnum.JOBORDER:
          me.dialogs.JOBORDER.uniqueId = state.uniqueId;
          me.dialogs.JOBORDER.visible = true;
          me.dialogs.JOBORDER.extraProps = state.extraProps;

          break;
        case DialogTypeEnum.JOBORDEROPERATION:
          me.dialogs.JOBORDEROPERATION.uniqueId = state.uniqueId;
          me.dialogs.JOBORDEROPERATION.visible = true;

          break;
        case DialogTypeEnum.STOCK:
          me.dialogs.STOCK.uniqueId = state.uniqueId;
          me.dialogs.STOCK.visible = true;
          break;
        case DialogTypeEnum.ORDERQUOTATIONITEM:
          me.dialogs.ORDERQUOTATIONITEM.uniqueId = state.uniqueId;
          me.dialogs.ORDERQUOTATIONITEM.visible = true;
          break;
        case DialogTypeEnum.ORDERQUOTATION:
          me.dialogs.ORDERQUOTATION.uniqueId = state.uniqueId;
          me.dialogs.ORDERQUOTATION.visible = true;
          break;
        case DialogTypeEnum.PROJECT:
          me.dialogs.PROJECT.uniqueId = state.uniqueId;
          me.dialogs.PROJECT.visible = true;
          break;
        case DialogTypeEnum.PROJECTTASK:
          me.dialogs.PROJECTTASK.uniqueId = state.uniqueId;
          me.dialogs.PROJECTTASK.visible = true;
          break;
        case DialogTypeEnum.MILESTONE:
          me.dialogs.MILESTONE.uniqueId = state.uniqueId;
          me.dialogs.MILESTONE.visible = true;
          break;
        case DialogTypeEnum.LOCATION:
          me.dialogs.LOCATION.uniqueId = state.uniqueId;
          me.dialogs.LOCATION.visible = true;
          break;
        case DialogTypeEnum.TRANSFERNOTIFICATION:
          me.dialogs.TRANSFERNOTIFICATION.uniqueId = state.uniqueId;
          me.dialogs.TRANSFERNOTIFICATION.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCENOTIFICATIONTYPE:
          me.dialogs.MAINTENANCENOTIFICATIONTYPE.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCENOTIFICATIONTYPE.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCENOTIFICATION:
            me.dialogs.MAINTENANCENOTIFICATION.uniqueId = state.uniqueId;
            me.dialogs.MAINTENANCENOTIFICATION.visible = true;
            break;
        case DialogTypeEnum.WORKSTATION:
          me.dialogs.WORKSTATION.uniqueId = state.uniqueId;
          me.dialogs.WORKSTATION.visible = true;
          break;
        case DialogTypeEnum.OPERATION:
          me.dialogs.OPERATION.uniqueId = state.uniqueId;
          me.dialogs.OPERATION.visible = true;
          break;
        case DialogTypeEnum.EQUIPMENTOPERATION:
            me.dialogs.EQUIPMENTOPERATION.uniqueId = state.uniqueId;
            me.dialogs.EQUIPMENTOPERATION.visible = true;
            break;
        case DialogTypeEnum.CUSTOMER:
          me.dialogs.CUSTOMER.uniqueId = state.uniqueId;
          me.dialogs.CUSTOMER.visible = true;
          break;
        case DialogTypeEnum.PRODUCTIONORDER:
          me.dialogs.PRODUCTIONORDER.uniqueId = state.uniqueId;
          me.dialogs.PRODUCTIONORDER.visible = true;
          me.dialogs.PRODUCTIONORDER.data = null;
          break;
        case DialogTypeEnum.PRODUCTIONORDERLIST:
          me.dialogs.PRODUCTIONORDERLIST.uniqueId = state.uniqueId;
          me.dialogs.PRODUCTIONORDERLIST.data = state.extraProps;
          me.dialogs.PRODUCTIONORDERLIST.visible = true;
          break;
        case DialogTypeEnum.MAIL:
          me.dialogs.MAIL.uniqueId = state.uniqueId;
          me.dialogs.MAIL.data = state.extraProps;
          me.dialogs.MAIL.visible = true;
          break;
        case DialogTypeEnum.BATCH:
          me.dialogs.BATCH.uniqueId = state.uniqueId;
          me.dialogs.BATCH.visible = true;
          break;
        case DialogTypeEnum.CREATEORDER:
          me.dialogs.CREATEORDER.uniqueId = state.uniqueId;
          me.dialogs.CREATEORDER.visible = true;
          break;
        case DialogTypeEnum.PRODUCTTREE:
          me.dialogs.PRODUCTTREE.uniqueId = state.uniqueId;
          me.dialogs.PRODUCTTREE.visible = true;
          break;
        case DialogTypeEnum.PRODUCTTREEEDIT:
            me.dialogs.PRODUCTTREEEDIT.uniqueId = state.uniqueId;
            me.dialogs.PRODUCTTREEEDIT.visible = true;
            break;
        case DialogTypeEnum.GOODTRANSFER:
          me.dialogs.GOODTRANSFER.uniqueId = state.uniqueId;
          me.dialogs.GOODTRANSFER.visible = true;
          break;
        case DialogTypeEnum.PLANT:
          me.dialogs.PLANT.uniqueId = state.uniqueId;
          me.dialogs.PLANT.visible = true;
          break;
        case DialogTypeEnum.PALLET:
          me.dialogs.PALLET.uniqueId = state.uniqueId;
          me.dialogs.PALLET.visible = true;
          break;
        case DialogTypeEnum.PALLETRECORD:
          me.dialogs.PALLETRECORD.uniqueId = state.uniqueId;
          me.dialogs.PALLETRECORD.visible = true;
          break;
        case DialogTypeEnum.WAREHOUSE:
          me.dialogs.WAREHOUSE.uniqueId = state.uniqueId;
          me.dialogs.WAREHOUSE.visible = true;
          break;
        case DialogTypeEnum.PURCHASEORDER:
          me.dialogs.PURCHASEORDER.uniqueId = state.uniqueId;
          me.dialogs.PURCHASEORDER.visible = true;
          break;
        case DialogTypeEnum.PURCHASEORDERITEMDETAIL:
          me.dialogs.PURCHASEORDERITEM.uniqueId = state.uniqueId;
          me.dialogs.PURCHASEORDERITEM.visible = true;
          break;
        case DialogTypeEnum.SCRAP:
          me.dialogs.SCRAP.uniqueId = state.uniqueId;
          me.dialogs.SCRAP.visible = true;
          break;
        case DialogTypeEnum.REWORK:
          me.dialogs.REWORK.uniqueId = state.uniqueId;
          me.dialogs.REWORK.visible = true;
          break;
        case DialogTypeEnum.SCRAPCAUSE:
          me.dialogs.SCRAPCAUSE.uniqueId = state.uniqueId;
          me.dialogs.SCRAPCAUSE.visible = true;
          break;
        case DialogTypeEnum.SCRAPTYPE:
          me.dialogs.SCRAPTYPE.uniqueId = state.uniqueId;
          me.dialogs.SCRAPTYPE.visible = true;
          break;
        case DialogTypeEnum.SCRAPCAUSEREWORK:
          me.dialogs.SCRAPCAUSEREWORK.uniqueId = state.uniqueId;
          me.dialogs.SCRAPCAUSEREWORK.visible = true;
          break;
        case DialogTypeEnum.COUNTRY:
          me.dialogs.COUNTRY.uniqueId = state.uniqueId;
          me.dialogs.COUNTRY.visible = true;
          break;
        case DialogTypeEnum.WORKCENTERTYPE:
          me.dialogs.WORKCENTERTYPE.uniqueId = state.uniqueId;
          me.dialogs.WORKCENTERTYPE.visible = true;
          break;
        case DialogTypeEnum.COSTCENTER:
          me.dialogs.COSTCENTER.uniqueId = state.uniqueId;
          me.dialogs.COSTCENTER.visible = true;
          break;
        case DialogTypeEnum.WORKCENTER:
          me.dialogs.WORKCENTER.uniqueId = state.uniqueId;
          me.dialogs.WORKCENTER.visible = true;
          break;
        case DialogTypeEnum.WORKSTATIONTYPE:
          me.dialogs.WORKSTATIONTYPE.uniqueId = state.uniqueId;
          me.dialogs.WORKSTATIONTYPE.visible = true;
          break;
        case DialogTypeEnum.WORKSTATIONCATEGORY:
          me.dialogs.WORKSTATIONCATEGORY.uniqueId = state.uniqueId;
          me.dialogs.WORKSTATIONCATEGORY.visible = true;
          break;
        case DialogTypeEnum.OPERATIONTYPE:
          me.dialogs.OPERATIONTYPE.uniqueId = state.uniqueId;
          me.dialogs.OPERATIONTYPE.visible = true;
          break;
        case DialogTypeEnum.ORDER:
          me.dialogs.ORDER.uniqueId = state.uniqueId;
          me.dialogs.ORDER.visible = true;
          break;
        case DialogTypeEnum.ORDERITEM:
          me.dialogs.ORDERITEM.uniqueId = state.uniqueId;
          me.dialogs.ORDERITEM.visible = true;
          break;
        case DialogTypeEnum.STAFF:
          me.dialogs.STAFF.uniqueId = state.uniqueId;
          me.dialogs.STAFF.visible = true;
          break;
        case DialogTypeEnum.FUNCTIONALLOCATION:
          me.dialogs.FUNCTIONALLOCATION.uniqueId = state.uniqueId;
          me.dialogs.FUNCTIONALLOCATION.visible = true;
          break;
        case DialogTypeEnum.EQUIPMENT:
          me.dialogs.EQUIPMENT.uniqueId = state.uniqueId;
          me.dialogs.EQUIPMENT.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCESYSTEMCONDITION:
          me.dialogs.MAINTENANCESYSTEMCONDITION.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCESYSTEMCONDITION.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCEACTIVITYTYPE:
          me.dialogs.MAINTENANCEACTIVITYTYPE.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCEACTIVITYTYPE.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCECATEGORYTYPE:
          me.dialogs.MAINTENANCECATEGORYTYPE.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCECATEGORYTYPE.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCEREASON:
          me.dialogs.MAINTENANCEREASON.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCEREASON.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCPLANNINGTYPE:
          me.dialogs.MAINTENANCPLANNINGTYPE.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCPLANNINGTYPE.visible = true;
          break;
        case DialogTypeEnum.EQUIPMENTCATEGORY:
          me.dialogs.EQUIPMENTCATEGORY.uniqueId = state.uniqueId;
          me.dialogs.EQUIPMENTCATEGORY.visible = true;
          break;
        case DialogTypeEnum.PLANNERGROUP:
          me.dialogs.PLANNERGROUP.uniqueId = state.uniqueId;
          me.dialogs.PLANNERGROUP.visible = true;
          break;
        case DialogTypeEnum.ABCINDICATOR:
          me.dialogs.ABCINDICATOR.uniqueId = state.uniqueId;
          me.dialogs.ABCINDICATOR.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCESTRATEGY:
          me.dialogs.MAINTENANCESTRATEGY.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCESTRATEGY.visible = true;
          break;
        case DialogTypeEnum.CODEGROUP:
          me.dialogs.CODEGROUP.uniqueId = state.uniqueId;
          me.dialogs.CODEGROUP.visible = true;
          break;
        case DialogTypeEnum.CODEGROUPHEADER:
          me.dialogs.CODEGROUPHEADER.uniqueId = state.uniqueId;
          me.dialogs.CODEGROUPHEADER.visible = true;
          break;
        case DialogTypeEnum.CITY:
          me.dialogs.CITY.uniqueId = state.uniqueId;
          me.dialogs.CITY.visible = true;
          break;
        case DialogTypeEnum.EMPLOYEECAPABILITY:
          me.dialogs.EMPLOYEECAPABILITY.uniqueId = state.uniqueId;
          me.dialogs.EMPLOYEECAPABILITY.visible = true;
          break;
        case DialogTypeEnum.RESERVATION:
          me.dialogs.RESERVATION.uniqueId = state.uniqueId;
          me.dialogs.RESERVATION.visible = true;
          break;
        case DialogTypeEnum.PRODUCTIONORDERREPORT:
          me.dialogs.PRODUCTIONORDERREPORT.uniqueId = state.uniqueId;
          me.dialogs.PRODUCTIONORDERREPORT.visible = true;
          break;
        case DialogTypeEnum.MAINTENANCEORDER:
          me.dialogs.MAINTENANCEORDER.uniqueId = state.uniqueId;
          me.dialogs.MAINTENANCEORDER.visible = true;
          break;
        case DialogTypeEnum.SHIFTSETTING:
          me.dialogs.SHIFTSETTING.uniqueId = state.uniqueId;
          me.dialogs.SHIFTSETTING.visible = true;
          break;
        case DialogTypeEnum.STOPCAUSETYPE:
          me.dialogs.STOPCAUSETYPE.uniqueId = state.uniqueId;
          me.dialogs.STOPCAUSETYPE.visible = true;
          break;
        case DialogTypeEnum.STOPCAUSE:
            me.dialogs.STOPCAUSE.uniqueId = state.uniqueId;
            me.dialogs.STOPCAUSE.visible = true;
            break;
      }

      setTimeout(() => {
        this.moveToTop(state.dialogType);
      }, 600);
    });


    this.loaderService.subscriberDialogHide$.subscribe(DtEnum => {
      console.log('@gotcha', DtEnum);
      switch (DtEnum) {
        case DialogTypeEnum.BARCODE:
          me.dialogs.BARCODE.visible = false;
          me.dialogs.BARCODE.uniqueId = null;
          break;
        case DialogTypeEnum.FACTORYCALENDAR:
          me.dialogs.FACTORYCALENDAR.visible = false;
          me.dialogs.FACTORYCALENDAR.uniqueId = null;
          break;
        case DialogTypeEnum.JOBORDER:
          me.dialogs.JOBORDER.visible = false;
          me.dialogs.JOBORDER.uniqueId = null;
          break;
        case DialogTypeEnum.JOBORDEROPERATION:
          me.dialogs.JOBORDEROPERATION.visible = false;
          me.dialogs.JOBORDEROPERATION.uniqueId = null;
          break;
        case DialogTypeEnum.PURCHASEORDERITEMDETAIL:
          me.dialogs.PURCHASEORDERITEM.visible = false;
          me.dialogs.PURCHASEORDERITEM.uniqueId = null;
          break;
        case DialogTypeEnum.STOCK:
          me.dialogs.STOCK.visible = false;
          me.dialogs.STOCK.uniqueId = null;
          break;
        case DialogTypeEnum.ORDERQUOTATION:
          me.dialogs.ORDERQUOTATION.visible = false;
          me.dialogs.ORDERQUOTATION.uniqueId = null;
          break;
        case DialogTypeEnum.ORDERQUOTATIONITEM:
          me.dialogs.ORDERQUOTATIONITEM.visible = false;
          me.dialogs.ORDERQUOTATIONITEM.uniqueId = null;
          break;
        case DialogTypeEnum.PROJECT:
          me.dialogs.PROJECT.visible = false;
          me.dialogs.PROJECT.uniqueId = null;
          break;
        case DialogTypeEnum.PROJECTTASK:
          me.dialogs.PROJECTTASK.visible = false;
          me.dialogs.PROJECTTASK.uniqueId = null;
          break;
        case DialogTypeEnum.MILESTONE:
          me.dialogs.MILESTONE.visible = false;
          me.dialogs.MILESTONE.uniqueId = null;
          break;
        case DialogTypeEnum.LOCATION:
          me.dialogs.LOCATION.visible = false;
          me.dialogs.LOCATION.uniqueId = null;
          break;
        case DialogTypeEnum.TRANSFERNOTIFICATION:
          me.dialogs.TRANSFERNOTIFICATION.visible = false;
          me.dialogs.TRANSFERNOTIFICATION.uniqueId = null;
          break;
        case DialogTypeEnum.WORKSTATION:
          me.dialogs.WORKSTATION.visible = false;
          break;
        case DialogTypeEnum.OPERATION:
          me.dialogs.OPERATION.visible = false;
          break;
        case DialogTypeEnum.EQUIPMENTOPERATION:
            me.dialogs.EQUIPMENTOPERATION.visible = false;
            break;
        case DialogTypeEnum.CUSTOMER:
          me.dialogs.CUSTOMER.visible = false;
          break;
        case DialogTypeEnum.PRODUCTIONORDER:
          me.dialogs.PRODUCTIONORDER.visible = false;
          me.dialogs.PRODUCTIONORDER.uniqueId = null;
          me.dialogs.PRODUCTIONORDER.data = null;
          break;
        case DialogTypeEnum.PRODUCTIONORDERLIST:
          me.dialogs.PRODUCTIONORDERLIST.visible = false;
          me.dialogs.PRODUCTIONORDERLIST.uniqueId = null;
          me.dialogs.PRODUCTIONORDERLIST.data = null;
          break;
        case DialogTypeEnum.MAIL:
          me.dialogs.MAIL.visible = false;
          me.dialogs.MAIL.uniqueId = null;
          me.dialogs.MAIL.data = null;
          break;
        case DialogTypeEnum.BATCH:
          me.dialogs.BATCH.visible = false;
          break;
        case DialogTypeEnum.CREATEORDER:
          me.dialogs.CREATEORDER.visible = false;
          break;
        case DialogTypeEnum.PRODUCTTREE:
          me.dialogs.PRODUCTTREE.visible = false;
          me.dialogs.PRODUCTTREE.uniqueId = null;
          break;
        case DialogTypeEnum.PRODUCTTREEEDIT:
            me.dialogs.PRODUCTTREEEDIT.visible = false;
            me.dialogs.PRODUCTTREEEDIT.uniqueId = null;
            break;
        case DialogTypeEnum.GOODTRANSFER:
          me.dialogs.GOODTRANSFER.visible = false;
          me.dialogs.GOODTRANSFER.uniqueId = null;
          break;
        case DialogTypeEnum.PLANT:
          me.dialogs.PLANT.visible = false;
          break;
        case DialogTypeEnum.PALLET:
          me.dialogs.PALLET.visible = false;
          break;
        case DialogTypeEnum.PALLETRECORD:
          me.dialogs.PALLETRECORD.visible = false;
          break;
        case DialogTypeEnum.WAREHOUSE:
          me.dialogs.WAREHOUSE.visible = false;
          break;
        case DialogTypeEnum.PURCHASEORDER:
          me.dialogs.PURCHASEORDER.visible = false;
          me.dialogs.PURCHASEORDER.uniqueId = null;
          break;
        case DialogTypeEnum.MAINTENANCENOTIFICATIONTYPE:
          me.dialogs.MAINTENANCENOTIFICATIONTYPE.visible = false;
          me.dialogs.MAINTENANCENOTIFICATIONTYPE.uniqueId = null;
          break;
        case DialogTypeEnum.MAINTENANCENOTIFICATION:
            me.dialogs.MAINTENANCENOTIFICATION.visible = false;
            me.dialogs.MAINTENANCENOTIFICATION.uniqueId = null;
            break;
        case DialogTypeEnum.SCRAP:
              me.dialogs.SCRAP.visible = false;
              break;
        case DialogTypeEnum.REWORK:
              me.dialogs.REWORK.visible = false;
              break;
        case DialogTypeEnum.SCRAPCAUSE:
          me.dialogs.SCRAPCAUSE.visible = false;
          break;
        case DialogTypeEnum.SCRAPTYPE:
          me.dialogs.SCRAPTYPE.visible = false;
          break;
        case DialogTypeEnum.SCRAPCAUSEREWORK:
          me.dialogs.SCRAPCAUSEREWORK.visible = false;
          break;
        case DialogTypeEnum.COUNTRY:
          me.dialogs.COUNTRY.visible = false;
          break;
        case DialogTypeEnum.WORKCENTERTYPE:
          me.dialogs.WORKCENTERTYPE.visible = false;
          break;
        case DialogTypeEnum.COSTCENTER:
          me.dialogs.COSTCENTER.visible = false;
          break;
        case DialogTypeEnum.WORKCENTER:
          me.dialogs.WORKCENTER.visible = false;
          break;
        case DialogTypeEnum.WORKSTATIONTYPE:
          me.dialogs.WORKSTATIONTYPE.visible = false;
          break;
        case DialogTypeEnum.WORKSTATIONCATEGORY:
          me.dialogs.WORKSTATIONCATEGORY.visible = false;
          break;
        case DialogTypeEnum.OPERATIONTYPE:
          me.dialogs.OPERATIONTYPE.visible = false;
          break;
        case DialogTypeEnum.ORDER:
          me.dialogs.ORDER.visible = false;
          break;
        case DialogTypeEnum.ORDERITEM:
          me.dialogs.ORDERITEM.visible = false;
          break;
        case DialogTypeEnum.STAFF:
          me.dialogs.STAFF.visible = false;
          break;
        case DialogTypeEnum.FUNCTIONALLOCATION:
          me.dialogs.FUNCTIONALLOCATION.visible = false;
          break;
        case DialogTypeEnum.EQUIPMENT:
          me.dialogs.EQUIPMENT.visible = false;
          break;
        case DialogTypeEnum.MAINTENANCESYSTEMCONDITION:
          me.dialogs.MAINTENANCESYSTEMCONDITION.visible = false;
          break;
        case DialogTypeEnum.MAINTENANCEACTIVITYTYPE:
          me.dialogs.MAINTENANCEACTIVITYTYPE.visible = false;
          break;
        case DialogTypeEnum.MAINTENANCECATEGORYTYPE:
          me.dialogs.MAINTENANCECATEGORYTYPE.visible = false;
          break;
        case DialogTypeEnum.MAINTENANCEREASON:
          me.dialogs.MAINTENANCEREASON.visible = false;
          break;
        case DialogTypeEnum.MAINTENANCPLANNINGTYPE:
          me.dialogs.MAINTENANCPLANNINGTYPE.visible = false;
          break;
        case DialogTypeEnum.EQUIPMENTCATEGORY:
          me.dialogs.EQUIPMENTCATEGORY.visible = false;
          break;
        case DialogTypeEnum.PLANNERGROUP:
          me.dialogs.PLANNERGROUP.visible = false;
          break;
        case DialogTypeEnum.ABCINDICATOR:
          me.dialogs.ABCINDICATOR.visible = false;
          break;
        case DialogTypeEnum.MAINTENANCESTRATEGY:
          me.dialogs.MAINTENANCESTRATEGY.visible = false;
          break;
        case DialogTypeEnum.CODEGROUPHEADER:
          me.dialogs.CODEGROUPHEADER.visible = false;
          break;
        case DialogTypeEnum.CITY:
          me.dialogs.CITY.visible = false;
          break;
        case DialogTypeEnum.EMPLOYEECAPABILITY:
          me.dialogs.EMPLOYEECAPABILITY.visible = false;
          break;
        case DialogTypeEnum.RESERVATION:
          me.dialogs.RESERVATION.visible = false;
          me.dialogs.RESERVATION.uniqueId = null;
          break;
        case DialogTypeEnum.PRODUCTIONORDERREPORT:
          me.dialogs.PRODUCTIONORDERREPORT.visible = false;
          me.dialogs.PRODUCTIONORDERREPORT.uniqueId = null;
          break;
        case DialogTypeEnum.MAINTENANCEORDER:
          me.dialogs.MAINTENANCEORDER.visible = false;
          me.dialogs.MAINTENANCEORDER.uniqueId = null;
          break;
        case DialogTypeEnum.SHIFTSETTING:
          me.dialogs.SHIFTSETTING.uniqueId = null;
          me.dialogs.SHIFTSETTING.visible = false;
          break;
        case DialogTypeEnum.STOPCAUSETYPE:
          me.dialogs.STOPCAUSETYPE.uniqueId = null;
          me.dialogs.STOPCAUSETYPE.visible = false;
          break;
        case DialogTypeEnum.STOPCAUSE:
            me.dialogs.STOPCAUSE.uniqueId = null;
            me.dialogs.STOPCAUSE.visible = false;
            break;

      }
    });
  }


  moveToTop(dialogToShow) {
    if (dialogToShow === 'BARCODE') {
      this.dBarcode.moveOnTop();
    } else if (dialogToShow === 'FACTORYCALENDAR') {
      this.dFactoryCalender.moveOnTop();
    } else if (dialogToShow === 'JOBORDER') {
      this.dJobOrder.moveOnTop();
    } else if (dialogToShow === 'JOBORDEROPERATION') {
      this.dJobOrderOperation.moveOnTop();
    } else if (dialogToShow === 'STOCK') {
      this.dStock.moveOnTop();
    } else if (dialogToShow === 'ORDERQUOTATION') {
      this.dOrderQuotation.moveOnTop();
    } else if (dialogToShow === 'ORDERQUOTATIONITEM') {
      this.dOrderQuotationItem.moveOnTop();
    } else if (dialogToShow === 'PROJECT') {
      this.dProject.moveOnTop();
    }else if (dialogToShow === 'PROJECTTASK') {
      this.dProjectTask.moveOnTop();
    } else if (dialogToShow === 'MILESTONE') {
      this.dMilestone.moveOnTop();
    }else if (dialogToShow === 'MAIL') {
      // this.dMail.moveOnTop();
    } else if (dialogToShow === 'WORKSTATION') {
      this.dWorkstation.moveOnTop();
    } else if (dialogToShow === 'OPERATION') {
      this.dOperation.moveOnTop();
    } else if (dialogToShow === 'EQUIPMENTOPERATION') {
      this.dEQUIPMENTOPERATION.moveOnTop();
    } else if (dialogToShow === 'CUSTOMER') {
      this.dCustomer.moveOnTop();
    }
    else if (dialogToShow === 'GOODTRANSFER') {
      this.dGOODTRANSFER.moveOnTop();
    }
    else if (dialogToShow === 'PRODUCTIONORDER') {
      this.dProdOrder.moveOnTop();
    }
    else if (dialogToShow === 'PRODUCTIONORDERLIST') {
      this.dProdOrderList.moveOnTop();
    }
    else if (dialogToShow === 'PURCHASEORDERITEM') {
      this.dPurchaseOrderItem.moveOnTop();
    }
    else if (dialogToShow === 'BATCH') {
      this.dBatch.moveOnTop();
    }
    else if (dialogToShow === 'CREATEORDER') {
      this.dCreateOrder.moveOnTop();
    } else if (dialogToShow === 'PRODUCTTREE') {
      this.dProductTree.moveOnTop();
    } else if (dialogToShow === 'PRODUCTTREEEDIT') {
      this.dProductTreeEdit.moveOnTop();
    } else if (dialogToShow === 'PLANT') {
      this.dPlant.moveOnTop();
    } else if (dialogToShow === 'LOCATION') {
      this.dLocation.moveOnTop();
    } else if (dialogToShow === 'WAREHOSUE') {
      this.dWarehouse.moveOnTop();
    } else if (dialogToShow === 'PURCHASEORDER') {
      this.dPurchaseOrder.moveOnTop();
    } else if (dialogToShow === 'SCRAPCAUSE') {
      this.dScrapCause.moveOnTop();
    }  else if (dialogToShow === 'SCRAP') {
      this.dSCRAP.moveOnTop();
    }  else if (dialogToShow === 'REWORK') {
      this.dREWORK.moveOnTop();
    } else if (dialogToShow === 'SCRAPTYPE') {
      this.dScrapType.moveOnTop();
    } else if (dialogToShow === 'SCRAPCAUSEREWORK') {
      this.dScrapCauseRework.moveOnTop();
    } else if (dialogToShow === 'COUNTRY') {
      this.dCountry.moveOnTop();
    } else if (dialogToShow === 'WORKCENTERTYPE') {
      this.dWorkCenterType.moveOnTop();
    } else if (dialogToShow === 'WORKCENTER') {
      this.dWorkCenter.moveOnTop();
    } else if (dialogToShow === 'WORKSTATIONTYPE') {
      this.dWorkStationType.moveOnTop();
    } else if (dialogToShow === 'WORKSTATIONCATEGORY') {
      this.dWorkStationCategory.moveOnTop();
    } else if (dialogToShow === 'OPERATIONTYPE') {
      this.dOperationType.moveOnTop();
    } else if (dialogToShow === 'ORDER') {
      this.dOrder.moveOnTop();
    } else if (dialogToShow === 'ORDERITEM') {
      this.dOrderItem.moveOnTop();
    } else if (dialogToShow === 'STAFF') {
      this.dStaff.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCENOTIFICATIONTYPE') {
      this.dMAINTENANCENOTIFICATIONTYPE.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCENOTIFICATION') {
      this.dMAINTENANCENOTIFICATION.moveOnTop();
    } else if (dialogToShow === 'FUNCTIONALLOCATION') {
      this.dFunctionalLocation.moveOnTop();
    } else if (dialogToShow === 'EQUIPMENT') {
      this.dEquipment.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCESYSTEMCONDITION') {
      this.dMaintenanceSystemCondition.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCEACTIVITYTYPE') {
      this.dMaintenanceActivityType.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCECATEGORYTYPE') {
      this.dMaintenanceCategoryType.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCEREASON') {
      this.dMaintenanceReason.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCPLANNINGTYPE') {
      this.dMaintenancePlanningType.moveOnTop();
    } else if (dialogToShow === 'EQUIPMENTCATEGORY') {
      this.dEquipmentCategory.moveOnTop();
    } else if (dialogToShow === 'PLANNERGROUP') {
      this.dPlannerGroup.moveOnTop();
    } else if (dialogToShow === 'ABCINDICATOR') {
      this.dABCIndicator.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCESTRATEGY') {
      this.dMaintenanceStrategy.moveOnTop();
    } else if (dialogToShow === 'CODEGROUP') {
      this.dCodeGroup.moveOnTop();
    } else if (dialogToShow === 'CODEGROUPHEADER') {
      this.dCodeGroupHeader.moveOnTop();
    } else if (dialogToShow === 'CITY') {
      this.dCity.moveOnTop();
    } else if (dialogToShow === 'EMPLOYEECAPABILITY') {
      this.dEmployeeCabability.moveOnTop();
    } else if (dialogToShow === 'RESERVATION') {
      this.dReservation.moveOnTop();
    } else if (dialogToShow === 'PRODUCTIONORDERREPORT') {
      this.dProductionOrderReport.moveOnTop();
    } else if (dialogToShow === 'MAINTENANCEORDER') {
      this.dMaintenanceOrder.moveOnTop();
    } else if (dialogToShow === 'SHIFTSETTING') {
      this.dShiftSetting.moveOnTop();
    } else if (dialogToShow === 'STOPCAUSETYPE') {
      this.dStopCausesType.moveOnTop();
    } else if (dialogToShow === 'COSTCENTER') {
      this.dCostCenter.moveOnTop();
    }else if (dialogToShow === 'STOPCAUSE') {
      this.dStopCause.moveOnTop();
    }
  }
}
