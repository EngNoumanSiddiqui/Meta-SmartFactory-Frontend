import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {ItemsService } from 'app/services/dto-services/quality-notification/item/tasks/items.service' 

@Component({
  selector: 'new-item-task',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewTasks  {

  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  itemTaskType = { 
    itemTasksId: null,
    itemTaskName: null,
    itemTaskResponsible: null,
    shortText: null,
    status: "CREATED"
  };
  itemTaskNameList = [
    'Name 1',
    'Name 2',
    'Name 3',
  ];
  itemTaskResponsibleList = [
    'fff',
    'fff',
    'fff',
  ]
  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _itemsService: ItemsService
  ) {}
  
  reset() {
    this.itemTaskType.itemTaskName= '',
    this.itemTaskType.itemTaskResponsible = '',
    this.itemTaskType.shortText=''
  }

  save() {
    this.loaderService.showLoader();
    this._itemsService.save(this.itemTaskType).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }

}
