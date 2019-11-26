import { Component, ComponentFactory } from '../interfaces/interfaces';

export class ExampleComponentChild implements Component<any> {
  props: any;
  mount: boolean;

  constructor(props) {
    this.props = props;
  }

  render(): HTMLElement {
    return document.createElement('div');
  }

  componentDidMount(): void {
    this.mount = true;
  }

  componentWillUnmount(): void {
    this.mount = false;
  }
}

export const factoryExampleComponentChild: ComponentFactory<any, ExampleComponentChild> = props =>
  new ExampleComponentChild(props);
