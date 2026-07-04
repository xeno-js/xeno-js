/**
 * @description Fornisce utilità per la gestione avanzata di Promise, ritardi asincroni e concorrenza.
 * Astrae le logiche di timing per renderle facilmente testabili e riutilizzabili.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const PromiseHelper = Object.freeze({
  /**
   * @description Sospende l'esecuzione asincrona per un numero esatto di millisecondi.
   * @param ms I millisecondi di attesa.
   * @returns Una Promise che si risolve al termine del tempo.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  /**
   * @description Introduce un ritardo asincrono composto da un tempo base più una variazione casuale.
   * Fondamentale per mitigare il "Thundering Herd problem" (effetto gregge) distribuendo
   * nel tempo i retry simultanei di più client.
   * * @param baseDelayMs Il ritardo minimo garantito.
   * @param maxJitterMs La variazione massima casuale aggiuntiva.
   * @returns Una Promise che si risolve al termine del calcolo.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  delayWithJitter(baseDelayMs: number, maxJitterMs: number): Promise<void> {
    const jitter = Math.floor(Math.random() * maxJitterMs)
    return new Promise((resolve) => setTimeout(resolve, baseDelayMs + jitter))
  },
} as const)
