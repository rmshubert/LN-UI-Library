import React, { useState } from 'react';
import { fn } from 'storybook/test';
import { HeartbeatDetectionSetting } from './HeartbeatDetectionSetting';

export default {
  title: 'Components/Heartbeat Detection Setting',
  component: HeartbeatDetectionSetting,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    disabled: { control: 'boolean' },
    startLabel: { control: 'text' },
    endLabel: { control: 'text' },
  },
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return React.createElement(HeartbeatDetectionSetting, {
      ...args,
      value,
      onChange: (v) => {
        setValue(v);
        args.onChange(v);
      },
    });
  },
};

export const Default = {
  args: {
    value: 3,
    disabled: false,
    startLabel: 'Less sensitive',
    endLabel: 'More sensitive',
  },
};

export const StepOne = {
  name: 'Step 1 — Less Sensitive',
  args: {
    value: 1,
    disabled: false,
    startLabel: 'Less sensitive',
    endLabel: 'More sensitive',
  },
};

export const StepFive = {
  name: 'Step 5 — More Sensitive',
  args: {
    value: 5,
    disabled: false,
    startLabel: 'Less sensitive',
    endLabel: 'More sensitive',
  },
};

export const Disabled = {
  args: {
    value: 3,
    disabled: true,
    startLabel: 'Less sensitive',
    endLabel: 'More sensitive',
  },
};
