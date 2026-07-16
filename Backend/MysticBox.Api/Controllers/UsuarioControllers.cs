using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioLN _usuarioLN;

    public UsuarioController(IUsuarioLN usuarioLN)
    {
        _usuarioLN = usuarioLN;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerUsuarios()
    {
        var usuarios = await _usuarioLN.ObtenerUsuarios();
        return Ok(usuarios);
    }

    [HttpGet("{idUsuario}")]
    public async Task<IActionResult> ObtenerUsuarioPorId(int idUsuario)
    {
        var usuario = await _usuarioLN.ObtenerUsuarioPorId(idUsuario);

        if (usuario == null)
            return NotFound("Usuario no encontrado.");

        return Ok(usuario);
    }

    [HttpPost]
    public async Task<IActionResult> CrearUsuario([FromBody] UsuarioDTO usuarioDTO)
    {
        var usuario = await _usuarioLN.CrearUsuario(usuarioDTO);
        return Ok(usuario);
    }

    [HttpPut("{idUsuario}")]
    public async Task<IActionResult> ActualizarUsuario(int idUsuario, [FromBody] UsuarioDTO usuarioDTO)
    {
        var resultado = await _usuarioLN.ActualizarUsuario(idUsuario, usuarioDTO);

        if (!resultado)
            return NotFound("Usuario no encontrado.");

        return Ok("Usuario actualizado correctamente.");
    }

    [HttpDelete("{idUsuario}")]
    public async Task<IActionResult> EliminarUsuario(int idUsuario)
    {
        var resultado = await _usuarioLN.EliminarUsuario(idUsuario);

        if (!resultado)
            return NotFound("Usuario no encontrado.");

        return Ok("Usuario eliminado correctamente.");


    }


}