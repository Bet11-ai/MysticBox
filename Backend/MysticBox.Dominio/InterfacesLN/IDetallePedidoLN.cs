using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface IDetallePedidoLN
{
    Task<List<DetallePedido>> ObtenerDetallesPedido();

    Task<DetallePedido?> ObtenerDetallePedidoPorId(int idDetallePedido);

    Task<DetallePedido> CrearDetallePedido(DetallePedidoDTO detalleDTO);

    Task<bool> ActualizarDetallePedido(int idDetallePedido, DetallePedidoDTO detalleDTO);

    Task<bool> EliminarDetallePedido(int idDetallePedido);
}