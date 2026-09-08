class CheckEmptyUtil {
  /**
   * Check obj is empty.
   *
   * @param {object} obj
   * @return {boolean} true(empty)
   */
  isEmpty(obj: object | string): boolean {
    return (typeof obj === 'undefined' || obj === null || obj === '');
  }

  /**
   * Check str is empty.
   *
   * @param {string} str
   * @return {boolean} true(empty)
   */
  checkStrIsEmpty(str: string): boolean {
    return str.trim().length === 0;
  }

  /**
   * Check array is empty.
   *
   * @param {Array}arr
   * @return {boolean} true(empty)
   */
  isEmptyArr(arr: Array<string>) {
    return arr.length === 0;
  }
}

export default new CheckEmptyUtil();

