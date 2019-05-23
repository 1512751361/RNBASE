import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

// 导入路由页面
import * as PageRouter from './path';

// 创建一个 stack navigator
const AppNavigator = createStackNavigator(PageRouter, {
  defaultNavigationOptions: {
    headerStyle: {
      height: 88,
    },
  },
});

// App路由容器
const AppContainer = createAppContainer(AppNavigator);


// 设置语言
export default AppContainer;
