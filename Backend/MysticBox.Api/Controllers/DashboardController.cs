using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DashboardController :
    ControllerBase
{
    private readonly IDashboardLN
        _dashboardLN;

    public DashboardController(
        IDashboardLN dashboardLN
    )
    {
        _dashboardLN =
            dashboardLN;
    }

    [HttpGet]
    public async Task<IActionResult>
        ObtenerDashboard()
    {
        var dashboard =
            await _dashboardLN
                .ObtenerDashboard();

        return Ok(dashboard);
    }
}