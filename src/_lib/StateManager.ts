type Unsubscribe = () => void;

export class StateManager {
  private _dispatchers: (() => void)[] = [];

  changeEffect(setVersion: React.Dispatch<React.SetStateAction<number>>): Unsubscribe {
    const dispatcher = () => setVersion((v) => v + 1);
    this._dispatchers.push(dispatcher);

    return () => {
      this._dispatchers = this._dispatchers.filter((d) => d !== dispatcher);
    };
  }

  dispatchChange() {
    this._dispatchers.forEach((d) => d());
  }
}