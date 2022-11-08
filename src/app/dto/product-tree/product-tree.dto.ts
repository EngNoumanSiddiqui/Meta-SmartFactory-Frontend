export interface ProductTreeRQDto {
    control: boolean;
    description: string;
    expiryDate: Date;
    lastModeDate: Date;
    materialId: number;
    plantId: number;
    productTreeDetailList: ProductTreeDetailList[];
    revisionNo: string;
    startDate: Date;
    status: string;
    workstationId: number;
  }
  
 export interface ProductTreeDetailList {
    componentList: ComponentList[];
    equipmentList: EquipmentList[];
    maxSingleStandbyDuration: number;
    operationList: OperationList[];
    operationRepeat: number;
    orderNo: number;
    parentId: number;
    processControlFrequency: number;
    singleDuration: number;
    singleSetupDuration: number;
    singleTotalDuration: number;
    status: string;
    workstationId: number;
    workstationProgramList: ProductTreeDetailWorkstationProgramList[];
  }
  
  interface OperationList {
    description: string;
    operationId: number;
    operationOrder: number;
    productTreeDetailWorkstationProgramList: ProductTreeDetailWorkstationProgramList[];
    quantity: number;
  }
  
  interface ProductTreeDetailWorkstationProgramList {
    description: string;
    operationOrder: number;
    workstationProgramId: number;
  }
  
  interface EquipmentList {
    count: number;
    equipmentId: number;
  }
  
  interface ComponentList {
    componentId: number;
    direction: number;
    productTreeDetailComponentFeatureList: ProductTreeDetailComponentFeatureList[];
    quantity: number;
    quantityUnit: string;
  }
  
  interface ProductTreeDetailComponentFeatureList {
    criteriaMaxValue: number;
    criteriaMinValue: number;
    criteriaUnit: string;
  }
