export interface ResponseEmployeeSkillMatrixDashboardDto {
  employee: ResponseEmployeeDetailDto;
  skillList: ResponseEmployeeSkillMatrixDto[];


}

export interface ResponseEmployeeSkillMatrixDto {
  proficiency: number;
  interest: number;
  employeeSkillMatrixId: number;
  skillMatrix: ResponseSkillMatrixDto;

}

export interface ResponseSkillMatrixDto {
  skillMatrixName: string;
  skillMatrixCategory: ResponseSkillMatrixCategoryDto;
}


export interface ResponseEmployeeDetailDto {
  employeeId: number;
  firstName: string;
  employeeTitleName: string;
  lastName: string;
}

export interface ResponseSkillMatrixCategoryDto {
  skillMatrixCategoryCode: string;
  skillMatrixCategoryId: string;
  skillMatrixCategoryDescription: string;
}

export interface EmployeeDto {
  employeeId: number,
  address1: string,
  address2: string,
  birthDate: string,
  bloodGroup: string,
  cityId: number,
  countryId: number,
  description: string,
  districtId: number,
  email: string,
  employeeGroupId: number,
  employeeNo: string,
  employeePermissionDtoList: EmployeePermissionDtoList [],
  employeeRoleDtoList: EmployeeRoleDtoList[],
  employeeTitleId: number,
  firstName: string,
  gender: string,
  gsm: string,
  identity: string,
  jobEntryDate: string | Date,
  lastName: string,
  mediaId: number,
  password?: string,
  phone: string,
  plantId: number,
  rfid: string,
  departmentId: number,
  jobExitDate: string
}

export interface EmployeePermissionDtoList {
  isActive: boolean,
  isExternal: boolean,
  isInternal: boolean,
  name: string,
  permissionId: number
}

export interface EmployeeRoleDtoList{
    defaultRoleName: string,
    isActive: boolean,
    roleId: number
}
