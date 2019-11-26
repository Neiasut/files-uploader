export type Handler<T> = (event: T) => void;

export default class EventDispatcher<T> {
  private handlers: Set<Handler<T>> = new Set();

  fire(event?: T) {
    for (const h of this.handlers) {
      h(event);
    }
  }

  register(handler: Handler<T>) {
    this.handlers.add(handler);
  }

  unregister(handler: Handler<T>) {
    this.handlers.delete(handler);
  }
}
