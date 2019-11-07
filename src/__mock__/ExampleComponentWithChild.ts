import { Component, ComponentFactory, SubComponentInfo } from '../interfaces/interfaces';
import ComponentPerformer from '../ComponentPerformer';

export class ExampleComponentWithChild implements Component<{ aliasChild: string }> {
  constructor(props) {
    this.props = props;
  }

  props: { aliasChild: string };

  render(): HTMLElement {
    return document.createElement('div');
  }

  subComponents(): SubComponentInfo[] {
    return [
      {
        key: ComponentPerformer.childrenKey,
        componentAlias: this.props.aliasChild,
        root: ComponentPerformer.getRenderRoot(this),
        props: null
      }
    ];
  }
}

export const factoryExampleComponentWithChild: ComponentFactory<
  { aliasChild: string },
  ExampleComponentWithChild
> = props => {
  return new ExampleComponentWithChild(props);
};
