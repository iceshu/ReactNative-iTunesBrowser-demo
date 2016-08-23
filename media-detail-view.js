'use strict';

import React ,{Component} from 'react';
import {
  Image,
  LinkingIOS,
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import dd from './styles';
let styles = dd.detailView;

export default class MediaDetailView extends Component{
    render() {
      let item = this.props.mediaItem;

      // console.dir(item);

      let buyPrice = (item.trackHdPrice && item.trackPrice) ?
        <View style={styles.mediaPriceRow}>
          <Text style={styles.sectionTitle}>Buy</Text>
          <Text style={styles.mediaPrice}>${item.trackHdPrice} (HD)</Text>
          <Text style={styles.mediaPrice}>${item.trackPrice} (SD)</Text>
        </View> : null;

      let rentalPrice = (item.trackHdRentalPrice && item.trackRentalPrice) ?
        <View style={styles.mediaPriceRow}>
          <Text style={styles.sectionTitle}>Rent</Text>
          <Text style={styles.mediaPrice}>${item.trackHdRentalPrice} (HD)</Text>
          <Text style={styles.mediaPrice}>${item.trackRentalPrice} (SD)</Text>
        </View> : null;

      return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.mediaTitle} numberOfLines={2}>
            {item.trackName}
          </Text>
          <View style={styles.mainSection}>
            <Image
              source={{uri: item.artworkUrl100}}
              style={styles.mediaImage}
            />
            <View style={{flex: 1}}>
              <View style={[styles.mainSection, {
                alignItems: 'center',
                justifyContent: 'space-between'
              }]}>
                <View>
                  <Text style={styles.mediaGenre}>{item.primaryGenreName}</Text>
                  <Text style={styles.contentAdvisory}>{item.contentAdvisoryRating}</Text>
                </View>
              </View>
              <View style={styles.separator} />
              {buyPrice}
              {rentalPrice}
            </View>
          </View>
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.mediaDescription}>{item.longDescription}</Text>
          <View style={styles.separator} />
          <TouchableHighlight
            onPress={() => LinkingIOS.openURL(item.trackViewUrl)}
          >
            <Text style={styles.iTunesButton}>
              View in iTunes
            </Text>
          </TouchableHighlight>
        </ScrollView>
      );
    }
}
