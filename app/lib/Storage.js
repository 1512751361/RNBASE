import { AsyncStorage } from 'react-native';

// 清空所有本地存储
function clear() {
  return AsyncStorage.clear();
}

// 获取指定key的本地存储
function get(key, defaultValue = null) {
  return AsyncStorage.getItem(key).then(
    value => (value !== null ? JSON.parse(value) : defaultValue),
  );
}

// 设置指定key的本地存储
function set(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

// 移除指定key的本地存储
function remove(key) {
  return AsyncStorage.removeItem(key);
}

// 获取多个key的本地存储
function multiGet(...keys) {
  return AsyncStorage.multiGet([...keys]).then((stores) => {
    const data = {};
    stores.forEach((result, i, store) => {
      data[store[i][0]] = JSON.parse(store[i][1]);
    });
    return data;
  });
}

// 移除多个key的本地存储
function multiRemove(...keys) {
  return AsyncStorage.multiRemove([...keys]);
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
};
