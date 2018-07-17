/**
 * 밥정너 3idiots
 * https://bapjn.com
 * @flow
 */

'use strict';

import { Dimensions, PixelRatio } from 'react-native';

const window = Dimensions.get('window');
const width: number = window.width;
const height: number = window.height;

//MIT RESPONSIVE DIMENSIONS

const Width = (w: number): number => Math.round(width * (w / 100));
const Height = (h: number): number => Math.round(height * (h / 100));
const FontSize = (f: number): number => Math.sqrt((height * height) + (width * width)) * (f / 100);

const FixedFontSize = (size: number): number => {
  const baseNum = PixelRatio.get();
  const fontNum = PixelRatio.getFontScale();
  const divisionNum = baseNum / fontNum;

  return size * divisionNum;
};

export default {
  Width,
  Height,
  FontSize,
  width,
  height,
  FixedFontSize,
};
