/**
 * Блок відображення короткого опису резюме
 */

import { ResumeModel } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class SummaryBlock implements IBlock {
  constructor(private summary: ResumeModel["summary"]) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "section summary";

    const header = document.createElement("h2");
    header.innerHTML = "Summary";

    const paragraph = document.createElement("p");
    paragraph.innerText = this.summary.text;

    el.appendChild(header);
    el.appendChild(paragraph);

    return el;
  }
}
