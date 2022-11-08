export class ReservedColor {
     static _colorDictionary = {};
    public static AddColor( color, uniqueId) {
        this._colorDictionary[uniqueId] = color;
    }

    public static GetColor(uniqueId) {
        return this._colorDictionary[uniqueId] ? this._colorDictionary[uniqueId] : null;
    }


    public static ResetColors() {
        this._colorDictionary = {};
    }

}
