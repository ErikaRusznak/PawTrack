import { Text, TextProps } from './Themed';

export function TextBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Bold' }]} />;
}

export function TextLight(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Light' }]} />;
}

export function TextMedium(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Medium' }]} />;
}

export function TextRegular(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Regular' }]} />;
}

export function TextSemiBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-SemiBold' }]} />;
}

