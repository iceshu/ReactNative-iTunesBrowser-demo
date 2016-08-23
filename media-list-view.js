'use strict'

import React ,{Component} from 'react';
import {
  ActivityIndicator,
  Text,
  ListView,
  View,
  StyleSheet,
  TextInput,
  AlertIOS
} from 'react-native'
import TimerMixin from 'react-timer-mixin';
import MediaCell from './media-cell';
import styles from './styles';
import MediaDetailView from './media-detail-view';

let timeoutID=null;
const API_URL='https://itunes.apple.com/search';

let LOADING={};

let resultsCache={
  dataForQuery:{}
};

class SearchBar extends Component{
  render(){
    return(
      <View style={styles.listView.searchBar}>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          placeholder='search for media on'
          returnKeyType='search'
          enablesReturnKeyAutomatically={true}
          style={styles.listView.searchBarInput}
          onChange={this.props.onSearch}

        />
        <ActivityIndicator
          animating={this.props.isLoading}
          style={styles.listView.spinner}
        />
      </View>
    )
  }
}
export default class MediaListView extends Component{
  constructor(props){
    super(props);
    this.state={
      isLoading:false,
      query:'',
      resultsData: new ListView.DataSource({
        rowHasChanged:(row1,row2)=>row1!=row2
      })
    }
  }

  componentDidMount(){
    this.searchMedia('misson impossible')
  }

  getDataSource(mediaItems){
    return this.state.resultsData.cloneWithRows(mediaItems)
  }

  //
  // getInitialState(){
  //   this.timeoutID=null
  // }
  // timeoutID=null;
  // let timeoutID:(null: any),


  _urlForQuery(query){
    if(query.length>2){
      return API_URL+'?media=movie&term='+encodeURIComponent(query);
    }
  }
  searchMedia(query:string){
    // this.timeoutID=null;
    this.setState({query:query});
    let cachedResultsForQuery = resultsCache.dataForQuery[query];
    if(cachedResultsForQuery){
      if(!LOADING[query]){
        this.setState({
          isLoading:false,
          resultsData:this.getDataSource(cachedResultsForQuery)
        })
      }
      else{
        this.setState({
          isLoading:true
        })
      }
    }
    else{
      let queryURL=this._urlForQuery(query);
      if(!queryURL) return;
      this.setState({
        isLoading:true
      });

      LOADING[query]=true;
      resultsCache.dataForQuery[query]=null;
      fetch(queryURL)
        .then((response)=>response.json())
        .catch((e)=>{
          LOADING[query]=false;
          resultsCache.dataForQuery[query]=undefined;

          this.setState({
            isLoading:false,
            resultsData:this.getDataSource([])
          })
        })
        .then((responseData)=>{
          // AlertIOS.alert('按钮',query);
          LOADING[query]=false;
          resultsCache.dataForQuery[query]=responseData.results;
          // AlertIOS.alert('number of results',responseData.resultCount+'results');
          this.setState({
            isLoading:false,
            resultsData:this.getDataSource(resultsCache.dataForQuery[query])
          })
        });
    }
  }


  render(){
    let content=null;
    if(this.state.resultsData.getRowCount()===0){
      let text = '';
      if (!this.state.isLoading && this.state.query) {
        text = "No movies found for '" + this.state.query + "'.";
      } else if (!this.state.isLoading) {
        text = "No movies found.";
      }
      content = <View style={styles.listView.emptyList}>
        <Text style={styles.listView.emptyListText}>{text}</Text>
      </View>;
    }
    else{
      content= <ListView
                dataSource={this.state.resultsData}
                renderRow={this.renderRow.bind(this)}
                renderSeparator={this.renderSeparator}
                automaticallyAdjustContentInsets={false}
                keyboardDismissMode='on-drag'
              />
    }
    return(
      <View style={styles.global.content}>
        <SearchBar
          isLoading={this.state.isLoading}
          onSearch={(e)=>{
            let searchString = e.nativeEvent.text;
             clearTimeout(this.timeoutID);
            //this.searchMedia(searchString);
             this.timeoutID=this.timer=setTimeout(()=>this.searchMedia(searchString),100);
          }}
        />
        {content}
      </View>
    )
  }

  renderRow (
    media: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunction: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <MediaCell
        media={media}
        onSelect={() => this.selectMediaItem(media)}
        onHighlight={() => highlightRowFunction(sectionID,rowID)}
        onDeHighlight={() => highlightRowFunction(null,null)}
      />
    );
  }

  selectMediaItem(mediaItem) {
    this.props.navigator.push({
      title: 'Media Details',
      component: MediaDetailView,
      passProps: {
        mediaItem
      }
    });
  }

  renderSeparator(
    sectionID:number|string,
    rowID:number|string,
    adjacentRowHighlighted:boolean
  ){
    return(
      <View
        key={'SEP_'+sectionID+'_'+rowID}
        style={[styles.listView.rowSeparator,adjacentRowHighlighted&&styles.listView.rowSeparatorHighlighted]}
      />
    )
  }

  componentWillUnmount() {
  // 如果存在this.timer，则使用clearTimeout清空。
  // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
  this.timer && clearTimeout(this.timer);
}

}
