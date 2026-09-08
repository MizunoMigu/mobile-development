import { PressKeyItem } from "@normalized:N&&&entry/src/main/ets/viewmodel/PressKeysItem&";
export class PressKeysViewModel {
    /**
     * Science mode key array (5 columns x 7 rows).
     */
    getSciencePressKeys(): Array<Array<PressKeyItem>> {
        return [
            [
                new PressKeyItem(1, '18vp', '26vp', '('),
                new PressKeyItem(1, '18vp', '26vp', 'sin'),
                new PressKeyItem(1, '18vp', '26vp', 'log'),
                new PressKeyItem(1, '18vp', '26vp', '!'),
                new PressKeyItem(2, '18vp', '26vp', '^'),
                new PressKeyItem(1, '18vp', '26vp', '√'),
                new PressKeyItem(1, '18vp', '26vp', 'π')
            ],
            [
                new PressKeyItem(1, '18vp', '26vp', ')'),
                new PressKeyItem(1, '18vp', '26vp', 'cos'),
                new PressKeyItem(1, '18vp', '26vp', 'ln'),
                new PressKeyItem(1, '22vp', '30vp', '7'),
                new PressKeyItem(1, '22vp', '30vp', '4'),
                new PressKeyItem(1, '22vp', '30vp', '1'),
                new PressKeyItem(1, '22vp', '30vp', 'e')
            ],
            [
                new PressKeyItem(1, '18vp', '26vp', 'x²'),
                new PressKeyItem(1, '18vp', '26vp', 'tan'),
                new PressKeyItem(2, '18vp', '26vp', '⌫'),
                new PressKeyItem(1, '22vp', '30vp', '8'),
                new PressKeyItem(1, '22vp', '30vp', '5'),
                new PressKeyItem(1, '22vp', '30vp', '2'),
                new PressKeyItem(1, '22vp', '30vp', '0')
            ],
            [
                new PressKeyItem(1, '22vp', '30vp', '00'),
                new PressKeyItem(2, '18vp', '26vp', 'AC'),
                new PressKeyItem(1, '18vp', '26vp', '1/x'),
                new PressKeyItem(1, '22vp', '30vp', '9'),
                new PressKeyItem(1, '22vp', '30vp', '6'),
                new PressKeyItem(1, '22vp', '30vp', '3'),
                new PressKeyItem(1, '22vp', '30vp', '.')
            ],
            [
                new PressKeyItem(2, '24vp', '32vp', '÷'),
                new PressKeyItem(2, '24vp', '32vp', '×'),
                new PressKeyItem(2, '24vp', '32vp', '-'),
                new PressKeyItem(2, '24vp', '32vp', '+'),
                new PressKeyItem(1, '18vp', '26vp', '%'),
                // 角度模式切换键（显示当前模式 deg/rad）
                new PressKeyItem(1, '18vp', '26vp', 'deg'),
                new PressKeyItem(3, '24vp', '32vp', '=')
            ]
        ];
    }
    /**
     * Key array data.
     */
    getPressKeys(): Array<Array<PressKeyItem>> {
        return [
            [
                new PressKeyItem(2, '28vp', '37vp', 'C', { "id": 16777253, "type": 20000, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" }),
                new PressKeyItem(1, '26vp', '35vp', '7'),
                new PressKeyItem(1, '26vp', '35vp', '4'),
                new PressKeyItem(1, '26vp', '35vp', '1'),
                new PressKeyItem(1, '26vp', '35vp', '%')
            ],
            [
                new PressKeyItem(2, '42vp', '56vp', '÷', { "id": 16777257, "type": 20000, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" }),
                new PressKeyItem(1, '26vp', '35vp', '8'),
                new PressKeyItem(1, '26vp', '35vp', '5'),
                new PressKeyItem(1, '26vp', '35vp', '2'),
                new PressKeyItem(1, '26vp', '35vp', '0')
            ],
            [
                new PressKeyItem(2, '42vp', '56vp', '×', { "id": 16777260, "type": 20000, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" }),
                new PressKeyItem(1, '26vp', '35vp', '9'),
                new PressKeyItem(1, '26vp', '35vp', '6'),
                new PressKeyItem(1, '26vp', '35vp', '3'),
                new PressKeyItem(1, '26vp', '35vp', '.')
            ],
            [
                new PressKeyItem(0, '30.48vp', '20vp', 'del', { "id": 16777256, "type": 20000, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" }),
                new PressKeyItem(2, '42vp', '56vp', '-', { "id": 16777259, "type": 20000, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" }),
                new PressKeyItem(2, '42vp', '56vp', '+', { "id": 16777254, "type": 20000, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" }),
                new PressKeyItem(3, '28vp', '54vp', '=', { "id": 16777258, "type": 20000, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" })
            ]
        ];
    }
}
let keysModel = new PressKeysViewModel();
export default keysModel as PressKeysViewModel;
