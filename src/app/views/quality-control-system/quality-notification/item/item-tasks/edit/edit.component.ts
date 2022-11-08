import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ItemsService } from 'app/services/dto-services/quality-notification/item/tasks/items.service'
@Component({
  selector: 'edit-item-task',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditTask implements OnInit {

  itemTaskType = {
    itemTasksId: null,
    itemTaskName: null,
    itemTaskResponsible: null,
    status: null,
    shortText: null,
  };

  itemTaskNameList =[
    'Name 1',
    'Name 2',
    'Name 3'
  ]
  itemTaskResponsibleList =[
    'fff',
    'fff',
    'fff'
  ]
  statusList = [
    'COMPLETED',
    'CREATED'
  ]

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _taskService: ItemsService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.itemTaskType.itemTasksId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.itemTaskType.itemTasksId = this.id;
    this.loaderService.showLoader();

    this._taskService.getUpdateDetail(id).subscribe(
      result => {
        this.loaderService.hideLoader();
        if ((result['itemTaskName'])) {
          this.itemTaskType.itemTaskName = result['itemTaskName'];
        }
        if ((result['itemTaskResponsible'])) {
          this.itemTaskType.itemTaskResponsible = result['itemTaskResponsible'];
        }
        if ((result['status'])) {
          this.itemTaskType.status = result['status'];
        }
        if ((result['shortText'])) {
          this.itemTaskType.shortText = result['shortText'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.itemTaskType.itemTaskName='',
    this.itemTaskType.itemTaskResponsible='',
    this.itemTaskType.status='',
    this.itemTaskType.shortText=''
  }

  save() {
    this.loaderService.showLoader();
    this._taskService.update(this.itemTaskType.itemTasksId, this.itemTaskType).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }

}
