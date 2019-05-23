/** *
 * TextInput 带图标组件封装
 *  */
import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Colors from './Colors';
import Assets from './assets';
import {
  scaleZoom, Typography, DEFAULT_COLOR_BY_STATE, DEFAULT_UNDERLINE_COLOR_BY_STATE,
} from './Typography';

const Constants = {
  isAndroid: Platform.OS === 'android', // android 系统
  isIOS: Platform.OS === 'ios', // ios系统
};

const underLineMB = (Constants.isIOS ? 10 : 5) * scaleZoom;


export default class ReactTextInput extends Component {
    static displayName = 'ReactTextInput'

    static Typography = Typography

    static propTypes = {
      ...TextInput.propTypes,
      /**
         * should placeholder have floating behavior
         */
      floatingPlaceholder: PropTypes.bool,
      /**
         * floating placeholder color as a string or object of states, ex. {default: 'black', error: 'red', focus: 'blue'}
         */
      floatingPlaceholderColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      /**
         * This text will appear as a placeholder when the textInput becomes focused, only when passing floatingPlaceholder
         * as well (NOT for expandable textInputs)
         */
      helperText: PropTypes.string,
      /**
         * hide text input underline, by default false
         */
      hideUnderline: PropTypes.bool,
      /**
         * underline color as a string or object of states, ex. {default: 'black', error: 'red', focus: 'blue'}
         */
      underlineColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      /**
         * should text input be align to center
         */
      centered: PropTypes.bool,
      /**
         * input error message, should be empty if no error exists
         */
      error: PropTypes.string,
      /**
         * should the input component support error messages
         */
      enableErrors: PropTypes.bool,
      /**
         * should the input expand to another text area modal
         */
      expandable: PropTypes.bool,
      /**
         * allow custom rendering of expandable content when clicking on the input (useful for pickers)
         * accept props and state as params, ex. (props, state) => {...}
         * use toggleExpandableModal(false) method to toggle off the expandable content
         */
      renderExpandable: PropTypes.func,
      /**
         * transform function executed on value and return transformed value
         */
      transformer: PropTypes.func,
      /**
         * Fixed title that will displayed above the input (note: floatingPlaceholder MUST be 'false')
         */
      title: PropTypes.string,
      /**
         * The title's color as a string or object of states, ex. {default: 'black', error: 'red', focus: 'blue'}
         */
      titleColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      /**
         * should the input display a character counter (only when passing 'maxLength')
         */
      showCharacterCounter: PropTypes.bool,

      innerContainerPaddingTop: PropTypes.number,
      isClear: PropTypes.bool,
      isEyes: PropTypes.bool,
      imageWidth: PropTypes.number,
    }

    static defaultProps = {
      placeholderTextColor: DEFAULT_COLOR_BY_STATE.default,
      enableErrors: false,
      innerContainerPaddingTop: 18 * scaleZoom,
      isClear: true,
      isEyes: false,
      imageWidth: 15 * scaleZoom,
    }

