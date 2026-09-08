## 一、实验内容

> 本实验主要介绍的ArkTS程序编译后在鸿蒙系统安装运行。通过本实验，您将能够掌握在ArkTS程序的编译，熟悉在鸿蒙系统的安装和运行的查看。本实验需要用到一台安装有Windows10 64位或Windows11 64位的主机，要求内存为16GB及以上，推荐为32GB，硬盘为100GB及以上，分辨率：1280*800像素及以上。

### （一）实验目的

1. 掌握基础的ArkTS程序开发；
2. 开发一个具有自己个性风格的计算器；
3. 掌握ArkTS语法与ArkUI声明式 UI 开发范式。

### （二）实验任务

本实验一共需要实现一个手机计算器应用，包含**普通模式**与**科学模式**两套键盘布局，可随时切换，主要功能需求如下：

#### 1. 普通模式功能需求

- 支持0~9、小数点、00键输入，支持`+`、`-`、`×`、`÷`四则运算与百分号运算；
- 支持清空、退格删除与等号计算；
- 输入过程中在输入栏底部实时浮现小号结果预览，与手机系统计算器交互一致。

#### 2. 科学模式功能需求

- 在普通模式基础上增加`sin`、`cos`、`tan`、`log`、`ln`、`√`、`x²`、`1/x`、`!`（阶乘）、`^`（乘方）、`π`、`e`、括号等科学功能；
- 提供deg/rad`角度制/弧度制切换按键；
- 支持括号嵌套与函数嵌套，如`sin(1/(8))`、`sin(30+(5))`等；
- 保证隐式乘法语义正确：`2÷3π ≠ 2÷3×π`（前者为`2/(3π)`，后者为`(2/3)π`）。

#### 3. 全局功能需求

- 支持科学/普通模式一键切换，切换后状态正确重置，科学函数不会与普通输入互相干扰；
- 历史记录入口化：点击标题栏历史按钮进入历史页面（此时隐藏计算器界面），展示全部历史表达式与结果，点击任意一条记录可回填到输入栏继续计算。

### （三）实验步骤

1. **创建工程并配置应用入口。**使用DevEco Studio新建HarmonyOS工程（phone设备类型，空Ability模板），生成`entry`模块。工程核心目录结构如下：

   ![工程目录结构](https://img.remit.ee/i/cQF7rkzkkADr)
   
2. **配置UIAbility生命周期与窗口。**在`EntryAbility.ets`中重写`onCreate / onWindowStageCreate / onForeground / onBackground / onDestroy`等生命周期方法，通过 `windowStage.loadContent('pages/HomePage')`加载主页面；在`onWindowStageCreate`中设置窗口全屏，并注册`avoidAreaChange`监听动态获取状态栏与导航条避让区高度存入`AppStorage`，供页面做安全区适配，保证键盘不被系统导航条遮挡。

   ```typescript
   // EntryAbility.ets 关键片段
   let isLayoutFullScreen = true;
   windowClass.setWindowLayoutFullScreen(isLayoutFullScreen);
   let avoidArea = windowClass.getWindowAvoidArea(window.AvoidAreaType.TYPE_NAVIGATION_INDICATOR);
   let bottomRectHeight = avoidArea.bottomRect.height;
   AppStorage.setOrCreate('bottomRectHeight', bottomRectHeight);
   ```

3. **设计页面整体结构。**`HomePage.ets`使用`@Entry @Component`声明页面，整体布局为：顶部标题栏（显示`deg/rad`角度模式、历史记录入口、模式切换按钮）→ 中部输入展示区（`TextArea`承载表达式输入、`Text`展示结果预览）→ 底部自定义键盘区（`Grid`网格 + `ForEach`渲染按键）。通过`@State`管理输入值、结果值、历史记录、科学模式开关、角度模式、历史页面开关等状态，任一状态变化都会驱动UI自动刷新，充分体现声明式UI的响应式特点。

   ```typescript
   @State inputValue: string = '';           // 输入栏表达式
   @State calValue: string = '';             // 结果预览/展示
   @State isScienceMode: boolean = false;    // 科学模式开关
   @State angleMode: string = 'deg';         // 角度模式
   @State showHistoryPage: boolean = false;  // 历史记录页开关
   @State history: Array<HistoryItem> = [];  // 历史记录
   private expressions: Array<string> = [];  // 表达式token数组
   ```

   ![普通模式主界面](https://img.remit.ee/i/SqYKF9xexu0J)

4. **构建键盘数据源。**新建`PressKeysViewModel`类提供普通模式与科学模式两套按键数据（`PressKeyItem`封装按键文案、行列占比flag、宽高尺寸等）。普通模式为5列布局，科学模式为5列 × 7行布局，其中`=`、`AC`、`⌫`等键通过flag控制跨行/跨列显示；`deg/rad`键复用科学模式第5列空白槽位，显示当前角度模式。页面按当前模式从ViewModel获取对应按键数组渲染。

5. **实现按键分发与输入逻辑。**在`HomePage`中实现`sciencePress`统一按键入口，将按键分发给数字输入、运算符输入、括号输入、常量输入、删除、等号、函数运算等处理方法；输入过程以`expressions`token数组为权威状态（数字、运算符、函数token各自成元素），配合`formatInputValue`实时刷新输入栏与结果预览。对`00`键单独处理：空函数括号内、函数参数内、普通数字后、等号后等不同上下文分别追加`00`到正确位置。

   ![表达式输入与结果预览](https://img.remit.ee/i/aot1JQ3zLQJz)

6. **实现计算引擎。**在`CalculateUtil.ets`中实现完整的表达式解析与求值：先将表达式token化（数字、函数调用整体、运算符、括号、`π`/`e`），再通过**调度场算法（Shunting-yard）**将中缀表达式转为后缀表达式，最后用栈完成后缀求值。关键设计点包括：

   - **运算符优先级**：`+ -`最低，`× ÷`其次，`^`与隐式乘法`·` 最高；
   - **隐式乘法**：`3π`、`2(3)`、`(2+3)5`这类相邻操作数自动插入隐式乘号`·`，且`·`优先级高于`÷`，保证`2÷3π = 2/(3π) ≈ 0.212`，而`2÷3×π = (2/3)π ≈ 2.094`；
   - **函数求值**：`sin/cos/tan/log/ln/√/x²/（1/x）/!`均支持嵌套（如 `cos(sin(30))`）；
   - **角度/弧度**：三角函数参数中只要含`π`或`e`即按弧度计算（`cos(π) = -1`），纯数字参数按`deg/rad`模式处理（`sin(30) = 0.5`）；
   - **百分号**：`30%`并入数字token作为后缀运算，`sin(30%)`中的`%`不会破坏函数求值；
   - **常量混合**：支持`3e`、`2π`、`πe`等数字与常量的混合求值；
   - **结果精度**：`trimFloat`清理浮点误差。

7. **实现等号、结果展示与连续运算。**`equPress`在按下等号时将当前表达式求值，结果写入历史记录（最多保留50条），并通过状态切换实现"输入过程小号结果预览、等号后结果放大覆盖计算式"的交互；`lastBtnIsEqu`标记等号状态，之后直接输入数字会开启新一轮计算。

   ![等号后结果放大](https://img.remit.ee/i/jS4V50tQ059Y)

8. **实现历史记录入口。**标题栏历史按钮切换`showHistoryPage`，为`true`时隐藏计算器界面、展示历史列表；点击某条记录调用`useHistory`将其表达式回填输入栏并重新计算，便于继续编辑。

   ![历史记录页面](https://img.remit.ee/i/VVxuUmpKqS6R)

9. **实现科学/普通模式切换与状态重置。**右上角按钮切换`isScienceMode`，切换时同步更换键盘数据源，并清空残留的输入状态（函数参数标记、光标残留等），避免出现"切回科学模式后sin失灵、log与sin嵌套"等脏状态问题。

   ![科学模式界面](https://img.remit.ee/i/ulk0LO4FnjIs)

10. **进行逻辑样例测试与模拟器调试。**由于计算逻辑复杂、边界场景多，编写了基于Node.js的样例测试脚本：将真实`.ets`纯逻辑文件转译为可执行JS用模拟`HomePage`状态机的`MiniCalc`类逐字复刻页面输入逻辑，通过按键序列驱动断言输入栏与结果值。测试覆盖嵌套计算、来回乘除、多项式、隐式乘法、弧度语义、多小数点、`00`键、倒数参数内输入等场景，共**214个样例全部通过**，作为功能正确性的回归保障；随后在DevEco Studio中编译运行，在模拟器上验证界面布局与交互。

### （四）核心代码片段

#### 1. PresskeysViewModel 科学模式键盘数据（节选）

```typescript
// 科学模式按键（5列 × 7行）
getSciencePressKeys(): Array<Array<PressKeyItem>> {
  return [
    [ new PressKeyItem(1, '18vp', '26vp', '('), new PressKeyItem(1, '18vp', '26vp', 'sin'),
      new PressKeyItem(1, '18vp', '26vp', 'log'), new PressKeyItem(1, '18vp', '26vp', '!'),
      new PressKeyItem(2, '18vp', '26vp', '^'), new PressKeyItem(1, '18vp', '26vp', '√'),
      new PressKeyItem(1, '18vp', '26vp', 'π') ],
    [ new PressKeyItem(1, '18vp', '26vp', ')'), new PressKeyItem(1, '18vp', '26vp', 'cos'),
      new PressKeyItem(1, '18vp', '26vp', 'ln'), new PressKeyItem(1, '22vp', '30vp', '7'),
      new PressKeyItem(1, '22vp', '30vp', '4'), new PressKeyItem(1, '22vp', '30vp', '1'),
      new PressKeyItem(1, '22vp', '30vp', 'e') ],
    // …… 共 7 行，5 列
  ];
}
```

#### 2. CalculateUtil 隐式乘法预处理

```typescript
// 相邻操作数之间自动插入隐式乘号·（如3π、2(3)、(2+3)5）
let prevIsOperandEnd = prev !== '' && prev !== '(' && !this.isSymbol(prev);
let curIsOperandStart = current === '(' ||
  (current !== ')' && !this.isSymbol(current) && current !== '%');
