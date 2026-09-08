export class PressKeyItem {
    flag: number;
    width: string;
    height: string;
    value: string;
    source?: Resource;
    constructor(flag: number, width: string, height: string, value: string, source?: Resource) {
        this.flag = flag;
        this.width = width;
        this.height = height;
        this.value = value;
        this.source = source;
    }
}
