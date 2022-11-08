import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {environment} from 'environments/environment';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {EmployeeSkillService} from 'app/services/dto-services/employee/employee-skills.service';
import {ResponseEmployeeSkillMatrixDashboardDto} from '../../../../dto/employee/employee.model';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;
  capabilities: any;

  @Input('selectedEmployees') set z(selectedEmployees) {

    this.intialize(selectedEmployees);

  }

  selectedCatList = [];
  allCatList;
  selectedIds = [];
  selectedEmp = [];
  showedEmployees = [];
  pageFilter =
    {
      employeeIds: [],
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      createDate: null,
      employeeId: null,
      employeeName: null,
      employeeSkillMatrixId: null,
      interest: null,
      note: null,
      proficiency: null,
      skillMatrixId: null,
      skillMatrixName: null,
      updateDate: null,
      orderByDirection: null,
      orderByProperty: null,
      query: null,
      skillMatrixCategoryId: null
    };
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };

  chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        data: [65, 59, 80, 81, 56, 55, 40]
      }

    ]
  };

  datas: ResponseEmployeeSkillMatrixDashboardDto[] = [];
  allDatas: ResponseEmployeeSkillMatrixDashboardDto[] = [];

  // fakeData = [
  //   {
  //     employee: {firstName: 'ali', employeeTitleName: 'Dr', lastName: 'soyad'},
  //     skillList: [
  //       {
  //         proficiency: 14, interest: 10, employeeSkillMatrixId: 54, skillMatrix: {
  //           skillMatrixName: 'Capability1', skillMatrixCategory: {
  //             skillMatrixCategoryCode: 'Cat1',
  //             skillMatrixCategoryDescription: 'Cat1'
  //           }
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     employee: {firstName: 'Veli', employeeTitleName: 'Müh', lastName: 'askdsa'},
  //     skillList: [
  //       {
  //         proficiency: 14, interest: 10, employeeSkillMatrixId: 54, skillMatrix: {
  //           skillMatrixName: 'Capability2', skillMatrixCategory: {
  //             skillMatrixCategoryCode: 'Cat2',
  //             skillMatrixCategoryDescription: 'Cat2'
  //           }
  //         }
  //       }
  //     ]
  //   }
  // ];

  getFieldVal(category, capability, rowData, field) {

    const find = rowData.skillList.find(item => item.skillMatrix.skillMatrixName === capability
      && item.skillMatrix.skillMatrixCategory.skillMatrixCategoryDescription === category);

    return find ? find[field] : '-';


  }

  getCategoryList(data: ResponseEmployeeSkillMatrixDashboardDto[]) {
    const catList = [];

    data.forEach((item: ResponseEmployeeSkillMatrixDashboardDto) => {
      item.skillList.forEach(skill => {

        const catName = skill.skillMatrix.skillMatrixCategory.skillMatrixCategoryDescription;
        const catId = skill.skillMatrix.skillMatrixCategory.skillMatrixCategoryId;
        let findCat = catList.find(x => x.category === catName);
        if (!findCat) {
          findCat = {
            category: catName,
            categoryId: catId,
            capabilities: [skill.skillMatrix.skillMatrixName]
          };
          catList.push(findCat);
        } else {
          if (findCat.capabilities.indexOf(skill.skillMatrix.skillMatrixName) === -1) {
            findCat.capabilities.push(skill.skillMatrix.skillMatrixName);
          }
        }
      })
    });
    return catList;
  }


  constructor(private _capabilitySrv: EmployeeSkillService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    // this.filterCategory();

  }

  // setSelectedCategory(category) {
  //   if (category) {
  //     this.pageFilter.skillMatrixCategoryId = category.skillMatrixCategoryId;
  //   } else {
  //     this.pageFilter.skillMatrixCategoryId = null;
  //   }
  //
  // }

  // filterCategory() {
  //   const data = {
  //     'category': null,
  //     'categoryCode': null,
  //     'orderByDirection': null,
  //     'orderByProperty': null,
  //     'pageNumber': 1,
  //     'pageSize': 9999,
  //     'query': null
  //   };
  //
  //   this._capabilitySrv.filterCategory(data)
  //     .then(result => {
  //       this.categories = result['content'];
  //     }).catch(error => {
  //     this.utilities.showErrorToast(error)
  //   });
  // }

  intialize(selectedEmp) {
    this.selectedEmp = selectedEmp;
    this.showedEmployees = [...selectedEmp];
    this.selectedIds = selectedEmp.map(item => {
      return item.employeeId;
    });

    this.pageFilter.employeeIds = this.selectedIds;
    this.filter(this.pageFilter);
  }

  showOnlyEmployees() {
    this.datas = this.allDatas.filter(item => !!this.showedEmployees.find(x => x.employeeId === item.employee.employeeId));
  }

  // showOnlyCatList() {
  //   this.selectedCatList = this.allCatList.filter(item=>t);
  // }

  filter(data) {
    this.loaderService.showLoader();
    this._capabilitySrv.filterCompare(data)
      .then(result => {
        this.loaderService.hideLoader();
        this.initTableData(result['content']);
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
      }).catch(error => {
      this.initTableData([]);
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  initTableData(datas) {

    if (datas) {
      this.allDatas = datas as ResponseEmployeeSkillMatrixDashboardDto[];
      this.datas = datas as ResponseEmployeeSkillMatrixDashboardDto[];
      this.allCatList = this.getCategoryList(datas);
      this.selectedCatList = [...this.allCatList];
    } else {
      this.allDatas = null;
      this.datas = null;
      this.allCatList = null;
      this.selectedCatList = null;
    }
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;
    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;
    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 500);
  }
}
