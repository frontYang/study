
/**
 *指定数组索引区间的值得总和
 * @param {Array} arr 数组
 * @param {Number} startIndex 开始索引
 * @param {Number} endIndex 结束索引
 * @returns
 */
function sum (arr, startIndex, endIndex){
  return arr.slice(startIndex, endIndex).reduce((a, b) => { return a + b });
}