import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { GestureHandlerRootView, PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';

const PinchableImage = ({ source }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const baseScale = useRef(1);
  const gestureScale = useRef(new Animated.Value(1)).current;

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const offsetX = useRef(0);
  const offsetY = useRef(0);

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: gestureScale } }],
    { useNativeDriver: true }
  );

  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      baseScale.current *= nativeEvent.scale;
      gestureScale.setValue(1);
      scale.setValue(baseScale.current);
    }
  };

  const onPanStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      offsetX.current += nativeEvent.translationX;
      offsetY.current += nativeEvent.translationY;
      translateX.setOffset(offsetX.current);
      translateY.setOffset(offsetY.current);
      translateX.setValue(0);
      translateY.setValue(0);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={onPanEvent}
        onHandlerStateChange={onPanStateChange}
        minPointers={1}
        maxPointers={2}
      >
        <Animated.View style={{ flex: 1 }}>
          <PinchGestureHandler
            onGestureEvent={onPinchEvent}
            onHandlerStateChange={onPinchStateChange}
          >
            <Animated.Image
              source={source}
              style={{
                width: '100%',
                height: '100%',
                transform: [
                  { scale: Animated.multiply(scale, gestureScale) },
                  { translateX },
                  { translateY },
                ],
              }}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default PinchableImage;