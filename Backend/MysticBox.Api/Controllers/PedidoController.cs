using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private readonly IPedidoLN _pedidoLN;

        public PedidoController(IPedidoLN pedidoLN)
        {
            _pedidoLN = pedidoLN;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerPedidos()
        {
            var pedidos = await _pedidoLN.ObtenerPedidos();

            return Ok(pedidos);
        }

        [HttpGet("{idPedido:int}")]
        public async Task<IActionResult> ObtenerPedidoPorId(
            int idPedido
        )
        {
            var pedido =
                await _pedidoLN.ObtenerPedidoPorId(idPedido);

            if (pedido == null)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no fue encontrado."
                });
            }

            return Ok(pedido);
        }

        [HttpPost]
        public async Task<IActionResult> CrearPedido(
            [FromBody] PedidoDTO pedidoDTO
        )
        {
            if (pedidoDTO.IdUsuario <= 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "Debe seleccionar un usuario válido."
                });
            }

            if (pedidoDTO.IdMetodoPago <= 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "Debe seleccionar un método de pago válido."
                });
            }

            if (pedidoDTO.Subtotal <= 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "El subtotal debe ser mayor que cero."
                });
            }

            var descuento = pedidoDTO.Descuento ?? 0;

            if (descuento < 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "El descuento no puede ser negativo."
                });
            }

            if (descuento > pedidoDTO.Subtotal)
            {
                return BadRequest(new
                {
                    mensaje =
                        "El descuento no puede superar el subtotal."
                });
            }

            var totalEsperado =
                pedidoDTO.Subtotal - descuento;

            if (Math.Round(pedidoDTO.Total, 2) !=
                Math.Round(totalEsperado, 2))
            {
                return BadRequest(new
                {
                    mensaje =
                        "El total del pedido no coincide con el subtotal y el descuento."
                });
            }

            pedidoDTO.FechaPedido ??= DateTime.Now;
            pedidoDTO.EstadoPedido ??= "Pendiente";

            var pedido =
                await _pedidoLN.CrearPedido(pedidoDTO);

            var fechaEstimadaEntrega =
                pedido.FechaPedido?.AddDays(5);

            return CreatedAtAction(
                nameof(ObtenerPedidoPorId),
                new
                {
                    idPedido = pedido.IdPedido
                },
                new
                {
                    mensaje =
                        "Compra confirmada correctamente.",
                    idPedido = pedido.IdPedido,
                    numeroPedido =
                        $"MB-{pedido.IdPedido:D6}",
                    fechaPedido = pedido.FechaPedido,
                    fechaEstimadaEntrega,
                    estadoPedido = pedido.EstadoPedido,
                    subtotal = pedido.Subtotal,
                    descuento = pedido.Descuento ?? 0,
                    total = pedido.Total,
                    idCupon = pedido.IdCupon,
                    idMetodoPago = pedido.IdMetodoPago
                }
            );
        }

        [HttpGet(
            "{idPedido:int}/detalle-completo"
        )]
        public async Task<IActionResult>
            ObtenerDetalleCompleto(
                int idPedido
            )
        {
            var pedido =
                await _pedidoLN
                    .ObtenerDetalleCompleto(
                        idPedido
                    );

            if (pedido == null)
            {
                return NotFound(
                    new
                    {
                        mensaje =
                            "El pedido no fue encontrado."
                    }
                );
            }

            return Ok(pedido);
        }



        [HttpPut("{idPedido:int}")]
        public async Task<IActionResult> ActualizarPedido(
            int idPedido,
            [FromBody] PedidoDTO pedidoDTO
        )
        {
            var resultado =
                await _pedidoLN.ActualizarPedido(
                    idPedido,
                    pedidoDTO
                );

            if (!resultado)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no fue encontrado."
                });
            }

            return Ok(new
            {
                mensaje =
                    "Pedido actualizado correctamente."
            });
        }

        [HttpDelete("{idPedido:int}")]
        public async Task<IActionResult> EliminarPedido(
            int idPedido
        )
        {
            var resultado =
                await _pedidoLN.EliminarPedido(idPedido);

            if (!resultado)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no fue encontrado."
                });
            }

            return Ok(new
            {
                mensaje =
                    "Pedido eliminado correctamente."
            });
        }
    }
}