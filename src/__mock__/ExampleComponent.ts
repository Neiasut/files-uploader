import { Component, ComponentFactory } from '../interfaces/interfaces';

export class ExampleComponent implements Component<any> {
  constructor(props) {
    this.props = props;
  }

  render() {
    return document.createElement('div');
  }

  props: any;
}

export const factoryExampleComponent: ComponentFactory<any, ExampleComponent> = props => {
  return new ExampleComponent(props);
};
