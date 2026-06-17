using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesAD;

public interface IEntregaAD
{
    Task<List<Entrega>> ObtenerEntregas();

    Task<Entrega?> ObtenerEntregaPorId(int idEntrega);

    Task<Entrega> CrearEntrega(EntregaDTO entregaDTO);

    Task<bool> ActualizarEntrega(int idEntrega, EntregaDTO entregaDTO);

    Task<bool> EliminarEntrega(int idEntrega);
}