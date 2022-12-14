export interface DialogObjectDto {
  dialogType: DialogTypeEnum;
  uniqueId: any;
  extraProps?: any;
}


export enum DialogTypeEnum {
  JOBORDER = 'JOBORDER',
  JOBORDEROPERATION = 'JOBORDEROPERATION',
  PRODUCTIONORDER = 'PRODUCTIONORDER',
  PRODUCTIONORDERLIST = 'PRODUCTIONORDERLIST',
  WORKSTATION = 'WORKSTATION',
  COSTCENTER = 'COSTCENTER',
  STOCK = 'STOCK',
  MAIL = 'MAIL',
  PROJECT = 'PROJECT',
  PROJECTTASK = 'PROJECTTASK',
  MILESTONE = 'MILESTONE',
  LOCATION = 'LOCATION',
  OPERATION = 'OPERATION',
  EQUIPMENTOPERATION = 'EQUIPMENTOPERATION',
  ORDER = 'ORDER',
  ORDERITEM = 'ORDERITEM',
  ORDERQUOTATION = 'ORDERQUOTATION',
  ORDERQUOTATIONITEM = 'ORDERQUOTATIONITEM',
  TRANSFERNOTIFICATION = 'TRANSFERNOTIFICATION',
  CUSTOMER = 'CUSTOMER',
  BATCH = 'BATCH',
  PALLET = 'PALLET',
  PALLETRECORD = 'PALLETRECORD',
  CREATEORDER = 'CREATEORDER',
  PRODUCTTREE = 'PRODUCTTREE',
  PRODUCTTREEEDIT = 'PRODUCTTREEEDIT',
  GOODTRANSFER = 'GOODTRANSFER',
  PLANT = 'PLANT',
  WAREHOUSE = 'WAREHOUSE',
  PURCHASEORDER = 'PURCHASEORDER',
  PURCHASEORDERITEMDETAIL = 'PURCHASEORDERITEMDETAIL',
  SCRAPCAUSE = 'SCRAPCAUSE',
  SCRAP = 'SCRAP',
  SCRAPCAUSEREWORK = 'SCRAPCAUSEREWORK',
  REWORK = 'REWORK',
  SCRAPTYPE = 'SCRAPTYPE',
  COUNTRY = 'COUNTRY',
  CITY = 'CITY',
  WORKCENTERTYPE = 'WORKCENTERTYPE',
  WORKCENTER = 'WORKCENTER',
  WORKSTATIONTYPE = 'WORKSTATIONTYPE',
  WORKSTATIONCATEGORY = 'WORKSTATIONCATEGORY',
  OPERATIONTYPE = 'OPERATIONTYPE',
  STAFF = 'STAFF',
  FUNCTIONALLOCATION = 'FUNCTIONALLOCATION',
  EQUIPMENT = 'EQUIPMENT',
  EQUIPMENTCATEGORY = 'EQUIPMENTCATEGORY',
  MAINTENANCESYSTEMCONDITION = 'MAINTENANCESYSTEMCONDITION',
  MAINTENANCESTRATEGY = 'MAINTENANCESTRATEGY',
  MAINTENANCEACTIVITYTYPE = 'MAINTENANCEACTIVITYTYPE',
  MAINTENANCECATEGORYTYPE = 'MAINTENANCECATEGORYTYPE',
  MAINTENANCEREASON = 'MAINTENANCEREASON',
  MAINTENANCPLANNINGTYPE = 'MAINTENANCPLANNINGTYPE',
  MAINTENANCENOTIFICATION = 'MAINTENANCENOTIFICATION',
  MAINTENANCENOTIFICATIONTYPE = 'MAINTENANCENOTIFICATIONTYPE',
  PLANNERGROUP = 'PLANNERGROUP',
  ABCINDICATOR = 'ABCINDICATOR',
  CODEGROUP = 'CODEGROUP',
  CODEGROUPHEADER = 'CODEGROUPHEADER',
  EMPLOYEECAPABILITY = 'EMPLOYEECAPABILITY',
  RESERVATION = 'RESERVATION',
  PRODUCTIONORDERREPORT = 'PRODUCTIONORDERREPORT',
  MAINTENANCEORDER = 'MAINTENANCEORDER',
  SHIFTSETTING = 'SHIFTSETTING',
  STOPCAUSETYPE = 'STOPCAUSETYPE',
  STOPCAUSE = 'STOPCAUSE',
  BARCODE = "BARCODE",
  FACTORYCALENDAR = "FACTORYCALENDAR",
}
