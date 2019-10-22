export type Handler<T> = (event: T) => void;

export default class EventDispatcher<T> {
  private handlers: Array<Handler<T>> = [];

  fire(event: T) {
    for (const h of this.handlers) {
      h(event);
    }
  }

  register(handler: Handler<T>) {
    this.handlers.push(handler);
  }
}
