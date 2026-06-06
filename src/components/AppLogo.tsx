import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg';

interface AppLogoProps {
  size?: number;
  style?: ViewStyle;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 80, style }) => {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 500 500">
        <Defs>
          {/* Background squircle gradient */}
          <LinearGradient id="bgG" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#f0fdfa" />
            <Stop offset="1" stopColor="#ccfbf1" />
          </LinearGradient>

          {/* C ribbon: top-left to bottom-right */}
          <LinearGradient id="cG" x1="98" y1="177" x2="243" y2="327" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#5eead4" />
            <Stop offset="1" stopColor="#0d9488" />
          </LinearGradient>

          {/* A: top to bottom */}
          <LinearGradient id="aG" x1="313" y1="122" x2="313" y2="373" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#0f766e" />
            <Stop offset="1" stopColor="#042f2e" />
          </LinearGradient>
        </Defs>

        {/* ── Squircle background ── */}
        <Rect
          x="14" y="14" width="472" height="472"
          rx="106" ry="106"
          fill="url(#bgG)" stroke="#99f6e4" strokeWidth="4"
        />

        {/* ── C ribbon arc ──
            Center (190, 252), radius 92, gap ±54.8° facing right.
            sweep=1 (CW in SVG) + large-arc=1 → arc travels through the LEFT side. */}

        {/* Shadow */}
        <Path
          d="M 243,177 A 92,92 0 1,1 243,327"
          stroke="#0d9488" strokeOpacity={0.14}
          strokeWidth={63} fill="none" strokeLinecap="round"
          transform="translate(5,6)"
        />
        {/* Main C */}
        <Path
          d="M 243,177 A 92,92 0 1,1 243,327"
          stroke="url(#cG)"
          strokeWidth={55} fill="none" strokeLinecap="round"
        />

        {/* ── A shape ──
            Peak (313, 122), left base (240, 373), right base (386, 373).
            Crossbar at y=272 extends beyond legs for graduation-cap brim.
            Tassel circle sits just above the peak. */}

        {/* Shadow */}
        <Path
          d="M 240,373 L 313,122 L 386,373"
          stroke="#042f2e" strokeOpacity={0.14}
          strokeWidth={48} fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          transform="translate(5,6)"
        />
        {/* Main A legs */}
        <Path
          d="M 240,373 L 313,122 L 386,373"
          stroke="url(#aG)"
          strokeWidth={40} fill="none"
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Cap crossbar */}
        <Path
          d="M 248,272 L 378,272"
          stroke="url(#aG)"
          strokeWidth={32} fill="none" strokeLinecap="round"
        />

        {/* Tassel — outer */}
        <Circle cx="313" cy="105" r="17" fill="#0f766e" />
        {/* Tassel — inner highlight */}
        <Circle cx="313" cy="105" r="9" fill="#e6fffa" />
      </Svg>
    </View>
  );
};

export default AppLogo;
