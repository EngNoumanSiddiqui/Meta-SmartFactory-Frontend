export interface ProductTreeDetailQualityPlanFilterDto {
    createDate: string,
    fromLotSize: number,
    groupCounter: number,
    keyDate: string,
    orderByDirection: string,
    orderByProperty: string,
    pageNumber: number,
    pageSize: number,
    plannerGroup: string,
    plantId: number,
    productTreeDetailId: number,
    productTreeDetailQualityPlanCode: string,
    productTreeDetailQualityPlanId: number,
    qualityGroup: number,
    qualityPlanStatus: string,
    qualityUsageId: number,
    query: string,
    stockId: number,
    toLotSize: number,
    updateDate: number
}

export interface ProductTreeDetailQualityPlanCreateDto {
    createDate: string,
    fromLotSize: number,
    groupCounter: number,
    keyDate: string,
    plannerGroup: string,
    plantId: number,
    productTreeDetailId: number,
    productTreeDetailQualityPlanCode: string,
    productTreeDetailQualityPlanId: number,
    qualityGroup: number,
    qualityPlanStatus: string,
    qualityUsageId: number,
    stockId: number,
    toLotSize: number,
    updateDate: string,
    workCenterId: number
}

export interface ProductTreeDetailQualityPlanOperationFilterDto {
    description: string,
    orderByDirection: string,
    orderByProperty: string,
    pageNumber: number,
    pageSize: number,
    productTreeDetailQualityPlanOperationCode: string,
    productTreeDetailQualityPlanOperationId: number,
    qualityControlKeyId: number,
    qualityInspectionOperationId: number,
    qualityPlanId: number,
    query: string,
    workCenterId: number
}

export interface ProductTreeDetailQualityPlanOperationCreateDto {
    createDate: string,
    description: string,
    productTreeDetailQualityPlanOperationCode: string,
    productTreeDetailQualityPlanOperationId: number,
    qualityControlKeyId: number,
    qualityInspectionOperationId: number,
    qualityPlanId: number,
    updateDate: string,
    workCenterId: number
}

export interface ProductTreeDetailQualityPlanCharacFilterDto {
    createDate: string,
    inspectionCharacteristicId: number,
    lowerSpecific: number,
    orderByDirection: string,
    orderByProperty: string,
    pageNumber: number,
    pageSize: number,
    productTreeDetailQualityPlanCharacOperationCode: string,
    productTreeDetailQualityPlanCharacOperationId: number,
    qualityInspectionCharacteristicId: number,
    qualityInspectionMethodId: number,
    qualityInspectionOperationId: number,
    qualityPlanOperationId: number,
    qualitySamplingProcedureId: number,
    query: string,
    updateDate: string,
    upperLimit: number
}

export interface ProductTreeDetailQualityPlanCharacCreateDto {
    createDate: string,
    lowerSpecific: number,
    productTreeDetailQualityPlanCharacOperationCode: string,
    productTreeDetailQualityPlanCharacOperationId: number,
    qualityInspectionCharacteristicId: number,
    qualityInspectionMethodId: number,
    qualityPlanOperationId: number,
    qualitySamplingProcedureId: number,
    updateDate: string,
    upperLimit: number
}