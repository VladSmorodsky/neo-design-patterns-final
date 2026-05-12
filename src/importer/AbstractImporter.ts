export abstract class AbstractImporter<T> {
  constructor(protected raw: unknown) {}

  import(): void {
    this.validate();
    const model = this.map();
    this.render(model);
  }

  protected abstract validate(): void;

  protected abstract map(): T;

  protected abstract render(model: T): void;
}
