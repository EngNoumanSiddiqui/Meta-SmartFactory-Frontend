import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { SkillCategoryService } from 'app/services/dto-services/employee/skill-category.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';
import { SubOperationService } from 'app/services/dto-services/operation/sub-operation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
    selector: 'key-value-skill-list',
    templateUrl: 'list.component.html',
    styles: [`
    
  .table-right-side-bordered td{
      border-right: 1px solid #a4b7c1;
      /* border-bottom: 1px solid #a4b7c1; */
  }
  .table-right-side-bordered td:last-child {
    border-right: none;
  }
    `]
})

export class KeyValueSKillListComponent implements OnInit, OnDestroy {
    keyValueSkillList = [];
    SkillMatrixList = [];
    skillMatrixTypeList = [];
    skillMatrixType = 'MURI';

    selectedMaterial=null;

    skillValueMatrixObj = new Array<SkillValueMatrix>();

    saveSkillValueMatrixObj = new Array<SaveSkillValueMatrix>();
    selectedOperation = null;

    skillCategoryPageFilter = {
        pageNumber: 1,
        pageSize: 9999,
        orderByDirection: null,
        orderByProperty: null,
        query: null,
        plantId: null,
        createDate: null,
        groupType: this.skillMatrixType,
        skillMatrixCategoryCode: null,
        skillMatrixCategoryDescription: null,
        skillMatrixCategoryId: null
    };

    subOperationPageFilter = {
        pageNumber: 1,
        pageSize: 9999,
        operationCode: null,
        operationId: null,
        operationName: null,
        orderByDirection: 'desc',
        orderByProperty: 'subOperationId',
        query: null,
        subOperationId: null,
        subOperationName: null,
    };
    skillMatrixFilter = {
        createDate: null,
        orderByDirection: 'desc',
        orderByProperty: 'skillMatrixId',
        pageNumber: 1,
        pageSize: 9999,
        plantId: null,
        query: null,
        skillMatrixCategoryDescription: null,
        skillMatrixCategoryId: null,
        skillMatrixCode: null,
        skillMatrixDescription: null,
        skillMatrixId: null,
        skillMatrixName: null,
    };

    keyValueMatrixFilter = {
        createDate: null,
        employeeId: null,
        employeeIds: null,
        employeeName: null,
        employeeSkillMatrixId: null,
        interest: null,
        note: null,
        operationId: null,
        materialId: null,
        orderByDirection: 'desc',
        orderByProperty: 'employeeSkillMatrixId',
        pageNumber: 1,
        pageSize: 9999,
        proficiency: null,
        query: null,
        skillMatrixCategoryId: null,
        skillMatrixId: null,
        skillMatrixName: null,
        updateDate: null,
    };
    skillCategoryList: any;
    subOperations = [];
    employeeList = [];
    sub: Subscription;
    selectedPlant: any;

