import React, { PureComponent } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { BoxShadow } from 'react-native-shadow';
import RNTouchableOpacity from './TouchableOpacity';

const scaleZoom = 2;

export default class RNButton extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    title: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    borderRadius: PropTypes.number,
    isLoading: PropTypes.bool,
    // 阴影样式配置
    isBoxShadow: PropTypes.bool,
    boxShadowColor: PropTypes.string,
    setting: PropTypes.object,
    // 渐变样式配置
    isLinearGradient: PropTypes.bool,
    linearGradientProps: PropTypes.object,
  }

  static defaultProps = {
    width: 0,
    height: 44 * scaleZoom,
    title: '',
    onPress: null,
    disabled: false,
    borderRadius: 4 * scaleZoom,
    isLoading: false,
    isBoxShadow: true,
    boxShadowColor: '#2B8AEB',
    setting: {},
    isLinearGradient: true,
    linearGradientProps: {},
  }

  constructor(props) {
    super(props);
    this.renderBoxShadow = this.renderBoxShadow.bind(this);
    this.renderLinearGradient = this.renderLinearGradient.bind(this);
    this.renderButtonText = this.renderButtonText.bind(this);
    this.onLayout = this.onLayout.bind(this);

    this.state = {
      width: props.width || 0,
    };
  }

  renderContent = () => {
    const {
      isBoxShadow,
      isLinearGradient,
      borderRadius,
    } = this.props;
    if (isBoxShadow) {
      if (isLinearGradient) {
        return this.renderBoxShadow(this.renderLinearGradient(this.renderButtonText()));
      }
      return this.renderBoxShadow(this.renderButtonText());
    }
    if (isLinearGradient) {
      return this.renderLinearGradient(this.renderButtonText());
    }
    return this.renderButtonText({ backgroundColor: '#BDBDBD', borderRadius });
  }

  renderBoxShadow = (children) => {
    const {
      isBoxShadow,
      boxShadowColor,
      setting,
      height,
      borderRadius,
    } = this.props;
    if (!isBoxShadow) return children;
    const {
      width,
    } = this.state;
    const shadowOpt = {
      width,
      height,
      border: 2 * scaleZoom,
      radius: 3 * scaleZoom,
      opacity: 0.2,
      color: boxShadowColor,
      x: 0,
      y: 3 * scaleZoom,
      style: { borderRadius, marginVertical: 5 * scaleZoom },
      ...setting,
    };

    return (
      <BoxShadow setting={shadowOpt}>
        {children}
      </BoxShadow>
    );
  }

  renderLinearGradient = (children) => {
    const {
      isLinearGradient,
      linearGradientProps,
      disabled,
      isLoading,
      borderRadius,
    } = this.props;
    if (!isLinearGradient) return children;
    const {
      colors = ['#2B8AEB', '#594CC3'],
      start = { x: 0, y: 0.5 },
      end = { x: 1, y: 0.5 },
      style,
    } = linearGradientProps || {};
    return (
      <LinearGradient
          colors={colors}
          start={start}
          end={end}
          style={[{
            opacity: (disabled || isLoading) ? 0.5 : 1, borderRadius,
          }, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  renderButtonText = (style = {}) => {
    const {
      children,
      height,
      title,
      titleStyle,
      isLoading,
    } = this.props;
    return (
      <View style={{
        height,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      >
        {children || (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 30 * scaleZoom, justifyContent: 'center' }}>
            <ActivityIndicator animating={isLoading} color="#fff" size={scaleZoom > 1 ? 'large' : 'small'} />
          </View>
          <Text style={[{ textAlign: 'center', color: '#fff', fontSize: 17 * scaleZoom }, titleStyle]}>{title}</Text>
          <View style={{ width: 30 * scaleZoom }} />
        </View>
        )}
      </View>
    );
  }

  onLayout = (event) => {
    if (this.props.width) {
      return;
    }
    const { width } = event.nativeEvent.layout;
    this.setState({ width });
  }

  render() {
    const {
      onPress,
      disabled,
      isLoading,
    } = this.props;
    if (onPress && !disabled && !isLoading) {
      return (
        <RNTouchableOpacity onLayout={this.onLayout} onPress={onPress}>
          {this.renderContent()}
        </RNTouchableOpacity>
      );
    }
    return (
      <View onLayout={this.onLayout}>
        {this.renderContent()}
      </View>
    );
  }
}
