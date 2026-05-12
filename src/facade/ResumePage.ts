import { ResumeImporter } from "../importer/ResumeImporter";

/**
 * Фасад: єдина точка входу.
 */
export class ResumePage {
  async init(jsonPath: string): Promise<void> {
    const jsonData = await this.fetchData(jsonPath);
    const importer = new ResumeImporter(jsonData);
    importer.import();
  }

  private async fetchData(path: string): Promise<unknown> {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from ${path}: ${response.statusText}`,
      );
    }

    return await response.json();
  }
}
