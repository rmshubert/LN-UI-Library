import { List } from './List';

export default {
  title: 'Components/List',
  component: List,
  argTypes: {
    ordered: {
      control: 'boolean',
      description: 'Renders an <ol> when true, <ul> when false',
    },
    items: {
      control: 'object',
      description: 'Array of list item strings',
    },
    listStyleType: {
      control: 'select',
      options: ['', 'disc', 'circle', 'square', 'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman', 'none'],
      description: 'CSS list-style-type override',
    },
    start: {
      control: 'number',
      description: 'Starting number for ordered lists',
      if: { arg: 'ordered', truthy: true },
    },
  },
};

const defaultItems = ['First item', 'Second item', 'Third item', 'Fourth item'];

export const Unordered = {
  args: {
    ordered: false,
    items: defaultItems,
    listStyleType: 'disc',
  },
};

export const UnorderedCircle = {
  args: {
    ordered: false,
    items: defaultItems,
    listStyleType: 'circle',
  },
};

export const UnorderedSquare = {
  args: {
    ordered: false,
    items: defaultItems,
    listStyleType: 'square',
  },
};

export const UnorderedNone = {
  args: {
    ordered: false,
    items: defaultItems,
    listStyleType: 'none',
  },
};

export const Ordered = {
  args: {
    ordered: true,
    items: defaultItems,
    listStyleType: 'decimal',
    start: 1,
  },
};

export const OrderedLowerAlpha = {
  args: {
    ordered: true,
    items: defaultItems,
    listStyleType: 'lower-alpha',
    start: 1,
  },
};

export const OrderedUpperAlpha = {
  args: {
    ordered: true,
    items: defaultItems,
    listStyleType: 'upper-alpha',
    start: 1,
  },
};

export const OrderedLowerRoman = {
  args: {
    ordered: true,
    items: defaultItems,
    listStyleType: 'lower-roman',
    start: 1,
  },
};

export const OrderedUpperRoman = {
  args: {
    ordered: true,
    items: defaultItems,
    listStyleType: 'upper-roman',
    start: 1,
  },
};

export const OrderedStartMidway = {
  args: {
    ordered: true,
    items: defaultItems,
    listStyleType: 'decimal',
    start: 5,
  },
};
