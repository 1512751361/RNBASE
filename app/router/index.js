/**
 * 路由集成 redux
 *  */
import React, { PureComponent } from 'react';
// import {
//   createReactNavigationReduxMiddleware,
//   createNavigationReducer,
//   createReduxContainer,
// } from 'react-navigation-redux-helpers';
// import { connect } from 'react-redux';
import AppContainer from './router';
import NavigationService from './NavigationService';

// 额外router reducer
// export const routerReducer = createNavigationReducer(AppContainer);

// router middleware
// export const routerMiddleware = createReactNavigationReduxMiddleware(state => state.router, 'root');

// const App = createReduxContainer(AppContainer, 'root');

// const mapStateToProps = state => ({
//   state: state.router,
// });

// const AppWithNavigationState = connect(mapStateToProps)(App);

export default class App extends PureComponent {
  render() {
    return (
      <AppContainer
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
      />
    );
  }
}
