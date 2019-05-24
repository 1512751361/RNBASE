import {
 createAction, delay,
} from '../../../lib';
import { RNRootSiblings } from '../../../components';
import NavigationService from '../../../router/NavigationService';

export default {
  namespace: 'loginNS',
  state: {},
  reducers: {

  },
  effects: {
    * login({ payload = {} }, { select, put, call }) {
      const res = true;
      if (res) {
        yield call(RNRootSiblings.loading, '正在登录中...');
        yield call(delay, 1000 * 5);
        yield put(createAction('mainNS/setUsername')({ username: '刘火生' }));
        yield call(NavigationService.navigate, 'Main', { username: '刘火生' });

        yield call(RNRootSiblings.hideLoad);
      }
    },
  },
};
