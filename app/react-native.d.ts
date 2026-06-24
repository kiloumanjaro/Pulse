// On web, `react-native` is aliased to `react-native-web` at build time by
// @tamagui/next-plugin. Neither react-native-web nor Tamagui's internals ship
// type declarations, and Tamagui's TS source imports RN primitives both as
// values and as types. This loose shim resolves every `react-native` import as
// `any` (usable in both value and type position). The `react-native` entry in
// tsconfig `paths` points here. Runtime behaviour is unaffected — this is
// types-only.
declare module "react-native" {
  // Component / value exports that Tamagui also uses in type position.
  export type View = any;
  export const View: any;
  export type Text = any;
  export const Text: any;
  export type TextInput = any;
  export const TextInput: any;
  export type ScrollView = any;
  export const ScrollView: any;
  export type Image = any;
  export const Image: any;
  export type ImageBackground = any;
  export const ImageBackground: any;
  export type Pressable = any;
  export const Pressable: any;
  export type Modal = any;
  export const Modal: any;
  export type Switch = any;
  export const Switch: any;
  export type FlatList = any;
  export const FlatList: any;
  export type SectionList = any;
  export const SectionList: any;
  export type ActivityIndicator = any;
  export const ActivityIndicator: any;
  export type TouchableOpacity = any;
  export const TouchableOpacity: any;
  export type TouchableWithoutFeedback = any;
  export const TouchableWithoutFeedback: any;
  export type TouchableHighlight = any;
  export const TouchableHighlight: any;
  export type SafeAreaView = any;
  export const SafeAreaView: any;
  export type KeyboardAvoidingView = any;
  export const KeyboardAvoidingView: any;

  // Value-only exports.
  export const StyleSheet: any;
  export const Platform: any;
  export const Dimensions: any;
  export const PixelRatio: any;
  export const Appearance: any;
  export const Animated: any;
  export const Easing: any;
  export const Keyboard: any;
  export const I18nManager: any;
  export const InteractionManager: any;
  export const LayoutAnimation: any;
  export const Linking: any;
  export const PanResponder: any;
  export const NativeModules: any;
  export const NativeEventEmitter: any;
  export const DeviceEventEmitter: any;
  export const UIManager: any;
  export const AccessibilityInfo: any;
  export const Alert: any;
  export const BackHandler: any;
  export const Vibration: any;
  export const Share: any;
  export const StatusBar: any;
  export const processColor: any;
  export const findNodeHandle: any;
  export const requireNativeComponent: any;
  export const useColorScheme: any;
  export const useWindowDimensions: any;

  // Type-only exports.
  export type ViewStyle = any;
  export type TextStyle = any;
  export type ImageStyle = any;
  export type FlexStyle = any;
  export type TransformsStyle = any;
  export type ViewProps = any;
  export type TextProps = any;
  export type ImageProps = any;
  export type TextInputProps = any;
  export type ScrollViewProps = any;
  export type PressableProps = any;
  export type SwitchProps = any;
  export type StyleProp<T = any> = any;
  export type ColorValue = any;
  export type DimensionValue = any;
  export type LayoutChangeEvent = any;
  export type LayoutRectangle = any;
  export type NativeSyntheticEvent<T = any> = any;
  export type NativeTouchEvent = any;
  export type GestureResponderEvent = any;
  export type ListRenderItemInfo<T = any> = any;
  export type ImageSourcePropType = any;
  export type ImageResizeMode = any;
  export type AccessibilityRole = any;
  export type AccessibilityState = any;

  const _default: any;
  export default _default;
}
