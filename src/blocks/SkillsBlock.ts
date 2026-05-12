/**
 * Блок відображення навичок резюме
 */

import { Skills } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class SkillsBlock implements IBlock {
  constructor(private skillsData: Skills) {}

  render(): HTMLElement {
    const section = document.createElement("section");
    section.className = "section skills";
    section.innerHTML = "<h2>Skills</h2>";

    const ul = document.createElement("ul");

    Object.entries(this.skillsData).forEach(([category, skills]) => {
      const li = document.createElement("li");
      li.className = "skills-category";

      const categoryTitle = document.createElement("strong");
      categoryTitle.textContent =
        category.charAt(0).toUpperCase() + category.slice(1) + ": ";
      li.appendChild(categoryTitle);

      const skillsText = document.createTextNode(skills.join(", "));
      li.appendChild(skillsText);

      ul.appendChild(li);
    });

    section.appendChild(ul);

    return section;
  }
}
