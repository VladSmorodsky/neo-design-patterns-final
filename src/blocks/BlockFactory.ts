/**
 * Патерн Factory Method (Фабричний метод)
 *
 * Клас BlockFactory відповідає за створення різних типів блоків резюме
 * залежно від типу, переданого як параметр.
 */

import { ResumeModel } from "../models/ResumeModel";
import { HeaderBlock } from "./HeaderBlock";
import { SummaryBlock } from "./SummaryBlock";
import { ExperienceBlock } from "./ExperienceBlock";
import { EducationBlock } from "./EducationBlock";
import { SkillsBlock } from "./SkillsBlock";

export interface IBlock {
  render(): HTMLElement;
}

export type BlockType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills";

export class BlockFactory {
  createBlock(type: BlockType, model: ResumeModel): IBlock {
    switch (type) {
      case "header":
        return new HeaderBlock(model.header);
      case "summary":
        return new SummaryBlock(model.summary);
      case "experience":
        return new ExperienceBlock(model.experience);
      case "education":
        return new EducationBlock(model.education);
      case "skills":
        return new SkillsBlock(model.skills);
      default:
        throw new Error(`Unknown block type: ${type}`);
    }
  }
}
