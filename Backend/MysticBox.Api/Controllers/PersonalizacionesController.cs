using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalizacionesController : ControllerBase
    {
        private readonly IPersonalizacionLN _personalizacionLN;

        public PersonalizacionesController(
            IPersonalizacionLN personalizacionLN
        )
        {
            _personalizacionLN = personalizacionLN;
        }

        [HttpGet]
        public async Task<ActionResult<List<PersonalizacionDTO>>>
            ObtenerPersonalizaciones()
        {
            var personalizaciones =
                await _personalizacionLN.ObtenerPersonalizaciones();

            return Ok(personalizaciones);
        }

        [HttpGet("{idPersonalizacion}")]
        public async Task<ActionResult<PersonalizacionDTO>>
            ObtenerPersonalizacionPorId(int idPersonalizacion)
        {
            var personalizacion =
                await _personalizacionLN.ObtenerPersonalizacionPorId(
                    idPersonalizacion
                );

            if (personalizacion == null)
            {
                return NotFound(new
                {
                    mensaje = "No se encontró la personalización."
                });
            }

            return Ok(personalizacion);
        }

        [HttpPost]
        public async Task<ActionResult<PersonalizacionDTO>>
            CrearPersonalizacion(
                [FromBody] PersonalizacionDTO personalizacionDTO
            )
        {
            if (personalizacionDTO.IdUsuario <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "Debe indicar un usuario válido."
                });
            }

            if (personalizacionDTO.IdCaja <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "Debe seleccionar una caja válida."
                });
            }

            if (string.IsNullOrWhiteSpace(
                personalizacionDTO.TamanoCaja
            ))
            {
                return BadRequest(new
                {
                    mensaje = "Debe seleccionar el tamaño de la caja."
                });
            }

            var personalizacionCreada =
                await _personalizacionLN.CrearPersonalizacion(
                    personalizacionDTO
                );

            return Ok(new
            {
                mensaje =
                    "La personalización se guardó correctamente.",

                personalizacion = personalizacionCreada
            });
        }

        [HttpPut("{idPersonalizacion}")]
        public async Task<ActionResult<PersonalizacionDTO>>
            ActualizarPersonalizacion(
                int idPersonalizacion,
                [FromBody] PersonalizacionDTO personalizacionDTO
            )
        {
            if (idPersonalizacion <= 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "El identificador de la personalización no es válido."
                });
            }

            if (personalizacionDTO.IdUsuario <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "Debe indicar un usuario válido."
                });
            }

            if (personalizacionDTO.IdCaja <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "Debe seleccionar una caja válida."
                });
            }

            if (string.IsNullOrWhiteSpace(
                personalizacionDTO.TamanoCaja
            ))
            {
                return BadRequest(new
                {
                    mensaje = "Debe seleccionar el tamaño de la caja."
                });
            }

            var personalizacionActualizada =
                await _personalizacionLN.ActualizarPersonalizacion(
                    idPersonalizacion,
                    personalizacionDTO
                );

            if (personalizacionActualizada == null)
            {
                return NotFound(new
                {
                    mensaje = "No se encontró la personalización."
                });
            }

            return Ok(new
            {
                mensaje =
                    "La personalización se actualizó correctamente.",

                personalizacion = personalizacionActualizada
            });
        }
    }
}
