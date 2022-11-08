import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import {PartService} from '../../../../services/dto-services/part/part.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'part-edit',
  templateUrl: './edit.component.html'
})
export class EditPartComponent implements OnInit {

  part = {
    'partName': null,
    'partId': null,
    'partCode': null,
    'quantity': 0,
    'description': null,
    'amount': null,
    'supplier': null,
    'lifeTime': null,
    'unit': null
  };

  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _partSvc: PartService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

    /*  this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.part.partId = this.id;
     console.log(this.id);
     });*/

  }

  private initialize(id) {
    this.part.partId = this.id;
    this.loaderService.showLoader();
    this._partSvc.getUpdateDetail(id).then(result => {
      this.loaderService.hideLoader();
      if ((result['partCode'])) {
        this.part.partCode = result['partCode'];
      }
      if ((result['partName'])) {
        this.part.partName = result['partName'];
      }
      if ((result['supplier'])) {
        this.part.supplier = result['supplier'];
      }
      if ((result['unit'])) {
        this.part.unit = result['unit'];
      }
      if ((result['amount'])) {
        this.part.amount = result['amount'];
      }
      if ((result['lifeTime'])) {
        this.part.lifeTime = result['lifeTime'];
      }
      if ((result['description'])) {
        this.part.description = result['description'];
      }
      if ((result['quantity'])) {
        this.part.quantity = result['quantity'];
      }
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }

  ngOnInit() {

  }

  goPage() {
    this._router.navigate(['/settings/parts']);
  }

  save() {
    // if (this.part.date !== '') { this.part.date = moment(this.part.date).format('DD/MM/YYYY HH:mm'); }
    this.loaderService.showLoader();
    this._partSvc.update(this.part)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


  cancel() {
    this.goPage();
  }


}
