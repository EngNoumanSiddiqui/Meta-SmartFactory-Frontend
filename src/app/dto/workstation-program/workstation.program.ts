export interface WorkstationProgramFilterDto {
    code: string,
    createDate: string | Date,
    description: string,
    orderByDirection: string,
    orderByProperty: string,
    pageNumber: number,
    pageSize: number,
    plcCode: string,
    plcValue: number,
    query: string,
    updateDate: string | Date,
    workStationId: number,
    workstationProgramId: number
}