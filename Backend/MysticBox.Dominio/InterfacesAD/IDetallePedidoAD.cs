using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesAD;

public interface IDetallePedidoAD
{
    Task<List<DetallePedido>> ObtenerDetallesPedido();

    Task<DetallePedido?> ObtenerDetallePedidoPorId(int idDetallePedido);

    Task<DetallePedido> CrearDetallePedido(DetallePedidoDTO detalleDTO);

    Task<bool> ActualizarDetallePedido(int idDetallePedido, DetallePedidoDTO detalleDTO);

    Task<bool> EliminarDetallePedido(int idDetallePedido);
}