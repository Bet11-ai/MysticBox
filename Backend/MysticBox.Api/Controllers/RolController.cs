using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RolController : ControllerBase
{
    private readonly IRolLN _rolLN;

    public RolController(IRolLN rolLN)
    {
        _rolLN = rolLN;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerRoles()
    {
        return Ok(await _rolLN.ObtenerRoles());
    }

    [HttpGet("{idRol}")]
    public async Task<IActionResult> ObtenerRolPorId(int idRol)
    {
        var rol = await _rolLN.ObtenerRolPorId(idRol);

        if (rol == null)
            return NotFound();

        return Ok(rol);
    }

    [HttpPost]
    public async Task<IActionResult> CrearRol(RolDTO rolDTO)
    {
        return Ok(await _rolLN.CrearRol(rolDTO));
    }

    [HttpPut("{idRol}")]
    public async Task<IActionResult> ActualizarRol(int idRol, RolDTO rolDTO)
    {
        var resultado = await _rolLN.ActualizarRol(idRol, rolDTO);

        if (!resultado)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{idRol}")]
    public async Task<IActionResult> EliminarRol(int idRol)
    {
        var resultado = await _rolLN.EliminarRol(idRol);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}