import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ActionSheetIOS,
  TouchableWithoutFeedback,
  Modal,
  StatusBar,
  Platform,
  View,
  Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';

const scaleZoom = 1;
export default class ActionSheet extends Component {
  static displayName = 'ActionSheet';

  static propTypes = {
    /**
     * 是否显示 ActionSheet
     */
    visible: PropTypes.bool,
    /**
     * 弹窗顶部标题
     */
    title: PropTypes.string,
    /**
     * 弹窗框顶部标题下方的信息
     */
    message: PropTypes.string,
    /**
     * 选项的索引表示取消操作（显示为分隔的底部粗体按钮）
     */
    cancelButtonIndex: PropTypes.number,
    /**
     * 选项的索引表示破坏性操作（将显示红色文本）。通常用于“删除”或“中止”操作）
     */
    destructiveButtonIndex: PropTypes.number,
    /**
     * 操作表的选项列表 (包含 'label' string and 'onPress' 点击事件)
     */
    options: PropTypes.array,
    /**
     * 关闭取消回调函数
     */
    onDismiss: PropTypes.func,
    /**
     * 应使用iOS的本机操作表
     */
    useNativeIOS: PropTypes.bool,
    /**
     * 传递后（仅适用于useNativeIOS），将在底部显示取消按钮（覆盖CancelButtonIndex）
     */
    showCancelButton: PropTypes.bool,
  };

  static defaultProps = {
    title: undefined,
    message: undefined,
    showCancelButton: false,
    useNativeIOS: true,
    visible: false,
    cancelButtonIndex: -1,
    destructiveButtonIndex: -1,
    options: [],
    onDismiss: () => {},
  };

  constructor(props) {
    super(props);
    this.getCancelButtonIndex = this.getCancelButtonIndex.bind(this);
    this.renderSheet = this.renderSheet.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.onOptionPress = this.onOptionPress.bind(this);
    this.renderAction = this.renderAction.bind(this);
    this.onClosePress = this.onClosePress.bind(this);
  }

  componentWillMount() {
    const { isFristIOS } = this.props;
    if (isFristIOS) {
      this.actionSheetIOS(this.props, isFristIOS);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.actionSheetIOS(nextProps);
  }

  actionSheetIOS = (nextProps, isFristIOS) => {
    const { useNativeIOS, visible } = this.props;
    const wasVisible = visible;
    const willBeVisible = nextProps.visible;
    if (((!wasVisible && willBeVisible && useNativeIOS) || isFristIOS) && Platform.OS === 'ios') {
      const {
        title, message, destructiveButtonIndex, options, showCancelButton,
      } = nextProps;

      const optionsArray = options !== undefined ? options : [];
      let cancelBtnIndex = this.getCancelButtonIndex();
      if (showCancelButton) {
        optionsArray.push({ label: 'Cancel' });
        cancelBtnIndex = optionsArray.length - 1;
      }

      ActionSheetIOS.showActionSheetWithOptions(
        {
          title,
          message,
          options: _.map(optionsArray, 'label'),
          cancelButtonIndex: cancelBtnIndex,
          destructiveButtonIndex,
        },
        this.onOptionPress,
      );
    }
  }

  onClosePress = () => {
    const {
      onDestroyPress,
    } = this.props;
    if (onDestroyPress) onDestroyPress();
  }

  getCancelButtonIndex = () => {
    const {
      cancelButtonIndex,
    } = this.props;
    return cancelButtonIndex;
  }

  renderSheet = () => {
    const {
      contentStyle,
    } = this.props;
    return (
      <Animatable.View animation="slideInUp" duration={600} easing="ease-out-quint">
        <View style={[styles.content, contentStyle]}>
          <View style={[{ backgroundColor: 'white' }, styles.content_list_radius]}>
            {this.renderTitle()}
            {this.renderActions()}
          </View>
          <View
              style={[{ backgroundColor: 'white' }, styles.content_list_radius, {
              marginTop: 9 * scaleZoom,
              marginBottom: 10 * scaleZoom,
            }]}
          >
            <TouchableWithoutFeedback onPress={() => {
              _.invoke(this.props, 'onDestroyPress');
              _.invoke(this.props, 'onDismiss');
            }}
            >
              <View
                  containerStyle={{ backgroundColor: 'transparent', borderRadius: 14 * scaleZoom }}
                  height={57 * scaleZoom}
                  key={-1}

                  activeBackgroundColor="#ecf5fd"
              >
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                >
                  <Text style={styles.content_list_txt} numberOfLines={1}>取消</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Animatable.View>
    );
  }

  renderTitle = () => {
    const { title } = this.props;
    if (!_.isEmpty(title)) {
      return (
        <View style={{
          alignItems: 'flex-end',
        }}
        >
          <Text
              style={{
              fontSize: 18 * scaleZoom,
              textAlign: 'center',
              paddingHorizontal: 10 * scaleZoom,
              paddingVertical: 20 * scaleZoom,
              color: '#858F96',
            }}
          >
            {title}
          </Text>
        </View>
      );
    }
  }

  renderActions = () => {
    const { title, options } = this.props;
    const cancelButtonIndex = this.getCancelButtonIndex();
    const optionsToRender = _.filter(options, (option, index) => index !== cancelButtonIndex);
    return (
      <View>
        {_.map(optionsToRender, this.renderAction)}
      </View>
    );
  }

  renderAction = (option, index) => {
    const { destructiveButtonIndex, title } = this.props;
    return (
      <TouchableWithoutFeedback key={index} onPress={() => this.onOptionPress(index)}>
        <View
            containerStyle={{ backgroundColor: 'transparent' }}
            height={57 * scaleZoom}
            activeBackgroundColor="#ecf5fd"
        >
          <View
              style={[{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }, (index === 0 && !_.isEmpty(title) || index > 0) ? {
              borderTopColor: 'rgba(63,63,63,0.2)',
              borderTopWidth: 1 * scaleZoom,
            } : {}]}
          >
            <Text style={[styles.content_list_txt, destructiveButtonIndex === index ? { color: '#FF4103' } : {}]} numberOfLines={1}>
              {option.label}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  onOptionPress = (optionIndex) => {
    _.invoke(this.props, `options[${optionIndex}].onPress`);
    _.invoke(this.props, 'onDestroyPress');
    _.invoke(this.props, 'onDismiss');
  }

  render() {
    const { visible, useNativeIOS, onDismiss } = this.props;

    if (Platform.OS === 'ios' && useNativeIOS) return null;

    if (!visible) return null;
    return (
      <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
        <Modal
            visible={visible}
            transparent
            onRequestClose={() => {
            _.invoke(this.props, 'onDestroyPress');
            _.invoke(this.props, 'onDismiss');
          }}
        >
          <StatusBar
              animated
              hidden={false}
              translucent
              barStyle="dark-content"
              backgroundColor="transparent"
          />
          <TouchableWithoutFeedback onPress={() => {
            _.invoke(this.props, 'onDestroyPress');
            _.invoke(this.props, 'onDismiss');
          }}
          >
            <View style={styles.container}>
              <Animatable.View
                  style={styles.overlay}
                  animation="fadeIn"
                  duration={300}
                  easing="ease-out-quint"
                  useNativeDriver
              >
                <View style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
                >
                  {this.renderSheet()}
                </View>
              </Animatable.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    marginHorizontal: 8 * scaleZoom,
  },
  content_list_radius: {
    borderRadius: 14 * scaleZoom,
    elevation: 2,
  },
  content_list_txt: {
    fontSize: 20 * scaleZoom,
    color: '#007AFF',
    letterSpacing: 0.76,
    textAlign: 'center',
  },
});
