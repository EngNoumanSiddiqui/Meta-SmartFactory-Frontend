import {Component, Input, OnInit} from '@angular/core';
import { DashboardService } from 'app/services/dto-services/dashboard/dashboard.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'app-material-rework-list',
  templateUrl: './material-rework-list.component.html',
  styleUrls: ['./material-rework-list.component.scss']
})
export class MaterialReworkListComponent implements OnInit {

  scrapMaterialList = [
    // {materialNo: 1, materialName: 'Material 1', scrapCount: 140, goodCount: 290, scrapPercentage: '22.5%'},
    // {materialNo: 2, materialName: 'Material 2', scrapCount: 11, goodCount: 140, scrapPercentage: '21.5%'},
    // {materialNo: 3, materialName: 'Material 3', scrapCount: 60, goodCount: 140, scrapPercentage: '12.5%'},
  ];
  cols = [
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material-name'},
    {field: 'scrapCount', header: 'rework-count'},
    {field: 'goodCount', header: 'good-count'},
    {field: 'percentage', header: 'scrap-percentage'},
  ];

  @Input('filterModel') set f(filterModel) {
    if (filterModel && filterModel.startDate && filterModel.finishDate) {
      this.loadMaterialScrapList(filterModel);
    }

  }

  constructor(private dashboardService: DashboardService, private utilities: UtilitiesService) {
  }

  ngOnInit() {
  }

  loadMaterialScrapList(filterModel) {
    this.dashboardService.getMaterialWithReworkPercentageList(filterModel).then(res => {
      this.initTable(res);
    }).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }

  initTable(data) {
    this.scrapMaterialList = data;
    if (this.scrapMaterialList && this.scrapMaterialList.length > 0) {
      this.scrapMaterialList.forEach(itm => {
        itm.percentage = this.getPercentageVal(itm.percentage);
      });
    }
  }
  getPercentageVal(val) {
    if (val) {
      return (val * 100).toFixed();
    }
    return 0;
  }


}
