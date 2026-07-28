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
    public async Task<IActionResult> Login(
        LoginDTO loginDTO
    )
    {
        if (
            string.IsNullOrWhiteSpace(
                loginDTO.Correo
            ) ||
            string.IsNullOrWhiteSpace(
                loginDTO.Contrasena
            )
        )
        {
            return BadRequest(
                new
                {
                    mensaje =
                        "Debe indicar el correo y la contraseña."
                }
            );
        }

        var usuario =
            await _authLN.Login(loginDTO);

        if (usuario == null)
        {
            return Unauthorized(
                new
                {
                    mensaje =
                        "Correo o contraseña incorrectos."
                }
            );
        }

        return Ok(usuario);
    }

    [HttpPost("Registro")]
    public async Task<IActionResult> Registro(
        RegistroDTO registroDTO
    )
    {
        if (
            string.IsNullOrWhiteSpace(
                registroDTO.Nombre
            ) ||
            string.IsNullOrWhiteSpace(
                registroDTO.Correo
            ) ||
            string.IsNullOrWhiteSpace(
                registroDTO.Contrasena
            )
        )
        {
            return BadRequest(
                new
                {
                    mensaje =
                        "Nombre, correo y contraseña son obligatorios."
                }
            );
        }

        try
        {
            var usuario =
                await _authLN.Registro(
                    registroDTO
                );

            return Ok(
                new
                {
                    mensaje =
                        "Usuario registrado correctamente.",

                    usuario
                }
            );
        }
        catch (
            InvalidOperationException error
        )
        {
            return BadRequest(
                new
                {
                    mensaje = error.Message
                }
            );
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes
                    .Status500InternalServerError,

                new
                {
                    mensaje =
                        "No fue posible registrar el usuario."
                }
            );
        }
    }

    [HttpPost("CrearAdministradorInicial")]
    public async Task<IActionResult>
        CrearAdministradorInicial(
            RegistroDTO registroDTO
        )
    {
        if (
            string.IsNullOrWhiteSpace(
                registroDTO.Nombre
            ) ||
            string.IsNullOrWhiteSpace(
                registroDTO.Correo
            ) ||
            string.IsNullOrWhiteSpace(
                registroDTO.Contrasena
            )
        )
        {
            return BadRequest(
                new
                {
                    mensaje =
                        "Nombre, correo y contraseña son obligatorios."
                }
            );
        }

        try
        {
            var administrador =
                await _authLN
                    .CrearAdministradorInicial(
                        registroDTO
                    );

            return Ok(
                new
                {
                    mensaje =
                        "Administrador inicial creado correctamente.",

                    usuario = administrador
                }
            );
        }
        catch (
            InvalidOperationException error
        )
        {
            return BadRequest(
                new
                {
                    mensaje = error.Message
                }
            );
        }
        catch (Exception error)
        {
            return StatusCode(
                StatusCodes
                    .Status500InternalServerError,

                new
                {
                    mensaje =
                        "No fue posible crear el administrador inicial.",

                    detalle = error.Message
                }
            );
        }
    }
}