using MysticBox.Dominio.DTO;

namespace MysticBox.Dominio.InterfacesLN;

public interface IDashboardLN
{
    Task<DashboardDTO>
        ObtenerDashboard();
}