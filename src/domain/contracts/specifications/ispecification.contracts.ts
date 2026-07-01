/**
 * Interfaccia che definisce il contratto per una specifica di dominio.
 * Una specifica permette di verificare se un oggetto (candidato)
 * soddisfa determinati criteri di business.
 *
 * @template T - Il tipo dell'oggetto da convalidare.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface ISpecification<T> {
  /**
   * Verifica se il candidato soddisfa i criteri della specifica.
   * @param candidate - L'oggetto da testare.
   * @returns Booleano: true se i criteri sono soddisfatti.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  isSatisfiedBy(candidate: T): boolean
  /**
   * Combina questa specifica con un'altra tramite l'operatore logico AND.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  and(other: ISpecification<T>): ISpecification<T>

  /**
   * Combina questa specifica con un'altra tramite l'operatore logico OR.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  or(other: ISpecification<T>): ISpecification<T>

  /**
   * Inverte il risultato di questa specifica tramite l'operatore logico NOT.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  not(): ISpecification<T>
}
