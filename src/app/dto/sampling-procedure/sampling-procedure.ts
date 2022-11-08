
export class SamplingProcedureListItem {
    acceptance: number;
    createDate: Date;
    sampleSize: number;
    samplingProcedureCode: string;
    samplingProcedureId: number;
    samplingProcedureInspectionPointId: number;
    samplingProcedureName: string;
    plantId: number;
    samplingProcedureValuationModeId: number;
    samplingProcedureValuationModeName: number;
    samplingTypeId: number;
    samplingTypeName: number;
    updateDate: Date;
    constructor() {
        this.acceptance = null ;
        this.createDate = null ;
        this.sampleSize = null ;
        this.samplingProcedureCode = null ;
        this.samplingProcedureId = null ;
        this.samplingProcedureInspectionPointId = null ;
        this.samplingProcedureName = null ;
        this.samplingProcedureValuationModeId = null ;
        this.samplingTypeId = null ;
        this.updateDate = null ;
    }
}

export class SamplingProcedureInspectionPoint {
    createDate: Date;
    samplingProcedureList: SamplingProcedureListItem[];
    samplingProcedurePointCode: string;
    samplingProcedurePointId: number;
    samplingProcedurePointText: string;
    plantId: number;
    updateDate: Date;
    constructor() {
        this.createDate = null;
        this.samplingProcedureList = [];
        this.samplingProcedurePointCode = null;
        this.samplingProcedurePointId = null;
        this.samplingProcedurePointText = null;
        this.updateDate = null;
    }
}
