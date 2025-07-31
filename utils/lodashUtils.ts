import _ from 'lodash';

// 数组操作工具
export const arrayUtils = {
  // 去重并排序
  uniqueAndSort: (arr: any[]) => {
    return _.uniq(arr).sort();
  },
  
  // 分组操作
  groupByProperty: (arr: any[], property: string) => {
    return _.groupBy(arr, property);
  },
  
  // 查找和过滤
  findAndFilter: (arr: any[], predicate: any) => {
    const found = _.find(arr, predicate);
    const filtered = _.filter(arr, predicate);
    return { found, filtered };
  },
  
  // 数组分块
  chunkArray: (arr: any[], size: number) => {
    return _.chunk(arr, size);
  },
  
  // 数组去重
  removeDuplicates: (arr: any[]) => {
    return _.uniq(arr);
  }
};

// 对象操作工具
export const objectUtils = {
  // 深度合并对象
  deepMerge: (obj1: any, obj2: any) => {
    return _.merge({}, obj1, obj2);
  },
  
  // 获取嵌套属性
  getNestedValue: (obj: any, path: string, defaultValue?: any) => {
    return _.get(obj, path, defaultValue);
  },
  
  // 设置嵌套属性
  setNestedValue: (obj: any, path: string, value: any) => {
    return _.set({ ...obj }, path, value);
  },
  
  // 对象去重
  pickProperties: (obj: any, keys: string[]) => {
    return _.pick(obj, keys);
  },
  
  // 对象过滤
  omitProperties: (obj: any, keys: string[]) => {
    return _.omit(obj, keys);
  },
  
  // 对象比较
  isEqual: (obj1: any, obj2: any) => {
    return _.isEqual(obj1, obj2);
  }
};

// 字符串操作工具
export const stringUtils = {
  // 驼峰转换
  toCamelCase: (str: string) => {
    return _.camelCase(str);
  },
  
  // 下划线转换
  toSnakeCase: (str: string) => {
    return _.snakeCase(str);
  },
  
  // 首字母大写
  capitalize: (str: string) => {
    return _.capitalize(str);
  },
  
  // 截断字符串
  truncate: (str: string, length: number) => {
    return _.truncate(str, { length });
  },
  
  // 模板字符串
  template: (template: string, data: any) => {
    return _.template(template)(data);
  }
};

// 数字操作工具
export const numberUtils = {
  // 随机数生成
  random: (min: number, max: number) => {
    return _.random(min, max);
  },
  
  // 数字范围
  range: (start: number, end: number, step?: number) => {
    return _.range(start, end, step);
  },
  
  // 数字求和
  sum: (arr: number[]) => {
    return _.sum(arr);
  },
  
  // 数字平均值
  mean: (arr: number[]) => {
    return _.mean(arr);
  },
  
  // 数字最大值
  max: (arr: number[]) => {
    return _.max(arr);
  },
  
  // 数字最小值
  min: (arr: number[]) => {
    return _.min(arr);
  }
};

// 函数操作工具
export const functionUtils = {
  // 防抖函数
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ) => {
    return _.debounce(func, wait);
  },
  
  // 节流函数
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ) => {
    return _.throttle(func, wait);
  },
  
  // 函数柯里化
  curry: <T extends (...args: any[]) => any>(func: T) => {
    return _.curry(func);
  },
  
  // 函数组合
  compose: (...funcs: ((...args: any[]) => any)[]) => {
    return _.flow(funcs);
  }
};

// 集合操作工具
export const collectionUtils = {
  // 集合映射
  mapCollection: (collection: any, iteratee: any) => {
    return _.map(collection, iteratee);
  },
  
  // 集合过滤
  filterCollection: (collection: any, predicate: any) => {
    return _.filter(collection, predicate);
  },
  
  // 集合归约
  reduceCollection: (collection: any, iteratee: any, accumulator?: any) => {
    return _.reduce(collection, iteratee, accumulator);
  },
  
  // 集合排序
  sortCollection: (collection: any, iteratee?: any) => {
    return _.sortBy(collection, iteratee);
  },
  
  // 集合去重
  uniqueCollection: (collection: any, iteratee?: any) => {
    return _.uniqBy(collection, iteratee);
  }
}; 