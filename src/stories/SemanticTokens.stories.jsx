import { SemanticColorsView, ScopingSemanticsView } from './TokenDisplay';

export default {
  title: 'Design Tokens/Semantics',
  parameters: { layout: 'fullscreen' },
};

export const All = {
  render: () => <SemanticColorsView />,
};

export const Icon = {
  render: () => <SemanticColorsView section="icon" />,
};

export const Text = {
  render: () => <SemanticColorsView section="text" />,
};

export const Surface = {
  render: () => <SemanticColorsView section="surface" />,
};

export const Border = {
  render: () => <SemanticColorsView section="border" />,
};

export const Shadow = {
  render: () => <SemanticColorsView section="shadow" />,
};

export const ScopingMobile = {
  name: 'Scoping — Mobile',
  render: () => <ScopingSemanticsView />,
};

export const ScopingDisplay = {
  name: 'Scoping — Display',
  render: () => <ScopingSemanticsView category="display" />,
};

export const ScopingTitle = {
  name: 'Scoping — Title',
  render: () => <ScopingSemanticsView category="title" />,
};

export const ScopingBody = {
  name: 'Scoping — Body',
  render: () => <ScopingSemanticsView category="body" />,
};
