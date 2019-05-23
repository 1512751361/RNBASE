import { createAction, NavigationActions } from '../../../lib';

export default {
  namespace: 'loginNS',
  state: {},
  reducers: {

  },
  effects: {
    * login({ payload = {} }, { select, put, call }) {
      const res = true;
      if (res) {
        yield put(createAction('mainNS/setUsername')({ username: '刘火生' }));
        yield put(NavigationActions.navigate({
          routeName: 'Main',
          params: { username: '刘火生' },
        }));
      }
    },
  },
};
