import { CommonConstants, Priority, SymbolicEnumeration } from "@normalized:N&&&entry/src/main/ets/common/constants/CommonConstants&";
import CheckEmptyUtil from "@normalized:N&&&entry/src/main/ets/common/util/CheckEmptyUtil&";
class CalculateUtil {
    /**
     * Determines whether it is an operator.
     *
     * @param value The symbol.
     * @return Is Operator.
     */
    isSymbol(value: string) {
        if (CheckEmptyUtil.isEmpty(value)) {
            return;
        }
        return (CommonConstants.OPERATORS.indexOf(value) !== -1);
    }
    /**
     * Get Operator Precedence.
     *
     * @param value The symbol.
     * @return Priority.
     */
    getPriority(value: string): number {
        if (CheckEmptyUtil.isEmpty(value)) {
            return Priority.LOW;
        }
        let result = 0;
        switch (value) {
            case SymbolicEnumeration.ADD:
            case SymbolicEnumeration.MIN:
                result = Priority.MEDIUM;
                break;
            case SymbolicEnumeration.MUL:
            case SymbolicEnumeration.DIV:
                result = Priority.HIGH;
                break;
            case SymbolicEnumeration.IMPLICIT_MUL:
                // 隐式乘法（3π）：优先级最高（与幂同级、左结合），使 2÷3π = 2÷(3×π)
                result = Priority.HIGHEST;
                break;
            case SymbolicEnumeration.POW:
                result = Priority.HIGHEST;
                break;
            default:
                result = Priority.LOW;
                break;
        }
        return result;
    }
    /**
     * Determine the priority of addition, subtraction, multiplication, and division.
     *
     * @param arg1 Parameter 1.
     * @param arg2 Parameter 2.
     * @return Compare Priority Results.
     */
    comparePriority(arg1: string, arg2: string): boolean {
        if (CheckEmptyUtil.isEmpty(arg1) || CheckEmptyUtil.isEmpty(arg2)) {
            return false;
        }
        let priority1 = this.getPriority(arg1);
        let priority2 = this.getPriority(arg2);
        if (priority1 < priority2) {
            return true;
        }
        if (priority1 > priority2) {
            return false;
        }
        // 同优先级时：幂运算 ^ 为右结合，遇到相同运算符不弹出；其余为左结合
        return arg1 !== CommonConstants.POW;
    }
    /**
     * Expression Processing.
     *
     * @param expressions Expressions.
     * @param angleMode Angle mode (deg / rad), used by trig functions.
     */
    parseExpression(expressions: Array<string>, angleMode: string = 'deg'): string {
        if (CheckEmptyUtil.isEmpty(expressions)) {
            return 'NaN';
        }
        // 一元负号预处理：表达式开头、左括号后或运算符后的 '-' 与后续操作数合并（(-5) -> -5）
        for (let i = 0; i < expressions.length; i++) {
            if (expressions[i] === CommonConstants.MIN) {
                let prev: string = i > 0 ? expressions[i - 1] : '';
                if (i === 0 || prev === '(' || this.isSymbol(prev)) {
                    if (i + 1 < expressions.length) {
                        expressions[i] = expressions[i] + expressions[i + 1];
                        expressions.splice(i + 1, 1);
                    }
                }
            }
        }
        // 隐式乘法预处理：操作数后紧跟操作数或左括号（2(3) → 2×(3)、5π → 5×π、
        // (2+3)5 → (2+3)×5、πe → π×e）。π/e 是操作数而非符号，数字后直接拼接显示。
        let merged: Array<string> = [];
        for (let i = 0; i < expressions.length; i++) {
            let current: string = expressions[i];
            let prev: string = merged.length > 0 ? merged[merged.length - 1] : '';
            // prev 是否为操作数边界：操作数（含 π/e/函数/右括号），排除空、左括号、四则运算符
            let prevIsOperandEnd: boolean = prev !== '' && prev !== '(' && !this.isSymbol(prev);
            // current 是否为操作数起始：操作数（含 π/e/函数）或左括号，排除右括号、四则运算符与 %（% 是后缀）
            let curIsOperandStart: boolean = current === '(' ||
                (current !== ')' && !this.isSymbol(current) && current !== CommonConstants.PERCENT_SIGN);
            if (prevIsOperandEnd && curIsOperandStart) {
                // 隐式乘法用高优先级内部符号 '·'：3π → 3·π，2÷3π = 2÷(3×π)
                merged.push(CommonConstants.IMPLICIT_MUL);
            }
            merged.push(current);
        }
        expressions = merged;
        let len = expressions.length;
        let outputStack: string[] = [];
        let outputQueue: string[] = [];
        let prevOperand: string = '';
        let prevSymbol: string = '';
        expressions.forEach((item: string, index: number) => {
            if (this.isSymbol(item)) {
                prevSymbol = item;
            }
            else if (item === CommonConstants.PI) {
                // Pi constant -> numeric value
                expressions[index] = Math.PI.toString();
                prevOperand = expressions[index];
            }
            else if (item === CommonConstants.EULER) {
                // Euler constant -> numeric value
                expressions[index] = Math.E.toString();
                prevOperand = expressions[index];
            }
            else if (item.indexOf(CommonConstants.PERCENT_SIGN) !== -1 && !this.isFunctionToken(item)) {
                // 后缀百分比：a+b% → a + a*b/100；a-b% → a - a*b/100；a×b% / a÷b% → b/100
                // 函数 token（sin(30%)）含 % 时不走此分支，由 isFunctionToken 分支整体求值
                let base: number = Number(item.slice(0, item.length - 1));
                let converted: number;
                if ((prevOperand !== '') && (prevSymbol === CommonConstants.ADD || prevSymbol === CommonConstants.MIN)) {
                    converted = Number(prevOperand) * base / 100;
                }
                else {
                    converted = base / 100;
                }
                expressions[index] = converted.toString();
                prevOperand = expressions[index];
            }
            else if (this.isFunctionToken(item)) {
                // 科学函数 token（sin(30)、30²、30!、1/(30)）-> 求值为数值
                expressions[index] = this.evaluateToken(item, angleMode).toString();
                prevOperand = expressions[index];
            }
            else {
                prevOperand = item;
            }
            // Whether the last digit is an operator.
            if ((index === len - 1) && this.isSymbol(item)) {
                expressions.pop();
            }
        });
        while (expressions.length > 0) {
            let current: string | undefined = expressions.shift();
            if (current !== undefined) {
                if (current === '(') {
                    // 左括号入栈
                    outputStack.push(current);
                }
                else if (current === ')') {
                    // 弹出直到左括号
                    while (outputStack.length > 0 && outputStack[outputStack.length - 1] !== '(') {
                        let popValue: string | undefined = outputStack.pop();
                        if (popValue !== undefined) {
                            outputQueue.push(popValue);
                        }
                    }
                    outputStack.pop();
                }
                else if (this.isSymbol(current)) {
                    // Processing addition, subtraction, multiplication and division.
                    while (outputStack.length > 0 && outputStack[outputStack.length - 1] !== '(' &&
                        this.comparePriority(current, outputStack[outputStack.length - 1])) {
                        let popValue: string | undefined = outputStack.pop();
                        if (popValue !== undefined) {
                            outputQueue.push(popValue);
                        }
                    }
                    outputStack.push(current);
                }
                else {
                    // Processing the numbers.
                    outputQueue.push(current);
                }
            }
        }
        while (outputStack.length > 0) {
            let popValue: string | undefined = outputStack.pop();
            // 未闭合的左括号直接丢弃，不进结果队列
            if (popValue !== undefined && popValue !== '(') {
                outputQueue.push(popValue);
            }
        }
        return this.dealQueue(outputQueue);
    }
    /**
     * 是否未闭合的函数前缀 token（用户正在输入的函数表达式，如 sin(、sin(30+5、sin(30+(5）。
     * 判定：函数前缀 + 参数内左括号多于右括号（括号不平衡即未闭合）。
     *
     * @param token 待判断的 token.
     * @return true 表示是未闭合函数前缀.
     */
    isUnclosedFunctionToken(token: string): boolean {
        if (token === undefined || token === null || token === '') {
            return false;
        }
        if (!/^(sin|cos|tan|log|ln|√)\(/.test(token)) {
            return false;
        }
        let open = 0;
        let close = 0;
        for (let i = 0; i < token.length; i++) {
            let ch: string = token.charAt(i);
            if (ch === '(') {
                open++;
            }
            else if (ch === ')') {
                close++;
            }
        }
        return open > close;
    }
    /**
     * 函数参数内的小数点判定：只检查"当前正在输入的数字段"（最后一个运算符/左括号之后），
     * 允许 sin(3.14+2.5) 中第二个数字段输入小数点，同时拒绝同一数字段内重复小数点（3.14. 非法）。
     * 段内含 π/e 时不视为纯数字段（放行，交给求值层兜底）。
     *
     * @param param 函数参数串（不含函数前缀与尾部括号）。
     * @return true 表示当前数字段已有小数点，应拒绝输入 '.'。
     */
    hasDotInCurrentSegment(param: string): boolean {
        let segStart = -1;
        for (let i = param.length - 1; i >= 0; i--) {
            let ch: string = param.charAt(i);
            if ('+-×÷^('.indexOf(ch) !== -1) {
                segStart = i;
                break;
            }
        }
        let seg: string = param.slice(segStart + 1);
        if (/[eπ]/.test(seg)) {
            return false;
        }
        return seg.indexOf('.') !== -1;
    }
    /**
     * Processing expressions in queues.
     *
     * @param queue Expression Queue.
     * @return The end result.
     */
    dealQueue(queue: Array<string>): string {
        if (CheckEmptyUtil.isEmpty(queue)) {
            return 'NaN';
        }
        let outputStack: string[] = [];
        while (queue.length > 0) {
            let current: string | undefined = queue.shift();
            if (current !== undefined) {
                if (!this.isSymbol(current)) {
                    outputStack.push(current);
                }
                else {
                    let second: string | undefined = outputStack.pop();
                    let first: string | undefined = outputStack.pop();
                    if (first !== undefined && second !== undefined) {
                        let calResultValue: string = this.calResult(first, second, current);
                        outputStack.push(calResultValue);
                    }
                }
            }
        }
        if (outputStack.length !== 1) {
            return 'NaN';
        }
        else {
            let end: string = outputStack[0]?.endsWith(CommonConstants.DOTS) ?
                outputStack[0].substring(0, outputStack[0].length - 1) : outputStack[0];
            return end;
        }
    }
    /**
     * Calculation result.
     *
     * @param arg1 Number 1.
     * @param arg2 Number 2.
     * @param symbol Operators.
     * @return Calculation result.
     */
    calResult(arg1: string, arg2: string, symbol: string): string {
        if (CheckEmptyUtil.isEmpty(arg1) || CheckEmptyUtil.isEmpty(arg2) || CheckEmptyUtil.isEmpty(symbol)) {
            return 'NaN';
        }
        let result = 0;
        switch (symbol) {
            case SymbolicEnumeration.ADD:
                result = this.add(arg1, arg2, CommonConstants.ADD);
                break;
            case SymbolicEnumeration.MIN:
                result = this.add(arg1, arg2, CommonConstants.MIN);
                break;
            case SymbolicEnumeration.MUL:
                result = this.mulOrDiv(arg1, arg2, CommonConstants.MUL);
                break;
            case SymbolicEnumeration.IMPLICIT_MUL:
                result = this.mulOrDiv(arg1, arg2, CommonConstants.MUL);
                break;
            case SymbolicEnumeration.DIV:
                result = this.mulOrDiv(arg1, arg2, CommonConstants.DIV);
                break;
            case SymbolicEnumeration.POW:
                result = this.pow(arg1, arg2);
                break;
            default:
                break;
        }
        return this.numberToScientificNotation(result);
    }
    /**
     * Addition and subtraction operation.
     *
     * @param arg1 Number 1.
     * @param arg2 Number 2.
     * @param symbol Operators.
     * @return Addition and subtraction results.
     */
    add(arg1: string, arg2: string, symbol: string): number {
        let addFlag = (symbol === CommonConstants.ADD);
        if (this.containScientificNotation(arg1) || this.containScientificNotation(arg2)) {
            if (addFlag) {
                return Number(arg1) + Number(arg2);
            }
            return Number(arg1) - Number(arg2);
        }
        arg1 = (arg1 === CommonConstants.ZERO_DOTS) ? '0' : arg1;
        arg2 = (arg2 === CommonConstants.ZERO_DOTS) ? '0' : arg2;
        let leftArr = arg1.split(CommonConstants.DOTS);
        let rightArr = arg2.split(CommonConstants.DOTS);
        let leftLen = leftArr.length > 1 ? leftArr[1] : '';
        let rightLen = rightArr.length > 1 ? rightArr[1] : '';
        let maxLen = Math.max(leftLen.length, rightLen.length);
        let multiples = Math.pow(CommonConstants.TEN, maxLen);
        if (addFlag) {
            return Number(((Number(arg1) * multiples + Number(arg2) * multiples) / multiples).toFixed(maxLen));
        }
        return Number(((Number(arg1) * multiples - Number(arg2) * multiples) / multiples).toFixed(maxLen));
    }
    /**
     * multiplication and division operation.
     *
     * @param arg1 Number 1.
     * @param arg2 Number 2.
     * @param symbol Operators.
     * @return Multiply and divide result.
     */
    mulOrDiv(arg1: string, arg2: string, symbol: string): number {
        let mulFlag = (symbol === CommonConstants.MUL);
        if (this.containScientificNotation(arg1) || this.containScientificNotation(arg2)) {
            if (mulFlag) {
                return Number(arg1) * Number(arg2);
            }
            return Number(arg1) / Number(arg2);
        }
        let leftLen = arg1.split(CommonConstants.DOTS)[1] ? arg1.split(CommonConstants.DOTS)[1].length : 0;
        let rightLen = arg2.split(CommonConstants.DOTS)[1] ? arg2.split(CommonConstants.DOTS)[1].length : 0;
        if (mulFlag) {
            return Number(arg1.replace(CommonConstants.DOTS, '')) *
                Number(arg2.replace(CommonConstants.DOTS, '')) / Math.pow(CommonConstants.TEN, leftLen + rightLen);
        }
        return Number(arg1.replace(CommonConstants.DOTS, '')) /
            (Number(arg2.replace(CommonConstants.DOTS, '')) / Math.pow(CommonConstants.TEN, rightLen - leftLen));
    }
    /**
     * Power operation.
     *
     * @param arg1 Base number.
     * @param arg2 Exponent.
     * @return Power result.
     */
    pow(arg1: string, arg2: string): number {
        return Math.pow(Number(arg1), Number(arg2));
    }
    /**
     * Whether the operand contains scientific notation
     *
     * @param arg Number.
     * @return Whether scientific notation is included
     */
    containScientificNotation(arg: string) {
        return (arg.indexOf(CommonConstants.E) !== -1);
    }
    /**
     * Results converted to scientific notation.
     *
     * @param result Digital Results.
     */
    numberToScientificNotation(result: number) {
        if (result === Number.NEGATIVE_INFINITY || result === Number.POSITIVE_INFINITY) {
            return 'NaN';
        }
        let resultStr = JSON.stringify(result);
        if (this.containScientificNotation(resultStr)) {
            return resultStr;
        }
        // 含小数点的结果保持原样，避免出现 6.28...e0 这类难看显示
        if (resultStr.indexOf(CommonConstants.DOTS) !== -1) {
            return resultStr;
        }
        let prefixNumber = (resultStr.indexOf(CommonConstants.MIN) === -1) ? 1 : -1;
        result *= prefixNumber;
        if (resultStr.replace(CommonConstants.DOTS, '').replace(CommonConstants.MIN, '').length <
            CommonConstants.NUM_MAX_LEN) {
            return resultStr;
        }
        let suffix = (Math.floor(Math.log(result) / Math.LN10));
        let prefix = (result * Math.pow(CommonConstants.TEN, -suffix) * prefixNumber);
        return (prefix + CommonConstants.E + suffix);
    }
    /**
     * 判断是否为科学函数 token。
     * 支持前缀函数：sin(30)、cos(30)、tan(30)、log(30)、ln(30)、√(30)；
     * 后缀函数：30²、30!；倒数：1/(30)。支持嵌套，如 cos(sin(30))。
     *
     * @param value Token.
     * @return Whether it is a function token.
     */
    isFunctionToken(value: string): boolean {
        if (CheckEmptyUtil.isEmpty(value)) {
            return false;
        }
        if (value.endsWith('²') || value.endsWith('!')) {
            return true;
        }
        if (value.startsWith('1/(') && value.endsWith(')')) {
            return true;
        }
        // 函数前缀 + 以右括号结尾 + 参数内括号平衡（sin(30+5)、sin(30+(5)) 为完整函数）
        if (!/^(sin|cos|tan|log|ln|√)\(/.test(value) || !value.endsWith(')')) {
            return false;
        }
        let open = 0;
        let close = 0;
        for (let i = 0; i < value.length; i++) {
            let ch: string = value.charAt(i);
            if (ch === '(') {
                open++;
            }
            else if (ch === ')') {
                close++;
            }
        }
        return open === close;
    }
    /**
     * 是否为空函数 token（刚按下函数键、尚未输入参数的成对括号），如 sin()。
     *
     * @param value Token.
     * @return Whether it is an empty function token.
     */
    isEmptyFunctionToken(value: string): boolean {
        if (CheckEmptyUtil.isEmpty(value)) {
            return false;
        }
        return /^(sin|cos|tan|log|ln|√)\(\)$/.test(value);
    }
    /**
     * 求值函数参数：参数为单个 token（数字/常量/常量混合/嵌套函数）时直接求值；
     * 参数含运算符、括号或百分号（如 30+5、30+(5)、30%）时拆分为表达式解析。
     *
     * @param param 参数字符串。
     * @param angleMode Angle mode (deg / rad).
     * @return 参数数值，非法时 NaN。
     */
    evaluateParam(param: string, angleMode: string = 'deg'): number {
        if (/[+\-×÷^()%]/.test(param)) {
            let tokens = this.tokenizeParam(param);
            let parsed = this.parseExpression(tokens, angleMode);
            return (parsed === 'NaN') ? NaN : Number(parsed);
        }
        return this.evaluateToken(param, angleMode);
    }
    /**
     * 把函数参数字符串拆成 token 数组（数字、函数调用整体、运算符、括号、π/e），
     * 供 parseExpression 解析。如 '30+cos(5)' → ['30','+','cos(5)']。
     *
     * @param param 参数字符串。
     * @return token 数组。
     */
    tokenizeParam(param: string): Array<string> {
        let tokens: Array<string> = [];
        let i = 0;
        while (i < param.length) {
            // 倒数函数调用整体吞入（到匹配的右括号），如 1/(8)、1/(8+5)；
            // 必须以 '1/(' 开头判断，因为 '1' 是数字会先进数字分支
            if (param.slice(i).startsWith('1/(')) {
                let j = i + 2;
                let depth = 0;
                while (j < param.length) {
                    if (param.charAt(j) === '(') {
                        depth++;
                    }
                    else if (param.charAt(j) === ')') {
                        depth--;
                        if (depth === 0) {
                            j++;
                            break;
                        }
                    }
                    j++;
                }
                tokens.push(param.slice(i, j));
                i = j;
                continue;
            }
            let ch: string = param.charAt(i);
            if (/[\d.]/.test(ch)) {
                let j = i;
                while (j < param.length && /[\d.]/.test(param.charAt(j))) {
                    j++;
                }
                // 数字后的 % 并入同一 token（30% 是带后缀的操作数）
                if (j < param.length && param.charAt(j) === CommonConstants.PERCENT_SIGN) {
                    j++;
                }
                tokens.push(param.slice(i, j));
                i = j;
            }
            else {
                let rest = param.slice(i);
                let m = /^(sin|cos|tan|log|ln|√)/.exec(rest);
                if (m !== null) {
                    let name: string = m[0];
                    let j = i + name.length;
                    if (j < param.length && param.charAt(j) === '(') {
                        // 函数调用整体吞入（到匹配的右括号）
                        let depth = 0;
                        while (j < param.length) {
                            if (param.charAt(j) === '(') {
                                depth++;
                            }
                            else if (param.charAt(j) === ')') {
                                depth--;
                                if (depth === 0) {
                                    j++;
                                    break;
                                }
                            }
                            j++;
                        }
                        tokens.push(param.slice(i, j));
                        i = j;
                    }
                    else {
                        tokens.push(name);
                        i = j;
                    }
                }
                else {
                    tokens.push(ch);
                    i++;
                }
            }
        }
        return tokens;
    }
    /**
     * 计算单个函数 token 的数值（支持嵌套）。
     *
     * @param token Function token.
     * @param angleMode Angle mode (deg / rad).
     * @return Computed value, NaN when invalid.
     */
    evaluateToken(token: string, angleMode: string = 'deg'): number {
        if (CheckEmptyUtil.isEmpty(token)) {
            return NaN;
        }
        // 后缀：平方 x²
        if (token.endsWith('²')) {
            let v = this.evaluateToken(token.substring(0, token.length - 1), angleMode);
            return this.trimFloat(v * v);
        }
        // 后缀：阶乘 x!
        if (token.endsWith('!')) {
            let v = this.evaluateToken(token.substring(0, token.length - 1), angleMode);
            return this.factorial(v);
        }
        // 倒数：1/(x)
        if (token.startsWith('1/(') && token.endsWith(')')) {
            let inner = token.substring(3, token.length - 1);
            let v = this.evaluateParam(inner, angleMode);
            return this.trimFloat(1 / v);
        }
        // 前缀函数：sin(x)、cos(x)、tan(x)、log(x)、ln(x)、√(x)
        let match = /^(sin|cos|tan|log|ln|√)\((.*)\)$/.exec(token);
        if (match !== null && match.length >= 3) {
            // 空参数（sin()）无法计算
            if (match[2] === '') {
                return NaN;
            }
            // 参数可能是表达式（30+5、30+(5)、30%）：用表达式求值
            let innerVal = this.evaluateParam(match[2], angleMode);
            let func: string = match[1];
            let result: number = NaN;
            if (func === 'sin' || func === 'cos' || func === 'tan') {
                // π/e 是弧度常量：参数只要含 π 或 e（如 π、2π、5÷2×e×π÷e÷5÷2）就按弧度计算，
                // 不再做 deg→rad 转换，保证 cos(π) = -1、sin(π/4) = √2/2；纯数字参数仍按当前角度模式
                let isRadConstant: boolean = /[eπ]/.test(match[2]);
                let rad: number = (angleMode === 'deg' && !isRadConstant) ? innerVal * Math.PI / 180 : innerVal;
                if (func === 'sin') {
                    result = Math.sin(rad);
                }
                else if (func === 'cos') {
                    result = Math.cos(rad);
                }
                else {
                    result = Math.tan(rad);
                }
            }
            else if (func === 'log') {
                result = Math.log10(innerVal);
            }
            else if (func === 'ln') {
                result = Math.log(innerVal);
            }
            else if (func === '√') {
                result = Math.sqrt(innerVal);
            }
            return this.trimFloat(result);
        }
        if (token === CommonConstants.PI) {
            return Math.PI;
        }
        if (token === CommonConstants.EULER) {
            return Math.E;
        }
        // 数字与常量相邻（3e、2π、e2、π5、πe）：按乘法解析，用于函数参数内输入 e/π
        if (/^[0-9.]+[eπ]$/.test(token)) {
            return Number(token.slice(0, token.length - 1)) * (token.endsWith('e') ? Math.E : Math.PI);
        }
        if (/^[eπ][0-9.]+$/.test(token)) {
            return (token.startsWith('e') ? Math.E : Math.PI) * Number(token.slice(1));
        }
        if (/^[eπ][eπ]$/.test(token)) {
            return Math.PI * Math.E;
        }
        return this.trimFloat(this.toNumber(token));
    }
    /**
     * 去掉函数包装，还原为原操作数（用于退格键）。
     * sin(30) -> 30；30² -> 30；30! -> 30；1/(30) -> 30；cos(sin(30)) -> sin(30)。
     *
     * @param token Function token.
     * @return Inner operand.
     */
    unwrapToken(token: string): string {
        if (token.endsWith('²') || token.endsWith('!')) {
            return token.substring(0, token.length - 1);
        }
        if (token.startsWith('1/(') && token.endsWith(')')) {
            return token.substring(3, token.length - 1);
        }
        let match = /^(sin|cos|tan|log|ln|√)\((.*)\)$/.exec(token);
        if (match !== null && match.length >= 3) {
            // 空参数（sin()）还原为空，由调用方删除该 token
            return match[2];
        }
        return token;
    }
    /**
     * 字符串转数值，去除可能存在的千分位逗号（防御性处理）。
     *
     * @param value Number string.
     * @return Numeric value.
     */
    toNumber(value: string): number {
        return Number(value.split(',').join(''));
    }
    /**
     * 阶乘（仅限非负整数，超过 170 返回 NaN）。
     *
     * @param value Operand.
     * @return Factorial result, NaN when invalid.
     */
    factorial(value: number): number {
        if (value < 0 || !Number.isInteger(value) || value > 170) {
            return NaN;
        }
        let result: number = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        return result;
    }
    /**
     * Trim floating point noise (e.g. sin(30°) -> 0.49999999999999994 -> 0.5).
     *
     * @param value Raw result.
     * @return Trimmed result.
     */
    trimFloat(value: number): number {
        if (!Number.isFinite(value)) {
            return value;
        }
        if (Math.abs(value) < 1e-12) {
            return 0;
        }
        let rounded: number = Math.round(value);
        if (Math.abs(value - rounded) < 1e-10) {
            return rounded;
        }
        // 常见三角特殊值：±0.5、±√2/2、±√3/2
        let specials: number[] = [0.5, -0.5, Math.SQRT1_2, -Math.SQRT1_2,
            Math.sqrt(3) / 2, -Math.sqrt(3) / 2];
        for (let i = 0; i < specials.length; i++) {
            if (Math.abs(value - specials[i]) < 1e-12) {
                return specials[i];
            }
        }
        return value;
    }
}
export default new CalculateUtil();
