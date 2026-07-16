using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface IEntregaLN
{
    Task<List<Entrega>> ObtenerEntregas();

    Task<Entrega?> ObtenerEntregaPorId(int idEntrega);

    Task<Entrega> CrearEntrega(EntregaDTO entregaDTO);

    Task<bool> ActualizarEntrega(int idEntrega, EntregaDTO entregaDTO);

    Task<bool> EliminarEntrega(int idEntrega);
}