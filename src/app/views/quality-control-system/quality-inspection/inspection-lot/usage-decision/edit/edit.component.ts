import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service'
import { environment } from 'environments/environment';

@Component({
  selector: 'edit-usage-decision',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditUsageDecision implements OnInit {
  @Input() plantId = null;
  usageDecision = {
    usageDecisionId: null,
    udCode: null,
    usageDecision: null,
    qualityScore: null,
    inspectionLotQuantity: null,
    sampleSize: null,
    unrestrictedUse: null,
    scrap: null,
    sampleUsage: null,
    blockedStock: null,
    reserves: null
  };
  
  udCodeList = [
    'Code 1',
    'Code 2', 
    'Code 3'
  ];

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
    private _resultRecordingService: UsageDecisionService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.usageDecision.usageDecisionId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.usageDecision.usageDecisionId = this.id;
    this.loaderService.showLoader();

    this._resultRecordingService.detailUsageDecision(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['udCode'])) {
          this.usageDecision.udCode = result['udCode'];
        }
        if ((result['usageDecision'])) {
          this.usageDecision.usageDecision = result['usageDecision'];
        }
        if ((result['qualityScore'])) {
          this.usageDecision.qualityScore = result['qualityScore'];
        }
        if ((result['inspectionLotQuantity'])) {
          this.usageDecision.inspectionLotQuantity = result['inspectionLotQuantity'];
        }
        if ((result['sampleSize'])) {
          this.usageDecision.sampleSize = result['sampleSize'];
        }
        if ((result['unrestrictedUse'])) {
          this.usageDecision.unrestrictedUse = result['unrestrictedUse'];
        }
        if ((result['scrap'])) {
          this.usageDecision.scrap = result['scrap'];
        }
        if ((result['sampleUsage'])) {
          this.usageDecision.sampleUsage = result['sampleUsage'];
        }
        if ((result['blockedStock'])) {
          this.usageDecision.blockedStock = result['blockedStock'];
        }
        if ((result['reserves'])) {
          this.usageDecision.reserves = result['reserves'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  
  onSelectedUsCode(event) {
    if (event) {
      this.usageDecision.usageDecision = "Decision 1";
      this.usageDecision.qualityScore = "Quality 1";
      this.usageDecision.inspectionLotQuantity = 2;
      this.usageDecision.sampleSize = 3;
    }
  }
  
  save() {
    this.loaderService.showLoader();
    this.usageDecision['plantId'] = this.plantId;
    this._resultRecordingService.update(this.usageDecision.usageDecisionId, this.usageDecision).subscribe(
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
 