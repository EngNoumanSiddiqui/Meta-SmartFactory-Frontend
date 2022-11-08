import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import {UtilitiesService} from '../../../services/utilities.service';

@Component({
  selector: 'insp-char-auto-complete',
  templateUrl: './insp-char-auto-complete.component.html',
})
export class InspCharAutoCompleteComponent implements OnInit {
  inspChars = [];
  selectedInspChar;
  placeholder = 'no-data';
  modal = {active: false};
  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  @Input('selectedInspCharId') selectedInspCharId;

  // @Input('selectedInspChar') set s(selectedInspChar) {
  //   this.selectedInspChar = selectedInspChar;
  // }
  @Output() selectedInspCharEvent = new EventEmitter();

  constructor(private _inspectionService: InspectionService,
              private utilities: UtilitiesService) {}

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    this.inspChars = [];
    this._inspectionService.getAll().subscribe(
      result => {
        this.inspChars = result['content'];
        this.selectedInspChar = this.inspChars.filter(item => item.inspCharId == this.selectedInspCharId)[0]
        console.log("---this.selectedInspChar: ",this.selectedInspChar)
      },
      error => {
        this.utilities.showErrorToast(error);
        this.inspChars = [];
      }
    );
  }

  handleDropdownClickForInspChar(){
    this.inspChars = [...this.inspChars];
  }
  onChangeInspChar(event){
    this.selectedInspCharEvent.next(event);
  }
}
