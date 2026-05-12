/**
 * Патерн Composite (Компоновщик)
 *
 * Блок досвіду роботи, який містить дочірні блоки проєктів
 */

import { Experience } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";
import { ProjectBlock } from "./ProjectBlock";
import { HighlightDecorator } from "../decorators/HighlightDecorator";

export class ExperienceBlock implements IBlock {
  constructor(private experienceItems: Experience[]) {}

  render(): HTMLElement {
    const container = document.createElement("section");
    container.className = "section experience";
    container.innerHTML = "<h2>Experience</h2>";

    this.experienceItems.forEach((experience) => {
      const experienceBlock = document.createElement("div");
      experienceBlock.className = "experience-item";
      experienceBlock.innerHTML = `<h3>${experience.position}</h3><div class="company">${experience.company}</div><div class="period">${experience.start} - ${experience.end}</div>`;

      experience.projects.forEach((project) => {
        const projectBlock = new ProjectBlock(project);

        let blockToRender: IBlock = projectBlock;
        if (project.isRecent) {
          blockToRender = new HighlightDecorator(projectBlock);
        }

        experienceBlock.appendChild(blockToRender.render());
      });

      container.appendChild(experienceBlock);
    });

    return container;
  }
}
