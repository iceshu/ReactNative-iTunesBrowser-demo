import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  NavigatorIOS,
  StatusBarIOS,
  AlertIOS
} from 'react-native';
import styles from './styles';


import MediaListView from './media-list-view'

class iTunesBrowser extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.global.mainContainer}
        barTintColor='#2A3744'
        tintColor='#EFEFEF'
        titleTextColor='#EFEFEF'
        initialRoute={{
          component:MediaListView,
          title:'影片搜索',
          rightButtonTitle:'搜索',
          onRightButtonPress:()=>AlertIOS.alert(
            '搜索','你点了'
          )
        }}
      />
    );
  }
}


AppRegistry.registerComponent('iTunesBrowser', () => iTunesBrowser);
