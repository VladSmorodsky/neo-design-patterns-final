/**
 * Блок відображення освіти в резюме
 */

import { Education } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class EducationBlock implements IBlock {
  constructor(private education: Education[]) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "section education";
    el.innerHTML = "<h2>Education</h2>";

    this.education.forEach((edItem) => {
      const edBlock = document.createElement("div");
      edBlock.className = "education-item";
      edBlock.innerHTML = `
        <h3>${edItem.degree} in ${edItem.field}</h3>
        <div class="institution">${edItem.institution}</div>
        <div class="graduation">${edItem.graduation}</div>
      `;
      el.appendChild(edBlock);
    });

    return el;
  }
}
