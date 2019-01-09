import React, { PureComponent } from 'react';
import {
  Animated,
  Easing,
  View,
  BackHandler,
  Platform,
} from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationActions,
  StackViewTransitionConfigs,
} from 'react-navigation';

import _ from 'lodash';

import {
  scaleHeight,
  setSpText2,
} from '../screenUtil';

export function setRouterNavigator(routerPath) {
  const routerNavigator = {};
  if (routerPath) {
    _.forEach(routerPath, (routePath, key) => {
      if (routePath) {
        routerNavigator[key] = { screen: routePath };
      }
    });
  }
  return routerNavigator;
}

export function setBottomTabNavigator({ bottomRouter, options, routerPath }) {
  const HomeNavigator = createBottomTabNavigator(bottomRouter, {
    tabBarPosition: 'bottom',
    lazy: true, // 是否懒加载
    swipeEnabled: false,
    animationEnabled: false,
    initialRouteName: 'Home',
    tabBarOptions: {
      showIcon: true,
      pressOpacity: 0.8,
      style: {
        height: scaleHeight(98),
        backgroundColor: '#ffffff',
        // opacity: 0,
        zIndex: 0,
        position: 'relative',
        justifyContent: 'center',
      },
      labelStyle: {
        fontSize: setSpText2(20),
        lineHeight: setSpText2(20),
        // paddingVertical: 0,
        marginTop: scaleHeight(12) - 2,
      },
      iconStyle: {
        marginTop: scaleHeight(14) - 10.5,
      },
      tabStyle: {
        backgroundColor: '#ffffff',
      },
      inactiveTintColor: '#ABB7C1',
      activeTintColor: '#4289FA',
    },
    ...options,
  });
  // 设置主页tab内容切换，标题切换
  HomeNavigator.navigationOptions = ({ navigation }) => {
    const {
      routeName,
    } = navigation.state.routes[navigation.state.index];
    return {
      headerTitle: routeName,
    };
  };
  const routerNavigator = setRouterNavigator(routerPath);
  const MainNavigator = createStackNavigator({
    HomeNavigator: { screen: HomeNavigator },
    ...routerNavigator,
  }, {
    headerMode: 'none',
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
  });
  return MainNavigator;
}

export function setRouter(tabPayload, routerPath, options) {
  const routerNavigator = setRouterNavigator(routerPath);
  const MainNavigator = {};
  if (Object.prototype.toString.call(tabPayload) === '[object Object]') {
    MainNavigator.Main = { screen: setBottomTabNavigator(tabPayload) };
  }
  const AppNavigator = createStackNavigator({
    ...MainNavigator,
    ...routerNavigator,
  }, {
    headerMode: 'none',
    // mode: 'modal',
    // initialRouteName: 'Main',
    navigationOptions: {
      // gesturesEnabled: false,
    },
    transitionConfig: () => (Platform.OS === 'ios' ? StackViewTransitionConfigs.SlideFromRightIOS : ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: (sceneProps) => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    })),
    ...options,
  });
}

// 获取routeName
export function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}
