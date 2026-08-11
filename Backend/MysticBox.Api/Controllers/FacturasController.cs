using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers
{
    [ApiController]
    [Route("api/facturas")]
    public class FacturasController
        : ControllerBase
    {
        private readonly IFacturaLN
            _facturaLN;

        public FacturasController(
            IFacturaLN facturaLN
        )
        {
            _facturaLN =
                facturaLN;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var facturas =
                await _facturaLN
                    .ObtenerFacturas();

            return Ok(
                facturas
            );
        }

        [HttpGet("{idFactura}")]
        public async Task<IActionResult>
            ObtenerFacturaPorId(
                int idFactura
            )
        {
            var factura =
                await _facturaLN
                    .ObtenerFacturaPorId(
                        idFactura
                    );

            if (
                factura == null
            )
            {
                return NotFound(
                    new
                    {
                        mensaje =
                            "La factura no existe."
                    }
                );
            }

            return Ok(
                factura
            );
        }

        [HttpPost]
        public async Task<IActionResult>
            CrearFactura(
                [FromBody]
                FacturaDTO facturaDTO
            )
        {
            if (
                facturaDTO.CostoEnvio < 0
            )
            {
                return BadRequest(
                    new
                    {
                        mensaje =
                            "El costo de envío no puede ser negativo."
                    }
                );
            }

            var descuento =
                facturaDTO.Descuento ?? 0;

            var totalEsperado =
                facturaDTO.Subtotal
                -
                descuento
                +
                facturaDTO.CostoEnvio;

            if (
                facturaDTO.Total !=
                totalEsperado
            )
            {
                return BadRequest(
                    new
                    {
                        mensaje =
                            "El total de la factura no coincide con el subtotal, descuento y costo de envío.",

                        totalEsperado
                    }
                );
            }

            var factura =
                await _facturaLN
                    .CrearFactura(
                        facturaDTO
                    );

            return Ok(
                factura
            );
        }

        [HttpPut("{idFactura}")]
        public async Task<IActionResult>
            ActualizarFactura(
                int idFactura,
                [FromBody]
                FacturaDTO facturaDTO
            )
        {
            if (
                facturaDTO.CostoEnvio < 0
            )
            {
                return BadRequest(
                    new
                    {
                        mensaje =
                            "El costo de envío no puede ser negativo."
                    }
                );
            }

            var descuento =
                facturaDTO.Descuento ?? 0;

            var totalEsperado =
                facturaDTO.Subtotal
                -
                descuento
                +
                facturaDTO.CostoEnvio;

            if (
                facturaDTO.Total !=
                totalEsperado
            )
            {
                return BadRequest(
                    new
                    {
                        mensaje =
                            "El total de la factura no coincide con los montos enviados.",

                        totalEsperado
                    }
                );
            }

            var resultado =
                await _facturaLN
                    .ActualizarFactura(
                        idFactura,
                        facturaDTO
                    );

            if (!resultado)
            {
                return NotFound(
                    new
                    {
                        mensaje =
                            "La factura no existe."
                    }
                );
            }

            return Ok(
                new
                {
                    mensaje =
                        "Factura actualizada correctamente."
                }
            );
        }

        [HttpDelete("{idFactura}")]
        public async Task<IActionResult>
            EliminarFactura(
                int idFactura
            )
        {
            var resultado =
                await _facturaLN
                    .EliminarFactura(
                        idFactura
                    );

            if (!resultado)
            {
                return NotFound(
                    new
                    {
                        mensaje =
                            "La factura no existe."
                    }
                );
            }

            return Ok(
                new
                {
                    mensaje =
                        "Factura eliminada correctamente."
                }
            );
        }
    }
}