/**
 * @description Contratto per i Mapper, che definisce i metodi per convertire tra entità e Data Transfer Object (DTO).
 *
 * @template TE - Il tipo dell'entità.
 * @template TDto - Il tipo del Data Transfer Object (DTO).

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IMapper<TE, TDto> {
  /**
   * Converts an entity of type TE to a Data Transfer Object (DTO) of type TDto.
   *
   * @param entity - The entity to be converted.
   * @returns A DTO representation of the given entity.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  toDto(entity: TE): TDto

  /**
   * Converts a Data Transfer Object (DTO) of type TDto to an entity of type TE.
   *
   * @param dto - The DTO to be converted.
   * @returns An entity representation of the given DTO.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  toEntity(dto: TDto): TE

  /**
   * Converts a partial entity of type TE to a partial Data Transfer Object (DTO) of type TDto.
   * @param entity - The partial entity to be converted.
   * @returns A partial DTO representation of the given partial entity.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  toPartialDto(entity: Partial<TE>): Partial<TDto>
}