    constructor(props) {
      super(props);
      this.input = null;
      this.renderTitle = this.renderTitle.bind(this);
      this.renderPlaceholder = this.renderPlaceholder.bind(this);
      this.hasText = this.hasText.bind(this);
      this.shouldShowHelperText = this.shouldShowHelperText.bind(this);
      this.shouldFakePlaceholder = this.shouldFakePlaceholder.bind(this);
      this.renderTextInput = this.renderTextInput.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onFocus = this.onFocus.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onClearPress = this.onClearPress.bind(this);
      this.updateFloatingPlaceholderState = this.updateFloatingPlaceholderState.bind(this);
      this.renderExpandableModal = this.renderExpandableModal.bind(this);
      this.renderError = this.renderError.bind(this);
      this.renderCharCounter = this.renderCharCounter.bind(this);
      this.getCharCount = this.getCharCount.bind(this);
      this.isCounterLimit = this.isCounterLimit.bind(this);
      this.generatePropsWarnings = this.generatePropsWarnings.bind(this);
      this.getHeight = this.getHeight.bind(this);
      this.getLinesHeightLimit = this.getLinesHeightLimit.bind(this);
      this.getStateColor = this.getStateColor.bind(this);
      this.generateStyles = this.generateStyles.bind(this);
      this.getTypography = this.getTypography.bind(this);
      this.getAssets = this.getAssets.bind(this);
      this.getInputStyles = this.getInputStyles.bind(this);
      this.renderInputClear = this.renderInputClear.bind(this);
      this.renderInputEyes = this.renderInputEyes.bind(this);
      this.renderInputLabel = this.renderInputLabel.bind(this);
      this.getLabelWidth = this.getLabelWidth.bind(this);
      this.blur = this.blur.bind(this);
      this.clear = this.clear.bind(this);

      this.state = {
        value: props.value,
        eyesCloseOpen: false,
        inputHeight: 0,
        labelWidth: 0,
        focused: false,
        floatingPlaceholderState: new Animated.Value(
          this.hasText(props.value) || this.shouldShowHelperText() ? 1 : 0,
        ),
      };
      this.generateStyles();
      this.getAssets();
      this.generatePropsWarnings(props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setState(
          {
            value: nextProps.value,
          },
          this.updateFloatingPlaceholderState,
        );
      }
    }

    componentDidMount() {
      this.getHeight();
    }

    getTypography = () => Typography.text70

    generateStyles() {
      this.styles = createStyles(this.props);
    }

    getInputStyles = (styleProps) => {
      const {
        imageWidth,
        hideUnderline,
      } = this.props;
      // const {
      //   inputHeight,
      // } = this.state;
      const padding = 5 * scaleZoom;
      const icon = {
        width: imageWidth + 10 * scaleZoom,
        height: imageWidth + 10 * scaleZoom,
        paddingHorizontal: padding,
        paddingBottom: hideUnderline ? undefined : underLineMB,
        paddingTop: 4,
        // paddingBottom: (Constants.isIOS ? 13 : 10) * scaleZoom,
        // paddingTop: (Constants.isAndroid ? 15 : 10) * scaleZoom,
        alignItems: 'flex-end',
        justifyContent: 'center',
        ...styleProps,
      };
      // const width = inputHeight - 2 * padding;
      // const maxWidth = 30 * screenWidth / 750;
      const image = {
        width: imageWidth,
        height: imageWidth,
        resizeMode: 'contain',
      };
      return {
        icon,
        image,
        padding,
      };
    }

    getAssets = () => {
      this.Assets = Assets;
    }

    getHeight() {
      const { multiline } = this.props;
      if (!multiline) {
        return 33;
      }
      return this.getLinesHeightLimit();
    }

    // numberOfLines support for both platforms
    getLinesHeightLimit() {
      const { multiline, numberOfLines } = this.props;
      if (multiline && numberOfLines) {
        return 33 * numberOfLines;
      }
    }

    generatePropsWarnings(props) {
      if (props.maxLength === 0) {
        console.warn('Setting maxLength to zero will block typing in this input');
      }
      if (props.showCharacterCounter && !props.maxLength) {
        console.warn('In order to use showCharacterCount please pass \'maxLength\' prop');
      }
    }

    hasText = value => !_.isEmpty(value || (this.state ? this.state.value : ''))

    shouldShowHelperText = () => {
      const { focused } = this.state ? this.state : {};
      const {
        helperText,
      } = this.props;
      return focused && helperText;
    }

    shouldFakePlaceholder = () => {
      const { floatingPlaceholder, centered } = this.props;
      return Boolean(floatingPlaceholder && !centered);
    }

    getCharCount() {
      const { value } = this.state;
      return _.size(value);
    }

    isCounterLimit() {
      const { maxLength } = this.props;
      const counter = this.getCharCount();
      return counter === 0 ? false : maxLength === counter;
    }

    renderTitle = () => {
      const { floatingPlaceholder, title, titleColor } = this.props;
      const color = this.getStateColor(titleColor);

      if (!floatingPlaceholder && title) {
        return (
          <Text style={[{ color, backgroundColor: 'pink' }, this.styles.title]}>
            {title}
          </Text>
        );
      }
    }

