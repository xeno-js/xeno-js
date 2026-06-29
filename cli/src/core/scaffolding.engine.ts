import { resolve } from 'path';
import { IGenerator } from './generator.interface';
import { ScaffoldingOptions } from './generator.interface';
import pc from 'picocolors';
import { mkdir } from 'fs/promises';

/**
 * Motore orchestratore dello scaffolding.
 * Il suo unico compito è coordinare l'esecuzione dei vari generatori 
 * senza conoscere i dettagli implementativi di come viene creato un file.
 */
export class ScaffoldingEngine {
  /**
   * @param generators - Lista di generatori iniettati (Dependency Injection).
   * Questo rende l'engine scalabile: puoi aggiungere generatori senza modificare la classe.
   */
  constructor(private readonly generators: IGenerator[]) {}

  async run(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    console.log(pc.cyan('\n🔨 Starting scaffolding process...'));

    const absolutePath = resolve(process.cwd(), projectPath);

    await mkdir(absolutePath, { recursive: true });

    for (const generator of this.generators) {
      if (generator.shouldGenerate(options)) {
        try {
          await generator.generate(absolutePath, options);
        } catch (error) {
          console.error(pc.red(`\n❌ Failed to execute generator: ${error}`));
          throw error;
        }
      }
    }

    console.log(pc.green('\n✨ Scaffolding completed successfully!'));
  }
}