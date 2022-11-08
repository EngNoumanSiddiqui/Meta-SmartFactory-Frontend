import {Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {ConfirmationService, Table, TreeTable} from 'primeng';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { PreferenceService } from 'app/services/dto-services/general-setting-services/preferences.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription, Subject } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { GeneralSettingItemService } from 'app/services/dto-services/general-setting-services/general-setting-item.service';
import { GeneralSettingItemValueService } from 'app/services/dto-services/general-setting-services/general-setting-item-value.service';
@Component({
  selector: 'preferences-list',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list.component.html'
})
export class PreferancesListComponent implements OnInit, OnDestroy {
  @ViewChild('myModal', {static: false}) public myModal: ModalDirective;
  @ViewChild('dt', {static: false}) public treeTable: TreeTable;

  @ViewChild('dttwo', {static: false}) public dtTableTwo: Table;
  countryModal = {
    modal: null,
    data: null,
    id: null
  };
  selectedColumns = [
    {field: 'generalSettingCategoryName', header: 'category-name'},
    {field: 'generalSettingCategoryType', header: 'category-type'},
    // {field: 'generalSettingCategoryMultiple', header: 'category-multiple'},
    // {field: 'generalSettingCategoriyCode', header: 'category-code'},
    {field: 'generalSettingCategoryDescription', header: 'category-description'},
    // {field: 'generalSettingCategoryId', header: 'category-id'},
    // {field: 'generalSettingCategoryName', header: 'category-name'},
    // {field: 'generalSettingItemList', header: 'item-list'},
    // {field: 'parent', header: 'parent'},
    // {field: 'plant', header: 'plant'},
    // {field: 'createDate', header: 'create-date'},
    // {field: 'updateDate', header: 'update-date'},
  ];
  cols = [
    {field: 'generalSettingCategoryId', header: 'category-id'},
    {field: 'generalSettingCategoriyCode', header: 'category-code'},
    {field: 'generalSettingCategoryDescription', header: 'category-description'},
    {field: 'generalSettingCategoryMultiple', header: 'category-multiple'},
    {field: 'generalSettingCategoryName', header: 'category-name'},
    {field: 'generalSettingCategoryType', header: 'category-type'},
    // {field: 'generalSettingItemList', header: 'item-list'},
    {field: 'parent', header: 'parent'},
    {field: 'plant', header: 'plant'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'},
  ];
  preferences: any = [];
  generalSettingItemExpandedRows: any = {};
  selectedpreferences: [];
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

  pageFilter =
    {
      generalSettingCategoriyCode: null,
      generalSettingCategoryDescription: null,
      generalSettingCategoryId: null,
      generalSettingCategoryMultiple: null,
      generalSettingCategoryName: null,
      generalSettingCategoryType: null,
      parentId: null,
      plantId: null,
      plantName: null,
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      orderByDirection: 'asc',
      orderByProperty: 'generalSettingCategoryId',
      query: null
    };
  sub: Subscription;

  childCols = [
    { header : 'general-setting-value-type-enum', field : 'generalSettingValueTypeEnum' },
    { header : 'general-setting-item-key', field : 'generalSettingItemKey' },
    // { header : 'general-setting-item-id', field : 'generalSettingItemId' },
    // { header : 'general-setting-value', field : 'generalSettingValue' },
    // { header : 'general-setting-item-value-object-type', field : 'generalSettingITemValueObjectType' },
    {header: 'general-setting-item-value', field: 'generalSettingItemValueList'}
  ];
  generalSettingItemValuechildCols = [
    { header : 'general-item-value', field : 'generalSettingItemValue' },
    { header : 'general-value-active', field : 'generalSettingValueActive' },
  ];
  selectedPlant: any;
  generalCategoryChanged = new Subject<any>();
  generalCategoryItemChanged = new Subject<any>();
  generalCategoryItemValueChanged = new Subject<any>();
  generalItemValueChanged = new Subject<any>();
  private searchTerms = new Subject<any>();
  catagoryType: any;
  itemValueType: any;
  typeEnum: any;

  constructor(private _confirmationSvc: ConfirmationService,
              private preferenceService: PreferenceService,
              private _translateSvc: TranslateService,
              private cdx: ChangeDetectorRef,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
              private settingItemService: GeneralSettingItemService,
              private settingItemValueService: GeneralSettingItemValueService,
              private enumService: EnumService,
              private loaderService: LoaderService) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.pageFilter.plantId = null;
                  } else {
                    this.selectedPlant = res;
                    this.pageFilter.plantId = res.plantId;
                  }
                  this.filter();
                });
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.preferenceService.filtergeneralSettingCategoryObservable(term)))
      .subscribe( result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.preferences = result['content'];
        this.preferences = this.preferences.map(item => {
          if (item.parent) {
            item.parentId = item.parent.generalSettingCategoryId;
          } else {
            item.parentId = 0;
          }
          if (item.generalSettingItemList) {
            item.generalSettingItemList = item.generalSettingItemList.map(si => {
              if (si.generalSettingCategory) {
                si.generalSettingCategoryId = si.generalSettingCategory.generalSettingCategoryId;
              }
              if (si.generalSettingItemValueList) {
                si.generalSettingItemValueList = si.generalSettingItemValueList.map(siv => {
                  siv.generalSettingItemId = si.generalSettingItemId;
                  return ({...siv})
                })
              }
              return({...si});
            })
          }
          return {...item };
        });
        this.preferences = this.getNestedChildren(this.preferences, 0);
        this.cdx.markForCheck();
        // console.log(this.preferences);
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.preferences = [];
        this.utilities.showErrorToast(error);
      }
    );

    this.filter();

    this.generalCategoryChanged.pipe(
      debounceTime(1200),
      map(itm =>  ({...itm,
        plantId: itm.plant ? itm.plant.plantId : this.pageFilter.plantId,
        parentId: itm.parent ? itm.parent.generalSettingCategoryId : null})),
      switchMap(term => this.preferenceService.savegeneralSettingCategoryObservable(term)))
      .subscribe( result => {
        this.utilities.showSuccessToast('updated-successfully');
        // this.pagination.currentPage = result['currentPage'];
        // this.pagination.totalElements = result['totalElements'];
        // this.pagination.totalPages = result['totalPages'];
        // this.preferences = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      }
    );

    // for setting item
    this.generalCategoryItemChanged.pipe(
      debounceTime(1200),
      map(itm =>  ({...itm,
        generalSettingCategoryId: itm.generalSettingCategory ? itm.generalSettingCategory.generalSettingCategoryId : null})),
      switchMap(term => this.settingItemService.saveObservable(term)))
      .subscribe( result => {
        this.utilities.showSuccessToast('updated-successfully');
        // this.pagination.currentPage = result['currentPage'];
        // this.pagination.totalElements = result['totalElements'];
        // this.pagination.totalPages = result['totalPages'];
        // this.preferences = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      }
    );

    // for setting item value
    this.generalCategoryItemValueChanged.pipe(
      debounceTime(1200),
      switchMap(term => this.settingItemValueService.saveObservable(term)))
      .subscribe( result => {
        this.utilities.showSuccessToast('updated-successfully');
        // this.pagination.currentPage = result['currentPage'];
        // this.pagination.totalElements = result['totalElements'];
        // this.pagination.totalPages = result['totalPages'];
        // this.preferences = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      }
    );

    this.enumService.getGeneralSettingCatagoryType().then((res: any) => {this.catagoryType = res});
    this.enumService.getGeneralSettingItemValueObjectType().then((res: any) => {this.itemValueType = res});
    this.enumService.getGeneralSettingTypeEnum().then((res: any) => {this.typeEnum = res});

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  getNestedChildren(arr, parent) {
    const out = []
    for (const i in arr) {
        if (arr[i].parentId === parent) {
            const children = this.getNestedChildren(arr, arr[i].generalSettingCategoryId)
            if (children.length) {
                arr[i] = {...arr[i], children: children};
            } else {
              arr[i] = {...arr[i], children: null};
            }
            out.push(arr[i])
        }
    }
    return out;
  }

  // getNestedChildren(arr, parent) {
  //   const out = []
  //   for (const i in arr) {
  //       if (arr[i].parentId === parent) {
  //           const children = this.getNestedChildren(arr, arr[i].generalSettingCategoryId)
  //           if (children.length) {
  //               arr[i] = {data: {...arr[i]}, children: children};
  //           } else {
  //             arr[i] = {data: {...arr[i]}, children: null};
  //           }
  //           out.push(arr[i])
  //       }
  //   }
  //   return out;
  // }

  nest = (items, id = null, link = 'parent') => items.map(item => {
            if (item[link] && item[link].generalSettingCategoryId === id) {
             return ({ data: {...item}, children: this.nest(items, item.generalSettingCategoryId) });
            } else {
              return ({ data: {...item}, children: null});
            }});

  filter() {
    this.loaderService.showLoader();
    this.searchTerms.next(this.pageFilter);
  }
  resetFilter() {
    this.pageFilter = {
      generalSettingCategoriyCode: null,
      generalSettingCategoryDescription: null,
      generalSettingCategoryId: null,
      generalSettingCategoryMultiple: null,
      generalSettingCategoryName: null,
      generalSettingCategoryType: null,
      parentId: null,
      plantId: this.selectedPlant ? this.selectedPlant.plantId : null,
      plantName: null,
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      orderByDirection: 'asc',
      orderByProperty: 'generalSettingCategoryId',
      query: null
    };
  }

  modalShow(id, mod: string, data?) {
    console.log('@OnEdit', id, mod);
    this.countryModal.id = id;
    this.countryModal.modal = mod;
    this.countryModal.data = data ? data : null;
    this.myModal.show();
  }
  onToggle(event, rowNode) {
    rowNode.node.expanded = !rowNode.node.expanded;
    if (rowNode.node.expanded) {
      this.treeTable.onNodeExpand.emit({
          originalEvent: event,
            node: rowNode.node
        });
    } else {
        this.treeTable.onNodeCollapse.emit({
            originalEvent: event,
            node: rowNode.node
        });
    }
    this.treeTable.updateSerializedValue();
    this.treeTable.tableService.onUIUpdate(this.treeTable.value);
    event.preventDefault();
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
      this.filter()
    }, 500);
  }

  onGeneralCategoryChanged(event, property, rowData, index) {
    const reqdto = {
      'generalSettingCategoriyCode': rowData.generalSettingCategoriyCode ,
      'generalSettingCategoryDescription': rowData.generalSettingCategoryDescription ,
      'generalSettingCategoryId': rowData.generalSettingCategoryId ,
      'generalSettingCategoryMultiple': rowData.generalSettingCategoryMultiple,
      'generalSettingCategoryName': rowData.generalSettingCategoryName,
      'generalSettingCategoryType': rowData.generalSettingCategoryType,
      'parentId': rowData.parent ? rowData.parent.generalSettingCategoryId : null,
      'plantId': rowData.plant ? rowData.plant.plantId : this.selectedPlant.plantId
    };

    if (event === false) {
      let found = 0;
      rowData.generalSettingItemList.forEach(item => {
        if (item.generalSettingValue === '1') {
          found = found + 1;
        }
        if (found > 1) {
          setTimeout(() => {
            item.generalSettingValue = '0';
            this.generalCategoryItemChanged.next(item);
            this.settingItemService.save(item).then((dt) => console.log('category Item saved'));
          }, 1000);
        }
      });
    }

    this.loaderService.showLoader();
    this.preferenceService.savegeneralSettingCategory(reqdto).then((res) => {
      this.utilities.showSuccessToast('updated-successfully');
      rowData = res;
      this.loaderService.hideLoader();
      this.cdx.markForCheck();
    });

    // this.generalCategoryChanged.next(reqdto);
  }

  addItemValue(mainrowData, rowData) {
    const itemValue = {
      createDate: null,
      generalSettingItem: null,
      generalSettingItemId: mainrowData.generalSettingItemId,
      generalSettingItemValue: '1',
      generalSettingItemValueId: null,
      generalSettingValueActive: true,
      referenceId: rowData.referenceId,
      updateDate: null,
    }
    mainrowData.generalSettingItemValueList.push(itemValue);
    this.cdx.markForCheck();
  }
  addItemValueList(mainrowData) {
    const itemValue = {
      createDate: null,
      generalSettingItem: null,
      generalSettingItemId: mainrowData.generalSettingItemId,
      generalSettingItemValue: '1',
      generalSettingItemValueId: null,
      generalSettingValueActive: true,
      referenceId: null,
      updateDate: null,
    }
    mainrowData.generalSettingItemValueList.push(itemValue);
    setTimeout(() => {
      this.dtTableTwo.toggleRow(mainrowData); // auto expand that row;
      this.cdx.markForCheck();
    }, 100);
  }

  saveItemValue(mainrowData, dto, index) {
    this.loaderService.showLoader();
    this.settingItemValueService.save(dto).then(res => {
      this.loaderService.hideLoader();
      mainrowData.generalSettingItemValueList.splice(index, 1, res);
      this.cdx.markForCheck();
    }).catch(err => this.loaderService.hideLoader());
  }
  deleteItemValue(mainrowData, dto, index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.showLoader();
        this.settingItemValueService.delete(dto.generalSettingItemValueId).then(res => {
          this.loaderService.hideLoader();
          mainrowData.generalSettingItemValueList.splice(index, 1);
          this.cdx.markForCheck();
        }).catch(err => this.loaderService.hideLoader());
      },
      reject: () => {
        this.utilities.showInfoToast('canceled-operation');
      }});
  }
  cancelSaveItemValue(mainrowData, dto, index) {
    mainrowData.generalSettingItemValueList.splice(index, 1);
    this.cdx.markForCheck();
  }
  onGeneralSettingItemValueChanged(event, property, rowData) {
    // if (event) {
    //   rowData[property] = '1';
    // } else {
    //   rowData[property] = '0';
    // }
    if (rowData.generalSettingItemValueId) {
      rowData[property] = event;
      this.loaderService.showLoader();
      this.generalCategoryItemValueChanged.next(rowData);
    }
  }
  onGeneralSettingValueChanged(event, property, rowData, rowmainData) {
    if (rowmainData.generalSettingCategoryMultiple === true && event === true) {
      rowData[property] = '1';
    } else if (rowmainData.generalSettingCategoryMultiple === false && event) {
      rowmainData.generalSettingItemList.forEach(itemvalue => {
        if (itemvalue.generalSettingValue === '1') {
          itemvalue.generalSettingValue = '0';
          this.settingItemService.save(itemvalue).then((dt) => console.log('Item Saved'))
        }
      });
      rowData[property] = '1';
    } else  {
      rowData[property] = '0';
    }
    this.loaderService.showLoader();
    this.generalCategoryItemChanged.next(rowData);
  }
  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.preferenceService.deletegeneralSettingCategoryById(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter();
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  detail2Node(detail, level?) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail, {generalSettingItemList: null}, {stepNo: level}),
        children: detail.generalSettingItemList ? me.detailList2Node(detail.generalSettingItemList, level) : [],
        key: ConvertUtil.getSimpleUId(),
        expanded: !!detail.expanded
      };
      return node;
    }
    return node;

  }
  detailList2Node(detailList, level?) {
    const me = this;
    if (!level) {
      level = '';
    } else {
      level = level + '.';
    }
    const list = [];

    if (detailList) {

      detailList.forEach((item, index) => {
        const treeNode = me.detail2Node(item, (level + (index + 1)));
        list.push(treeNode);
      });

    }
    return list;

  }

  nodeList2DetailData(nodes) {
    const me = this;
    const list = nodes.map(item => {
      return me.node2DetailData(item);
    });

    return list;

  }

  node2DetailData(node) {
    const me = this;
    let data = null;
    if (node) {
      data = Object.assign({}, node.data, {expanded: node.expanded});
      data.productTreeDetailList = me.nodeList2DetailData(node.children);
      return data;
    }
    return data;
  }

}
