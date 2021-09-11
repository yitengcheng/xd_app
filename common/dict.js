import getDict from "./dict-cache.js"; // 接口缓存

/**
 * 所有业务字典
 */
const dictRequest = (type) =>
  getDict(`/system/dict/data/type/${type}`, type);

export default dictRequest;