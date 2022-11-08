import { ConvertUtil } from './../../../../util/convert-util';
import { EmployeeTitleService } from './../../../../services/dto-services/employee-title/employee-title.service';
import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      setTimeout(() => {
        this.initialize(this.id);
      }, 1000);
    }
  };

  workcenters: any[];
  detailResult: any;
  id;


  cols = [
    {field: 'employeeTitleName', header: 'title'},
    {field: 'employeeTitleId', header: 'employee-title-id'},
    {field: 'employeeTitleCode', header: 'employee-title-code'},
    {field: 'panelMaster', header: 'panel-master'},
    {field: 'stopMaster', header: 'stop-master'},
    {field: 'scrapMaster', header: 'scrap-master'},
    {field: 'setupMaster', header: 'setup-master'},
    {field: 'reworkMaster', header: 'rework-master'},
    {field: 'maintenanceMaster', header: 'maintenance-master'},
    {field: 'employeeTitleParentId', header: 'employee-title-parent-id'},
  ];


  treeData;

  fakeData = [
    {
      
      'employeeTitleId': 11,
      'employeeTitleName': 'Senior Operator',
      'employeeTitleParentId': null,
      'employeeTitleCode': '01099',
      'employeeTitleDescription': 'operator description.',
      'createDate': 1574705357000,
      'updateDate': 1574706089000,
      innerList: [
        {
          'employeeTitleId': 13,
                      'employeeTitleName': 'Mid Senior',
                      'employeeTitleParentId': 11,
                      'employeeTitleCode': '101020',
                      'employeeTitleDescription': 'demo',
                      'createDate': 1574792569000,
                      'updateDate': 1574792569000,
                      'childList': null,
                      
          
          innerList: [
            {
              'employeeTitleId': 2,
              'employeeTitleName': 'operator',
              'employeeTitleParentId': null,
              'employeeTitleCode': '900100',
              'employeeTitleDescription': 'updated',
              'createDate': null,
              'updateDate': 1574706109000,
              'childList': null,
              innerList: []
            }
          ]
        },
        
      ]
    }
  ];

  fakeDatas = [
    {
      
      
      'content': [
          
          {
              'employeeTitleId': 11,
              'employeeTitleName': 'Senior Operator',
              'employeeTitleParentId': null,
              'employeeTitleCode': '01099',
              'employeeTitleDescription': 'operator description.',
              'createDate': 1574705357000,
              'updateDate': 1574706089000,
              'childList': [
                  {
                      'employeeTitleId': 13,
                      'employeeTitleName': 'Mid Senior',
                      'employeeTitleParentId': 11,
                      'employeeTitleCode': '101020',
                      'employeeTitleDescription': 'demo',
                      'createDate': 1574792569000,
                      'updateDate': 1574792569000,
                      'childList': null

                  }
              ]
          },
          {
              'employeeTitleId': 2,
              'employeeTitleName': 'operator',
              'employeeTitleParentId': null,
              'employeeTitleCode': '900100',
              'employeeTitleDescription': 'updated',
              'createDate': null,
              'updateDate': 1574706109000,
              'childList': null

          },
          {
              'employeeTitleId': 3,
              'employeeTitleName': 'manager',
              'employeeTitleParentId': null,
              'employeeTitleCode': null,
              'employeeTitleDescription': null,
              'createDate': null,
              'updateDate': null,
              'childList': null
          },
          {
              'employeeTitleId': 4,
              'employeeTitleName': 'SALES',
              'employeeTitleParentId': null,
              'employeeTitleCode': null,
              'employeeTitleDescription': null,
              'createDate': null,
              'updateDate': null,
              'childList': null
          },
          {
              'employeeTitleId': 5,
              'employeeTitleName': 'ENGINEERING',
              'employeeTitleParentId': null,
              'employeeTitleCode': null,
              'employeeTitleDescription': null,
              'createDate': null,
              'updateDate': null,
              'childList': null
          },
          {
              'employeeTitleId': 6,
              'employeeTitleName': 'OTHERS',
              'employeeTitleParentId': null,
              'employeeTitleCode': null,
              'employeeTitleDescription': null,
              'createDate': null,
              'updateDate': null,
              'childList': null
          }
      ]
  }
  ]

  
  initialize(id) {
  this.employeeTitleService.getEmployeeById(id).then((res: any) => {
    this.detailResult = res;
  });  
  }

  constructor(private employeeTitleService: EmployeeTitleService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {
  }

  
  ngOnInit() {

    this.treeData = this.detailList2Node(this.fakeData);

    // this.treeData=this.detailList2Node(this.detailResult);
  }


  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time)
  }

  detail2Node(detail) {
    const me = this;
    let node = null;

    if (detail) {

      node = {
        data: Object.assign({}, detail, {innerList: null}),
        children: detail.innerList ? me.detailList2Node(detail.innerList) : [],
        key: ConvertUtil.getSimpleUId(),
        // expanded: !!detail.expanded
      };
      return node;
    }
    return node;

  }

  detailList2Node(detailList) {
    const me = this;
    const list = [];

    if (detailList) {

      detailList.forEach((item) => {
        const treeNode = me.detail2Node(item);
        list.push(treeNode);
      });

    }
    return list;
  }

  

}
