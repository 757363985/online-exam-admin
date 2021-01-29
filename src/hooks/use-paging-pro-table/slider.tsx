import React from 'react';

import { Slider } from 'antd';

import { ValueType } from './types';

export type ProTableSliderProps = {
  value: any;
  onChange: any;
  min?: number;
  max?: number;
};

export const ProTableSlider: React.FC<ProTableSliderProps> & {
  valueType: string;
} = ({ value, onChange, min = 0, max = 100 }) => {
  return (
    <Slider
      range
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      marks={{
        [min]: min,
        [max]: max,
      }}
    />
  );
};

ProTableSlider.valueType = ValueType.slider;

export default ProTableSlider;
