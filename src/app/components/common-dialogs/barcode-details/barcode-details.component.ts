import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BarCodeService } from 'app/services/dto-services/barcode/barcode.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'barcode-details',
  templateUrl: './barcode-details.component.html'
})
export class BarcodeDetailsComponent implements OnInit, OnChanges {

  @Input() barcode: string = null;
  imageUrl: any;

  constructor(private loaderService: LoaderService, private barcodeService: BarCodeService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes.barcode && changes.barcode.currentValue) {
          this.details(changes.barcode.currentValue);
      }
  }

  details(barcode: string) {
    this.loaderService.showLoader();
    this.barcodeService.getBarcode(barcode).then((res: any) => {
      this.loaderService.hideLoader();
      const unsafeImageUrl = URL.createObjectURL(res);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    }).catch(err => {
      this.loaderService.hideLoader();
      console.error(err);
    });
  }

}
