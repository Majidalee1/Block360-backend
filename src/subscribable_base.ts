export class Subscribable<T> {
  private subscribers: Set<(value: T) => void> = new Set();

  public subscribe(subscriber: (value: T) => void) {
    this.subscribers.add(subscriber);
  }

  public unsubscribe(subscriber: (value: T) => void) {
    this.subscribers.delete(subscriber);
  }

  public notify(value: T) {
    this.subscribers.forEach((subscriber) => {
      subscriber(value);
    });
  }
}