    renderPlaceholder = () => {
      const { floatingPlaceholderState } = this.state;
      const {
        centered,
        expandable,
        placeholder,
        placeholderTextColor,
        floatingPlaceholderColor,
        multiline,
        floatingPlaceholderLeft,
        innerContainerPaddingTop,
      } = this.props;
      const typography = this.getTypography();
      const floatingTypography = Typography.text90;

      if (this.shouldFakePlaceholder()) {
        return (
          <Animated.Text
              style={[
              this.styles.floatingPlaceholder,
              this.styles.placeholder,
              typography,
              centered && this.styles.placeholderCentered,
              !centered && {
                top: floatingPlaceholderState.interpolate({
                  inputRange: [0, 1],
                  outputRange: [multiline ? innerContainerPaddingTop : innerContainerPaddingTop, multiline ? 5 : 0],
                }),
                fontSize: floatingPlaceholderState.interpolate({
                  inputRange: [0, 1],
                  outputRange: [typography.fontSize, floatingTypography.fontSize],
                }),
                color: floatingPlaceholderState.interpolate({
                  inputRange: [0, 1],
                  outputRange: [placeholderTextColor, this.getStateColor(floatingPlaceholderColor)],
                }),
                lineHeight: this.hasText() || this.shouldShowHelperText()
                  ? floatingTypography.lineHeight
                  : typography.lineHeight,
                left: floatingPlaceholderState.interpolate({
                  inputRange: [0, 1],
                  outputRange: [this.getLabelWidth(), (floatingPlaceholderLeft || floatingPlaceholderLeft === 0) ? floatingPlaceholderLeft : this.getLabelWidth()],
                }),
              },
            ]}
          >
            {placeholder}
          </Animated.Text>
        );
      }
    }

    updateFloatingPlaceholderState(withoutAnimation) {
      if (withoutAnimation) {
        this.state.floatingPlaceholderState.setValue(this.hasText() || this.shouldShowHelperText() ? 1 : 0);
      } else {
        Animated.spring(this.state.floatingPlaceholderState, {
          toValue: this.hasText() || this.shouldShowHelperText() ? 1 : 0,
          duration: 150,
        }).start();
      }
    }

    renderExpandableInput = () => {

    }

    renderInputClear = () => {
      const {
        clearStyle,
      } = this.props;
      const inputIconStyle = this.getInputStyles({ paddingRight: 0, ...clearStyle });
      const {
        isClear,
        clearIcon,
        isEmptyClear,
      } = this.props;
      const {
        focused,
      } = this.state;
      if (isClear && focused) {
        return (
          <TouchableWithoutFeedback onPress={this.onClearPress.bind(this)}>
            <View style={inputIconStyle.icon}><Image source={clearIcon || this.Assets.clear} style={inputIconStyle.image} /></View>
          </TouchableWithoutFeedback>
        );
      }
      if (isClear && isEmptyClear) {
        return <View style={inputIconStyle.icon} />;
      }
    }

    getLabelWidth = () => {
      const {
        labelRender,
        labelWidth,
        labelUri,
        labelStyle,
        imageWidth,
      } = this.props;
      // const {
      //   inputHeight,
      // } = this.state;
      const inputIconStyle = this.getInputStyles({ paddingLeft: 0 });
      const style = _.merge(inputIconStyle, labelStyle);
      if (labelRender || labelUri) {
        return labelWidth !== undefined && labelWidth !== null ? labelWidth : (imageWidth + style.padding * 2);
      }
      return undefined;
    }

    renderInputLabel = () => {
      const inputIconStyle = this.getInputStyles({ paddingLeft: 0 });
      const {
        labelRender,
        labelUri,
        labelStyle,
      } = this.props;
      const {
        lineHeight,
      } = this.state;
      if (labelRender) {
        return _.invoke(this.props, 'labelRender', lineHeight);
      }
      if (labelUri) {
        const style = _.merge(inputIconStyle, labelStyle);
        return <View style={style.icon}><Image source={labelUri} style={style.image} /></View>;
      }
    }

