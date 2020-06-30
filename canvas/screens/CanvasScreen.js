import React, { useState } from 'react';
import {
  Dimensions, View,
  StyleSheet, PanResponder
} from 'react-native';
import Colors from '../constants/Colors';
import ColorSelector from '../components/ColorSelector';
import Svg, { G, Path } from 'react-native-svg';

export default () => {

  const [color, setColor] = useState(Colors.color1);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [donePaths, setDonePaths] = useState([]);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [currentMax, setCurrentMax] = useState(0);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [gestures, setGestures] = useState(gestures || []);


  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gs) => onResponderGrant(e, gs),
    onPanResponderMove: (e, gs) => onResponderMove(e, gs),
    onPanResponderRelease: (e, gs) => onResponderRelease(e, gs),
  });

  const onTouch = (e) => {
    let [x, y] = [e.nativeEvent.pageX, e.nativeEvent.pageY];
    setCurrentPoints(currentPoints.concat({ x, y }));
  }

  const onResponderGrant = (e) => {
    onTouch(e);
  }

  const onResponderMove = (e) => {
    onTouch(e);
  }

  const onResponderRelease = () => {
    if (currentPoints.length > 0) {
      setDonePaths(donePaths.concat(
        <Path
          key={currentMax}
          d={pointsToSvg(currentPoints)}
          stroke={color}
          strokeWidth={strokeWidth}
          fill='none'
        />
      ));
      setGestures(gestures.concat(currentPoints));
    }
    setCurrentPoints([]);
    setCurrentMax(currentMax + 1);
  }

  const changeColor = (color) => {
    if (color === 'eraser') {
      setColor('#FFF');
      setStrokeWidth(15);
    }
    else if (color === 'clear') {
      setColor('#4d4d4d');
      setStrokeWidth(4);
      setDonePaths([]);
    }
    else {
      setColor(color);
      setStrokeWidth(4);
    }
  }

  const onLayoutContainer = (e) => {
    setOffsetX(e.nativeEvent.layout.x);
    setOffsetY(e.nativeEvent.layout.y + 50);
  }

  const pointsToSvg = (points) => {
    if (points.length > 0) {
      let path = `M ${points[0].x - offsetX}, ${points[0].y - offsetY}`;
      points.forEach((point) => {
        path = `${path} L ${point.x - offsetX}, ${point.y - offsetY}`;
      });
      return path;
    } else {
      return '';
    }
  }

  return (
    <View style={styles.container}>

      <View style={{ alignItems: 'center' }}>
        <View
          onLayout={onLayoutContainer}
          style={ styles.drawContainer }
        >
          <View {...panResponder.panHandlers}>
            <Svg
              style={{ backgroundColor: 'transparent' }}
              width={Dimensions.get('window').width}
              height={Dimensions.get('window').width + 100}
            >
              <G>
                {donePaths.map((path) => {
                  return path;
                })}
                <Path
                  key={currentMax}
                  d={pointsToSvg(currentPoints)}
                  stroke={color}
                  strokeWidth={strokeWidth - 1}
                  fill='none'
                />
              </G>
            </Svg>
          </View>
        </View>
      </View>
      <ColorSelector onPress={changeColor} />
    </View>
  )

}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  drawContainer: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width + 100, 
    backgroundColor: '#FFF',
    marginTop: 10,
  },
})
