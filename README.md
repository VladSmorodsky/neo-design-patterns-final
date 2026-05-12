# Resume Generator - Design Patterns Demo

Проєкт демонструє застосування **п'яти патернів проєктування** (Facade, Template Method, Factory Method, Composite, Decorator) для автоматичної генерації HTML-резюме з JSON-даних.

---

## Реалізовані патерни

### 1. **Facade (Фасад)**
**Файл:** `src/facade/ResumePage.ts`

**Призначення:** Надає простий інтерфейс для складної підсистеми.

**Реалізація:**
```typescript
export class ResumePage {
  async init(jsonPath: string): Promise<void> {
    const jsonData = await this.fetchData(jsonPath);
    const importer = new ResumeImporter(jsonData);
    importer.import();
  }
}
```

Клас `ResumePage` приховує складність завантаження, валідації та рендерингу резюме за одним простим методом `init()`. Користувач просто викликає:
```typescript
new ResumePage().init("/resume.json");
```

---

### 2. **Template Method (Шаблонний метод)**
**Файли:** `src/importer/AbstractImporter.ts`, `src/importer/ResumeImporter.ts`

**Призначення:** Визначає скелет алгоритму в базовому класі, дозволяючи підкласам перевизначити окремі кроки.

**Реалізація:**
```typescript
// AbstractImporter.ts
export abstract class AbstractImporter<T> {
  import(): void {
    this.validate();  // Крок 1: валідація
    const model = this.map();  // Крок 2: маппінг
    this.render(model);  // Крок 3: рендеринг
  }

  protected abstract validate(): void;
  protected abstract map(): T;
  protected abstract render(model: T): void;
}
```

Базовий клас `AbstractImporter` визначає порядок операцій (validate → map → render), а `ResumeImporter` реалізує конкретну логіку для кожного кроку.

---

### 3. **Factory Method (Фабричний метод)**
**Файл:** `src/blocks/BlockFactory.ts`

**Призначення:** Делегує створення об'єктів фабричному методу, дозволяючи підкласам змінювати тип створюваних об'єктів.

**Реалізація:**
```typescript
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
```

Фабрика створює різні типи блоків резюме на основі переданого типу, приховуючи логіку інстанціювання.

---

### 4. **Composite (Компонувальник)**
**Файли:** `src/blocks/ExperienceBlock.ts`, `src/blocks/ProjectBlock.ts`

**Призначення:** Дозволяє компонувати об'єкти в деревоподібні структури і працювати з ними як з окремими об'єктами.

**Реалізація:**
```typescript
// ExperienceBlock.ts (композит)
export class ExperienceBlock implements IBlock {
  render(): HTMLElement {
    const container = document.createElement("section");
    
    this.experienceItems.forEach((experience) => {
      experience.projects.forEach((project) => {
        const projectBlock = new ProjectBlock(project);  // Створюємо дочірній блок
        container.appendChild(projectBlock.render());  // Рекурсивно рендеримо
      });
    });
    
    return container;
  }
}

// ProjectBlock.ts
export class ProjectBlock implements IBlock {
  render(): HTMLElement {
    const container = document.createElement("div");
    container.textContent = `• ${this.project.name} – ${this.project.description}`;
    return container;
  }
}
```

`ExperienceBlock` - контейнер, який містить дочірні `ProjectBlock`. Обидва реалізують інтерфейс `IBlock`, тому можуть використовуватися однаково.

---

### 5. **Decorator (Декоратор)**
**Файл:** `src/decorators/HighlightDecorator.ts`

**Призначення:** Динамічно додає нову функціональність об'єктам без зміни їх коду.

**Реалізація:**
```typescript
export class HighlightDecorator implements IBlock {
  constructor(private wrapped: IBlock) {}

  render(): HTMLElement {
    const element = this.wrapped.render();  // Викликаємо оригінальний render()
    element.classList.add("highlight");  // Додаємо нову функціональність
    return element;
  }
}
```

**Використання:**
```typescript
const projectBlock = new ProjectBlock(project);
let blockToRender: IBlock = projectBlock;

if (project.isRecent) {
  blockToRender = new HighlightDecorator(projectBlock);  // Обгортаємо в декоратор
}

container.appendChild(blockToRender.render());
```

Декоратор додає клас `highlight` до елемента, не модифікуючи `ProjectBlock`.

---

## 🚀 Запуск проєкту

### Встановлення залежностей
```bash
npm install
```

### Режим розробки
```bash
npm run dev
```
Відкрийте браузер за адресою: `http://localhost:5173`

### Збірка для продакшну
```bash
npm run build
```
Результат буде у папці `dist/`

### Перегляд збірки
```bash
npm run preview
```

## ➕ Як додати новий блок (наприклад, "Certificates")

### Крок 1: Додайте поле до моделі
**Файл:** `src/models/ResumeModel.ts`
```typescript
export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeModel {
  header: { fullName: string; title: string; contacts: Contact };
  summary: { text: string };
  experience: Experience[];
  education: Education[];
  skills: Skills;
  certificates: Certificate[];  // ← Нове поле
}
```

### Крок 2: Створіть клас блоку
**Файл:** `src/blocks/CertificatesBlock.ts`
```typescript
import { Certificate } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class CertificatesBlock implements IBlock {
  constructor(private certificates: Certificate[]) {}

  render(): HTMLElement {
    const section = document.createElement("section");
    section.className = "section certificates";
    section.innerHTML = "<h2>Certificates</h2>";

    this.certificates.forEach((cert) => {
      const certBlock = document.createElement("div");
      certBlock.className = "certificate-item";
      certBlock.innerHTML = `
        <h3>${cert.name}</h3>
        <div class="issuer">${cert.issuer}</div>
        <div class="date">${cert.date}</div>
      `;
      section.appendChild(certBlock);
    });

    return section;
  }
}
```

### Крок 3: Додайте тип у BlockFactory
**Файл:** `src/blocks/BlockFactory.ts`
```typescript
import { CertificatesBlock } from "./CertificatesBlock";

export type BlockType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certificates";  // ← Новий тип

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
      case "certificates":
        return new CertificatesBlock(model.certificates);  // ← Нова гілка
      default:
        throw new Error(`Unknown block type: ${type}`);
    }
  }
}
```

### Крок 4: Оновіть валідацію
**Файл:** `src/importer/ResumeImporter.ts`
```typescript
protected validate(): void {
  // ...
  const requiredFields = [
    "header",
    "summary",
    "experience",
    "education",
    "skills",
    "certificates"  // ← Додайте до списку
  ];
  // ...
}
```

### Крок 5: Додайте дані у JSON
**Файл:** `public/resume.json`
```json
{
  "header": { ... },
  "summary": { ... },
  "experience": [ ... ],
  "education": [ ... ],
  "skills": { ... },
  "certificates": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2023"
    }
  ]
}
```

**Готово!** Новий блок автоматично з'явиться в резюме.

---