import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {PartService} from '../../../../services/dto-services/part/part.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'part-new',
  templateUrl: './new.component.html'
})
export class NewPartComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  part = {
    'partName': null,
    'partCode': null,
    'quantity': 0,
    'description': null,
    'amount': null,
    'supplier': null,
    'lifeTime': null,
    'unit': null
  };


  constructor(private _partSvc: PartService,
              private _router: Router,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

  }

  ngOnInit() {
  }

  goPage() {
    this._router.navigate(['/settings/parts']);
  }

  save() {
    this.loaderService.showLoader();
    this._partSvc.save(this.part)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  reset() {
    this.part = {
      'partName': null,
      'partCode': null,
      'quantity': 0,
      'description': null,
      'amount': null,
      'supplier': null,
      'lifeTime': null,
      'unit': null
    };
  }


}