    constructor(private employeeSkillSrv : EmployeeSkillService, 
        private _subOperationSvc: SubOperationService,
        private _operationSvc: OperationService,
        private skillCategorySrv: SkillCategoryService,
        private skillMatrixSrv: EmployeeCapabilityService,
        private appStateService:AppStateService,
        private loaderService: LoaderService,
        private empService: EmployeeService,
        private utilities: UtilitiesService,
        private enumService: EnumService) {
            this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                if (res) {
                 this.selectedPlant = res;
                } else {
                  this.selectedPlant = null;
                }
              });
         }

    ngOnInit() {
        this.enumService.getSkillMatrixGroupTypeEnum().then(res => this.skillMatrixTypeList = res || []).catch(err => console.error(err));
        if(this.skillMatrixType) {
            this.filterSkillCategory();
        }
     }
     ngOnDestroy() {
         if(this.sub) {
             this.sub.unsubscribe();
         }
     }

     onSkillTypeSelected(event) {
         this.skillCategoryPageFilter.groupType = this.skillMatrixType;
         this.filterSkillCategory();
     }

     materialSelected(event) {
         if(event) {
            this.selectedMaterial=event;
            this.keyValueMatrixFilter.materialId = this.selectedMaterial?.stockId;
            if(this.selectedOperation) {
                this.filterKeyValueSkill();
            }
            // if(this.selectedOperation) {
            //     this.operationSelected(this.selectedOperation);
            // }
         }
        
     }

     operationSelected(event) {
         if(event) {
             this.selectedOperation = event;
             this.loaderService.showLoader();
             this.subOperationPageFilter.operationId = this.selectedOperation.operationId;
             this._subOperationSvc.filter(this.subOperationPageFilter).then(result => {
                this.subOperations = result['content'];
                if(this.subOperations && this.subOperations.length > 0) {
                    this.keyValueMatrixFilter.operationId = this.selectedOperation.operationId;
                    this.filterKeyValueSkill();
                }
                this.loaderService.hideLoader();
             }).catch(err => {
                this.loaderService.hideLoader();
                 console.error(err);
             });
             
         }
     }

     filterSkillCategory() {
         this.loaderService.showLoader();
         this.skillCategoryPageFilter.plantId = this.selectedPlant?.plantId;
        this.skillCategorySrv.filter(this.skillCategoryPageFilter).then(result => {
            this.skillCategoryList = result['content'];

            const skillmatrixCalls = [];
            this.SkillMatrixList = [];
            this.saveSkillValueMatrixObj = [];
            if (this.skillCategoryList && this.skillCategoryList.length > 0) {
                this.skillCategoryList.forEach(skillcat => {
                    if(skillcat.skillMatrixList) {
                        this.SkillMatrixList = [...skillcat.skillMatrixList, ...this.SkillMatrixList]
                    } else {
                        this.skillMatrixFilter.skillMatrixCategoryId = skillcat.skillMatrixCategoryId;
                        this.skillMatrixFilter.plantId = this.selectedPlant?.plantId;
                        skillmatrixCalls.push(this.skillMatrixSrv.filter({...this.skillMatrixFilter}));
                    }
                });

                if(skillmatrixCalls.length > 0) {
                    forkJoin([...skillmatrixCalls]).subscribe(res => {
                        if(res && res.length > 0) {
                            res.forEach(r => this.SkillMatrixList = [...r['content'], ...this.SkillMatrixList]);
                        }
                        this.loaderService.hideLoader();
                    });
                } else {
                    this.loaderService.hideLoader();
                }
            } else {
                this.loaderService.hideLoader();
            }
            if(this.skillMatrixType !=='EMPLOYEE_GENERAL_SKILL') {
                if(this.selectedOperation) {
                    this.filterKeyValueSkill();
                }
            } else {
                this.filterEmployees();
            }
           
            
         }).catch(err => {
            this.loaderService.hideLoader();
             console.error(err);
         });
     }

     filterEmployees() {
        //  this.selectedOperation = null;
         this.keyValueMatrixFilter.operationId = null;
         this.empService.filter({pageSize: 9999, pageNumber:1, plantId: this.selectedPlant.plantId})
         .then(res => {
             this.employeeList = res['content'];
             this.keyValueMatrixFilter.employeeIds = [];
             this.employeeList.forEach(emp => {
                 this.keyValueMatrixFilter.employeeIds.push(emp.employeeId);
             });
             this.filterKeyValueSkill();
         }).catch(err => console.error(err));
     }

     filterKeyValueSkill() {
        if(this.skillMatrixType !=='EMPLOYEE_GENERAL_SKILL') {
            this.keyValueMatrixFilter.employeeIds = null;
        } else {
            this.keyValueMatrixFilter.operationId = null;
            this.keyValueMatrixFilter.materialId = null;
        }
         this.employeeSkillSrv.filter(this.keyValueMatrixFilter).then(res => {
             this.keyValueSkillList = res['content'];
             this.skillValueMatrixObj = [];
             this.saveSkillValueMatrixObj = [];
             if(this.skillMatrixType !=='EMPLOYEE_GENERAL_SKILL') {
                this.subOperations.forEach(subopr => {
                    this.SkillMatrixList.forEach(matrix => {
                        if(this.keyValueSkillList && this.keyValueSkillList.length > 0) {
                            const keyValue = this.keyValueSkillList.find(ky => ky.subOperation && ky.subOperation.subOperationId === subopr.subOperationId
                                && ky.skillMatrix && ky.skillMatrix.skillMatrixId === matrix.skillMatrixId);
                            if(keyValue) {
                                this.skillValueMatrixObj.push({
                                    employeeId: null,
                                    employeeSkillMatrixId: keyValue.employeeSkillMatrixId,
                                    interest: keyValue.interest,
                                    minProficiency: matrix.minProficiency,
                                    maxProficiency: matrix.maxProficiency,
                                    note: keyValue.note,
                                    proficiency: 0,
                                    materialId: keyValue.stock?.stockId || this.selectedMaterial?.stockId,
                                    skillMatrixId: keyValue.skillMatrix?.skillMatrixId,
                                    subOperationId: keyValue.subOperation?.subOperationId,
                                });
    
                                return 0;
                            }
                            // const keySubOprValue = this.keyValueSkillList.find(ky => ky.subOperation && ky.subOperation.subOperationId === subopr.subOperationId
                            //     && !ky.skillMatrix);
                            // if(keySubOprValue) {
                            //     this.skillValueMatrixObj.push({
                            //         employeeId: null,
                            //         employeeSkillMatrixId: keySubOprValue.employeeSkillMatrixId,
                            //         interest: keySubOprValue.interest,
                            //         note: keySubOprValue.note,
                            //         minProficiency: matrix.minProficiency,
                            //         maxProficiency: matrix.maxProficiency,
                            //         proficiency: 0,
                            //         skillMatrixId: matrix.skillMatrixId,
                            //         subOperationId: keySubOprValue.subOperation?.subOperationId,
                            //     });
    
                            //     return 0;
                            // }
    
                            // const keySkillMtrxValue = this.keyValueSkillList.find(ky => !ky.subOperation && ky.skillMatrix && ky.skillMatrix.skillMatrixId === matrix.skillMatrixId);
                            // if(keySkillMtrxValue) {
                            //     this.skillValueMatrixObj.push({
                            //         employeeId: null,
                            //         employeeSkillMatrixId: keySkillMtrxValue.employeeSkillMatrixId,
                            //         interest: keySkillMtrxValue.interest,
                            //         note: keySkillMtrxValue.note,
                            //         minProficiency: matrix.minProficiency,
                            //         maxProficiency: matrix.maxProficiency,
                            //         proficiency: 0,
                            //         skillMatrixId: keySkillMtrxValue.skillMatrix?.skillMatrixId,
                            //         subOperationId: subopr.subOperationId,
                            //     });
    
                            //     return 0;
                            // }
    
                            this.skillValueMatrixObj.push({
                                employeeId: null,
                                employeeSkillMatrixId: null,
                                interest: null,
                                minProficiency: matrix.minProficiency,
                                maxProficiency: matrix.maxProficiency,
                                note: null,
                                proficiency: 0,
                                materialId: keyValue?.stock?.stockId || this.selectedMaterial?.stockId,
                                skillMatrixId: matrix.skillMatrixId,
                                subOperationId: subopr.subOperationId,
                            });
    
                        } else {
                            this.skillValueMatrixObj.push({
                                employeeId: null,
                                employeeSkillMatrixId: null,
                                interest: null,
                                minProficiency: matrix.minProficiency,
                                maxProficiency: matrix.maxProficiency,
                                note: null,
                                proficiency: 0,
                                materialId: this.selectedMaterial?.stockId,
                                skillMatrixId: matrix.skillMatrixId,
                                subOperationId: subopr.subOperationId,
                            });
                        }
                    });
                 });

                //  this.skillValueMatrixObj = Array.from(new Set(this.skillValueMatrixObj.map(a => a.employeeSkillMatrixId)))
                //  .map(id => {
                //    return this.skillValueMatrixObj.find(a => a.skillMatrixId === id || null);
                //  })

                 console.table(this.skillValueMatrixObj);
            } else {
                this.employeeList.forEach(employee => {
                    this.SkillMatrixList.forEach(matrix => {
                        if(this.keyValueSkillList && this.keyValueSkillList.length > 0) {
                            const keyValue = this.keyValueSkillList.find(ky => ky.employee && ky.employee.employeeId === employee.employeeId
                                && ky.skillMatrix && ky.skillMatrix.skillMatrixId === matrix.skillMatrixId);
                            if(keyValue) {
                                this.skillValueMatrixObj.push({
                                    employeeId: keyValue.employee?.employeeId,
                                    employeeSkillMatrixId: keyValue.employeeSkillMatrixId,
                                    interest: keyValue.interest,
                                    minProficiency: matrix.minProficiency,
                                    maxProficiency: matrix.maxProficiency,
                                    note: keyValue.note,
                                    proficiency: 0,
                                    materialId: null,
                                    skillMatrixId: keyValue.skillMatrix?.skillMatrixId,
                                    subOperationId: null,
                                });
    
                                return 0;
                            }
                            // const keySubOprValue = this.keyValueSkillList.find(ky => ky.employee && ky.employee.employeeId === employee.employeeId
                            //     && !ky.skillMatrix);
                            // if(keySubOprValue) {
                            //     this.skillValueMatrixObj.push({
                            //         employeeId: keySubOprValue.employee?.employeeId,
                            //         employeeSkillMatrixId: keySubOprValue.employeeSkillMatrixId,
                            //         interest: keySubOprValue.interest,
                            //         note: keySubOprValue.note,
                            //         minProficiency: matrix.minProficiency,
                            //         maxProficiency: matrix.maxProficiency,
                            //         proficiency: 0,
                            //         skillMatrixId: null,
                            //         subOperationId: null,
                            //     });
    
                            //     return 0;
                            // }
    
                            // const keySkillMtrxValue = this.keyValueSkillList.find(ky => !ky.employee && ky.skillMatrix && ky.skillMatrix.skillMatrixId === matrix.skillMatrixId);
                            // if(keySkillMtrxValue) {
                            //     this.skillValueMatrixObj.push({
                            //         employeeId: employee.employeeId,
                            //         employeeSkillMatrixId: keySkillMtrxValue.employeeSkillMatrixId,
                            //         interest: keySkillMtrxValue.interest,
                            //         note: keySkillMtrxValue.note,
                            //         minProficiency: matrix.minProficiency,
                            //         maxProficiency: matrix.maxProficiency,
                            //         proficiency: 0,
                            //         skillMatrixId: keySkillMtrxValue.skillMatrix?.skillMatrixId,
                            //         subOperationId: null,
                            //     });
    
                            //     return 0;
                            // }
    
                            this.skillValueMatrixObj.push({
                                employeeId: employee.employeeId,
                                employeeSkillMatrixId: null,
                                interest: null,
                                minProficiency: matrix.minProficiency,
                                maxProficiency: matrix.maxProficiency,
                                note: null,
                                proficiency: 0,
                                materialId: null,
                                skillMatrixId: matrix.skillMatrixId,
                                subOperationId: null,
                            });
    
                        } else {
                            this.skillValueMatrixObj.push({
                                employeeId: employee.employeeId,
                                employeeSkillMatrixId: null,
                                interest: null,
                                minProficiency: matrix.minProficiency,
                                maxProficiency: matrix.maxProficiency,
                                note: null,
                                proficiency: 0,
                                materialId: null,
                                skillMatrixId: matrix.skillMatrixId,
                                subOperationId: null,
                            });
                        }
                    });
                 });
            }
            
            



         });
     }

     lengthSize = (length) => {
         return Math.round(60 / length);
     }
     

     childLengthSize = (parentlength, childLength) => {
        return Math.round(parentlength / childLength);
    }

    calcuateGrandTotal(){
        var total = 0;
        this.subOperations.forEach(element => {
            total = total + this.getTotal(element.subOperationId)
        });

        return total;
    }

    getTotalByCategory = (skillMatrixCategoryId) => {
        let total = 0;
        const cat = this.skillCategoryList.find(ct => ct.skillMatrixCategoryId == skillMatrixCategoryId);
        if(cat) {
            this.subOperations.forEach(sub => {
                cat.skillMatrixList.forEach(skm => {
                    const obj = this.skillValueMatrixObj.find(skil => skil.subOperationId == sub.subOperationId && skil.skillMatrixId == skm.skillMatrixId);
                    if(obj) {
                        total = total + obj.interest;
                    }
                });
            });  
        }
        return total;
    }

    getTotalPercentageByCategory = (skillMatrixCategoryId) => {
        let total: any = 0;
        const cat = this.skillCategoryList.find(ct => ct.skillMatrixCategoryId == skillMatrixCategoryId);
        if(cat) {
            this.subOperations.forEach(sub => {
                cat.skillMatrixList.forEach(skm => {
                    const obj = this.skillValueMatrixObj.find(skil => skil.subOperationId == sub.subOperationId && skil.skillMatrixId == skm.skillMatrixId);
                    if(obj) {
                        total = total + obj.interest;
                    }
                });
            });  
        }
        if(total > 0) {
            let totalValue = 0;
            this.skillValueMatrixObj.forEach(itm => {
                 totalValue = totalValue + itm.interest
            });
            total = ((total/totalValue) * 100).toFixed(2);
        }
        return total;
    }


     getValueSKill = (skillMatrixId, subOperationId) => {
         return this.skillValueMatrixObj.filter(value => skillMatrixId === value.skillMatrixId
            && subOperationId === value.subOperationId
            ) || [];
     }

     getEmpValueSKill = (skillMatrixId, employeeId) => {
        return this.skillValueMatrixObj.filter(value => skillMatrixId === value.skillMatrixId
           && employeeId === value.employeeId
           ) || [];
    }

     getTotal = (subOperationId) => {
        var total = 0;
        this.skillValueMatrixObj.filter(value => subOperationId === value.subOperationId).forEach(itm => {
            total = total + itm.interest;
        })
        return total;
     }
     getAllTotal = () => {
        var total = 0;
        this.skillValueMatrixObj.forEach(itm => {
            total = total + itm.interest;
        })
        return total;
     }
     getTotalEmp = (employeeId) => {
        var total = 0;
        this.skillValueMatrixObj.filter(value => employeeId === value.employeeId).forEach(itm => {
            total = total + itm.interest;
        })
        return total;
     }

     onInterestValueChanged(event, skillMatrixId, subOperationId) {
         const skillMatrix = this.skillValueMatrixObj.find(value => skillMatrixId === value.skillMatrixId && subOperationId === value.subOperationId);
         if(this.saveSkillValueMatrixObj.length === 0) {
             this.saveSkillValueMatrixObj.push({
                employeeId: null,
                employeeSkillMatrixId: skillMatrix.employeeSkillMatrixId,
                interest: skillMatrix.interest,
                note: skillMatrix.note,
                proficiency: 0,
                materialId: skillMatrix.materialId || this.selectedMaterial?.stockId,
                skillMatrixId: skillMatrix.skillMatrixId,
                subOperationId: skillMatrix.subOperationId,
             });
         } else {
             const saveSKillMatrix = this.saveSkillValueMatrixObj.find(value => skillMatrixId === value.skillMatrixId && subOperationId === value.subOperationId);
             if(saveSKillMatrix) {
                 saveSKillMatrix.interest = skillMatrix.interest;
                 saveSKillMatrix.skillMatrixId = skillMatrix.skillMatrixId;
                 saveSKillMatrix.subOperationId = skillMatrix.subOperationId;
                 saveSKillMatrix.materialId = skillMatrix.materialId || this.selectedMaterial?.stockId;
             } else {

                this.saveSkillValueMatrixObj.push({
                    employeeId: null,
                    employeeSkillMatrixId: skillMatrix.employeeSkillMatrixId,
                    interest: skillMatrix.interest,
                    note: skillMatrix.note,
                    proficiency: 0,
                    materialId: skillMatrix.materialId || this.selectedMaterial?.stockId,
                    skillMatrixId: skillMatrix.skillMatrixId,
                    subOperationId: skillMatrix.subOperationId,
                 })
             }
         }
         this.saveSkillValueMatrixObj = this.saveSkillValueMatrixObj.filter(itm => itm.interest !== null);

         console.table(this.saveSkillValueMatrixObj);
     }
    //  setSelectMaterial(event) {
    //      if(event) {
    //          this.selectedMaterial = event;
    //          this.skillValueMatrixObj.forEach(sk => {
    //              sk.materialId = this.selectedMaterial?.stockId;
    //          });

    //          console.table(this.skillValueMatrixObj);
    //      }
    //  }
     onInterestEmpValueChanged(event, skillMatrixId, employeeId) {
        const skillMatrix = this.skillValueMatrixObj.find(value => skillMatrixId === value.skillMatrixId && employeeId === value.employeeId);
        if(this.saveSkillValueMatrixObj.length === 0) {
            this.saveSkillValueMatrixObj.push({
               employeeId: skillMatrix.employeeId,
               employeeSkillMatrixId: skillMatrix.employeeSkillMatrixId,
               interest: skillMatrix.interest,
               note: skillMatrix.note,
               proficiency: 0,
               materialId: skillMatrix.materialId,
               skillMatrixId: skillMatrix.skillMatrixId,
               subOperationId: skillMatrix.subOperationId,
            });
        } else {
            const saveSKillMatrix = this.saveSkillValueMatrixObj.find(value => skillMatrixId === value.skillMatrixId && employeeId === value.employeeId);
            if(saveSKillMatrix) {
                saveSKillMatrix.interest = skillMatrix.interest;
                saveSKillMatrix.skillMatrixId = skillMatrix.skillMatrixId;
                saveSKillMatrix.subOperationId = skillMatrix.subOperationId;
            } else {

               this.saveSkillValueMatrixObj.push({
                   employeeId: skillMatrix.employeeId,
                   employeeSkillMatrixId: skillMatrix.employeeSkillMatrixId,
                   interest: skillMatrix.interest,
                   note: skillMatrix.note,
                   proficiency: 0,
                   materialId: skillMatrix.materialId,
                   skillMatrixId: skillMatrix.skillMatrixId,
                   subOperationId: skillMatrix.subOperationId,
                })
            }
        }
        this.saveSkillValueMatrixObj = this.saveSkillValueMatrixObj.filter(itm => itm.interest !== null);
    }

     SaveChanges() {
         console.table(this.saveSkillValueMatrixObj);
         if(this.saveSkillValueMatrixObj.length > 0) {
             this.loaderService.showLoader();
             this.employeeSkillSrv.saveAll(this.saveSkillValueMatrixObj).then(res => {
                 this.loaderService.hideLoader();
                this.filterKeyValueSkill();
                 this.utilities.showSuccessToast('saved-success');
             }).catch(err => {
                 this.loaderService.hideLoader();
                 this.utilities.showErrorToast(err)
             });

             if(this.skillMatrixType ==='MURI') {
                 let subOperationCalls = [];
                 this.subOperations.forEach(suboperation => {
                    let max = 0;
                    if(this.getTotal(suboperation.subOperationId) > max) {
                        max = this.getTotal(suboperation.subOperationId);
                    }

                    if(max > 0) {
                        subOperationCalls.push(
                            this._subOperationSvc.updateSubOperationTotalSkillValue({
                                "active": suboperation.active,
                                "createDate": suboperation.createDate,
                                "operationCode": this.selectedOperation.operationNo,
                                "operationId": this.selectedOperation.operationId,
                                "subOperationId": suboperation.subOperationId,
                                "subOperationName": suboperation.subOperationName,
                                "totalSkillValue": max,
                                "updateDate": suboperation.updateDate
                            })
                        );
                    }

                 });

                 if(subOperationCalls.length > 0 ) {
                     forkJoin([... subOperationCalls]).subscribe(res => {
                         this.utilities.showSuccessToast('sub-operations-saved-success');
                     }, (err => {
                        this.utilities.showErrorToast(err);
                        }
                    ));
                 }


                let maxValue = 0;	                 
                this.subOperations.forEach(suboperation => {	                 
                    if(this.getTotal(suboperation.subOperationId) > maxValue) {	             
                        maxValue = this.getTotal(suboperation.subOperationId);	                  
                    }	                    
                });
                if(maxValue !== 0 && this.selectedOperation) {	                    
                    this._operationSvc.getDetail(this.selectedOperation.operationId).then(res => {
                        this.selectedOperation = res;	
                        this.selectedOperation.totalSkillValue = maxValue;	                
                        if(this.selectedOperation.operationType) {	                    
                            this.selectedOperation.operationTypeId = this.selectedOperation.operationType.operationTypeId;
                        }	                     
                        if(this.selectedOperation.plant) {	                        
                            this.selectedOperation.plantId = this.selectedOperation.plant.plantId;	
                        }	                        
                        if(this.selectedOperation.subOperationList) {	            
                            delete this.selectedOperation.subOperationList;	
                        }	
                        if (this.selectedOperation.workStationIdList) {	
                            this.selectedOperation.workStationIdList = this.selectedOperation.workStationIdList.map(wrk => wrk.workStationId);	
                        }	
                        this._operationSvc.update(this.selectedOperation).then(res => {	
                            this.utilities.showSuccessToast('operation-updated-success');
                        }).catch(err => console.error(err))	
                    }).catch(err => console.error(err));
                }
             }
         }
     }
}



class SkillValueMatrix {
    employeeId: number;
    employeeSkillMatrixId: number;
    interest: number;
    materialId: number;
    note: string;
    proficiency: number;
    minProficiency: number;
    maxProficiency: number;
    skillMatrixId: number;
    subOperationId: number;
    // subOperationId: number;
    // subOperation: any;
    // interest: number;
    // employeeSkillMatrixId: number;
    // skillMatrixId: number;
    // employeeId: number;
    // employee: any;
}
class SaveSkillValueMatrix {
    employeeId: number;
    employeeSkillMatrixId: number;
    materialId: number;
    interest: number;
    note: string;
    proficiency: number;
    skillMatrixId: number;
    subOperationId: number;
}