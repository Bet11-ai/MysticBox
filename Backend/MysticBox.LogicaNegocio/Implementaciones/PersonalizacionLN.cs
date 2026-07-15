using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;
using System;


namespace MysticBox.LogicaNegocio.Implementaciones
{
    public class PersonalizacionLN : IPersonalizacionLN
    {
        private readonly IUnidadTrabajoEF _unidadTrabajo;

        public PersonalizacionLN(IUnidadTrabajoEF unidadTrabajo)
        {
            _unidadTrabajo = unidadTrabajo;
        }

        public async Task<List<PersonalizacionDTO>>
            ObtenerPersonalizaciones()
        {
            var respuesta =
                _unidadTrabajo.TPersonalizacion.Listar();

            var personalizaciones =
                respuesta.ValorRetorno?.ToList()
                ?? new List<Personalizacione>();

            var personalizacionesDTO =
                personalizaciones.Select(personalizacion =>
                    new PersonalizacionDTO
                    {
                        IdPersonalizacion =
                            personalizacion.IdPersonalizacion,

                        IdUsuario =
                            personalizacion.IdUsuario,

                        IdCaja =
                            personalizacion.IdCaja,

                        TamanoCaja =
                            personalizacion.TamanoCaja,

                        Preferencias =
                            personalizacion.Preferencias,

                        Exclusiones =
                            personalizacion.Exclusiones,

                        MensajePersonalizado =
                            personalizacion.MensajePersonalizado,

                        FechaPersonalizacion =
                            personalizacion.FechaPersonalizacion
                    }
                ).ToList();

            return await Task.FromResult(
                personalizacionesDTO
            );
        }

        public async Task<PersonalizacionDTO?>
            ObtenerPersonalizacionPorId(
                int idPersonalizacion
            )
        {
            var respuesta =
                _unidadTrabajo.TPersonalizacion.ObtenerEntidad(
                    personalizacion =>
                        personalizacion.IdPersonalizacion ==
                        idPersonalizacion
                );

            var personalizacion = respuesta.ValorRetorno;

            if (personalizacion == null)
            {
                return null;
            }

            var personalizacionDTO =
                new PersonalizacionDTO
                {
                    IdPersonalizacion =
                        personalizacion.IdPersonalizacion,

                    IdUsuario =
                        personalizacion.IdUsuario,

                    IdCaja =
                        personalizacion.IdCaja,

                    TamanoCaja =
                        personalizacion.TamanoCaja,

                    Preferencias =
                        personalizacion.Preferencias,

                    Exclusiones =
                        personalizacion.Exclusiones,

                    MensajePersonalizado =
                        personalizacion.MensajePersonalizado,

                    FechaPersonalizacion =
                        personalizacion.FechaPersonalizacion
                };

            return await Task.FromResult(
                personalizacionDTO
            );
        }

        public async Task<PersonalizacionDTO>
            CrearPersonalizacion(
                PersonalizacionDTO personalizacionDTO
            )
        {
            var personalizacion =
                new Personalizacione
                {
                    IdUsuario =
                        personalizacionDTO.IdUsuario,

                    IdCaja =
                        personalizacionDTO.IdCaja,

                    TamanoCaja =
                        personalizacionDTO.TamanoCaja,

                    Preferencias =
                        personalizacionDTO.Preferencias,

                    Exclusiones =
                        personalizacionDTO.Exclusiones,

                    MensajePersonalizado =
                        personalizacionDTO
                            .MensajePersonalizado,

                    FechaPersonalizacion =
                        DateTime.Now
                };

            _unidadTrabajo.TPersonalizacion.Insertar(
                personalizacion
            );

            _unidadTrabajo.Completar();

            personalizacionDTO.IdPersonalizacion =
                personalizacion.IdPersonalizacion;

            personalizacionDTO.FechaPersonalizacion =
                personalizacion.FechaPersonalizacion;

            return await Task.FromResult(
                personalizacionDTO
            );
        }

        public async Task<PersonalizacionDTO?>
            ActualizarPersonalizacion(
                int idPersonalizacion,
                PersonalizacionDTO personalizacionDTO
            )
        {
            var respuesta =
                _unidadTrabajo.TPersonalizacion.ObtenerEntidad(
                    personalizacion =>
                        personalizacion.IdPersonalizacion ==
                        idPersonalizacion
                );

            var personalizacionExistente =
                respuesta.ValorRetorno;

            if (personalizacionExistente == null)
            {
                return null;
            }

            personalizacionExistente.IdUsuario =
                personalizacionDTO.IdUsuario;

            personalizacionExistente.IdCaja =
                personalizacionDTO.IdCaja;

            personalizacionExistente.TamanoCaja =
                personalizacionDTO.TamanoCaja;

            personalizacionExistente.Preferencias =
                personalizacionDTO.Preferencias;

            personalizacionExistente.Exclusiones =
                personalizacionDTO.Exclusiones;

            personalizacionExistente.MensajePersonalizado =
                personalizacionDTO.MensajePersonalizado;

            _unidadTrabajo.TPersonalizacion.Modificar(
                personalizacionExistente
            );

            _unidadTrabajo.Completar();

            personalizacionDTO.IdPersonalizacion =
                personalizacionExistente.IdPersonalizacion;

            personalizacionDTO.FechaPersonalizacion =
                personalizacionExistente.FechaPersonalizacion;

            return await Task.FromResult(
                personalizacionDTO
            );
        }
    }
}
