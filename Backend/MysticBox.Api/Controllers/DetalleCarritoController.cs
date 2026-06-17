using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DetalleCarritoController : ControllerBase
{
    private readonly IDetalleCarritoLN _detalleCarritoLN;

    public DetalleCarritoController(IDetalleCarritoLN detalleCarritoLN)
    {
        _detalleCarritoLN = detalleCarritoLN;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerDetallesCarrito()
    {
        return Ok(await _detalleCarritoLN.ObtenerDetallesCarrito());
    }

    [HttpGet("{idDetalleCarrito}")]
    public async Task<IActionResult> ObtenerDetalleCarritoPorId(int idDetalleCarrito)
    {
        var detalle = await _detalleCarritoLN.ObtenerDetalleCarritoPorId(idDetalleCarrito);

        if (detalle == null)
            return NotFound();

        return Ok(detalle);
    }

    [HttpPost]
    public async Task<IActionResult> CrearDetalleCarrito(DetalleCarritoDTO detalleDTO)
    {
        return Ok(await _detalleCarritoLN.CrearDetalleCarrito(detalleDTO));
    }

    [HttpPut("{idDetalleCarrito}")]
    public async Task<IActionResult> ActualizarDetalleCarrito(int idDetalleCarrito, DetalleCarritoDTO detalleDTO)
    {
        var resultado = await _detalleCarritoLN.ActualizarDetalleCarrito(idDetalleCarrito, detalleDTO);

        if (!resultado)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{idDetalleCarrito}")]
    public async Task<IActionResult> EliminarDetalleCarrito(int idDetalleCarrito)
    {
        var resultado = await _detalleCarritoLN.EliminarDetalleCarrito(idDetalleCarrito);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}