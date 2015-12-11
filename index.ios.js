let React = require('react-native');
let AutoResponisve = require('./src/Layout.js');

let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image
} = React;

const GAP = 8;
const BASE_URL = 'http://image.baidu.com/search/avatarjson?tn=resultjsonavatarnew&ie=utf-8&word=%E7%BE%8E%E5%A5%B3&cg=girl&itg=0&z=0&fr=&width=&height=&lm=-1&ic=0&s=0&st=-1&gsm=1d9070001e0';
const noop = function() {};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class Sample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
    this.page = 0;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.loadImages();
  }

  loadImages() {

    const {isLoading, page, pageSize} = this;

    if (isLoading) {
      return;
    }

    this.isLoading = true;

    const url = `${BASE_URL}&pn=${page * pageSize}&rn=${pageSize}`;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.imgs);
        this.setState({
          images: this.state.images.concat(data.imgs)
        }, () => {
          this.page++;
        });
        this.isLoading = false;
      })
      .catch((e) => {
        console.error(e);
        this.isLoading = false;
      });

  }

  getAutoResponisveProps() {
    return {
      itemMargin: GAP
    };
  }

  renderChildren() {

    const {images} = this.state;

    console.log(images.length);

    return images.map((image, key) => {

      const {objURL, width, height} = image;
      const displayWidth = (screenWidth - 3 * GAP) / 2;
      const displayHeight = displayWidth / width * height;

      const style = {
        width: displayWidth,
        height: displayHeight,
        borderRadius: 8
      };

      return (
        <View style={style} key={key}>
          <Image source={{uri: objURL}} style={{width: displayWidth, height: displayHeight}} />
        </View>
      );

    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Belle</Text>
        </View>
        <ScrollView
          style={{
            height: screenHeight - 50
          }}
          contentContainerStyle={{justifyContent: 'center', paddingLeft: GAP}}
          onScroll={(e) => {
            const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;
            if (contentSize.height - contentOffset.y < layoutMeasurement.height) {
              this.loadImages();
            }
          }}
          scrollEventThrottle={10}>
          <AutoResponisve {...this.getAutoResponisveProps()}>
            {this.renderChildren()}
          </AutoResponisve>
        </ScrollView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  title: {
    paddingTop: 20,
    paddingBottom: 20
  },
  titleText: {
    color: 'rgb(0, 159, 147)',
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold'
  },
  text: {
    textAlign: 'center',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'rgb(58, 45, 91)'
  }
});

AppRegistry.registerComponent('belle', () => Sample);
