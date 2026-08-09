using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioLN
        _usuarioLN;

    public UsuarioController(
        IUsuarioLN usuarioLN
    )
    {
        _usuarioLN =
            usuarioLN;
    }

    [HttpGet("clientes")]
    public async Task<IActionResult>
        ObtenerClientes()
    {
        var clientes =
            await _usuarioLN
                .ObtenerClientes();

        return Ok(clientes);
    }

    [HttpGet(
        "clientes/{idUsuario:int}"
    )]
    public async Task<IActionResult>
        ObtenerClientePorId(
            int idUsuario
        )
    {
        var cliente =
            await _usuarioLN
                .ObtenerClientePorId(
                    idUsuario
                );

        if (cliente == null)
        {
            return NotFound(
                new
                {
                    mensaje =
                        "Cliente no encontrado."
                }
            );
        }

        return Ok(cliente);
    }

    [HttpPut(
        "clientes/{idUsuario:int}"
    )]
    public async Task<IActionResult>
        ActualizarCliente(
            int idUsuario,
            [FromBody]
            ActualizarUsuarioDTO
                usuarioDTO
        )
    {
        if (
            string.IsNullOrWhiteSpace(
                usuarioDTO.Nombre
            ) ||
            string.IsNullOrWhiteSpace(
                usuarioDTO.Correo
            )
        )
        {
            return BadRequest(
                new
                {
                    mensaje =
                        "Nombre y correo son obligatorios."
                }
            );
        }

        try
        {
            var resultado =
                await _usuarioLN
                    .ActualizarCliente(
                        idUsuario,
                        usuarioDTO
                    );

            if (!resultado)
            {
                return NotFound(
                    new
                    {
                        mensaje =
                            "Cliente no encontrado."
                    }
                );
            }

            return Ok(
                new
                {
                    mensaje =
                        "Cliente actualizado correctamente."
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
                    mensaje =
                        error.Message
                }
            );
        }
    }

    [HttpPatch(
        "clientes/{idUsuario:int}/estado"
    )]
    public async Task<IActionResult>
        CambiarEstadoCliente(
            int idUsuario,
            [FromBody]
            CambiarEstadoUsuarioDTO
                estadoDTO
        )
    {
        var resultado =
            await _usuarioLN
                .CambiarEstadoCliente(
                    idUsuario,
                    estadoDTO.Estado
                );

        if (!resultado)
        {
            return NotFound(
                new
                {
                    mensaje =
                        "Cliente no encontrado."
                }
            );
        }

        return Ok(
            new
            {
                mensaje =
                    estadoDTO.Estado
                        ? "Cliente activado correctamente."
                        : "Cliente desactivado correctamente."
            }
        );
    }
}