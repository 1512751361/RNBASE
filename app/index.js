import React from 'react';
import { AppRegistry } from 'react-native';
// 导入App工程名称
import { name as appName } from '../app.json';
// 导入语言设置
import './lang/i18n';
// 导入图片资源
import './lib/assets';
// 设备响应式容器
import Resolution from './lib/Resolution';
// dva模块
import dva from './dva';
import Router, {
  routerMiddleware,
  routerReducer,
} from './router';

// 导入状态模块
import * as models from './models';

// dva创建redux状态管理store
const app = dva({
  models,
  initialState: {}, // 设置初始化数据
  // extraReducers: { router: routerReducer }, // 指定额外的 reducer
  // onAction: [routerMiddleware], // 在 action 被 dispatch 时触发，用于注册 redux 中间件。支持函数或函数数组格式
  onError(e) {
    console.log('onError', e);
  },
});

const App = app.start(<Resolution.FixWidthView><Router /></Resolution.FixWidthView>);

// 注册组件
AppRegistry.registerComponent(appName, () => App);
