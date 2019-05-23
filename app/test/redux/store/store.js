import { createStore } from 'redux';
import Reducer from '../reducer/reducer';

export default () => {
  // 根据 reducer 初始化 store
  const store = createStore(Reducer);

  return store;
};
