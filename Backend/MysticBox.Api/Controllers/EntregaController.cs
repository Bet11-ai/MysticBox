using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EntregaController : ControllerBase
{
    private readonly IEntregaLN _entregaLN;

    public EntregaController(IEntregaLN entregaLN)
    {
        _entregaLN = entregaLN;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerEntregas()
    {
        return Ok(await _entregaLN.ObtenerEntregas());
    }

    [HttpGet("{idEntrega}")]
    public async Task<IActionResult> ObtenerEntregaPorId(int idEntrega)
    {
        var entrega = await _entregaLN.ObtenerEntregaPorId(idEntrega);

        if (entrega == null)
            return NotFound();

        return Ok(entrega);
    }

    [HttpPost]
    public async Task<IActionResult> CrearEntrega(EntregaDTO entregaDTO)
    {
        return Ok(await _entregaLN.CrearEntrega(entregaDTO));
    }

    [HttpPut("{idEntrega}")]
    public async Task<IActionResult> ActualizarEntrega(int idEntrega, EntregaDTO entregaDTO)
    {
        var resultado = await _entregaLN.ActualizarEntrega(idEntrega, entregaDTO);

        if (!resultado)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{idEntrega}")]
    public async Task<IActionResult> EliminarEntrega(int idEntrega)
    {
        var resultado = await _entregaLN.EliminarEntrega(idEntrega);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}