using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CarritoController : ControllerBase
{
    private readonly ICarritoLN _carritoLN;

    public CarritoController(ICarritoLN carritoLN)
    {
        _carritoLN = carritoLN;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerCarritos()
    {
        var carritos = await _carritoLN.ObtenerCarritos();
        return Ok(carritos);
    }

    [HttpGet("{idCarrito}")]
    public async Task<IActionResult> ObtenerCarritoPorId(int idCarrito)
    {
        var carrito = await _carritoLN.ObtenerCarritoPorId(idCarrito);

        if (carrito == null)
            return NotFound();

        return Ok(carrito);
    }

    [HttpPost]
    public async Task<IActionResult> CrearCarrito(CarritoDTO carritoDTO)
    {
        var carrito = await _carritoLN.CrearCarrito(carritoDTO);
        return Ok(carrito);
    }

    [HttpPut("{idCarrito}")]
    public async Task<IActionResult> ActualizarCarrito(int idCarrito, CarritoDTO carritoDTO)
    {
        var resultado = await _carritoLN.ActualizarCarrito(idCarrito, carritoDTO);

        if (!resultado)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{idCarrito}")]
    public async Task<IActionResult> EliminarCarrito(int idCarrito)
    {
        var resultado = await _carritoLN.EliminarCarrito(idCarrito);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}