// 原生 JavaScript 工具函数 (替代 lodash)

// 数组操作工具
export const arrayUtils = {
  // 去重并排序
  uniqueAndSort: (arr: any[]) => {
    return [...new Set(arr)].sort();
  },

  // 分组操作
  groupByProperty: (arr: any[], property: string) => {
    return arr.reduce((groups, item) => {
      const key = item[property];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, any[]>);
  },

  // 查找和过滤
  findAndFilter: (arr: any[], predicate: any) => {
    const found = arr.find(predicate);
    const filtered = arr.filter(predicate);
    return { found, filtered };
  },

  // 数组分块
  chunkArray: (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  // 数组去重
  removeDuplicates: (arr: any[]) => {
    return [...new Set(arr)];
  },
};

// 对象操作工具
export const objectUtils = {
  // 深度合并对象
  deepMerge: (obj1: any, obj2: any) => {
    const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);

    if (!isObject(obj1) || !isObject(obj2)) {
      return obj2;
    }

    const result = { ...obj1 };

    Object.keys(obj2).forEach(key => {
      if (isObject(obj2[key])) {
        result[key] = objectUtils.deepMerge(result[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    });

    return result;
  },

  // 获取嵌套属性
  getNestedValue: (obj: any, path: string, defaultValue?: any) => {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }

    return result !== undefined ? result : defaultValue;
  },

  // 设置嵌套属性
  setNestedValue: (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      } else {
        current[key] = { ...current[key] };
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return result;
  },

  // 选择属性
  pickProperties: (obj: any, keys: string[]) => {
    const result: any = {};
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  // 排除属性
  omitProperties: (obj: any, keys: string[]) => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  // 对象比较 (浅比较)
  isEqual: (obj1: any, obj2: any) => {
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 !== 'object') return obj1 === obj2;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!objectUtils.isEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  },
};

// 字符串操作工具
export const stringUtils = {
  // 驼峰转换
  toCamelCase: (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  },

  // 下划线转换
  toSnakeCase: (str: string) => {
    return str
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  },

  // 首字母大写
  capitalize: (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // 截断字符串
  truncate: (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.slice(0, length - 3) + '...';
  },

  // 模板字符串
  template: (template: string, data: any) => {
    return template.replace(/<%=\s*(\w+)\s*%>/g, (_, key) => {
      return data[key] || '';
    });
  },
};

// 数字操作工具
export const numberUtils = {
  // 随机数生成
  random: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 数字范围
  range: (start: number, end: number, step: number = 1) => {
    const result = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  },

  // 数字求和
  sum: (arr: number[]) => {
    return arr.reduce((sum, num) => sum + num, 0);
  },

  // 数字平均值
  mean: (arr: number[]) => {
    return arr.length > 0 ? numberUtils.sum(arr) / arr.length : 0;
  },

  // 数字最大值
  max: (arr: number[]) => {
    return arr.length > 0 ? Math.max(...arr) : undefined;
  },

  // 数字最小值
  min: (arr: number[]) => {
    return arr.length > 0 ? Math.min(...arr) : undefined;
  },
};

// 函数操作工具
export const functionUtils = {
  // 防抖函数
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },

  // 节流函数
  throttle: <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, wait);
      }
    }) as T;
  },

  // 函数柯里化
  curry: <T extends (...args: any[]) => any>(func: T) => {
    return function curried(...args: any[]): any {
      if (args.length >= func.length) {
        return func(...args);
      } else {
        return (...nextArgs: any[]) => curried(...args, ...nextArgs);
      }
    } as T;
  },

  // 函数组合
  compose: (...funcs: ((...args: any[]) => any)[]) => {
    return (input: any) => {
      return funcs.reduce((acc, func) => func(acc), input);
    };
  },
};

// 集合操作工具
export const collectionUtils = {
  // 集合映射
  mapCollection: (collection: any[], iteratee: any) => {
    if (typeof iteratee === 'function') {
      return collection.map(iteratee);
    }
    // 如果 iteratee 是字符串，则提取该属性
    return collection.map(item => item[iteratee]);
  },

  // 集合过滤
  filterCollection: (collection: any[], predicate: any) => {
    if (typeof predicate === 'function') {
      return collection.filter(predicate);
    }
    // 如果 predicate 是对象，则匹配属性
    return collection.filter(item => {
      return Object.keys(predicate).every(key => item[key] === predicate[key]);
    });
  },

  // 集合归约
  reduceCollection: (collection: any[], iteratee: any, accumulator?: any) => {
    return accumulator !== undefined
      ? collection.reduce(iteratee, accumulator)
      : collection.reduce(iteratee);
  },

  // 集合排序
  sortCollection: (collection: any[], iteratee?: any) => {
    const sorted = [...collection];
    if (!iteratee) {
      return sorted.sort();
    }
    if (typeof iteratee === 'string') {
      return sorted.sort((a, b) => {
        const aVal = a[iteratee];
        const bVal = b[iteratee];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      });
    }
    if (typeof iteratee === 'function') {
      return sorted.sort((a, b) => {
        const aVal = iteratee(a);
        const bVal = iteratee(b);
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      });
    }
    return sorted;
  },

  // 集合去重
  uniqueCollection: (collection: any[], iteratee?: any) => {
    if (!iteratee) {
      return [...new Set(collection)];
    }
    const seen = new Set();
    return collection.filter(item => {
      const key = typeof iteratee === 'string' ? item[iteratee] : iteratee(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },
};