    renderInputEyes = () => {
      const inputIconStyle = this.getInputStyles({ paddingRight: 0 });
      const {
        isEyes,
      } = this.props;
      const {
        eyesCloseOpen,
      } = this.state;
      if (isEyes) {
        return (
          <TouchableWithoutFeedback onPress={() => this.setState({ eyesCloseOpen: !eyesCloseOpen })}>
            <View style={inputIconStyle.icon}><Image source={eyesCloseOpen ? this.Assets.openEyes : this.Assets.closeEyes} style={inputIconStyle.image} /></View>
          </TouchableWithoutFeedback>
        );
      }
    }

    renderRight = () => {
      const {
        renderRight,
      } = this.props;
      if (renderRight) {
        return (
          <View style={{ height: this.state.inputHeight, justifyContent: 'center' }}>
            {renderRight(this.props)}
          </View>
        );
      }
    }

    renderTextInput = () => {
      const { value, eyesCloseOpen } = this.state;
      const color = this.props.color || Colors.extractColor;
      const typography = this.getTypography();
      const {
        style,
        placeholder,
        floatingPlaceholder,
        centered,
        multiline,
        numberOfLines,
        helperText,
        onLayout,
        autoCapitalize,
        secureTextEntry,
        isEyes,
        ...others
      } = this.props;
      const inputStyle = [
        this.styles.input,
        typography,
        color && { color },
        // with the right flex on the tree hierarchy we might not need this
        // {height: this.getHeight()},
        style,
      ];
      const placeholderText = this.shouldFakePlaceholder()
        ? (this.shouldShowHelperText() ? helperText : undefined) : placeholder;

      return (
        <View style={this.styles.inputContainer}>
          {this.renderInputLabel()}
          <TextInput
              {...others}
              autoCapitalize={autoCapitalize || 'none'}
              secureTextEntry={!isEyes ? secureTextEntry : !eyesCloseOpen}
              value={value}
              placeholder={placeholderText}
              underlineColorAndroid="transparent"
              style={inputStyle}
              multiline={multiline}
              numberOfLines={numberOfLines}
              onChangeText={this.onChangeText}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              ref={(input) => {
              this.input = input;
            }}
              onLayout={(event) => {
              if (event && event.nativeEvent && event.nativeEvent.layout) {
                const {
                  x,
                  y,
                  width,
                  height,
                } = event.nativeEvent.layout;
                this.setState({ inputHeight: height });
              }
              if (onLayout) onLayout(event);
            }}
          />
          {this.renderInputClear()}
          {this.renderInputEyes()}
          {this.renderRight()}
        </View>
      );
    }

    onChangeText = (text) => {
      const { transformer } = this.props;
      let transformedText = text;

      if (_.isFunction(transformer)) {
        transformedText = transformer(text);
      }

      _.invoke(this.props, 'onChangeText', transformedText);

      this.setState({
        value: transformedText,
      },
      this.updateFloatingPlaceholderState);
    }

    onChange = () => {

    }

    onFocus = (...args) => {
      _.invoke(this.props, 'onFocus', ...args);
      this.setState({ focused: true }, this.updateFloatingPlaceholderState);
    }

    onBlur = (...args) => {
      _.invoke(this.props, 'onBlur', ...args);
      this.setState({ focused: false }, this.updateFloatingPlaceholderState);
    }

    onClearPress = () => {
      _.invoke(this.props, 'onClearPress', this.state.value);
      if (this.input && this.input.clear) {
        this.input.clear();
      }
      this.setState({ value: '' }, this.updateFloatingPlaceholderState);
      _.invoke(this.props, 'onChangeText', '');
    }

    clear = () => {
      if (this.input && this.input.clear) {
        this.input.clear();
      }
    }

    blur = () => {
      if (this.input && this.input.blur) {
        this.input.blur();
      }
    }

