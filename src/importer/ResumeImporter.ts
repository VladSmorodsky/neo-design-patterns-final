import { AbstractImporter } from "./AbstractImporter";
import { ResumeModel } from "../models/ResumeModel";
import { BlockFactory, BlockType } from "../blocks/BlockFactory";

export class ResumeImporter extends AbstractImporter<ResumeModel> {
  protected validate(): void {
    if (!this.raw || typeof this.raw !== "object") {
      throw new Error("Invalid JSON: data must be an object");
    }

    const data = this.raw as any;

    const requiredFields = [
      "header",
      "summary",
      "experience",
      "education",
      "skills",
    ];
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Invalid JSON: missing required field '${field}'`);
      }
    }

    if (!data.header.fullName || !data.header.title || !data.header.contacts) {
      throw new Error(
        "Invalid JSON: header must contain fullName, title, and contacts",
      );
    }

    if (!data.summary.text) {
      throw new Error("Invalid JSON: summary must contain text");
    }

    if (!Array.isArray(data.experience)) {
      throw new Error("Invalid JSON: experience must be an array");
    }

    if (!Array.isArray(data.education)) {
      throw new Error("Invalid JSON: education must be an array");
    }

    if (!data.skills || typeof data.skills !== "object") {
      throw new Error("Invalid JSON: skills must be an object");
    }
  }

  protected map(): ResumeModel {
    const data = this.raw as any;

    return {
      header: {
        fullName: data.header.fullName,
        title: data.header.title,
        contacts: data.header.contacts,
      },
      summary: {
        text: data.summary.text,
      },
      experience: data.experience,
      education: data.education,
      skills: {
        core: data.skills.core || [],
        tools: data.skills.tools || [],
        languages: data.skills.languages || [],
      },
    };
  }

  protected render(model: ResumeModel): void {
    const root = document.getElementById("resume-content")!;
    const factory = new BlockFactory();

    Object.keys(model).forEach((blockKey) => {
      const block = factory.createBlock(blockKey as BlockType, model);
      root.appendChild(block.render());
    });
  }
}
