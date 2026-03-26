import { ColorsView, ScaleView, TypographyView, RadiusView, BorderWidthView } from './TokenDisplay';

export default {
  title: 'Design Tokens/Primitives',
  parameters: {
    layout: 'fullscreen',
    designToken: { files: ['src/tokens.css'] },
  },
};

export const Colors = {
  render: () => <ColorsView />,
};

export const Scale = {
  render: () => <ScaleView />,
};

export const Typography = {
  render: () => <TypographyView />,
};

export const Radius = {
  render: () => <RadiusView />,
};

export const BorderWidth = {
  render: () => <BorderWidthView />,
};