    renderExpandableModal = () => {

    }

    renderError = () => {
      const { enableErrors, error, centered } = this.props;
      if (enableErrors) {
        return (
          <Text style={this.styles.errorMessage}>
            {error}
          </Text>
        );
      }
    }

    renderCharCounter = () => {
      const { focused } = this.state;
      const { maxLength, showCharacterCounter } = this.props;
      if (maxLength && showCharacterCounter) {
        const counter = this.getCharCount();
        const color = this.isCounterLimit() && focused ? DEFAULT_COLOR_BY_STATE.error : DEFAULT_COLOR_BY_STATE.default;
        return (
          <Text
              style={[{ color }, this.styles.charCounter]}
          >
            {counter}
            {' '}
            {'/'}
            {' '}
            {maxLength}
          </Text>
        );
      }
    }

    getStateColor(colorProp, isUnderline) {
      const { focused } = this.state;
      const { error } = this.props;
      const colorByState = _.cloneDeep(isUnderline ? DEFAULT_UNDERLINE_COLOR_BY_STATE : DEFAULT_COLOR_BY_STATE);

      if (colorProp) {
        if (_.isString(colorProp)) {
          // use given color for any state
          return colorProp;
        } if (_.isObject(colorProp)) {
          // set given colors by states
          _.merge(colorByState, colorProp);
        }
      }

      // return the right color for the current state
      let color = colorByState.default;
      if (error && isUnderline) {
        color = colorByState.error;
      } else if (focused) {
        color = colorByState.focus;
      }
      return color;
    }

    render() {
      const { expandable, containerStyle, underlineColor } = this.props;
      const underlineStateColor = this.getStateColor(underlineColor, true);

      return (
        <View style={[this.styles.container, containerStyle]} collapsable={false}>
          {this.renderTitle()}
          <View style={[this.styles.innerContainer, { borderColor: underlineStateColor }]}>
            {this.renderPlaceholder()}
            {expandable ? this.renderExpandableInput() : this.renderTextInput()}
            {this.renderExpandableModal()}
          </View>
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,0,134,0.5)',
          }}
          >
            <View style={{
              flex: 1,
            }}
            >
              {this.renderError()}
            </View>
            {this.renderCharCounter()}
          </View>
        </View>
      );
    }
}

function createStyles({
  placeholderTextColor,
  hideUnderline,
  centered,
  floatingPlaceholder,
  innerContainerPaddingTop,
}) {
  return StyleSheet.create({
    container: {
    },
    innerContainer: {
      flexDirection: 'row',
      borderBottomWidth: hideUnderline ? 0 : 1 * scaleZoom,
      borderColor: Colors.dark70,
      justifyContent: centered ? 'center' : undefined,
      paddingTop: floatingPlaceholder ? innerContainerPaddingTop : undefined,
      flexGrow: 1,
    },
    focusedUnderline: {
      borderColor: Colors.blue30,
    },
    errorUnderline: {
      borderColor: Colors.red30,
    },
    inputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      flex: 1,
      marginBottom: hideUnderline ? undefined : underLineMB,
      padding: 0,
      textAlign: centered ? 'center' : undefined,
      backgroundColor: 'transparent',
    },
    floatingPlaceholder: {
      position: 'absolute',
    },
    placeholder: {
      color: placeholderTextColor,
    },
    placeholderCentered: {
      left: 0,
      right: 0,
      textAlign: 'center',
    },
    errorMessage: {
      color: Colors.red30,
      textAlign: centered ? 'center' : undefined,
      ...Typography.text90,
      marginTop: 1,
    },
    expandableModalContent: {
      flex: 1,
      paddingTop: 15 * scaleZoom,
      paddingHorizontal: 20 * scaleZoom,
    },
    title: {
      top: 0,
      ...Typography.text90,
      height: Typography.text90.lineHeight,
      marginBottom: Constants.isIOS ? 5 : 4,
    },
    charCounter: {
      ...Typography.text90,
      height: Typography.text90.lineHeight,
      marginTop: 1,
    },
  });
}
