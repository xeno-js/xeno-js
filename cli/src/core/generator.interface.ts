/**
 * Definizione delle opzioni scelte dall'utente durante l'interazione con la CLI.
 * Questo contratto centralizza lo stato che guida lo scaffolding.
 */
export interface ScaffoldingOptions {
  targetDir: string;
  database: boolean;
  http: boolean;
  supabase: boolean;
  logging: boolean;
  sentry: boolean;
  redis: boolean;
}

/**
 * Interfaccia base per ogni generatore di codice.
 * Segue il principio di Single Responsibility (SRP): ogni implementazione
 * si occupa esclusivamente di uno specifico compito di scaffolding.
 */
export interface IGenerator {
  /**
   * Determina se questo generatore debba essere eseguito in base
   * alle opzioni scelte dall'utente.
   */
  shouldGenerate(options: ScaffoldingOptions): boolean;

  /**
   * Esegue la logica specifica di generazione.
   * Scrive file, aggiorna configurazioni o prepara template.
   * @param projectPath - Il percorso assoluto della cartella di destinazione
   * @param options - Le scelte fatte dall'utente
   */
  generate(projectPath: string, options: ScaffoldingOptions): Promise<void>;
}