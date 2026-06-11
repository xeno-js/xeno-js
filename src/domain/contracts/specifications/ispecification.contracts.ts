/**
 * Interfaccia che definisce il contratto per una specifica di dominio.
 * Una specifica permette di verificare se un oggetto (candidato)
 * soddisfa determinati criteri di business.
 *
 * @template T - Il tipo dell'oggetto da convalidare.
 */
export interface ISpecification<T> {
  /**
   * Verifica se il candidato soddisfa i criteri della specifica.
   * @param candidate - L'oggetto da testare.
   * @returns Booleano: true se i criteri sono soddisfatti.
   */
  isSatisfiedBy(candidate: T): boolean
  /**
   * Combina questa specifica con un'altra tramite l'operatore logico AND.
   */
  and(other: ISpecification<T>): ISpecification<T>

  /**
   * Combina questa specifica con un'altra tramite l'operatore logico OR.
   */
  or(other: ISpecification<T>): ISpecification<T>

  /**
   * Inverte il risultato di questa specifica tramite l'operatore logico NOT.
   */
  not(): ISpecification<T>
}
