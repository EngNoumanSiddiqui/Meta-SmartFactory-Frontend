export enum CommonCodeGeneration {
    BATCH = "BATCH",
    RESERVATION = "RESERVATION",
    SALE_ORDER = "SALE_ORDER",
    TRANSFER_RECIPT = "TRANSFER_RECIPT",
    PURCHASE_ORDER = "PURCHASE_ORDER",
    MATERIAL = "MATERIAL",
    PRODUCTION_ORDER= "PRODUCTION_ORDER", 
    JOB_ORDER= "JOB_ORDER", 
    STOP_CAUSE_TYPE= "STOP_CAUSE_TYPE", 
    SKILL_MATRIX_CATEGORY= "SKILL_MATRIX_CATEGORY", 
    SKILL_MATRIX= "SKILL_MATRIX", 
    INDUSRTY= "INDUSRTY", 
    MATERIAL_GROUP= "MATERIAL_GROUP", 
    ACT= "ACT", 
    SHIFT= "SHIFT", 
    GOODS_MOVEMENT= "GOODS_MOVEMENT", 
    STOP_CAUSE= "STOP_CAUSE", 
    COMPANY= "COMPANY", 
    WORKSTATION= "WORKSTATION", 
    WORKCENTER= "WORKCENTER", 
    OPERATION= "OPERATION", 
    PRODUCT_TREE= "PRODUCT_TREE", 
    WORKSTATION_CATEGORY= "WORKSTATION_CATEGORY", 
    GOODS_MOVEMENT_NOTIFICATION= "GOODS_MOVEMENT_NOTIFICATION", 
    EMPLOYEE_GROUP_CODE= "EMPLOYEE_GROUP_CODE", 
    GENERAL_SETTING_CATEGORY= "GENERAL_SETTING_CATEGORY", 
    GENERAL_SETTING_ITEM= "GENERAL_SETTING_ITEM", 
    GENERAL_SETTING_ITEM_VALUE= "GENERAL_SETTING_ITEM_VALUE", 
    QUALITY_INSPECTION_CHARACTERISTIC= "QUALITY_INSPECTION_CHARACTERISTIC", 
    QUALITY_INSPECTION_METHOD= "QUALITY_INSPECTION_METHOD", 
    QUALITY_SAMPLING_PROCEDURE= "QUALITY_SAMPLING_PROCEDURE", 
    QUALITY_INSPECTION_PLAN= "QUALITY_INSPECTION_PLAN", 
    QUALITY_INSPECTION_LOT= "QUALITY_INSPECTION_LOT", 
    QUALITY_CATALOG_GROUP= "QUALITY_CATALOG_GROUP", 
    QUALITY_INSPECTION_TYPE= "QUALITY_INSPECTION_TYPE", 
    QUALITY_INSPECTION_LOT_RESULT= "QUALITY_INSPECTION_LOT_RESULT", 
    QUALITY_INSPECTION_OPERATION= "QUALITY_INSPECTION_OPERATION", 
    QUALITY_INSPECTION_PLAN_OPERATION= "QUALITY_INSPECTION_PLAN_OPERATION", 
    QUALITY_SAMPLING_PROCEDURE_USAGE_INDICATOR= "QUALITY_SAMPLING_PROCEDURE_USAGE_INDICATOR", 
    QUALITY_SAMPLING_PROCEDURE_VALUATION_MODE= "QUALITY_SAMPLING_PROCEDURE_VALUATION_MODE", 
    QUALITY_SAMPLING_TYPE= "QUALITY_SAMPLING_TYPE", 
    MAINTENANCE_NOTIFICATION= "MAINTENANCE_NOTIFICATION", 
    QUALITY_TASK= "QUALITY_TASK", 
    QUALITY_SAMPLING_PROCEDURE_INSPECTION_POINT= "QUALITY_SAMPLING_PROCEDURE_INSPECTION_POINT", 
    QUALITY_PLAN= "QUALITY_PLAN", 
    QUALITY_PLAN_OPERATION= "QUALITY_PLAN_OPERATION", 
    QUALITY_NOTIFICATION_STATUS= "QUALITY_NOTIFICATION_STATUS", 
    QUALITY_NOTIFICATION= "QUALITY_NOTIFICATION", 
    QUALITY_USAGE= "QUALITY_USAGE", 
    QUALITY_CHARACTERISTIC_CONTROL_INDICATOR= "QUALITY_CHARACTERISTIC_CONTROL_INDICATOR", 
    QUALITY_CHARACTERISTIC_CONTROL_DATA_INDICATOR= "QUALITY_CHARACTERISTIC_CONTROL_DATA_INDICATOR", 
    QUALITY_CODE_GROUP= "QUALITY_CODE_GROUP", 
    QUALITY_CONTROL_INDICATOR_RESULT= "QUALITY_CONTROL_INDICATOR_RESULT", 
    QUALITY_CONTROL_INDICATOR_SAMPLE= "QUALITY_CONTROL_INDICATOR_SAMPLE", 
    QUALITY_CONTROL_INDICATOR_TYPE= "QUALITY_CONTROL_INDICATOR_TYPE", 
    QUALITY_CONTROL_KEY= "QUALITY_CONTROL_KEY", 
    QUALITY_DEFECT_RECORDING= "QUALITY_DEFECT_RECORDING", 
    QUALITY_DEFECT_TYPE= "QUALITY_DEFECT_TYPE", 
    QUALITY_INDICATOR_SAMPLE= "QUALITY_INDICATOR_SAMPLE", 
    QUALITY_INFO_RECORD= "QUALITY_INFO_RECORD", 
    QUALITY_INSPECTION_CHARACTERISTIC_STATUS= "QUALITY_INSPECTION_CHARACTERISTIC_STATUS", 
    QUALITY_INSPECTION_METHOD_STATUS= "QUALITY_INSPECTION_METHOD_STATUS", 
    QUALITY_INSPECTION_PLAN_STATUS= "QUALITY_INSPECTION_PLAN_STATUS", 
    QUALITY_PLAN_STATUS= "QUALITY_PLAN_STATUS", 
    QUALITY_NOTIFICATION_TYPE= "QUALITY_NOTIFICATION_TYPE", 
    QUALITY_DEFECT_LOCATION= "QUALITY_DEFECT_LOCATION", 
    QUALITY_VENDOR_SOURCE_INSPECTION= "QUALITY_VENDOR_SOURCE_INSPECTION", 
    QUALITY_SYSTEM= "QUALITY_SYSTEM", 
    QUALITY_CERTIFICATE_CONTROL= "QUALITY_CERTIFICATE_CONTROL", 
    QUALITY_TASK_TYPE= "QUALITY_TASK_TYPE", 
    QUALITY_NOTIFICATION_ITEM= "QUALITY_NOTIFICATION_ITEM", 
    QUALITY_RESULT_RECORDING_TYPE= "QUALITY_RESULT_RECORDING_TYPE", 
    QUALITY_INSPECTION_CONTROL_DATA_CERTIFICATION= "QUALITY_INSPECTION_CONTROL_DATA_CERTIFICATION", 
    STOCK_PURCHASE= "STOCK_PURCHASE", 
    STOCK_VALUATION= "STOCK_VALUATION", 
    STOCK_COSTING= "STOCK_COSTING", 
    STOCK_COST_ESTIMATE= "STOCK_COST_ESTIMATE", 
    PURCHASE_INFO_RECORD= "PURCHASE_INFO_RECORD", 
    PURCHASE_GROUP= "PURCHASE_GROUP", 
    PURCHASE_GROUP_MEMBER= "PURCHASE_GROUP_MEMBER", 
    PURCHASE_CONTROL= "PURCHASE_CONTROL", 
    PURCHASE_CONDITION_TYPE= "PURCHASE_CONDITION_TYPE", 
    PURCHASE_CONDITION_RECORD= "PURCHASE_CONDITION_RECORD", 
    QUALITY_INSPECTION_CONTROL_DATA= "QUALITY_INSPECTION_CONTROL_DATA", 
    QUALITY_INFO_RECORD_RELEASE_NOT= "QUALITY_INFO_RECORD_RELEASE_NOT", 
    QUALITY_NOTIFICATION_REPORT_TYPE= "QUALITY_NOTIFICATION_REPORT_TYPE", 
    QUALITY_USAGE_DECISION_TYPE= "QUALITY_USAGE_DECISION_TYPE", 
    QUALITY_USAGE_DECISION= "QUALITY_USAGE_DECISION", 
    STOCK_QUALITY= "STOCK_QUALITY", 
    PALLET_SETTING= "PALLET_SETTING", 
    STOCK_TRANSFER_DETAIL_PURCHASE_COST= "STOCK_TRANSFER_DETAIL_PURCHASE_COST", 
    EMPLOYEE_SHIFT_GROUP= "EMPLOYEE_SHIFT_GROUP", 
    BARCODE= "BARCODE", 
    QRCODE= "QRCODE", 
    QUOTATION_ORDER= "QUOTATION_ORDER", 
    QUOTATION_ORDER_DETAIL= "QUOTATION_ORDER_DETAIL", 
    ACCOUNT_TYPE= "ACCOUNT_TYPE", 
    WAREHOUSE= "WAREHOUSE", 
    MAINTENANCE_ORDER= "MAINTENANCE_ORDER", 
    MAINTENANCE_ORDER_OPERATION= "MAINTENANCE_ORDER_OPERATION", 
    MAINTENANCE_ORDER_COMPONENT= "MAINTENANCE_ORDER_COMPONENT", 
    MAINTENANCE_ORDER_NOTIFICATION= "MAINTENANCE_ORDER_NOTIFICATION", 
    MAINTENANCE_ORDER_PLAN= "MAINTENANCE_ORDER_PLAN", 
    MAINTENANCE_ORDER_PLAN_ITEM= "MAINTENANCE_ORDER_PLAN_ITEM", 
    EMPLOYEE= "EMPLOYEE", 
    DEFAULT= "DEFAULT"
}