import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from '../app.json';
import Assets from './lib/assets';
import './lib/global';

import dva from './lib/utils/dva';
import Router, {
  routerMiddleware,
  routerReducer,
} from './lib/router';

import * as models from './model';
// alert(models.loginModels)
const app = dva({
  models,
  initialState: {}, // 设置初始化数据
  extraReducers: { router: routerReducer }, // 指定额外的 reducer
  onAction: [routerMiddleware], // 在 action 被 dispatch 时触发，用于注册 redux 中间件。支持函数或函数数组格式
  onError(e) {
    console.log('onError', e);
  },
});

const App = app.start(<Router />);

AppRegistry.registerComponent(appName, () => App);
