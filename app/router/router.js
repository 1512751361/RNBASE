import React, { PureComponent } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import Assets from '../lib/assets';

// 导入路由页面
import * as PageRouter from './path';

class HeaderLeft extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{
        paddingHorizontal: 10,
        height: 88,
        justifyContent: 'center',
      }}
      >
        <TouchableHighlight
            underlayColor="#DDD"
            style={{
              padding: 10,
              borderRadius: 30,
            }}
            onPress={() => {
            if (navigation) navigation.goBack();
          }}
        >
          <Image
              source={Assets.icons.ico_back}
              style={{
                width: 40,
                height: 40,
              }}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

// 创建一个 stack navigator
const AppNavigator = createStackNavigator(PageRouter, {
  defaultNavigationOptions: ({ navigation, screenProps, navigationOptions }) => ({
    headerStyle: {
      height: 88,
    },
    headerLeft: <HeaderLeft navigation={navigation} />,
  }),
});

// App路由容器
const AppContainer = createAppContainer(AppNavigator);


// 设置语言
export default AppContainer;
