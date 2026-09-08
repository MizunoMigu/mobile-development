if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    inputValue?: string;
    calValue?: string;
    expressions?: Array<string>;
    caretPos?: number;
    pendingCaret?: number;
    caretSeq?: number;
    inFuncParam?: boolean;
    textAreaCtrl?: TextAreaController;
    lastBtnIsEqu?: boolean;
    history?: Array<HistoryItem>;
    isScienceMode?: boolean;
    angleMode?: string;
    showHistoryPage?: boolean;
    pressKeys?: Array<Array<PressKeyItem>>;
    uiContext?;
    topRectHeight?: number;
    bottomRectHeight?: number;
}
import Logger from "@normalized:N&&&entry/src/main/ets/common/util/Logger&";
import CalculateUtil from "@normalized:N&&&entry/src/main/ets/common/util/CalculateUtil&";
import CheckEmptyUtil from "@normalized:N&&&entry/src/main/ets/common/util/CheckEmptyUtil&";
import keysModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PresskeysViewModel&";
import type { PressKeyItem } from '../viewmodel/PressKeysItem';
import { CommonConstants, Symbol } from "@normalized:N&&&entry/src/main/ets/common/constants/CommonConstants&";
import type common from "@ohos:app.ability.common";
import type { BusinessError } from "@ohos:base";
import pasteboard from "@ohos:pasteboard";
import promptAction from "@ohos:promptAction";
interface HistoryItem {
    expression: string;
    result: string;
}
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__inputValue = new ObservedPropertySimplePU('', this, "inputValue");
        this.__calValue = new ObservedPropertySimplePU('', this, "calValue");
        this.expressions = [];
        this.caretPos = -1;
        this.pendingCaret = -1;
        this.caretSeq = 0;
        this.inFuncParam = false;
        this.textAreaCtrl = new TextAreaController();
        this.__lastBtnIsEqu = new ObservedPropertySimplePU(false, this, "lastBtnIsEqu");
        this.__history = new ObservedPropertyObjectPU([], this, "history");
        this.__isScienceMode = new ObservedPropertySimplePU(false, this, "isScienceMode");
        this.__angleMode = new ObservedPropertySimplePU('deg', this, "angleMode");
        this.__showHistoryPage = new ObservedPropertySimplePU(false, this, "showHistoryPage");
        this.__pressKeys = new ObservedPropertyObjectPU(keysModel.getPressKeys(), this, "pressKeys");
        this.uiContext = this.getUIContext();
        this.__topRectHeight = this.createStorageLink('topRectHeight', 0, "topRectHeight");
        this.__bottomRectHeight = this.createStorageLink('bottomRectHeight', 0, "bottomRectHeight");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.inputValue !== undefined) {
            this.inputValue = params.inputValue;
        }
        if (params.calValue !== undefined) {
            this.calValue = params.calValue;
        }
        if (params.expressions !== undefined) {
            this.expressions = params.expressions;
        }
        if (params.caretPos !== undefined) {
            this.caretPos = params.caretPos;
        }
        if (params.pendingCaret !== undefined) {
            this.pendingCaret = params.pendingCaret;
        }
        if (params.caretSeq !== undefined) {
            this.caretSeq = params.caretSeq;
        }
        if (params.inFuncParam !== undefined) {
            this.inFuncParam = params.inFuncParam;
        }
        if (params.textAreaCtrl !== undefined) {
            this.textAreaCtrl = params.textAreaCtrl;
        }
        if (params.lastBtnIsEqu !== undefined) {
            this.lastBtnIsEqu = params.lastBtnIsEqu;
        }
        if (params.history !== undefined) {
            this.history = params.history;
        }
        if (params.isScienceMode !== undefined) {
            this.isScienceMode = params.isScienceMode;
        }
        if (params.angleMode !== undefined) {
            this.angleMode = params.angleMode;
        }
        if (params.showHistoryPage !== undefined) {
            this.showHistoryPage = params.showHistoryPage;
        }
        if (params.pressKeys !== undefined) {
            this.pressKeys = params.pressKeys;
        }
        if (params.uiContext !== undefined) {
            this.uiContext = params.uiContext;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputValue.purgeDependencyOnElmtId(rmElmtId);
        this.__calValue.purgeDependencyOnElmtId(rmElmtId);
        this.__lastBtnIsEqu.purgeDependencyOnElmtId(rmElmtId);
        this.__history.purgeDependencyOnElmtId(rmElmtId);
        this.__isScienceMode.purgeDependencyOnElmtId(rmElmtId);
        this.__angleMode.purgeDependencyOnElmtId(rmElmtId);
        this.__showHistoryPage.purgeDependencyOnElmtId(rmElmtId);
        this.__pressKeys.purgeDependencyOnElmtId(rmElmtId);
        this.__topRectHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__bottomRectHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputValue.aboutToBeDeleted();
        this.__calValue.aboutToBeDeleted();
        this.__lastBtnIsEqu.aboutToBeDeleted();
        this.__history.aboutToBeDeleted();
        this.__isScienceMode.aboutToBeDeleted();
        this.__angleMode.aboutToBeDeleted();
        this.__showHistoryPage.aboutToBeDeleted();
        this.__pressKeys.aboutToBeDeleted();
        this.__topRectHeight.aboutToBeDeleted();
        this.__bottomRectHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __inputValue: ObservedPropertySimplePU<string>;
    get inputValue() {
        return this.__inputValue.get();
    }
    set inputValue(newValue: string) {
        this.__inputValue.set(newValue);
    }
    private __calValue: ObservedPropertySimplePU<string>;
    get calValue() {
        return this.__calValue.get();
    }
    set calValue(newValue: string) {
        this.__calValue.set(newValue);
    }
    private expressions: Array<string>;
    // 输入框光标位置（字符索引）；-1 表示光标在末尾/未跟踪
    private caretPos: number;
    // 渲染后待补偿的光标位置；-1 表示无。系统在文本更新后会把光标重置到末尾，
    // 需要等渲染完成再 setTextSelection，期间以该值识别并补偿
    private pendingCaret: number;
    // setCaretLater 版本号：旧延迟回调（例如 120ms 兜底）不得覆盖新操作设置的光标
    private caretSeq: number;
    // 是否正处于"函数参数输入"状态（sin() 插入参数后，后续数字继续追加到参数内）
    private inFuncParam: boolean;
    private textAreaCtrl: TextAreaController;
    private __lastBtnIsEqu: ObservedPropertySimplePU<boolean>;
    get lastBtnIsEqu() {
        return this.__lastBtnIsEqu.get();
    }
    set lastBtnIsEqu(newValue: boolean) {
        this.__lastBtnIsEqu.set(newValue);
    }
    private __history: ObservedPropertyObjectPU<Array<HistoryItem>>;
    get history() {
        return this.__history.get();
    }
    set history(newValue: Array<HistoryItem>) {
        this.__history.set(newValue);
    }
    private __isScienceMode: ObservedPropertySimplePU<boolean>;
    get isScienceMode() {
        return this.__isScienceMode.get();
    }
    set isScienceMode(newValue: boolean) {
        this.__isScienceMode.set(newValue);
    }
    private __angleMode: ObservedPropertySimplePU<string>;
    get angleMode() {
        return this.__angleMode.get();
    }
    set angleMode(newValue: string) {
        this.__angleMode.set(newValue);
    }
    private __showHistoryPage: ObservedPropertySimplePU<boolean>;
    get showHistoryPage() {
        return this.__showHistoryPage.get();
    }
    set showHistoryPage(newValue: boolean) {
        this.__showHistoryPage.set(newValue);
    }
    private __pressKeys: ObservedPropertyObjectPU<Array<Array<PressKeyItem>>>;
    get pressKeys() {
        return this.__pressKeys.get();
    }
    set pressKeys(newValue: Array<Array<PressKeyItem>>) {
        this.__pressKeys.set(newValue);
    }
    private uiContext;
    private __topRectHeight: ObservedPropertyAbstractPU<number>;
    get topRectHeight() {
        return this.__topRectHeight.get();
    }
    set topRectHeight(newValue: number) {
        this.__topRectHeight.set(newValue);
    }
    private __bottomRectHeight: ObservedPropertyAbstractPU<number>;
    get bottomRectHeight() {
        return this.__bottomRectHeight.get();
    }
    set bottomRectHeight(newValue: number) {
        this.__bottomRectHeight.set(newValue);
    }
    // 自定义键盘（宽高设为0）
    CustomKeyboardBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.height(0);
            Grid.width(0);
        }, Grid);
        Grid.pop();
        Column.pop();
    }
    inputValueChange() {
        if (this.inputValue !== null || this.inputValue !== undefined) {
            this.inputValue = this.resultFormat((this.inputValue));
        }
    }
    /**
     * 渲染完成后把输入框光标设置到指定位置（解决内容更新后光标跳回末尾的问题）。
     * 文本更新后系统会把光标重置到末尾，setTextSelection 需等渲染完成后才生效，
     * 因此分段延迟设置，并以 pendingCaret 交给 onTextSelectionChange 兜底补偿。
     * 每次调用递增版本号，旧延迟回调（如 120ms 兜底）发现版本过期即跳过，
     * 避免后续输入把光标拉回旧位置。
     *
     * @param pos 光标字符索引。
     */
    private setCaretLater(pos: number) {
        this.pendingCaret = pos;
        let seq = ++this.caretSeq;
        setTimeout(() => {
            if (seq === this.caretSeq) {
                this.textAreaCtrl.setTextSelection(pos, pos);
            }
        }, 0);
        setTimeout(() => {
            if (seq === this.caretSeq) {
                this.textAreaCtrl.setTextSelection(pos, pos);
                this.pendingCaret = -1;
            }
        }, 120);
    }
    /**
     * 输入区显示字号：等号后结果放大显示，覆盖计算式；按其他键恢复常规字号。
     *
     * @return Font size.
     */
    getDisplayFontSize(): number {
        if (this.lastBtnIsEqu) {
            let len = this.inputValue.length;
            if (len <= 9) {
                return 64;
            }
            if (len <= 14) {
                return 48;
            }
            return 40;
        }
        return 48;
    }
    /**
     * 输入区行高（与字号匹配）。
     *
     * @return Line height.
     */
    getDisplayLineHeight(): number {
        return this.lastBtnIsEqu ? 84 : 64;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(CommonConstants.FULL_PERCENT);
            Column.backgroundColor({ "id": 16777226, "type": 10001, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // title
            Column.create();
            // title
            Column.justifyContent(FlexAlign.Center);
            // title
            Column.width('100%');
            // title
            Column.height(54);
            // title
            Column.margin({ top: this.uiContext.px2vp(this.topRectHeight) });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(32);
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" });
            Text.width(128);
            Text.height(32);
            Text.fontSize(26);
            Text.fontWeight(700);
            Text.lineHeight(35);
            Text.fontColor('rgba(0, 0, 0, 0.9)');
            Text.fontFamily(CommonConstants.FONT_FAMILY_1);
            Text.margin({ left: CommonConstants.COMPONENT_BAY_SIZE_16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 历史记录入口
            Column.create();
            // 历史记录入口
            Column.width(44);
            // 历史记录入口
            Column.height(44);
            // 历史记录入口
            Column.borderRadius(22);
            // 历史记录入口
            Column.backgroundColor('rgb(255, 255, 255)');
            // 历史记录入口
            Column.alignItems(HorizontalAlign.Center);
            // 历史记录入口
            Column.justifyContent(FlexAlign.Center);
            // 历史记录入口
            Column.margin({ right: 8 });
            // 历史记录入口
            Column.onClick(() => {
                this.showHistoryPage = true;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('历');
            Text.fontSize(13);
            Text.fontWeight(CommonConstants.FONT_WEIGHT_MEDIUM);
            Text.fontColor('rgba(0, 0, 0, 0.65)');
            Text.lineHeight(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('史');
            Text.fontSize(13);
            Text.fontWeight(CommonConstants.FONT_WEIGHT_MEDIUM);
            Text.fontColor('rgba(0, 0, 0, 0.65)');
            Text.lineHeight(16);
        }, Text);
        Text.pop();
        // 历史记录入口
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 基础 / 科学模式切换按钮
            Column.create();
            // 基础 / 科学模式切换按钮
            Column.width(44);
            // 基础 / 科学模式切换按钮
            Column.height(44);
            // 基础 / 科学模式切换按钮
            Column.borderRadius(22);
            // 基础 / 科学模式切换按钮
            Column.backgroundColor('rgb(255, 255, 255)');
            // 基础 / 科学模式切换按钮
            Column.alignItems(HorizontalAlign.Center);
            // 基础 / 科学模式切换按钮
            Column.justifyContent(FlexAlign.Center);
            // 基础 / 科学模式切换按钮
            Column.margin({ right: 12 });
            // 基础 / 科学模式切换按钮
            Column.onClick(() => {
                this.isScienceMode = !this.isScienceMode;
                this.pressKeys = this.isScienceMode ? keysModel.getSciencePressKeys() : keysModel.getPressKeys();
                // 切换模式时清空当前输入与状态，避免残留表达式/函数参数态干扰后续输入
                this.expressions = [];
                this.inputValue = '';
                this.calValue = '';
                this.caretPos = -1;
                this.pendingCaret = -1;
                this.inFuncParam = false;
                this.lastBtnIsEqu = false;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isScienceMode ? '+-' : '√π');
            Text.fontSize(13);
            Text.fontWeight(CommonConstants.FONT_WEIGHT_MEDIUM);
            Text.fontColor('rgba(0, 0, 0, 0.65)');
            Text.lineHeight(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isScienceMode ? '×=' : 'e=');
            Text.fontSize(13);
            Text.fontWeight(CommonConstants.FONT_WEIGHT_MEDIUM);
            Text.fontColor('rgba(0, 0, 0, 0.65)');
            Text.lineHeight(16);
        }, Text);
        Text.pop();
        // 基础 / 科学模式切换按钮
        Column.pop();
        Row.pop();
        // title
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 历史记录页（隐藏计算器界面）
            if (this.showHistoryPage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                        Column.width('100%');
                        Column.backgroundColor('rgb(255, 255, 255)');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(48);
                        Row.padding({ left: 16, right: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('历史记录');
                        Text.fontSize(18);
                        Text.fontWeight(CommonConstants.FONT_WEIGHT_MEDIUM);
                        Text.fontColor(Color.Black);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('清除');
                        Text.fontSize(15);
                        Text.fontColor('rgba(10, 89, 247, 1)');
                        Text.onClick(() => {
                            this.history = [];
                        });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('返回');
                        Text.fontSize(15);
                        Text.fontColor('rgba(10, 89, 247, 1)');
                        Text.margin({ left: 24 });
                        Text.onClick(() => {
                            this.showHistoryPage = false;
                        });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.history.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.layoutWeight(1);
                                    Column.width('100%');
                                    Column.justifyContent(FlexAlign.Center);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('暂无历史记录');
                                    Text.fontSize(14);
                                    Text.fontColor('rgba(0, 0, 0, 0.4)');
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    List.create({ space: 4 });
                                    List.layoutWeight(1);
                                    List.width('100%');
                                    List.scrollBar(BarState.Off);
                                    List.divider({ strokeWidth: 0.5, color: 'rgba(0, 0, 0, 0.06)' });
                                }, List);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, index: number) => {
                                        const item = _item;
                                        {
                                            const itemCreation = (elmtId, isInitialRender) => {
                                                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                ListItem.create(deepRenderFunction, true);
                                                if (!isInitialRender) {
                                                    ListItem.pop();
                                                }
                                                ViewStackProcessor.StopGetAccessRecording();
                                            };
                                            const itemCreation2 = (elmtId, isInitialRender) => {
                                                ListItem.create(deepRenderFunction, true);
                                            };
                                            const deepRenderFunction = (elmtId, isInitialRender) => {
                                                itemCreation(elmtId, isInitialRender);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Row.create();
                                                    Row.width('100%');
                                                    Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                                                    Row.onClick(() => {
                                                        // 点击记录：填充到输入并返回计算器
                                                        this.useHistory(index);
                                                        this.showHistoryPage = false;
                                                    });
                                                }, Row);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.expression);
                                                    Text.fontSize(15);
                                                    Text.fontColor('rgba(0, 0, 0, 0.6)');
                                                    Text.maxLines(1);
                                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('=');
                                                    Text.fontSize(15);
                                                    Text.fontColor('rgba(0, 0, 0, 0.6)');
                                                    Text.margin({ left: 8, right: 8 });
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.result);
                                                    Text.fontSize(15);
                                                    Text.fontWeight(CommonConstants.FONT_WEIGHT_MEDIUM);
                                                    Text.fontColor(Color.Black);
                                                    Text.maxLines(1);
                                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                                }, Text);
                                                Text.pop();
                                                Row.pop();
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    };
                                    this.forEachUpdateFunction(elmtId, this.history, forEachItemGenFunction, (item: HistoryItem, index: number) => item.expression + item.result + index.toString(), true, true);
                                }, ForEach);
                                ForEach.pop();
                                List.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(360);
                        Column.height(224);
                        Column.alignItems(HorizontalAlign.End);
                        Column.justifyContent(FlexAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // input
                        TextArea.create({ text: this.resultFormat(this.inputValue), controller: this.textAreaCtrl });
                        // input
                        TextArea.selectionMenuHidden(true);
                        // input
                        TextArea.customKeyboard({ builder: () => {
                                this.CustomKeyboardBuilder.call(this);
                            } });
                        // input
                        TextArea.visibility(Visibility.Visible);
                        // input
                        TextArea.fontSize(this.getDisplayFontSize());
                        // input
                        TextArea.focusable(true);
                        // input
                        TextArea.lineHeight(this.getDisplayLineHeight());
                        // input
                        TextArea.maxLines(6);
                        // input
                        TextArea.fontColor(Color.Black);
                        // input
                        TextArea.textAlign(TextAlign.End);
                        // input
                        TextArea.align(Alignment.End);
                        // input
                        TextArea.backgroundColor({ "id": 16777226, "type": 10001, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" });
                        // input
                        TextArea.onTextSelectionChange((start: number, end: number) => {
                            // 跟踪光标位置，用于退格时删除光标左侧内容
                            if (this.pendingCaret >= 0 && start !== this.pendingCaret) {
                                // 文本更新后系统把光标重置到别处：补偿回期望位置
                                this.textAreaCtrl.setTextSelection(this.pendingCaret, this.pendingCaret);
                                return;
                            }
                            if (this.pendingCaret >= 0 && start === this.pendingCaret) {
                                // 光标已到达期望位置，补偿结束
                                this.pendingCaret = -1;
                            }
                            this.caretPos = start;
                        });
                        // input
                        TextArea.margin({
                            top: 20
                        });
                    }, TextArea);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // result
                        Text.create(this.resultFormat(this.calValue));
                        // result
                        Text.fontSize(26);
                        // result
                        Text.fontWeight(CommonConstants.FONT_WEIGHT_MEDIUM);
                        // result
                        Text.fontFamily(CommonConstants.FONT_FAMILY_1);
                        // result
                        Text.fontColor('rgba(0, 0, 0, 0.6)');
                        // result
                        Text.margin({ right: 16 });
                        // result
                        Text.textAlign(TextAlign.End);
                        // result
                        Text.maxLines(1);
                        // result
                        Text.onClick(() => {
                            this.copyResult();
                        });
                    }, Text);
                    // result
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 键盘
                        Column.create();
                        // 键盘
                        Column.width('100%');
                        // 键盘
                        Column.layoutWeight(1);
                        // 键盘
                        Column.borderRadius({ topLeft: 16, topRight: 16 });
                        // 键盘
                        Column.alignItems(HorizontalAlign.Center);
                        // 键盘
                        Column.backgroundColor('rgb(241, 243, 245)');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 键盘（数据源由 @State pressKeys 驱动，模式切换时更新）
                        Row.create();
                        // 键盘（数据源由 @State pressKeys 驱动，模式切换时更新）
                        Row.padding({
                            top: 16,
                            left: 16,
                            right: 16,
                            bottom: this.uiContext.px2vp(this.bottomRectHeight) + 16
                        });
                        // 键盘（数据源由 @State pressKeys 驱动，模式切换时更新）
                        Row.width('100%');
                        // 键盘（数据源由 @State pressKeys 驱动，模式切换时更新）
                        Row.alignItems(VerticalAlign.Center);
                        // 键盘（数据源由 @State pressKeys 驱动，模式切换时更新）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, columnItemIndex?: number) => {
                            const columnItem = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 键盘每一列
                                Column.create();
                                // 键盘每一列
                                Column.justifyContent(FlexAlign.SpaceBetween);
                                // 键盘每一列
                                Column.alignItems(HorizontalAlign.Center);
                                // 键盘每一列
                                Column.height('100%');
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = (_item, keyItemIndex?: number) => {
                                    const keyItem = _item;
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.shadow({ radius: 4, color: 'rgba(0, 0, 0, 0.15)' });
                                        Column.width(this.isScienceMode ? 50 : 64);
                                        Column.height(
                                        // 占位符高度由数据决定（空槽 50 对齐；列5 空槽 0 保持等号贴底）
                                        keyItem.flag === 4 ? parseInt(keyItem.height, 10) :
                                            (this.isScienceMode ? 50 :
                                                ((columnItemIndex === (this.pressKeys.length - 1)) &&
                                                    (keyItemIndex === (columnItem.length - 1))) ? 148 : 64));
                                        Column.borderColor({ "id": 16777227, "type": 10001, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" });
                                        Column.borderRadius(this.isScienceMode ? 25 :
                                            ((columnItemIndex === (this.pressKeys.length - 1)) &&
                                                (keyItemIndex === (columnItem.length - 1))) ? 40 : 32);
                                        Column.backgroundColor(((columnItemIndex === (this.pressKeys.length - 1)) &&
                                            (keyItemIndex === (columnItem.length - 1))) ? { "id": 16777229, "type": 10001, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" } : 'rgb(255, 255, 255)');
                                        Column.alignItems(HorizontalAlign.Center);
                                        Column.justifyContent(FlexAlign.Center);
                                        Column.onClick(() => {
                                            if (this.isScienceMode) {
                                                // 科学模式统一走科学分发
                                                this.sciencePress(keyItem);
                                            }
                                            else if (keyItem.flag === 0 || keyItem.flag === 2 || keyItem.flag === 3) {
                                                this.inputSymbol(keyItem.value);
                                            }
                                            else {
                                                if (this.lastBtnIsEqu) {
                                                    this.expressions = [];
                                                }
                                                this.lastBtnIsEqu = false;
                                                this.inputNumber(keyItem.value);
                                            }
                                        });
                                        Column.width(this.isScienceMode ? 50 : 64);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (keyItem.flag === 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Image.create(keyItem.source !== undefined ? keyItem.source : '');
                                                    Image.width(keyItem.width);
                                                    Image.height(keyItem.height);
                                                }, Image);
                                            });
                                        }
                                        else if (keyItem.flag === 3) {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(keyItem.value);
                                                    Text.lineHeight(this.isScienceMode ? 40 : 48);
                                                    Text.fontSize(this.isScienceMode ? 28 : 36);
                                                    Text.fontColor(Color.White);
                                                    Text.width(keyItem.width);
                                                    Text.height(keyItem.height);
                                                    Text.textAlign(TextAlign.Center);
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else if (keyItem.flag !== 4) {
                                            this.ifElseBranchUpdateFunction(2, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(keyItem.value === 'deg' ? this.angleMode : keyItem.value);
                                                    Text.fontColor(keyItem.flag === 2 ? 'rgba(10, 89, 247, 1)' : Color.Black);
                                                    Text.fontSize(keyItem.width);
                                                    Text.width('100%');
                                                    Text.height(this.isScienceMode ? 50 : 64);
                                                    Text.lineHeight(keyItem.height);
                                                    Text.textAlign(TextAlign.Center);
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(3, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Column.pop();
                                };
                                this.forEachUpdateFunction(elmtId, columnItem, forEachItemGenFunction, (keyItem: PressKeyItem) => keyItem.value + '_' + keyItem.flag + '_' + keyItem.width, true, false);
                            }, ForEach);
                            ForEach.pop();
                            // 键盘每一列
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.pressKeys, forEachItemGenFunction, (item: Array<PressKeyItem>, index: number) => (item.length > 0 ? item[0].value : 'empty') + '_' + index, true, true);
                    }, ForEach);
                    ForEach.pop();
                    // 键盘（数据源由 @State pressKeys 驱动，模式切换时更新）
                    Row.pop();
                    // 键盘
                    Column.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * Input Symbols.
     * 输入
     *
     * @param value Input Operators.
     */
    inputSymbol(value: string) {
        if (CheckEmptyUtil.isEmpty(value)) {
            return;
        }
        let len = this.expressions.length;
        this.lastBtnIsEqu = false;
        switch (value) {
            case Symbol.CLEAN:
                this.expressions = [];
                this.calValue = '';
                this.caretPos = -1;
                this.inFuncParam = false;
                break;
            case Symbol.DEL:
                this.inputDelete(len);
                break;
            case Symbol.EQU:
                this.equPress();
                break;
            default:
                this.inputOperators(len, value);
                break;
        }
        this.formatInputValue();
    }
    /**
     * Press equals: 计算结果，结果覆盖计算式并放大显示，加入历史。
     */
    equPress() {
        let len = this.expressions.length;
        if (len === 0) {
            return;
        }
        this.getResult().then((result: boolean) => {
            if (!result) {
                return;
            }
            let expression: string = this.expressions.join('');
            this.inputValue = this.calValue;
            this.calValue = '';
            this.caretPos = -1;
            this.pendingCaret = -1;
            this.expressions = [];
            this.expressions.push(this.inputValue);
            this.lastBtnIsEqu = true;
            // 计算完成后退出函数参数输入态
            this.inFuncParam = false;
            this.history.push({
                expression: this.resultFormat(expression),
                result: this.inputValue
            });
            if (this.history.length > 50) {
                this.history.shift();
            }
        });
    }
    /**
     * Enter numbers.
     * 结果
     *
     * @param value Enter numbers.
     */
    inputNumber(value: string) {
        if (CheckEmptyUtil.isEmpty(value)) {
            return;
        }
        let len = this.expressions.length;
        let last = len > 0 ? this.expressions[len - 1] : '';
        let secondLast = len > 1 ? this.expressions[len - CommonConstants.TWO] : undefined;
        // 左括号后输入数字/小数点：作为新操作数（'.' 输入为 '0.'）
        if (last === '(') {
            this.expressions.push(value === CommonConstants.DOTS ? CommonConstants.ZERO_DOTS : value);
            this.formatInputValue();
            if (value !== CommonConstants.DOTS) {
                this.getResult();
            }
            return;
        }
        // 空函数 token（sin()）：数字插入括号中间成为参数，如 sin() + 3 → sin(3)
        if (last !== '' && CalculateUtil.isEmptyFunctionToken(last)) {
            this.expressions[len - 1] = last.slice(0, last.length - 1) +
                (value === CommonConstants.DOTS ? CommonConstants.ZERO_DOTS : value) + ')';
            this.inFuncParam = true;
            this.formatInputValue();
            // 光标保持在参数末尾（'）' 之前）
            let newPos = this.resultFormat(this.expressions[len - 1]).length - 1;
            this.caretPos = newPos;
            this.setCaretLater(newPos);
            if (value !== CommonConstants.DOTS) {
                this.getResult();
            }
            return;
        }
        // 右括号后输入数字：隐式乘法，(2+3)5 → (2+3)5（解析层补 ×）
        if (last === ')') {
            if (value === CommonConstants.DOTS) {
                return;
            }
            this.expressions.push(value);
            this.formatInputValue();
            this.getResult();
            return;
        }
        // 未闭合函数前缀（sin(、sin(30）：数字直接追加到函数参数
        if (last !== '' && CalculateUtil.isUnclosedFunctionToken(last)) {
            if (value === CommonConstants.DOTS) {
                // 支持函数参数内的小数点：sin(3.14；sin( 后按 . 输入 0.
                // 只检查当前数字段（最后一个运算符之后），允许 sin(3.14+2.5)
                if (last.endsWith('(') || /[+\-×÷^]$/.test(last)) {
                    this.expressions[len - 1] += CommonConstants.ZERO_DOTS;
                }
                else {
                    let inner = last.slice(last.indexOf('(') + 1);
                    if (CalculateUtil.hasDotInCurrentSegment(inner)) {
                        return;
                    }
                    this.expressions[len - 1] += value;
                }
            }
            else {
                this.expressions[len - 1] += value;
            }
            this.formatInputValue();
            if (value !== CommonConstants.DOTS) {
                this.getResult();
            }
            return;
        }
        // 函数表达式（sin(30) 等）后继续输入数字：
        if (last !== '' && CalculateUtil.isFunctionToken(last)) {
            if (this.inFuncParam) {
                // 函数参数输入中：数字/小数点继续追加到括号内，如 sin(3) + 0 → sin(30)
                if (value === CommonConstants.DOTS) {
                    // 参数起点取函数前缀第一个 '('（兼容 sin( 与 1/( 等不同前缀长度，含嵌套括号）
                    let inner = last.slice(last.indexOf('(') + 1, last.length - 1);
                    // 只检查当前数字段：sin(3.14+2.5) 允许，sin(3.14.) 拒绝
                    if (CalculateUtil.hasDotInCurrentSegment(inner)) {
                        return;
                    }
                    // 运算符后直接按小数点：补 0. → sin(3.14+0.)
                    if (/[+\-×÷^]$/.test(inner)) {
                        value = CommonConstants.ZERO_DOTS;
                    }
                }
                this.expressions[len - 1] = last.slice(0, last.length - 1) + value + ')';
                this.formatInputValue();
                // 光标保持在参数末尾（'）' 之前）
                let newPos = this.resultFormat(this.expressions[len - 1]).length - 1;
                this.caretPos = newPos;
                this.setCaretLater(newPos);
                if (value !== CommonConstants.DOTS) {
                    this.getResult();
                }
                return;
            }
            let tokenValue: number = CalculateUtil.evaluateToken(last, this.angleMode);
            if (!Number.isFinite(tokenValue)) {
                return;
            }
            this.expressions[len - 1] = tokenValue.toString();
            last = this.expressions[len - 1];
        }
        if (!this.validateEnter(last, value)) {
            return;
        }
        // 数字以 % 结尾时继续输入数字：% 转为除号（% 在中间当除号）
        if (last.endsWith(CommonConstants.PERCENT_SIGN)) {
            this.expressions[len - 1] = last.slice(0, last.length - 1);
            this.expressions.push(CommonConstants.DIV);
            this.expressions.push(value);
            this.formatInputValue();
            this.getResult();
            return;
        }
        // π/e 后输入数字：直接拼接显示（隐式乘法由解析层处理，如 π5、π00）
        if (last === CommonConstants.PI || last === CommonConstants.EULER) {
            this.expressions.push(value);
            this.formatInputValue();
            this.getResult();
            return;
        }
        if (!last) {
            this.expressions.push(value);
        }
        else if (!secondLast) {
            this.expressions[len - 1] += value;
        }
        if (secondLast && (CalculateUtil.isSymbol(secondLast) || secondLast === '(')) {
            this.expressions[len - 1] += value;
        }
        if (secondLast && !CalculateUtil.isSymbol(secondLast) && secondLast !== '(') {
            this.expressions.push(value);
        }
        this.formatInputValue();
        if (value !== CommonConstants.DOTS) {
            this.getResult();
        }
    }
    /**
     * 00 键：输入两个 0。
     * 开头/运算符后输入 00；整数后追加 00（5 → 500）；小数后追加 00（1.5 → 1.500）；
     * 0 后不追加；% 后转为除号；函数表达式后先代入函数值。
     */
    inputDoubleZero() {
        let len = this.expressions.length;
        let last = len > 0 ? this.expressions[len - 1] : '';
        // 空函数 token（sin()）：00 插入括号中间成为参数
        if (last !== '' && CalculateUtil.isEmptyFunctionToken(last)) {
            this.expressions[len - 1] = last.slice(0, last.length - 1) + CommonConstants.DOUBLE_ZERO + ')';
            this.inFuncParam = true;
            this.formatInputValue();
            let newPos = this.resultFormat(this.expressions[len - 1]).length - 1;
            this.caretPos = newPos;
            this.setCaretLater(newPos);
            this.getResult();
            return;
        }
        // 函数参数输入中：00 追加到括号内
        if (last !== '' && CalculateUtil.isFunctionToken(last) && this.inFuncParam) {
            this.expressions[len - 1] = last.slice(0, last.length - 1) + CommonConstants.DOUBLE_ZERO + ')';
            this.formatInputValue();
            let newPos = this.resultFormat(this.expressions[len - 1]).length - 1;
            this.caretPos = newPos;
            this.setCaretLater(newPos);
            this.getResult();
            return;
        }
        // 左括号后：输入 00
        if (last === '(') {
            this.expressions.push(CommonConstants.DOUBLE_ZERO);
            this.formatInputValue();
            this.getResult();
            return;
        }
        // 右括号后：隐式乘法
        if (last === ')') {
            this.expressions.push(CommonConstants.MUL);
            this.expressions.push(CommonConstants.DOUBLE_ZERO);
            this.formatInputValue();
            this.getResult();
            return;
        }
        // 未闭合函数前缀（sin(、sin(30）：00 直接追加到函数参数
        if (last !== '' && CalculateUtil.isUnclosedFunctionToken(last)) {
            this.expressions[len - 1] += CommonConstants.DOUBLE_ZERO;
            this.formatInputValue();
            this.getResult();
            return;
        }
        // 已闭合函数表达式（sin(30)，且不在参数输入态）：先把函数结果代入为数值（30² + 00 → 90000）
        if (last !== '' && CalculateUtil.isFunctionToken(last)) {
            let tokenValue: number = CalculateUtil.evaluateToken(last, this.angleMode);
            if (!Number.isFinite(tokenValue)) {
                return;
            }
            this.expressions[len - 1] = tokenValue.toString();
            last = this.expressions[len - 1];
        }
        if (!last || CalculateUtil.isSymbol(last) || last === '(') {
            // 开头/运算符后/左括号后：输入 00
            this.expressions.push(CommonConstants.DOUBLE_ZERO);
        }
        else if (last.endsWith(CommonConstants.PERCENT_SIGN)) {
            // 数字以 % 结尾：% 转为除号，再输入 00（与普通数字输入一致）
            this.expressions[len - 1] = last.slice(0, last.length - 1);
            this.expressions.push(CommonConstants.DIV);
            this.expressions.push(CommonConstants.DOUBLE_ZERO);
        }
        else if (last === CommonConstants.ZERO || last === CommonConstants.ZERO_DOTS) {
            // 0 / 0. 后按 00：不追加，避免出现 000 / 0.00
            return;
        }
        else if (last === CommonConstants.PI || last === CommonConstants.EULER) {
            // π/e 后输入 00：直接拼接显示（隐式乘法由解析层处理，如 π00）
            this.expressions.push(CommonConstants.DOUBLE_ZERO);
        }
        else {
            // 数字后追加 00
            this.expressions[len - 1] += CommonConstants.DOUBLE_ZERO;
        }
        this.formatInputValue();
        this.getResult();
    }
    /**
     * 括号输入：左括号/右括号。
     * '('：开头、运算符后直接输入；数字/常量/函数/右括号后按 '(' 为隐式乘法。
     * ')'：需存在未配对的左括号，且当前不在运算符/左括号之后。
     *
     * @param value '(' or ')'.
     */
    inputBracket(value: string) {
        if (value === '(') {
            // 等号后按左括号：重新开始
            if (this.lastBtnIsEqu) {
                this.expressions = [];
                this.lastBtnIsEqu = false;
            }
            let len = this.expressions.length;
            let last = len > 0 ? this.expressions[len - 1] : '';
            // 函数参数输入中：左括号留在参数内并展开为未闭合状态，
            // 如 sin(30 → sin(30(；sin(30+ → sin(30+(
            if (last !== '' && (this.inFuncParam || CalculateUtil.isUnclosedFunctionToken(last))) {
                // 闭合函数（sin(30)）：去掉尾部 ')' 再追加 '('，保持未闭合等待用户补 ')' 闭合嵌套
                if (CalculateUtil.isFunctionToken(last)) {
                    this.expressions[len - 1] = last.slice(0, last.length - 1) + '(';
                }
                else {
                    this.expressions[len - 1] += '(';
                }
                this.inFuncParam = true;
                this.formatInputValue();
                this.getResult();
                return;
            }
            if (!last || CalculateUtil.isSymbol(last) || last === '(') {
                // 开头/运算符后/左括号后：直接输入
                this.expressions.push('(');
                this.inFuncParam = false;
            }
            else {
                // 数字/常量/函数/右括号后：直接输入（隐式乘法由解析层处理，如 2( → 2(）
                this.expressions.push('(');
                this.inFuncParam = false;
            }
        }
        else {
            // 右括号
            let len = this.expressions.length;
            let last = len > 0 ? this.expressions[len - 1] : '';
            if (!last || CalculateUtil.isSymbol(last) || last === '(') {
                return;
            }
            // 空函数（sin()）已闭合：忽略并按右括号退出参数输入
            if (CalculateUtil.isEmptyFunctionToken(last)) {
                this.inFuncParam = false;
                return;
            }
            // 未闭合函数前缀（sin(30）：按右括号合并为完整函数 token sin(30)
            if (CalculateUtil.isUnclosedFunctionToken(last)) {
                this.expressions[len - 1] = last + ')';
                this.inFuncParam = false;
                this.formatInputValue();
                this.getResult();
                return;
            }
            let openCount = 0;
            let closeCount = 0;
            this.expressions.forEach((item: string) => {
                if (item === '(') {
                    openCount++;
                }
                else if (item === ')') {
                    closeCount++;
                }
            });
            if (openCount <= closeCount) {
                // 无未配对左括号：若末尾是已闭合函数，按右括号仅退出参数输入
                if (CalculateUtil.isFunctionToken(last)) {
                    this.inFuncParam = false;
                }
                return;
            }
            this.expressions.push(')');
            this.inFuncParam = false;
        }
        this.formatInputValue();
        this.getResult();
    }
    /**
     * Verify that you can enter.
     *
     * @param last Value of the last element.
     * @param value Current input value.
     * return Indicates whether to allow input.
     */
    validateEnter(last: string, value: string) {
        if (!last && value === CommonConstants.PERCENT_SIGN) {
            return false;
        }
        if ((last === CommonConstants.MIN) && (value === CommonConstants.PERCENT_SIGN)) {
            return false;
        }
        if ((last === CommonConstants.PI || last === CommonConstants.EULER) &&
            (value === CommonConstants.DOTS || value === CommonConstants.PERCENT_SIGN)) {
            return false;
        }
        if (last.endsWith(CommonConstants.PERCENT_SIGN)) {
            // 数字以 % 结尾时，允许继续输入数字（此时 % 转为除号），
            // 但不能再输入小数点（50%. 非法）或重复输入 %（50%% 非法）
            return (value !== CommonConstants.DOTS) && (value !== CommonConstants.PERCENT_SIGN);
        }
        if ((last.indexOf(CommonConstants.DOTS) !== -1) && (value === CommonConstants.DOTS)) {
            return false;
        }
        if ((last === '0') && (value !== CommonConstants.DOTS) &&
            (value !== CommonConstants.PERCENT_SIGN)) {
            return false;
        }
        return true;
    }
    /**
     * Delete Key Trigger.
     *
     * @param len Expression Length.
     */
    inputDelete(len: number) {
        if (len === 0) {
            return;
        }
        // 光标在输入串中间：删除光标左侧的字符（定位到所在 token 内部删除）
        let sel = this.caretPos;
        let inputLen = this.inputValue.length;
        if (sel >= 0 && sel < inputLen) {
            this.deleteAtCaret(sel);
            return;
        }
        let last = this.expressions[len - 1];
        let lastLen = last.length;
        if (CalculateUtil.isFunctionToken(last)) {
            // 函数表达式整体回退：去掉函数包装，还原为原操作数（sin() 还原为空则删除整个 token）
            let unwrapped = CalculateUtil.unwrapToken(last);
            if (unwrapped === '') {
                this.expressions.pop();
            }
            else {
                this.expressions[len - 1] = unwrapped;
            }
        }
        else if (lastLen === 1) {
            this.expressions.pop();
            len = this.expressions.length;
        }
        else {
            this.expressions[len - 1] = last.slice(0, last.length - 1);
        }
        if (len === 0) {
            this.inputValue = '';
            this.calValue = '';
            this.inFuncParam = false;
            return;
        }
        // 末尾删除后光标回到末尾；同步函数参数输入态（删除后仍是函数 token 则继续参数输入）
        this.formatInputValue();
        let newLast: string = this.expressions[len - 1];
        this.inFuncParam = newLast !== '' &&
            (CalculateUtil.isFunctionToken(newLast) || CalculateUtil.isUnclosedFunctionToken(newLast));
        if (!CalculateUtil.isSymbol(newLast)) {
            this.getResult();
        }
    }
    /**
     * 按光标位置删除输入串中间的字符（光标左侧）。
     * 先定位光标所在的 token，再删除 token 内光标左侧字符；
     * 删除后若 token 畸形则回退为最内层数字。
     *
     * @param sel 光标在格式化输入串中的字符索引。
     */
    deleteAtCaret(sel: number) {
        let len = this.expressions.length;
        let pos = 0;
        let tokenIdx = len - 1;
        let offset = sel;
        for (let i = 0; i < len; i++) {
            let fmtLen = this.resultFormat(this.expressions[i]).length;
            if (sel <= pos + fmtLen) {
                tokenIdx = i;
                offset = sel - pos;
                break;
            }
            pos += fmtLen;
        }
        if (offset === 0) {
            // 光标在 token 开头：删除前一个 token 的最后一个字符
            if (tokenIdx === 0) {
                return;
            }
            let prevIdx = tokenIdx - 1;
            let prevTok = this.expressions[prevIdx];
            if (prevTok.length === 1) {
                this.expressions.splice(prevIdx, 1);
            }
            else {
                this.expressions[prevIdx] = prevTok.slice(0, prevTok.length - 1);
            }
        }
        else {
            let tok = this.expressions[tokenIdx];
            let fmt = this.resultFormat(tok);
            // 光标左侧的格式化字符，跳过千分位逗号
            let left = offset - 1;
            while (left >= 0 && fmt.charAt(left) === ',') {
                left--;
            }
            if (left < 0) {
                return;
            }
            // 映射回原 token 的字符索引（去掉已跳过的逗号）
            let commasBefore = 0;
            for (let k = 0; k < left; k++) {
                if (fmt.charAt(k) === ',') {
                    commasBefore++;
                }
            }
            let rawIdx = left - commasBefore;
            let newTok = tok.slice(0, rawIdx) + tok.slice(rawIdx + 1);
            // 删除后畸形（既非数字/函数/括号/常量）时回退为最内层数字
            if (newTok !== '' && !this.isTokenValid(newTok)) {
                let match = newTok.match(/\d+(\.\d+)?/);
                newTok = (match !== null && match.length > 0) ? match[0] : '';
            }
            if (newTok === '') {
                this.expressions.splice(tokenIdx, 1);
            }
            else {
                this.expressions[tokenIdx] = newTok;
            }
        }
        this.formatInputValue();
        // 同步函数参数输入态：删除后仍是函数/未闭合函数 token 则继续参数输入，
        // 否则退出（避免后续 π/e/数字被追加到函数外）
        let lastTok: string = this.expressions.length > 0 ? this.expressions[this.expressions.length - 1] : '';
        this.inFuncParam = lastTok !== '' &&
            (CalculateUtil.isFunctionToken(lastTok) || CalculateUtil.isUnclosedFunctionToken(lastTok));
        // 光标移到删除位置（虚拟光标）；渲染完成后同步 TextArea 光标，避免跳回末尾
        let newSel = sel - 1 < 0 ? 0 : sel - 1;
        this.caretPos = newSel;
        this.setCaretLater(newSel);
        if (this.expressions.length === 0) {
            this.inputValue = '';
            this.calValue = '';
            return;
        }
        if (!CalculateUtil.isSymbol(lastTok)) {
            this.getResult();
        }
    }
    /**
     * 判断 token 删除部分字符后是否仍是合法 token。
     *
     * @param token 待判断的 token.
     * @return 是否合法.
     */
    isTokenValid(token: string): boolean {
        if (CalculateUtil.isFunctionToken(token) || CalculateUtil.isUnclosedFunctionToken(token)) {
            return true;
        }
        if (token === '(' || token === ')' || token === CommonConstants.PI || token === CommonConstants.EULER) {
            return true;
        }
        if (CommonConstants.OPERATORS.indexOf(token) !== -1) {
            return true;
        }
        // 数字（含小数点、千分位逗号）、带 % / ² / ! 后缀
        return /^[\d,.]+$/.test(token) || /^[\d.]+[%²!]?$/.test(token);
    }
    /**
     * Triggered when input is added, subtracted, multiplied, and divided.
     *
     * @param len Expression Length.
     * @param value Current Input Value.
     */
    inputOperators(len: number, value: string) {
        let last = len > 0 ? this.expressions[len - 1] : '';
        // 函数参数输入中（含未闭合函数、空函数）：运算符留在括号内作为参数表达式，
        // 如 sin(30 + → sin(30+；sin() - → sin(-
        if (last !== '' && (this.inFuncParam || CalculateUtil.isUnclosedFunctionToken(last) ||
            CalculateUtil.isEmptyFunctionToken(last))) {
            let opSym = this.getSymbol(value);
            // 闭合函数（sin(30)）：运算符插在 ')' 之前，sin(30) + → sin(30+)
            if (CalculateUtil.isFunctionToken(last)) {
                this.expressions[len - 1] = last.slice(0, last.length - 1) + opSym + ')';
            }
            else {
                this.expressions[len - 1] += opSym;
            }
            this.inFuncParam = true;
            this.formatInputValue();
            this.getResult();
            return;
        }
        // 输入运算符后退出函数参数输入态
        this.inFuncParam = false;
        let secondLast = len > 1 ? this.expressions[len - CommonConstants.TWO] : undefined;
        if (!last && (value === Symbol.MIN)) {
            this.expressions.push(this.getSymbol(value));
            return;
        }
        if (!last) {
            return;
        }
        // 左括号后只允许负号（一元负号，如 (-5)）
        if (last === '(') {
            if (value === Symbol.MIN) {
                this.expressions.push(this.getSymbol(value));
            }
            return;
        }
        if (!CalculateUtil.isSymbol(last)) {
            this.expressions.push(this.getSymbol(value));
            return;
        }
        if ((value === Symbol.MIN) &&
            (last === CommonConstants.MIN || last === CommonConstants.ADD)) {
            this.expressions.pop();
            this.expressions.push(this.getSymbol(value));
            return;
        }
        if (!secondLast) {
            return;
        }
        if (value !== Symbol.MIN) {
            this.expressions.pop();
        }
        if (CalculateUtil.isSymbol(secondLast)) {
            this.expressions.pop();
        }
        this.expressions.push(this.getSymbol(value));
    }
    /**
     * Get Operator.
     *
     * @param value.
     * @return Operators.
     */
    getSymbol(value: string) {
        if (CheckEmptyUtil.isEmpty(value)) {
            return '';
        }
        let symbol = '';
        switch (value) {
            case Symbol.ADD:
                symbol = CommonConstants.ADD;
                break;
            case Symbol.MIN:
                symbol = CommonConstants.MIN;
                break;
            case Symbol.MUL:
                symbol = CommonConstants.MUL;
                break;
            case Symbol.DIV:
                symbol = CommonConstants.DIV;
                break;
            case Symbol.POW:
                symbol = CommonConstants.POW;
                break;
            default:
                break;
        }
        return symbol;
    }
    /**
     * Make a deep copy of an expression.
     *
     * @return deep copy expression.
     */
    deepCopy(): Array<string> {
        let copyExpressions: Array<string> = Array.from(this.expressions);
        return copyExpressions;
    }
    /**
     * Obtaining Results.
     *
     * @return Whether the result is incorrect.
     */
    async getResult() {
        // 正在输入函数参数（sin(、sin(30）时不做预览
        let len = this.expressions.length;
        if (len > 0 && CalculateUtil.isUnclosedFunctionToken(this.expressions[len - 1])) {
            this.calValue = '';
            return false;
        }
        // 空函数（sin()）参数未填，不做预览
        if (len > 0 && CalculateUtil.isEmptyFunctionToken(this.expressions[len - 1])) {
            this.calValue = '';
            return false;
        }
        let calResult = CalculateUtil.parseExpression(this.deepCopy(), this.angleMode);
        if (calResult === 'NaN') {
            this.calValue = this.resourceToString({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" });
            return false;
        }
        this.calValue = calResult;
        return true;
    }
    /**
     * Number Formatting.
     *
     * @param value Formatting parameters.
     * @return Thousand percentile data.
     */
    resultFormat(value: string) {
        try {
            let reg = (value.indexOf('.') > -1) ?
                new RegExp('(\\d)(?=(\\d{3})+\\.)', 'g') :
                new RegExp('(\\d)(?=(?:\\d{3})+$)', 'g');
            return value.replace(reg, '$1,');
        }
        catch (error) {
            Logger.error('[CalculateModel] resultFormat fail: ' + JSON.stringify(error));
            return value;
        }
    }
    /**
     * Convert a resource file to a string.
     *
     * @param resource Resource file.
     * @return Character string converted from the resource file.
     */
    resourceToString(resource: Resource): string {
        if (CheckEmptyUtil.isEmpty(resource)) {
            return '';
        }
        let result = '';
        try {
            result = (this.uiContext.getHostContext() as common.UIAbilityContext).resourceManager.getStringSync(resource.id);
        }
        catch (error) {
            Logger.error('[CalculateModel] getResourceString fail: ' + JSON.stringify(error));
        }
        return result;
    }
    /**
     * Thousands in the formatting result.
     */
    formatInputValue() {
        let deepExpressions: Array<string> = [];
        this.deepCopy().forEach((item: string, index: number) => {
            deepExpressions[index] = this.resultFormat(item);
        });
        this.inputValue = deepExpressions.join('');
        // 输入内容更新后，光标视为回到末尾（除非随后按 ⌫ 走光标删除逻辑）；
        // 同时作废未完成的旧光标补偿
        this.caretPos = -1;
        this.pendingCaret = -1;
    }
    /**
     * Science mode key dispatch.
     *
     * @param keyItem Pressed key item.
     */
    sciencePress(keyItem: PressKeyItem) {
        let value: string = keyItem.value;
        // 括号
        if (value === '(' || value === ')') {
            this.inputBracket(value);
            return;
        }
        // 00 键：输入两个 0（开头/运算符后输入 00，数字后追加 00）
        if (value === '00') {
            if (this.lastBtnIsEqu) {
                this.expressions = [];
                this.inFuncParam = false;
            }
            this.lastBtnIsEqu = false;
            this.inputDoubleZero();
            return;
        }
        // 数字、小数点、百分号：等号后按数字重新开始输入
        if ('0123456789.%'.indexOf(value) !== -1) {
            if (this.lastBtnIsEqu) {
                this.expressions = [];
                this.inFuncParam = false;
            }
            this.lastBtnIsEqu = false;
            this.inputNumber(value);
            return;
        }
        this.lastBtnIsEqu = false;
        // 四则与幂运算符：等号后继续基于结果计算
        if (CommonConstants.OPERATORS.indexOf(value) !== -1) {
            this.inputOperators(this.expressions.length, value);
            this.formatInputValue();
            return;
        }
        // 控制键
        if (value === 'AC') {
            this.expressions = [];
            this.calValue = '';
            this.inFuncParam = false;
            this.formatInputValue();
            return;
        }
        if (value === '⌫') {
            this.inputDelete(this.expressions.length);
            return;
        }
        // 等号：计算结果并放大展示
        if (value === '=') {
            this.equPress();
            return;
        }
        // 科学函数与常量
        switch (value) {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
                this.unaryOp(value);
                break;
            case '!':
                this.unaryOp('factorial');
                break;
            case '√':
                this.unaryOp('sqrt');
                break;
            case '1/x':
                this.unaryOp('reciprocal');
                break;
            case 'x²':
                this.unaryOp('square');
                break;
            case 'π':
                this.inputConstant(CommonConstants.PI);
                break;
            case 'e':
                this.inputConstant(CommonConstants.EULER);
                break;
            case 'deg':
                this.angleMode = (this.angleMode === 'deg') ? 'rad' : 'deg';
                break;
            default:
                break;
        }
    }
    /**
     * Input constant (Pi / Euler e).
     *
     * @param symbol Constant symbol.
     */
    inputConstant(symbol: string) {
        let len = this.expressions.length;
        let last = len > 0 ? this.expressions[len - 1] : '';
        // 空函数 token（log()）：常量插入括号中间成为参数，如 log() + e → log(e)
        if (last !== '' && CalculateUtil.isEmptyFunctionToken(last)) {
            this.expressions[len - 1] = last.slice(0, last.length - 1) + symbol + ')';
            this.inFuncParam = true;
            this.formatInputValue();
            let newPos = this.resultFormat(this.expressions[len - 1]).length - 1;
            this.caretPos = newPos;
            this.setCaretLater(newPos);
            this.getResult();
            return;
        }
        // 未闭合函数前缀（sin(、sin(3）：常量追加到参数内，如 sin(3 + e → sin(3e)
        if (last !== '' && CalculateUtil.isUnclosedFunctionToken(last)) {
            this.expressions[len - 1] += symbol;
            this.inFuncParam = true;
            this.formatInputValue();
            this.getResult();
            return;
        }
        // 函数参数输入中（sin(3) 后继续输入）：常量追加到括号内，与数字行为一致
        if (last !== '' && CalculateUtil.isFunctionToken(last) && this.inFuncParam) {
            this.expressions[len - 1] = last.slice(0, last.length - 1) + symbol + ')';
            this.inFuncParam = true;
            this.formatInputValue();
            let newPos = this.resultFormat(this.expressions[len - 1]).length - 1;
            this.caretPos = newPos;
            this.setCaretLater(newPos);
            this.getResult();
            return;
        }
        if (CheckEmptyUtil.isEmpty(last) || CalculateUtil.isSymbol(last) || last === '(') {
            this.expressions.push(symbol);
        }
        else {
            // 数字/常量/函数/右括号后按 π/e：直接拼接显示（隐式乘法由解析层处理，如 5π）
            this.expressions.push(symbol);
        }
        this.formatInputValue();
        this.getResult();
    }
    /**
     * Unary operation on the last operand:
     * square / sqrt / reciprocal / sin / cos / tan / log / ln / factorial.
     * 与手机计算器一致：在输入栏展示函数表达式（如 sin(30)），
     * 底部预览小号结果，点击等号后再放大结果。
     *
     * @param op Operation type.
     */
    unaryOp(op: string) {
        let len = this.expressions.length;
        let last = len > 0 ? this.expressions[len - 1] : '';
        // x² 在函数参数输入中：平方后缀留在参数内，如 sin(30 → sin(30²
        if (op === 'square' && last !== '' &&
            (this.inFuncParam || CalculateUtil.isUnclosedFunctionToken(last))) {
            if (CalculateUtil.isFunctionToken(last)) {
                this.expressions[len - 1] = last.slice(0, last.length - 1) + '²' + ')';
            }
            else {
                this.expressions[len - 1] += '²';
            }
            this.inFuncParam = true;
            this.formatInputValue();
            this.getResult();
            return;
        }
        // 开头/运算符后/左括号后按函数键：生成成对括号 sin()，光标移到括号中间等待输入参数；
        // x²/阶乘/倒数在无操作数时可作用对象，忽略
        if (len === 0 || CalculateUtil.isSymbol(last) || last === '(') {
            let prefix = '';
            switch (op) {
                case 'sin':
                    prefix = 'sin()';
                    break;
                case 'cos':
                    prefix = 'cos()';
                    break;
                case 'tan':
                    prefix = 'tan()';
                    break;
                case 'log':
                    prefix = 'log()';
                    break;
                case 'ln':
                    prefix = 'ln()';
                    break;
                case 'sqrt':
                    prefix = '√()';
                    break;
                default: return;
            }
            this.expressions.push(prefix);
            this.inFuncParam = false;
            this.formatInputValue();
            // 光标移到左括号之后（括号中间）：√() 较短，中间位为 2，其余函数为 4
            let mid = (op === 'sqrt') ? 2 : 4;
            this.caretPos = mid;
            this.setCaretLater(mid);
            return;
        }
        if (last.endsWith(CommonConstants.PERCENT_SIGN)) {
            return;
        }
        // 右括号后按函数：先把括号表达式作为整体求值折叠，如 (2+3) 后按 sin → sin(5)
        if (last === ')') {
            let depth = 0;
            let start = -1;
            for (let i = len - 1; i >= 0; i--) {
                let t: string = this.expressions[i];
                if (t === ')') {
                    depth++;
                }
                else if (t === '(') {
                    depth--;
                    if (depth === 0) {
                        start = i;
                        break;
                    }
                }
            }
            if (start === -1) {
                return;
            }
            let seg: Array<string> = this.expressions.slice(start);
            let segVal: string = CalculateUtil.parseExpression(seg, this.angleMode);
            if (segVal === 'NaN') {
                this.calValue = this.resourceToString({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" });
                return;
            }
            this.expressions = this.expressions.slice(0, start).concat([segVal]);
            len = this.expressions.length;
            last = this.expressions[len - 1];
        }
        let value: number = CalculateUtil.evaluateToken(last, this.angleMode);
        // 空函数/畸形操作数（sin() 等）无法求值：忽略本次按键，避免产生 log(sin()) 这类嵌套
        if (Number.isNaN(value) || !Number.isFinite(value)) {
            return;
        }
        // π/e 是弧度常量：操作数只要含 π 或 e（如 π、2π）就按弧度计算，cos(π) = -1；纯数字按当前角度模式
        let isRadConstant: boolean = /[eπ]/.test(last);
        let trigRad: number = (this.angleMode === 'deg' && !isRadConstant) ? value * Math.PI / 180 : value;
        let result = 0;
        switch (op) {
            case 'square':
                result = value * value;
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'reciprocal':
                result = 1 / value;
                break;
            case 'sin':
                result = Math.sin(trigRad);
                break;
            case 'cos':
                result = Math.cos(trigRad);
                break;
            case 'tan':
                result = Math.tan(trigRad);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'factorial':
                result = CalculateUtil.factorial(value);
                break;
            default:
                return;
        }
        result = CalculateUtil.trimFloat(result);
        // 用函数表达式替换原操作数，保留在输入栏展示
        this.expressions[len - 1] = this.wrapFunction(op, last);
        // 前缀函数（sin(30)、1/(8) 等）：进入参数输入态，后续数字/00/π/e 继续进括号
        if (op === 'sin' || op === 'cos' || op === 'tan' || op === 'log' || op === 'ln' ||
            op === 'sqrt' || op === 'reciprocal') {
            this.inFuncParam = true;
        }
        this.formatInputValue();
        if (Number.isNaN(result) || !Number.isFinite(result)) {
            this.calValue = this.resourceToString({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" });
            return;
        }
        this.getResult();
    }
    /**
     * Wrap the last operand into a function expression token.
     * 30 + square -> 30²；30 + sin -> sin(30)；30 + reciprocal -> 1/(30)。
     *
     * @param op Operation type.
     * @param last Last operand token.
     * @return Function expression token.
     */
    wrapFunction(op: string, last: string): string {
        switch (op) {
            case 'square':
                return last + '²';
            case 'factorial':
                return last + '!';
            case 'reciprocal':
                return '1/(' + last + ')';
            case 'sqrt':
                return '√(' + last + ')';
            case 'sin':
                return 'sin(' + last + ')';
            case 'cos':
                return 'cos(' + last + ')';
            case 'tan':
                return 'tan(' + last + ')';
            case 'log':
                return 'log(' + last + ')';
            case 'ln':
                return 'ln(' + last + ')';
            default:
                return last;
        }
    }
    /**
     * Copy result to clipboard.
     */
    copyResult() {
        let text: string = this.calValue !== '' ? this.calValue : this.inputValue;
        if (CheckEmptyUtil.isEmpty(text)) {
            return;
        }
        try {
            let data = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
            pasteboard.getSystemPasteboard().setData(data).then(() => {
                promptAction.openToast({ message: this.resourceToString({ "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.calculator", "moduleName": "entry" }) });
            }).catch((err: BusinessError) => {
                Logger.error('[CalculateModel] copy result fail: ' + JSON.stringify(err));
            });
        }
        catch (error) {
            Logger.error('[CalculateModel] copy result exception: ' + JSON.stringify(error));
        }
    }
    /**
     * Fill history result back to input.
     *
     * @param index History index.
     */
    useHistory(index: number) {
        if (index < 0 || index >= this.history.length) {
            return;
        }
        let item: HistoryItem = this.history[index];
        this.inputValue = item.result;
        this.calValue = '';
        this.caretPos = -1;
        this.pendingCaret = -1;
        this.expressions = [item.result];
        this.lastBtnIsEqu = false;
        this.inFuncParam = false;
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "HomePage";
    }
}
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.example.calculator", moduleName: "entry", pagePath: "pages/HomePage", pageFullPath: "entry/src/main/ets/pages/HomePage", integratedHsp: "false", moduleType: "followWithHap" });
