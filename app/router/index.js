/**
 * 路由集成 redux
 *  */
import {
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import AppContainer from './router';

// 额外router reducer
export const routerReducer = createNavigationReducer(AppContainer);

// router middleware
export const routerMiddleware = createReactNavigationReduxMiddleware(state => state.router, 'root');

const App = createReduxContainer(AppContainer, 'root');

const mapStateToProps = state => ({
  state: state.router,
});

const AppWithNavigationState = connect(mapStateToProps)(App);

export default AppWithNavigationState;
