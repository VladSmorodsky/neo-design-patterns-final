import { IBlock } from "../blocks/BlockFactory";

export class HighlightDecorator implements IBlock {
  private wrapped: IBlock;

  constructor(block: IBlock) {
    this.wrapped = block;
  }

  render(): HTMLElement {
    const element = this.wrapped.render();

    element.classList.add("highlight");

    return element;
  }
}
