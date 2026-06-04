/**
 * @description Contratto per i Mapper, che definisce i metodi per convertire tra entità e Data Transfer Object (DTO).
 *
 * @template TE - Il tipo dell'entità.
 * @template TDto - Il tipo del Data Transfer Object (DTO).
 */
export interface IMapper<TE, TDto> {
  /**
   * Converts an entity of type TE to a Data Transfer Object (DTO) of type TDto.
   *
   * @param entity - The entity to be converted.
   * @returns A DTO representation of the given entity.
   */
  toDto(entity: TE): TDto

  /**
   * Converts a Data Transfer Object (DTO) of type TDto to an entity of type TE.
   *
   * @param dto - The DTO to be converted.
   * @returns An entity representation of the given DTO.
   */
  toEntity(dto: TDto): TE
}
