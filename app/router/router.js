import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

// 导入路由页面
import * as PageRouter from './path';

// 创建一个 stack navigator
const AppNavigator = createStackNavigator(PageRouter);

// App路由容器
const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
