import { createAction, NavigationActions } from '../../../lib';

export default {
  namespace: 'mainNS',
  state: {
    username: '',
  },
  reducers: {
    setUsername(state, { payload = {} }) {
      const { username } = payload;
      return {
        ...state,
        username,
      };
    },
  },
};
