import { Component, ComponentFactory } from './interfaces/interfaces';
import { checkOnFunction } from './functions/functions';

export default class ComponentPerformer {
  private static factories: Map<string, ComponentFactory<any, Component<any>>> = new Map();
  static childrenKey = 'children';

  static addFactory(aliasComponent: string, factory: ComponentFactory<any, Component<any>>) {
    this.factories.set(aliasComponent, factory);
  }

  static getFactory(aliasComponent: string): ComponentFactory<any, Component<any>> {
    return this.factories.get(aliasComponent);
  }

  static createComponent(aliasComponent: string, props: any): Component<any> {
    const factory = this.getFactory(aliasComponent);
    return factory(props);
  }

  static mountComponent(where: Element, componentAlias: string, props?: any) {
    const component = this.createComponent(componentAlias, props);
    const render = component.render();
    component._renderRoot = render;
    let children: Array<Component<any>> = [];
    if (component.subComponents) {
      children = component.subComponents().map(childrenInfo => {
        const child = this.mountComponent(childrenInfo.root, childrenInfo.componentAlias, childrenInfo.props);
        child._key = childrenInfo.key;
        return child;
      });
    }
    where.appendChild(render);

    component._children = children;
    component._inDOM = true;
    if (checkOnFunction(component.componentDidMount)) {
      component.componentDidMount();
    }

    return component;
  }

  static unmountComponent(component: Component<any>, deleteNode = true) {
    if (component._inDOM) {
      if (Array.isArray(component._children) && component._children.length > 0) {
        component._children.forEach(child => {
          this.unmountComponent(child, false);
        });
      }
      if (checkOnFunction(component.componentWillUnmount)) {
        component.componentWillUnmount();
      }
      if (deleteNode) {
        component._renderRoot.remove();
      }
      component._inDOM = false;
      delete component._children;
      delete component._renderRoot;
    }
  }

  static getChildComponent(parent: Component<any>, findKey: string): Component<any> {
    return parent._children.find((child: Component<any>) => {
      return child._key === findKey;
    });
  }

  static getRenderRoot(component: Component<any>): Element {
    return component._renderRoot;
  }
}
