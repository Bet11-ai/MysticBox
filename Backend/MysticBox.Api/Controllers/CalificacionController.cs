using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CalificacionController : ControllerBase
{
    private readonly ICalificacionLN _calificacionLN;

    public CalificacionController(ICalificacionLN calificacionLN)
    {
        _calificacionLN = calificacionLN;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerCalificaciones()
    {
        return Ok(await _calificacionLN.ObtenerCalificaciones());
    }

    [HttpGet("{idCalificacion}")]
    public async Task<IActionResult> ObtenerCalificacionPorId(int idCalificacion)
    {
        var calificacion = await _calificacionLN.ObtenerCalificacionPorId(idCalificacion);

        if (calificacion == null)
            return NotFound();

        return Ok(calificacion);
    }

    [HttpPost]
    public async Task<IActionResult> CrearCalificacion(CalificacionDTO calificacionDTO)
    {
        return Ok(await _calificacionLN.CrearCalificacion(calificacionDTO));
    }

    [HttpPut("{idCalificacion}")]
    public async Task<IActionResult> ActualizarCalificacion(int idCalificacion, CalificacionDTO calificacionDTO)
    {
        var resultado = await _calificacionLN.ActualizarCalificacion(idCalificacion, calificacionDTO);

        if (!resultado)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{idCalificacion}")]
    public async Task<IActionResult> EliminarCalificacion(int idCalificacion)
    {
        var resultado = await _calificacionLN.EliminarCalificacion(idCalificacion);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}