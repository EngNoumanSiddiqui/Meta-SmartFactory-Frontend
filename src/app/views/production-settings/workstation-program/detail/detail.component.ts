import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'workstation-program-detail',
  templateUrl: './detail.component.html',
})

export class WorkStationProgramDetailComponent implements OnInit {
  showLoader = false;

  @Input() data: any;

  constructor(private utilities: UtilitiesService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    console.log('data', this.data)
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
