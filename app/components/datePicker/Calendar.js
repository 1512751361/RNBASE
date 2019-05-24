import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  ScrollView,
  FlatList,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from '../modal';
import RNTouchableOpacity from '../Touchable/TouchableOpacity';
import RNTouchableWithoutFeedback from '../Touchable/TouchableWithoutFeedback';
import { isBefore, getYMDHm } from '../../../lib/tools/date';

const statusBarH = global.ScreenUtil.isIOS ? global.ScreenUtil.statusBarHeight : 0;

export default class Calendar extends Component {
  static defaultProps = {
    headerStyle: {
      color: '#fff',
    },
  }

  constructor(props) {
    super(props);
    let {
      startTime,
      holiday,
      check,
      headerStyle,
      num,
    } = props;
    // 开始时间
    const date = new Date();
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    startTime = startTime || newDate;
    holiday = holiday || {};
    check = check || {};
    headerStyle = headerStyle || {};
    // 显示月份的个数
    num = num || 3;
    this.state = {
      startTime,
      num,
      holiday,
      check,
      headerStyle,

      beginTime: '',
      endTime: '',

      refreshing: false,
    };
    this.onTouchEvent = this.onTouchEvent.bind(this);
    this.getDateCheck = this.getDateCheck.bind(this);
    this.getData = this.getData.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
  }

  onTouchEvent = (dateStr) => {
    const {
      touchEvent,
    } = this.props;
    let {
      beginTime,
      endTime,
    } = this.state;
    if (dateStr) {
      if ((isBefore(dateStr, new Date()))) {
        if (beginTime && endTime) {
          if (isBefore(dateStr, beginTime)) {
            beginTime = dateStr;
          } else if (isBefore(endTime, dateStr)) {
            endTime = dateStr;
          } else {
            beginTime = dateStr;
            endTime = '';
          }
        } else if (beginTime) {
          endTime = dateStr;
        } else {
          beginTime = dateStr;
        }
        this.setState({ beginTime, endTime });
      }
      if (touchEvent) touchEvent(dateStr);
    }
  }

  getDateCheck = () => {
    const {
      beginTime,
      endTime,
      check,
    } = this.state;
    const dateCheck = {};
    if (beginTime) {
      dateCheck[beginTime] = 'checked';
    }
    if (endTime) {
      dateCheck[endTime] = 'checked';
    }
    return { ...check, ...dateCheck };
  }

  getData = () => {
    const {
      num,
    } = this.state;
    return new Array(num);
  }

