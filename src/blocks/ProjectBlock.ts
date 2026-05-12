/**
 * Блок проєкту - є частиною патерну Composite
 * Це "листовий" компонент, який не має дочірніх елементів
 */

import { Project } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class ProjectBlock implements IBlock {
  constructor(private project: Project) {}

  render(): HTMLElement {
    const container = document.createElement("div");
    container.className = "project-item";

    container.textContent = `• ${this.project.name} – ${this.project.description}`;

    return container;
  }
}
