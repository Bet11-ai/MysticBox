using Microsoft.AspNetCore.Mvc;

using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EstadisticasController :
    ControllerBase
{
    private readonly IEstadisticasLN
        _estadisticasLN;

    public EstadisticasController(
        IEstadisticasLN estadisticasLN
    )
    {
        _estadisticasLN =
            estadisticasLN;
    }

    [HttpGet]
    public async Task<IActionResult>
        ObtenerEstadisticas(
            [FromQuery]
            int? anio = null
        )
    {
        var estadisticas =
            await _estadisticasLN
                .ObtenerEstadisticas(
                    anio
                );

        return Ok(
            estadisticas
        );
    }
}