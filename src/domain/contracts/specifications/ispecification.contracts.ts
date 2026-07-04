/**
 * Interfaccia che definisce il contratto per una specifica di dominio.
 * Una specifica permette di verificare se un oggetto (candidato)
 * soddisfa determinati criteri di business.
 *
 * @template T - Il tipo dell'oggetto da convalidare.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ISpecification<T> {
  /**
   * Verifica se il candidato soddisfa i criteri della specifica.
   * @param candidate - L'oggetto da testare.
   * @returns Booleano: true se i criteri sono soddisfatti.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isSatisfiedBy(candidate: T): boolean
  /**
   * Combina questa specifica con un'altra tramite l'operatore logico AND.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  and(other: ISpecification<T>): ISpecification<T>

  /**
   * Combina questa specifica con un'altra tramite l'operatore logico OR.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  or(other: ISpecification<T>): ISpecification<T>

  /**
   * Inverte il risultato di questa specifica tramite l'operatore logico NOT.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  not(): ISpecification<T>
}
