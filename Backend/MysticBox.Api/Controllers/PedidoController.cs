using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

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
        return Ok(await _pedidoLN.ObtenerPedidos());
    }

    [HttpGet("{idPedido}")]
    public async Task<IActionResult> ObtenerPedidoPorId(int idPedido)
    {
        var pedido = await _pedidoLN.ObtenerPedidoPorId(idPedido);

        if (pedido == null)
            return NotFound();

        return Ok(pedido);
    }

    [HttpPost]
    public async Task<IActionResult> CrearPedido(PedidoDTO pedidoDTO)
    {
        return Ok(await _pedidoLN.CrearPedido(pedidoDTO));
    }

    [HttpPut("{idPedido}")]
    public async Task<IActionResult> ActualizarPedido(int idPedido, PedidoDTO pedidoDTO)
    {
        var resultado = await _pedidoLN.ActualizarPedido(idPedido, pedidoDTO);

        if (!resultado)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{idPedido}")]
    public async Task<IActionResult> EliminarPedido(int idPedido)
    {
        var resultado = await _pedidoLN.EliminarPedido(idPedido);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}