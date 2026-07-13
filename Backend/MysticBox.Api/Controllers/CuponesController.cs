using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers
{
    [ApiController]
    [Route("api/cupones")]
    public class CuponesController : ControllerBase
    {
        private readonly ICuponLN _cuponLN;

        public CuponesController(ICuponLN cuponLN)
        {
            _cuponLN = cuponLN;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var cupones = await _cuponLN.ObtenerCupones();

            return Ok(cupones);
        }

        [HttpGet("{idCupon:int}")]
        public async Task<IActionResult> ObtenerCuponPorId(int idCupon)
        {
            var cupon = await _cuponLN.ObtenerCuponPorId(idCupon);

            if (cupon == null)
            {
                return NotFound(new
                {
                    mensaje = "El cupón no fue encontrado."
                });
            }

            return Ok(cupon);
        }

        [HttpGet("validar/{codigo}")]
        public async Task<IActionResult> ValidarCupon(
            string codigo,
            [FromQuery] decimal subtotal
        )
        {
            if (string.IsNullOrWhiteSpace(codigo))
            {
                return BadRequest(new
                {
                    valido = false,
                    mensaje = "Debe ingresar un código de cupón."
                });
            }

            if (subtotal <= 0)
            {
                return BadRequest(new
                {
                    valido = false,
                    mensaje = "El subtotal de la compra debe ser mayor que cero."
                });
            }

            var cupon = await _cuponLN.ObtenerCuponPorCodigo(codigo);

            if (cupon == null)
            {
                return NotFound(new
                {
                    valido = false,
                    mensaje = "El código del cupón no existe."
                });
            }

            if (cupon.Activo != true)
            {
                return BadRequest(new
                {
                    valido = false,
                    mensaje = "El cupón se encuentra inactivo."
                });
            }

            var fechaActual = DateOnly.FromDateTime(DateTime.Now);

            if (fechaActual < cupon.FechaInicio)
            {
                return BadRequest(new
                {
                    valido = false,
                    mensaje = "El cupón todavía no se encuentra vigente."
                });
            }

            if (fechaActual > cupon.FechaFin)
            {
                return BadRequest(new
                {
                    valido = false,
                    mensaje = "El cupón está vencido."
                });
            }

            decimal descuento = 0;

            if (cupon.PorcentajeDescuento.HasValue &&
                cupon.PorcentajeDescuento.Value > 0)
            {
                descuento =
                    subtotal * cupon.PorcentajeDescuento.Value / 100;
            }
            else if (cupon.MontoDescuento.HasValue &&
                     cupon.MontoDescuento.Value > 0)
            {
                descuento = cupon.MontoDescuento.Value;
            }

            if (descuento > subtotal)
            {
                descuento = subtotal;
            }

            descuento = Math.Round(descuento, 2);

            var totalFinal = Math.Round(subtotal - descuento, 2);

            return Ok(new
            {
                valido = true,
                mensaje = "Cupón aplicado correctamente.",
                idCupon = cupon.IdCupon,
                codigo = cupon.Codigo,
                descripcion = cupon.Descripcion,
                porcentajeDescuento = cupon.PorcentajeDescuento,
                montoDescuento = cupon.MontoDescuento,
                subtotal,
                descuento,
                totalFinal,
                fechaInicio = cupon.FechaInicio,
                fechaFin = cupon.FechaFin
            });
        }

        [HttpPost]
        public async Task<IActionResult> CrearCupon(
            [FromBody] CuponDTO cuponDTO
        )
        {
            if (string.IsNullOrWhiteSpace(cuponDTO.Codigo))
            {
                return BadRequest(new
                {
                    mensaje = "El código del cupón es obligatorio."
                });
            }

            if (cuponDTO.FechaFin < cuponDTO.FechaInicio)
            {
                return BadRequest(new
                {
                    mensaje =
                        "La fecha final no puede ser anterior a la fecha inicial."
                });
            }

            var cupon = await _cuponLN.CrearCupon(cuponDTO);

            return Ok(cupon);
        }

        [HttpPut("{idCupon:int}")]
        public async Task<IActionResult> ActualizarCupon(
            int idCupon,
            [FromBody] CuponDTO cuponDTO
        )
        {
            if (cuponDTO.FechaFin < cuponDTO.FechaInicio)
            {
                return BadRequest(new
                {
                    mensaje =
                        "La fecha final no puede ser anterior a la fecha inicial."
                });
            }

            var resultado =
                await _cuponLN.ActualizarCupon(idCupon, cuponDTO);

            if (!resultado)
            {
                return NotFound(new
                {
                    mensaje = "El cupón no fue encontrado."
                });
            }

            return Ok(new
            {
                mensaje = "Cupón actualizado correctamente."
            });
        }

        [HttpDelete("{idCupon:int}")]
        public async Task<IActionResult> EliminarCupon(int idCupon)
        {
            var resultado = await _cuponLN.EliminarCupon(idCupon);

            if (!resultado)
            {
                return NotFound(new
                {
                    mensaje = "El cupón no fue encontrado."
                });
            }

            return Ok(new
            {
                mensaje = "Cupón eliminado correctamente."
            });
        }
    }
}