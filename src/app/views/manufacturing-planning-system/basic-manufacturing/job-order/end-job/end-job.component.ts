import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'end-job',
  templateUrl: './end-job.component.html'
})

export class EndJobComponent implements OnInit{

    jobOrder:any;

    @Input('jobOrder') set jO(jobOrder){
        this.jobOrder = jobOrder;
    }

    constructor(){}

    ngOnInit() {}
}