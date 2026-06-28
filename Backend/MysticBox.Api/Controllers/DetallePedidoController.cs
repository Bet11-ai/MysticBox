using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DetallePedidoController : ControllerBase
{
    private readonly IDetallePedidoLN _detallePedidoLN;

    public DetallePedidoController(IDetallePedidoLN detallePedidoLN)
    {
        _detallePedidoLN = detallePedidoLN;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerDetallesPedido()
    {
        return Ok(await _detallePedidoLN.ObtenerDetallesPedido());
    }

    [HttpGet("{idDetallePedido}")]
    public async Task<IActionResult> ObtenerDetallePedidoPorId(int idDetallePedido)
    {
        var detalle = await _detallePedidoLN.ObtenerDetallePedidoPorId(idDetallePedido);

        if (detalle == null)
            return NotFound();

        return Ok(detalle);
    }

    [HttpPost]
    public async Task<IActionResult> CrearDetallePedido(DetallePedidoDTO detalleDTO)
    {
        return Ok(await _detallePedidoLN.CrearDetallePedido(detalleDTO));
    }

    [HttpPut("{idDetallePedido}")]
    public async Task<IActionResult> ActualizarDetallePedido(int idDetallePedido, DetallePedidoDTO detalleDTO)
    {
        var resultado = await _detallePedidoLN.ActualizarDetallePedido(idDetallePedido, detalleDTO);

        if (!resultado)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{idDetallePedido}")]
    public async Task<IActionResult> EliminarDetallePedido(int idDetallePedido)
    {
        var resultado = await _detallePedidoLN.EliminarDetallePedido(idDetallePedido);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}