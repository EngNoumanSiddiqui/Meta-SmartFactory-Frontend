import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../services/shared/loader.service';
@Component({
  selector: 'loader-spinner',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderSpinnerComponent implements OnDestroy, OnInit, AfterViewChecked {
  showLoader = false;
  subscription;
  message: string;
  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef) { }

  ngOnDestroy() {
    this.showLoader = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.subscription = this.loaderService.subscriber$.subscribe(state => {
      this.showLoader = state;
    });
    this.loaderService.subscriberMessage$.subscribe(data => {
      if (data) {
        this.message = data;
      }

    })
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