  renderItem = (data) => {
    const {
      onBackButtonPress,
      onPressOK,
    } = this.props;
    if (!data) return null;
    const {
      index,
    } = data;
    const {
      startTime,
      holiday,
      headerStyle,
    } = this.state;

    const date = startTime;
    const check = this.getDateCheck();

    const dateNow = new Date();

    const n = index;
    /* 循环完成一个月 */
    const rows = [];
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1 + n, 0); // 天数
    let week = new Date(date.getFullYear(), date.getMonth() + n, 1).getDay(); // 月份开始的星期
    if (week === 0) {
      week = 7;
    }
    const counts = newDate.getDate();
    const rowCounts = Math.ceil((counts + week - 1) / 7); // 本月行数
    for (let i = 0; i < rowCounts; i += 1) {
      const days = [];
      for (let j = (i * 7) + 1; j < ((i + 1) * 7) + 1; j += 1) {
        // 根据每个月开始的［星期］往后推
        let dayNum = j - week + 1;
        if (dayNum > 0 && j < counts + week) {
          // 如果当前日期小于今天，则变灰
          const dateObj = new Date(date.getFullYear(), date.getMonth() + n, dayNum);
          const dateStr = `${dateObj.getFullYear()}-${(`0${dateObj.getMonth() + 1}`).slice(-2)}-${(`0${dayNum}`).slice(-2)}`;
          // var dateStr = getYMDHm(dateStr1,'YYYY-MM-DD');
          let grayStyle = {};
          let bk = {};
          if (dateNow < new Date(date.getFullYear(), date.getMonth() + n, dayNum + 1 - 1)) {
            grayStyle = {
              color: '#ccc',
            };
          }
          if (holiday[dateStr]) {
            dayNum = holiday[dateStr];
          }
          if (check[dateStr]) {
            bk = {
              backgroundColor: '#1EB7FF',
              width: 46,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
            };
            grayStyle = {
              color: '#fff',
            };
          }
          days.push(
            <RNTouchableOpacity style={[styles.flex_1]} underlayColor="#fff" onPress={() => this.onTouchEvent(dateStr)}>
              <View style={bk}>
                <Text style={grayStyle}>{dayNum}</Text>
              </View>
            </RNTouchableOpacity>,
          );
        } else {
          days.push(
            <View style={[styles.flex_1]}>
              <Text />
            </View>,
          );
        }
      }
      rows.push(
        <View style={styles.row}>{days}</View>,
      );
    }
    return (
      <View style={[styles.cm_bottom]}>
        <View style={styles.month}>
          <Text style={styles.month_text}>
            {newDate.getFullYear()}


            {'年'}
            {newDate.getMonth() + 1}


            {'月'}
          </Text>
        </View>
        {rows}
      </View>
    );
  }

  render() {
    const {
      onBackButtonPress,
      onPressOK,
      isVisible,
      style,
      headerStyle,
    } = this.props;
    if (!isVisible) {
      return null;
    }
    const {
      refreshing,
    } = this.state;
    return (
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
      }}
      >
        <ReactNativeModal
            {...this.props}
            style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }}
            isModal
        >
          <StatusBar
              animated
              hidden={false}
              translucent
              barStyle="dark-content"
              backgroundColor="transparent"
          />
          <View style={styles.calendar_container}>
            <LinearGradient
                colors={['#59E9C7', '#07C79A']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ paddingTop: statusBarH }}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                <RNTouchableWithoutFeedback onPress={onBackButtonPress}>
                  <View style={{
                    paddingHorizontal: global.ScreenUtil.scaleSize(30),
                    paddingVertical: global.ScreenUtil.scaleHeight(22),
                  }}
                  >
                    <Text style={{
                      color: '#fff',
                      fontSize: global.ScreenUtil.setSpText2(24),
                    }}
                    >
                      {'取消'}
                    </Text>
                  </View>
                </RNTouchableWithoutFeedback>
                <Text style={{
                  fontSize: global.ScreenUtil.setSpText2(28),
                  color: '#fff',
                  flex: 1,
                  textAlign: 'center',
                }}
                >
                  {'请选择日期'}
                </Text>
                <RNTouchableWithoutFeedback onPress={() => {
                  const {
                    beginTime,
                    endTime,
                  } = this.state;
                  if (onPressOK) {
                    onPressOK({
                      beginTime,
                      endTime,
                    });
                  }
                }}
                >
                  <View style={{
                    paddingHorizontal: global.ScreenUtil.scaleSize(30),
                    paddingVertical: global.ScreenUtil.scaleHeight(22),
                  }}
                  >
                    <Text style={{
                      color: '#fff',
                      fontSize: global.ScreenUtil.setSpText2(24),
                    }}
                    >
                      {'确定'}
                    </Text>
                  </View>
                </RNTouchableWithoutFeedback>
              </View>
              <View style={[styles.row, styles.row_header, headerStyle]}>
                <View style={[styles.flex_1]}>
                  <Text style={headerStyle}>周一</Text>
                </View>
                <View style={[styles.flex_1]}>
                  <Text style={headerStyle}>周二</Text>
                </View>
                <View style={[styles.flex_1]}>
                  <Text style={headerStyle}>周三</Text>
                </View>
                <View style={[styles.flex_1]}>
                  <Text style={headerStyle}>周四</Text>
                </View>
                <View style={[styles.flex_1]}>
                  <Text style={headerStyle}>周五</Text>
                </View>
                <View style={[styles.flex_1]}>
                  <Text style={[styles.week_highlight, headerStyle]}>周六</Text>
                </View>
                <View style={[styles.flex_1]}>
                  <Text style={[styles.week_highlight, headerStyle]}>周日</Text>
                </View>
              </View>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <FlatList
                  style={{
                  flex: 1,
                }}
                  data={this.getData()}
                  keyExtractor={(item, index) => index}
                  renderItem={this.renderItem}
                  refreshing={refreshing}
                  onRefresh={() => {
                  const {
                    num,
                    startTime,
                  } = this.state;
                  const date = new Date(startTime);
                  const newDate = new Date(date.getFullYear(), date.getMonth() - 2, 1);
                  this.setState({
                    startTime: newDate,
                    num: num + 2,
                  });
                }}
                  onEndReached={() => {
                  const {
                    num,
                  } = this.state;
                  this.setState({
                    num: num + 2,
                  });
                }}
                  onEndReachedThreshold={0.5}
              />
            </View>
          </View>
        </ReactNativeModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  flex_1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar_container: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#ccc',
    // position: "absolute",
    // left: 0,
    // right: 0,
    // bottom: 0,
    // top: 0
  },
  row_header: {
    // backgroundColor:'#F5F5F5',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    height: 35,
  },
  month: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  month_text: {
    fontSize: 18,
    fontWeight: '400',
  },
  week_highlight: {
    color: '#23B8FC',
  },
  cm_bottom: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
  },
});