if (prevIsOperandEnd && curIsOperandStart) {
  merged.push(CommonConstants.IMPLICIT_MUL);
}
```

#### 3. CalculateUtil 运算符优先级（隐式乘法最高、左结合）

```typescript
case SymbolicEnumeration.IMPLICIT_MUL:
  // 隐式乘法（3π）：优先级最高（与幂同级、左结合），使2÷3π = 2÷(3×π)
  result = Priority.HIGHEST;
  break;
case SymbolicEnumeration.POW:
  result = Priority.HIGHEST;
  break;
```

#### 4. HomePage 输入框光标控制（解决更新后光标跳回末尾）

```typescript
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
```

#### 5. HomePage 函数参数内继续输入（数字/小数点留在括号内）

```typescript
// 函数表达式（sin(30)等）后继续输入数字：
if (last !== '' && CalculateUtil.isFunctionToken(last)) {
  if (this.inFuncParam) {
    // 函数参数输入中：数字/小数点继续追加到括号内，如sin(3) + 0 → sin(30)
    if (value === CommonConstants.DOTS) {
      // 参数起点取函数前缀第一个'('（兼容sin(与1/(等不同前缀长度，含嵌套括号）
      let inner = last.slice(last.indexOf('(') + 1, last.length - 1);
      // 只检查当前数字段：sin(3.14+2.5)允许，sin(3.14.)拒绝
      if (CalculateUtil.hasDotInCurrentSegment(inner)) {
        return;
      }
    }
    this.expressions[len - 1] = last.slice(0, last.length - 1) + value + ')';
    this.formatInputValue();
    // 光标保持在参数末尾（'）'之前）
    let newPos = this.resultFormat(this.expressions[len - 1]).length - 1;
    this.caretPos = newPos;
  }
}
```

### （五）实验结果

编译并在模拟器/手机上运行。项目运行后：

- 普通模式键盘显示正常，输入`987÷654+32×10`后输入栏正确展示表达式，底部实时浮现小号结果预览 `321.50917...`；按下等号后结果放大覆盖计算式，再次输入数字开启新一轮计算；
- 科学模式切换正常，`sin/cos/tan/log/ln/√/x²/1/x/%/!/π/e/()`等按键布局对齐；输入`ln(e^2)`后继续输入数字仍保留在括号内，`ln(ln(e^2)×e)`计算结果为`1.6931...`，其余计算式结果测试均正确；
- 历史记录入口可进入历史页面，展示全部计算记录，点击任意一条可回填输入栏继续计算；
- 输入框光标可自由移动，删除键删除光标左侧元素，删除后光标不再跳回末尾；
- 214条逻辑样例测试全部通过，计算正确性得到回归保障。

![普通模式运行效果](https://img.remit.ee/i/zeN8dG79xtiR)

![科学模式运行效果](https://img.remit.ee/i/PgWsWLScZWg4)

![历史记录效果](https://img.remit.ee/i/A6bRSkgTh3f7)

## 二、问题总结与体会

本次实验属于鸿蒙应用开发综合实验，结合ArkTS声明式UI、自定义键盘输入、表达式解析算法、状态管理与光标控制，完成了一个功能完整的科学计算器应用。开发过程中我遇到若干问题，通过阅读文档、分析逻辑、编写样例测试逐一解决。

#### 第一个遇到的问题：`00`键异常，有时没反应、连`0`也点不出来，有时直接把外层括号或科学函数清除了。

排查发现两处根因：一是`inputDoubleZero`的"函数求值折叠"分支被放在参数内输入分支之前，参数态下点`00`时函数被提前求值替换（`sin(30)`变成`0.5`）；二是部分分支对`0`、`0.`静默拦截且输入校验拒绝在`0`后再输入`0`。修复：重排分支顺序，让参数态下`00`一律按"留在括号内追加"处理（`sin(30)` + `00` → `sin(3000)`），普通数字后`00`正常追加，纯`0`后不再误拦。

#### 第二个问题：使用`sin(30)`之后再输入数字或运算符，内容"跳出括号"，甚至变成`sin(30)+5`。

根因是`unaryOp`包装出函数表达式后未进入"函数参数输入态"（`inFuncParam`未置位），后续输入走了"代入求值"路径，把`sin(30)`直接算成`0.5`再接数字。修复：`sin/cos/tan/log/ln/√/1/x`包装后统一进入参数输入态，函数参数内的一切输入（数字、小数点、`π`、`e`、四则、`x²`、`%`、`00`）都保留在括号内，光标位置交给用户决定。

#### 第三个问题：隐式乘法优先级错误，`2÷3π`和`2÷3×π`结果相同。

早期实现把隐式乘法（`3π`、`2(3)`）直接替换为普通`×`，与显式乘除同级，导致`2÷3π`被算成`(2/3)π`。修复：新增内部符号`·`（隐式乘号），优先级设为最高（与`^`同级、左结合），解析层预处理时插入`·`，从而`2÷3π = 2/(3π) ≈ 0.212 ≠ (2/3)π ≈ 2.094`。

#### 第四个问题：三角函数弧度语义错误，`cos(π)`不是 -1，`sin(π/4)`结果是一个0.0137左右的浮点数。

最初只有参数"纯由数字和 π/e 组成"时才按弧度计算，参数含运算符（如`sin(5÷2×e×π÷e÷5÷2)`）时误退回角度模式，相当于算了角度的正弦，结果完全错误。修复：只要参数含`π`或`e`即按弧度计算，纯数字参数仍按`deg/rad`模式处理，保证`cos(π) = -1`、`sin(π/4) ≈ 0.707`等数学语义正确。

#### 第五个问题：函数参数内小数点被整段参数里的点挡住，`sin(1.5+2.5)`的第二个小数点输不进去。

修复：按"最后一个运算符/左括号之后的当前数字段"判断是否已有小数点，只阻止同一数字段内的重复小数点；运算符后直接按`.`自动补`0.`（`sin(1.5+.5)` → `sin(1.5+0.5)`）。

#### 第六个问题：输入框光标错乱，删除后光标跳回末尾，函数嵌套时括号内定位错误。

修复：引入"光标版本号 + 延迟双设置 + 残留清除"机制（`caretSeq` / `pendingCaret`），文本更新后分段延迟设置光标位置，旧延迟回调发现版本过期即跳过；删除时按新token重算函数参数态，保证删除光标左侧元素后光标不跳回末尾、函数括号内删除仍留在括号内。

本次实验让我完整走通了鸿蒙应用开发流程，理解了ArkUI声明式UI的响应式渲染模型，也深刻体会到"计算器看似简单，边界极多"：运算符优先级、隐式乘法、括号嵌套、函数参数态、弧度/角度、多小数点、连续运算，任何一个环节处理不当都会产生错误结果。功能"能用"不等于"正确"，需要系统化的样例测试兜底。同时，"结果放大覆盖计算式""删除光标左侧元素""函数括号内输入不跳出"这类细节决定了计算器是否好用，以手机系统计算器为参照反复打磨交互，调试修理，对我收获很大。后续可以考虑加入历史记录持久化、表达式语法高亮、更多科学函数（反三角函数、对数换底）等扩展功能。
