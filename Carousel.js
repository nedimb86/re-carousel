'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Carousel = function (_React$Component) {
  _inherits(Carousel, _React$Component);

  function Carousel(props, context) {
    _classCallCheck(this, Carousel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Carousel).call(this, props, context));

    var frames = _this.props.frames || _this.props.children;
    _this.state = {
      frames: frames,
      total: frames.length,
      current: 0, // current frame index
      vertical: _this.props.axis === 'y',
      horizontal: _this.props.axis === 'x'
    };

    _this.onTouchStart = _this.onTouchStart.bind(_this);
    _this.onTouchMove = _this.onTouchMove.bind(_this);
    _this.onTouchEnd = _this.onTouchEnd.bind(_this);
    _this.readyAutoSlide = _this.readyAutoSlide.bind(_this);
    return _this;
  }

  _createClass(Carousel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.readyAutoSlide();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.state.slider);
    }
  }, {
    key: 'updateFrameSize',
    value: function updateFrameSize() {
      var _getComputedStyle = getComputedStyle(this.refs.wrapper);

      var width = _getComputedStyle.width;
      var height = _getComputedStyle.height;

      this.setState({
        frameWidth: parseInt(width.split('px')[0], 10),
        frameHeight: parseInt(height.split('px')[0], 10)
      });
    }
  }, {
    key: 'readyAutoSlide',
    value: function readyAutoSlide() {
      var _this2 = this;

      if (!this.props.auto) return;
      this.setState({
        slider: setTimeout(function () {
          var direction = { x: 'left', y: 'up' }[_this2.props.axis];
          // prepare frames
          _this2.updateFrameSize();
          _this2.moveFrames(0, 0);
          _this2.updateFrameSize();
          // make the move
          _this2.moveFramesTowards(direction);
          _this2.readyAutoSlide();
        }, this.props.interval)
      });
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
      this.updateFrameSize();
      clearTimeout(this.state.slider);

      var _ref = e.touches && e.touches[0] || e;

      var pageX = _ref.pageX;
      var pageY = _ref.pageY;

      this.setState({
        startX: pageX,
        startY: pageY
      });

      this.refs.wrapper.addEventListener('touchmove', this.onTouchMove);
      this.refs.wrapper.addEventListener('touchend', this.onTouchEnd);
      this.refs.wrapper.addEventListener('mousemove', this.onTouchMove);
      this.refs.wrapper.addEventListener('mouseup', this.onTouchEnd);
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      if (e.touches && e.touches.length > 1) return;

      var _ref2 = e.touches && e.touches[0] || e;

      var pageX = _ref2.pageX;
      var pageY = _ref2.pageY;

      var deltaX = pageX - this.state.startX;
      var deltaY = pageY - this.state.startY;
      this.setState({
        deltaX: deltaX,
        deltaY: deltaY
      });

      if (this.state.vertical && Math.abs(deltaY) < Math.abs(deltaX)) return;
      if (this.state.horizontal && Math.abs(deltaX) < Math.abs(deltaY)) return;

      e.preventDefault();
      this.moveFrames(deltaX, deltaY);
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e) {
      var _state = this.state;
      var deltaX = _state.deltaX;
      var deltaY = _state.deltaY;

      console.log(this.decideTargetPosition(deltaX, deltaY));
      this.moveFramesTowards(this.decideTargetPosition(deltaX, deltaY));

      this.readyAutoSlide();

      this.refs.wrapper.removeEventListener('touchmove', this.onTouchMove);
      this.refs.wrapper.removeEventListener('touchend', this.onTouchEnd);
      this.refs.wrapper.removeEventListener('mousemove', this.onTouchMove);
      this.refs.wrapper.removeEventListener('mouseup', this.onTouchEnd);
    }
  }, {
    key: 'moveFrames',
    value: function moveFrames(deltaX, deltaY) {
      var _getSiblingFrames = this.getSiblingFrames();

      var prev = _getSiblingFrames.prev;
      var current = _getSiblingFrames.current;
      var next = _getSiblingFrames.next;

      toggleAnimation(prev, 0);
      toggleAnimation(current, 0);
      toggleAnimation(next, 0);
      if (this.state.vertical) {
        translate(current, 0, deltaY);
        if (deltaY > 0) {
          translate(prev, 0, deltaY - this.state.frameHeight);
        } else {
          translate(next, 0, deltaY + this.state.frameHeight);
        }
      } else {
        translate(current, deltaX, 0);
        if (deltaX > 0) {
          translate(prev, deltaX - this.state.frameWidth, 0);
        } else {
          translate(next, deltaX + this.state.frameWidth, 0);
        }
      }
    }
  }, {
    key: 'moveFramesTowards',
    value: function moveFramesTowards(direction) {
      var _getSiblingFrames2 = this.getSiblingFrames();

      var prev = _getSiblingFrames2.prev;
      var current = _getSiblingFrames2.current;
      var next = _getSiblingFrames2.next;

      toggleAnimation(prev, this.props.duration);
      toggleAnimation(current, this.props.duration);
      toggleAnimation(next, this.props.duration);
      var newCurrentId = void 0;
      switch (direction) {
        case 'up':
          translate(current, 0, -this.state.frameHeight);
          translate(next, 0, 0);
          newCurrentId = this.getFrameId('next');
          break;
        case 'down':
          translate(current, 0, this.state.frameHeight);
          translate(prev, 0, 0);
          newCurrentId = this.getFrameId('prev');
          break;
        case 'left':
          translate(current, -this.state.frameWidth, 0);
          translate(next, 0, 0);
          newCurrentId = this.getFrameId('next');
          break;
        case 'right':
          translate(current, this.state.frameWidth, 0);
          translate(prev, 0, 0);
          newCurrentId = this.getFrameId('prev');
      }
      // Update state
      this.setState({ current: newCurrentId });
    }
  }, {
    key: 'decideTargetPosition',
    value: function decideTargetPosition(deltaX, deltaY) {
      switch (this.props.axis) {
        case 'x':
          if (Math.abs(deltaX / deltaY) < 1) return 'origin';
          return deltaX > 0 ? 'right' : 'left';
        case 'y':
          if (Math.abs(deltaY / deltaX) < 1) return 'origin';
          return deltaY > 0 ? 'down' : 'up';
        default:
          console.error('Decide: on %s axis', this.props.axis, deltaX, deltaY);
      }
    }
  }, {
    key: 'getFrameId',
    value: function getFrameId(pos) {
      var _state2 = this.state;
      var total = _state2.total;
      var current = _state2.current;

      switch (pos) {
        case 'prev':
          return (current - 1 + total) % total;
        case 'next':
          return (current + 1) % total;
        default:
          return current;
      }
    }
  }, {
    key: 'getSiblingFrames',
    value: function getSiblingFrames() {
      return {
        current: this.refs['f' + this.getFrameId()],
        prev: this.refs['f' + this.getFrameId('prev')],
        next: this.refs['f' + this.getFrameId('next')]
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var wrapperStyle = objectAssign(styles.wrapper, this.props.style);
      var Indicator = this.props.indicator;
      return _react2.default.createElement(
        'div',
        { ref: 'wrapper', style: wrapperStyle,
          onTouchStart: this.onTouchStart,
          onMouseDown: this.onTouchStart },
        this.state.frames.map(function (frame, i) {
          var frameStyle = objectAssign({ zIndex: 99 - i }, styles.frame);
          return _react2.default.createElement(
            'div',
            { ref: 'f' + i, key: i, style: frameStyle },
            frame
          );
        }),
        Indicator && _react2.default.createElement(Indicator, { index: this.state.current, total: this.state.total }),
        this.props.frames && this.props.children
      );
    }
  }]);

  return Carousel;
}(_react2.default.Component);

Carousel.propTypes = {
  axis: _react2.default.PropTypes.oneOf(['x', 'y']),
  auto: _react2.default.PropTypes.bool,
  interval: _react2.default.PropTypes.number,
  duration: _react2.default.PropTypes.number,
  indicator: _react2.default.PropTypes.func,
  frames: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element),
  style: _react2.default.PropTypes.object
};

Carousel.defaultProps = {
  axis: 'x',
  auto: false,
  interval: 4000,
  duration: 300
};

function translate(el, x, y, withAnimation) {
  el.style.transfrom = 'translate(' + x + 'px, ' + y + 'px)';
  el.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px) translateZ(0)';
}

function toggleAnimation(el, duration) {
  duration = duration ? duration + 'ms' : '';
  el.style.transitionDuration = el.style.webkitTransitionDuration = duration;
}

function objectAssign(target) {
  var output = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
}

var styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative'
  },
  frame: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
};

exports.default = Carousel;