export class Settings {
  KEY_PREFIX = 'select-murder.';
  constructor(private store: Storage = window.localStorage) {}
  private constructKey(key: string) {
    return this.KEY_PREFIX + key;
  }

  get(key: string) {
    return this.store.getItem(this.constructKey(key));
  }
  set(key: string, value: string) {
    return this.store.setItem(this.constructKey(key), value);
  }
  reset() {
    return this.store.clear();
  }
  remove(key: string) {
    return this.store.removeItem(this.constructKey(key));
  }
  binded(key: string) {
    return new BindedSetting(this, key);
  }
}
export class BindedSetting {
  constructor(
    private settings: Settings,
    private key: string
  ) {}

  get() {
    return this.settings.get(this.key);
  }
  set(value: string) {
    return this.settings.set(this.key, value);
  }
  delete() {
    return this.settings.remove(this.key);
  }
}
export default new Settings();
