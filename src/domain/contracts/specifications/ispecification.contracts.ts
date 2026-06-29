/**
 * Interfaccia che definisce il contratto per una specifica di dominio.
 * Una specifica permette di verificare se un oggetto (candidato)
 * soddisfa determinati criteri di business.
 *
 * @template T - Il tipo dell'oggetto da convalidare.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface ISpecification<T> {
  /**
   * Verifica se il candidato soddisfa i criteri della specifica.
   * @param candidate - L'oggetto da testare.
   * @returns Booleano: true se i criteri sono soddisfatti.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  isSatisfiedBy(candidate: T): boolean
  /**
   * Combina questa specifica con un'altra tramite l'operatore logico AND.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  and(other: ISpecification<T>): ISpecification<T>

  /**
   * Combina questa specifica con un'altra tramite l'operatore logico OR.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  or(other: ISpecification<T>): ISpecification<T>

  /**
   * Inverte il risultato di questa specifica tramite l'operatore logico NOT.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  not(): ISpecification<T>
}
