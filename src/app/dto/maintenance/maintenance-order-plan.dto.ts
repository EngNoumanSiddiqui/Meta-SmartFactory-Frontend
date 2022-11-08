export interface MaintenanceOrderPlanRespObject {
    content: MaintenanceOrderPlanContent[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
  }
  
  export interface MaintenanceOrderPlanContent {
    assembly: string;
    calHorizon: string;
    completionRequirement: number;
    createDate: string;
    cycleCompletionDate: string;
    cycleModificationFactor: number;
    equipment: Equipment;
    equipmentTask: EquipmentTask;
    mainWorkStation: MaintenanceWorkstation;
    maintenanceActivityType: MaintenanceActivityType;
    maintenanceFunctionalLocation: MaintenanceFunctionalLocation;
    maintenanceOrderPlanCycleItemList: MaintenanceOrderPlanCycleItemList[];
    maintenanceOrderPlanItemList: IMaintenanceOrderPlanItemList[];
    maintenanceOrderPlanType: MaintenanceOrderPlanType;
    maintenancePlanId: number;
    maintenancePlanPlanName: string;
    maintenancePlannerGroup: EquipmentPlannerGroup;
    planningPlant: MaintanencePlanningPlant;
    priority: string;
    schedulingIndicator: string;
    schedulingPeriod: string;
    schedulingPeriodUnit: string;
    shiftFactorEarlyCompletion: number;
    shiftFactorEarlyTolerance: number;
    shiftFactorLateCompletion: number;
    shiftFactorLateTolerance: number;
    startOfCycleCounter: string;
    startOfCycleCounterUnit: string;
    startOfCycleDate: string;
    updateDate: string;
  }
  
  export interface IMaintenanceOrderPlanItemList {
    assembly: string;
    createDate: string;
    equipment: Equipment;
    imaintenancePlanItemId: number;
    mainWorkStation?: MaintenanceWorkstation;
    maintenanceActivityType?: MaintenanceActivityType;
    maintenanceFunctionalLocation?: MaintenanceFunctionalLocation;
    maintenanceOrderPlanType?: MaintenanceOrderPlanType;
    maintenancePlannerGroup?: EquipmentPlannerGroup;
    planningPlant?: MaintanencePlanningPlant;
    priority?: string;
    updateDate: string;
  }
  
  export interface MaintenanceOrderPlanType {
    code: string;
    createDate: string;
    description: string;
    maintenancePlanTypeId: number;
    updateDate: string;
  }
  
  interface MaintenanceOrderPlanCycleItemList {
    counter: number;
    createDate: string;
    cycle: number;
    cycleUnit: string;
    description: string;
    maintenanceCycleItemId: number;
    maintenanceCycleText: string;
    offset: number;
    offsetUnit: string;
    updateDate: string;
  }
  
  export interface MaintenanceActivityType {
    code: string;
    createDate: string;
    description: string;
    maintenanceActivityTypeId: number;
    updateDate: string;
  }
  
  export interface EquipmentTask {
    active: boolean;
    createDate: string;
    equipment: Equipment;
    equipmentPlannerGroup: EquipmentPlannerGroup;
    equipmentTaskId: number;
    equipmentTaskType: ActStatus;
    group: string;
    groupCounter: number;
    maintenanceFunctionalLocation: MaintenanceFunctionalLocation;
    maintenanceStrategy: MaintenanceStrategy;
    maintenanceSystemCondition: MaintenanceSystemCondition;
    planningPlant: MaintanencePlanningPlant;
    taskCode: string;
    taskDescription: string;
    updateDate: string;
    workStation: MaintenanceWorkstation;
  }
  
  interface MaintenanceSystemCondition {
    active: boolean;
    code: string;
    createDate: string;
    description: string;
    maintenanceSystemConditionId: number;
    updateDate: string;
  }
  
  interface MaintenanceStrategy {
    active: boolean;
    callHerizon: number;
    createDate: string;
    description: string;
    maintenanceStrategyId: number;
    maintenanceStrategyPackageList: MaintenanceStrategyPackageList[];
    schedulingIndicator: string;
    shiftFactorForEarlyCompletion: number;
    shiftFactorForLateCompletion: number;
    strategyType: string;
    strategyUnit: string;
    toleranceFactorForEarlyCompletion: number;
    toleranceFactorForLateCompletion: number;
    updateDate: string;
  }
  
  interface MaintenanceStrategyPackageList {
    createDate: string;
    cycleLenght: number;
    cycleShortText: string;
    cycleUnit: string;
    hierarchy: number;
    hierarchyText: string;
    maintenanceCycleText: string;
    maintenanceStrategyPackageId: number;
    packageNumber: number;
    updateDate: string;
  }
  
  export interface MaintenanceFunctionalLocation {
    active: boolean;
    createDate: string;
    description: string;
    equipmentABCIndicator: EquipmentABCIndicator;
    equipmentObjectType: EquipmentObjectType;
    equipmentPlannerGroup: EquipmentPlannerGroup;
    generalDate: string;
    invertoryNo: string;
    mainPlant: MaintanencePlanningPlant;
    maintenanceFunctionalLocationId: number;
    manufacturer: Manufacturer;
    manufacturerCountry: ManufacturerCountry;
    manufpartNo: string;
    manufserialNo: string;
    modelNumber: string;
    planningPlant: MaintanencePlanningPlant;
    updateDate: string;
    weight: number;
    weightUnit: string;
    workStation: MaintenanceWorkstation;
  }
  
  export interface Equipment {
    createDate: string;
    description: string;
    equipmentABCIndicator: EquipmentABCIndicator;
    equipmentCategory: EquipmentCategory;
    equipmentId: number;
    equipmentName: string;
    equipmentNo: string;
    equipmentObjectType: EquipmentObjectType;
    equipmentPlannerGroup: EquipmentPlannerGroup;
    equipmentStatus: string;
    maintenanceWorkstation: MaintenanceWorkstation;
    maintenanceWorkstationPlant: MaintanencePlanningPlant;
    manufacturer: Manufacturer;
    manufacturerCountry: ManufacturerCountry;
    manufacturerMonth: string;
    manufacturerPartNo: string;
    manufacturerSerialNo: string;
    manufacturerYear: string;
    modelNumber: string;
    planningPlant: MaintanencePlanningPlant;
    updateDate: string;
    validFrom: string;
    weight: number;
    weightUnit: string;
  }
  
  interface ManufacturerCountry {
    countryId: number;
    countryName: string;
  }
  
  interface Manufacturer {
    accountPosition: string;
    actId: number;
    actName: string;
    actName2: string;
    actNo: string;
    actStatus: ActStatus;
    actTypeName: string;
    address1: string;
    address2: string;
    cityName: string;
    contactName: string;
    countryName: string;
    description: string;
    districtName: string;
    email: string;
    fax: string;
    gsm: string;
    orders: Order[];
    phone: string;
    webSite: string;
  }
  
  interface Order {
    description: string;
    orderNo: string;
  }
  
  interface ActStatus {
    id: number;
  }
  
  export interface MaintenanceWorkstation {
    capacity: number;
    cyclePeriod: number;
    description: string;
    employeeFirstName: string;
    employeeId: number;
    employeeLastName: string;
    kwh: number;
    kwhCost: number;
    mark: string;
    minCapacity: number;
    model: string;
    plant: MaintanencePlanningPlant;
    producer: string;
    productDate: string;
    purchaseDate: string;
    serialNo: string;
    workCenter: WorkCenter;
    workCenterId: number;
    workCenterName: string;
    workStationCategory: WorkStationCategory;
    workStationId: number;
    workStationName: string;
    workStationNo: string;
    workStationStatus: string;
    workStationTypeId: number;
    workStationTypeName: string;
  }
  
  interface WorkStationCategory {
    wsCatCode: string;
    wsCatDescription: string;
    wsCatId: number;
    wsCatName: string;
  }
  
  interface WorkCenter {
    workCenterId: number;
    workCenterName: string;
  }
  
  export interface EquipmentPlannerGroup {
    active: boolean;
    createDate: string;
    definition: string;
    equipmentlist: Equipmentlist[];
    mail: string;
    maintanencePlanningPlant: MaintanencePlanningPlant;
    plannerGroup: string;
    plannerGroupId: number;
    telephone: string;
    updateDate: string;
  }
  
  export interface MaintanencePlanningPlant {
    address: string;
    createdDate: string;
    plantCode: string;
    plantId: number;
    plantName: string;
    postcode: string;
  }
  
  interface EquipmentObjectType {
    createDate: string;
    equipmentObjectType: string;
    equipmentObjectTypeDescription: string;
    equipmentObjectTypeId: number;
    equipmentlist: Equipmentlist[];
    updateDate: string;
  }
  
  interface EquipmentCategory {
    createDate: string;
    equipmentCategory: string;
    equipmentCategoryId: number;
    equipmentCategorydescription: string;
    equipmentlist: Equipmentlist[];
    plannerGroupId: number;
    updateDate: string;
  }
  
  interface EquipmentABCIndicator {
    createDate: string;
    equipmentAbcIndicatorDescription: string;
    equipmentAbcIndicatorId: number;
    equipmentAbcIndicatorType: string;
    equipmentlist: Equipmentlist[];
    updateDate: string;
  }
  
  interface Equipmentlist {
    equipmentId: number;
    equipmentName: string;
    equipmentNo: string;
    equipmentTypeName: string;
  }