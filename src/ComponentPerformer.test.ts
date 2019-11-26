import ComponentPerformer from './ComponentPerformer';
import { mockDefaultDiv } from './__mock__/structures';
import { ExampleComponent, factoryExampleComponent } from './__mock__/ExampleComponent';
import { ExampleComponentWithChild, factoryExampleComponentWithChild } from './__mock__/ExampleComponentWithChild';
import { ExampleComponentChild, factoryExampleComponentChild } from './__mock__/ExampleComponentChild';

test('any functions', () => {
  const ALIAS_COMPONENT = 'testAlias';
  ComponentPerformer.addFactory(ALIAS_COMPONENT, factoryExampleComponent);
  expect(ComponentPerformer.getFactory(ALIAS_COMPONENT)).toBe(factoryExampleComponent);
  const spyCreate = jest.spyOn(ComponentPerformer as any, 'createComponent');
  const div = mockDefaultDiv();
  const instance = ComponentPerformer.mountComponent(div, ALIAS_COMPONENT, null);
  expect(spyCreate).toHaveBeenCalled();
  spyCreate.mockRestore();
  expect(instance).toBeInstanceOf(ExampleComponent);
  expect(div.childNodes.length).toBeGreaterThan(0);
  expect(instance._renderRoot).toBeInstanceOf(Element);
  expect(instance._children.length).toBe(0);
  expect(instance._inDOM).toBeTruthy();
  expect(instance._key).toBeUndefined();
});

test('child', () => {
  const ALIAS_COMPONENT = 'component';
  const ALIAS_CHILD_COMPONENT = 'child';
  const div = mockDefaultDiv();
  ComponentPerformer.addFactory(ALIAS_COMPONENT, factoryExampleComponentWithChild);
  ComponentPerformer.addFactory(ALIAS_CHILD_COMPONENT, factoryExampleComponentChild);
  const spyChildComponentDidMount = jest.spyOn(ExampleComponentChild.prototype as any, 'componentDidMount');
  const spyChildComponentWillUnmount = jest.spyOn(ExampleComponentChild.prototype as any, 'componentWillUnmount');
  const instance = ComponentPerformer.mountComponent(div, ALIAS_COMPONENT, {
    aliasChild: ALIAS_CHILD_COMPONENT
  });
  const instanceChild = ComponentPerformer.getChildComponent(instance, ComponentPerformer.childrenKey);
  expect(instance).toBeInstanceOf(ExampleComponentWithChild);
  expect(instanceChild).toBeInstanceOf(ExampleComponentChild);
  expect(spyChildComponentDidMount).toHaveBeenCalledTimes(1);
  ComponentPerformer.unmountComponent(instance);
  expect(spyChildComponentWillUnmount).toHaveBeenCalled();
  ComponentPerformer.unmountComponent(instance);
  expect(spyChildComponentDidMount).toHaveBeenCalledTimes(1);
  spyChildComponentDidMount.mockRestore();
  spyChildComponentWillUnmount.mockRestore();
});
