/**
 * Блок відображення заголовка резюме
 */

import { ResumeModel } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class HeaderBlock implements IBlock {
  constructor(private headerData: ResumeModel["header"]) {}

  render(): HTMLElement {
    const header = document.createElement("header");
    header.className = "section header";

    header.innerHTML = `
      <h1>${this.headerData.fullName}</h1>
      <p>${this.headerData.title}</p>
      <p>${this.headerData.contacts.email} ${this.headerData.contacts.phone} ${this.headerData.contacts.location}</p>
    `;

    return header;
  }
}
