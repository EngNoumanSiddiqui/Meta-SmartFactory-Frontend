import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProductionOrderMaterialService {

    materialChangedSubject = new BehaviorSubject<any>(null);
    componentMaterialChangedSubject = new BehaviorSubject<any>(null);
    auxiliaryMaterialChangedSubject = new BehaviorSubject<any>(null);

    materialChanged() {
        return this.materialChangedSubject.asObservable();
    }

    componentMaterialChanged() {
        return this.componentMaterialChangedSubject.asObservable();
    }

    auxiliaryMaterialChanged() {
        return this.auxiliaryMaterialChangedSubject.asObservable();
    }
}