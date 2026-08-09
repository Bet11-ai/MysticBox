using MysticBox.Dominio.DTO;

namespace MysticBox.Dominio.InterfacesLN;

public interface IEstadisticasLN
{
    Task<EstadisticasDTO>
        ObtenerEstadisticas(
            int? anio = null
        );
}