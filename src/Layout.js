const React = require('react-native');
const Common = require('autoresponsive-common');

const {
  Util,
  GridSort
} = Common;

const {
  View,
  Dimensions
} = React;

const screenWidth = Dimensions.get('window').width;
const noop = function() {};

class AutoResponsive extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.sortManager = new GridSort({
      containerWidth: this.props.containerWidth,
      gridWidth: this.props.gridWidth
    });
  }

  componentWillUpdate() {
    this.sortManager.init();
  }

  mixItemInlineStyle(s) {
    let style = {
      position: 'absolute',
      overflow: 'hidden'
    };
    Util.merge(s, style);
  }

  renderChildren() {
    return React.Children.map(this.props.children, function(child, childIndex) {

      let childWidth = parseInt(child.props.style.width) + this.props.itemMargin;
      let childHeight = parseInt(child.props.style.height) + this.props.itemMargin;
      let calculatedPosition = this.sortManager.getPosition(childWidth, childHeight, this.containerStyle.height);

      if (!this.fixedContainerHeight) {

        if (calculatedPosition[1] + childHeight > this.containerStyle.height) {
          this.containerStyle.height = calculatedPosition[1] + childHeight;
        }
      }

      let calculatedStyle = {
        left: calculatedPosition[0],
        top: calculatedPosition[1]
      };

      this.mixItemInlineStyle(calculatedStyle);

      this.props.onItemDidLayout.call(this, child);

      if (childIndex + 1 === this.props.children.length) {
        this.props.onContainerDidLayout.call(this);
      }

      return React.cloneElement(child, {
        style: Util.extend({}, child.props.style, calculatedStyle)
      });
    }, this);
  }

  setPrivateProps() {
    this.containerStyle = {
      position: 'relative',
      height: this.containerHeight || 0
    };
  }

  getContainerStyle() {
    return this.containerStyle
  }

  render() {
    this.setPrivateProps();

    return (
      <View style={this.getContainerStyle()}>
      {this.renderChildren()}
      </View>
    );
  }
}

AutoResponsive.defaultProps = {
  containerWidth: screenWidth,
  containerHeight: null,
  gridWidth: 1,
  itemMargin: 0,
  horizontalDirection: 'left',
  verticalDirection: 'top',
  onItemDidLayout: noop,
  onContainerDidLayout: noop
};

module.exports = AutoResponsive;
