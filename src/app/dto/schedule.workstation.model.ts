export class ReservedWorkstation {
    static _reservedWrk = [];
   public static AddWrk(uniqueId) {
       this._reservedWrk.push(uniqueId);
   }

   public static GetWrks(uniqueId) {
       return this._reservedWrk.filter(itm => uniqueId === itm);
   }


   public static ResetColors() {
        this._reservedWrk = [];
   }

}
