using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthLN _authLN;

    public AuthController(IAuthLN authLN)
    {
        _authLN = authLN;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginDTO loginDTO)
    {
        var usuario = await _authLN.Login(loginDTO);

        if (usuario == null)
            return Unauthorized("Correo o contraseña incorrectos.");

        return Ok(usuario);
    }

    [HttpPost("Registro")]
    public async Task<IActionResult> Registro(RegistroDTO registroDTO)
    {
        var usuario = await _authLN.Registro(registroDTO);
        return Ok(usuario);
    }
}