export class RequestmaintenanceStrategyCreateDto
{
    callHerizon:number;
    description:string;
    maintenanceStrategyId:number;
    maintenanceStrategyPackageList:maintenanceStrategyPackageListDto[]=[];
    //any[]=[]//maintenanceStrategyPackageListDto[]=[];
    schedulingIndicator:string;
    plantId: number;
    shiftFactorForEarlyCompletion:number;
    shiftFactorForLateCompletion: number;
    strategyName:string;
    strategyUnit:any;
    toleranceFactorForEarlyCompletion:number;
    toleranceFactorForLateCompletion:number;

}
export class RequestmaintenanceStrategyUpdateDto{
    callHerizon:number;
    description:string;
    maintenanceStrategyId:number;
    maintenanceStrategyPackagelist:any[]=[];//maintenanceStrategyPackageListDto[];
    schedulingIndicator:string;
    shiftFactorForEarlyCompletion:number;
    shiftFactorForLateCompletion: number;
    strategyType:string;
    strategyUnit:any;
    toleranceFactorForEarlyCompletion:number;
    toleranceFactorForLateCompletion:number;
}

export class maintenanceStrategyPackageListDto{
    cycleLenght:number;
    cycleShortText:string;
    cycleUnit:any;
    hierarchy:number;
    plantId: number;
    hierarchyText:string;
    maintenanceCycleText:string;
    maintenanceStrategyId:number;
    maintenanceStrategyPackageId:number;
    offset: number;
    offsetShortText: string;
    packageNumber:number;
}