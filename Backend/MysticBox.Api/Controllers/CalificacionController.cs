using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalificacionController : ControllerBase
    {
        private readonly ICalificacionLN _calificacionLN;

        public CalificacionController(
            ICalificacionLN calificacionLN
        )
        {
            _calificacionLN = calificacionLN;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerCalificaciones()
        {
            var calificaciones =
                await _calificacionLN.ObtenerCalificaciones();

            return Ok(calificaciones);
        }

        [HttpGet("{idCalificacion:int}")]
        public async Task<IActionResult> ObtenerCalificacionPorId(
            int idCalificacion
        )
        {
            var calificacion =
                await _calificacionLN
                    .ObtenerCalificacionPorId(idCalificacion);

            if (calificacion == null)
            {
                return NotFound(new
                {
                    mensaje =
                        "La calificación no fue encontrada."
                });
            }

            return Ok(calificacion);
        }

        [HttpPost]
        public async Task<IActionResult> CrearCalificacion(
            [FromBody] CalificacionDTO calificacionDTO
        )
        {
            if (calificacionDTO.IdPedido <= 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "Debe seleccionar un pedido válido."
                });
            }

            if (
                calificacionDTO.Estrellas < 1 ||
                calificacionDTO.Estrellas > 5
            )
            {
                return BadRequest(new
                {
                    mensaje =
                        "La calificación debe estar entre 1 y 5 estrellas."
                });
            }

            if (
                !string.IsNullOrWhiteSpace(
                    calificacionDTO.Comentario
                ) &&
                calificacionDTO.Comentario.Length > 500
            )
            {
                return BadRequest(new
                {
                    mensaje =
                        "El comentario no puede superar los 500 caracteres."
                });
            }

            calificacionDTO.FechaCalificacion ??=
                DateTime.Now;

            var calificacion =
                await _calificacionLN
                    .CrearCalificacion(calificacionDTO);

            return CreatedAtAction(
                nameof(ObtenerCalificacionPorId),
                new
                {
                    idCalificacion =
                        calificacion.IdCalificacion
                },
                new
                {
                    mensaje =
                        "Calificación registrada correctamente.",
                    idCalificacion =
                        calificacion.IdCalificacion,
                    idPedido =
                        calificacion.IdPedido,
                    estrellas =
                        calificacion.Estrellas,
                    comentario =
                        calificacion.Comentario,
                    fechaCalificacion =
                        calificacion.FechaCalificacion
                }
            );
        }

        [HttpPut("{idCalificacion:int}")]
        public async Task<IActionResult> ActualizarCalificacion(
            int idCalificacion,
            [FromBody] CalificacionDTO calificacionDTO
        )
        {
            if (
                calificacionDTO.Estrellas < 1 ||
                calificacionDTO.Estrellas > 5
            )
            {
                return BadRequest(new
                {
                    mensaje =
                        "La calificación debe estar entre 1 y 5 estrellas."
                });
            }

            if (
                !string.IsNullOrWhiteSpace(
                    calificacionDTO.Comentario
                ) &&
                calificacionDTO.Comentario.Length > 500
            )
            {
                return BadRequest(new
                {
                    mensaje =
                        "El comentario no puede superar los 500 caracteres."
                });
            }

            var resultado =
                await _calificacionLN
                    .ActualizarCalificacion(
                        idCalificacion,
                        calificacionDTO
                    );

            if (!resultado)
            {
                return NotFound(new
                {
                    mensaje =
                        "La calificación no fue encontrada."
                });
            }

            return Ok(new
            {
                mensaje =
                    "Calificación actualizada correctamente."
            });
        }

        [HttpDelete("{idCalificacion:int}")]
        public async Task<IActionResult> EliminarCalificacion(
            int idCalificacion
        )
        {
            var resultado =
                await _calificacionLN
                    .EliminarCalificacion(idCalificacion);

            if (!resultado)
            {
                return NotFound(new
                {
                    mensaje =
                        "La calificación no fue encontrada."
                });
            }

            return Ok(new
            {
                mensaje =
                    "Calificación eliminada correctamente."
            });
        }
    }
}