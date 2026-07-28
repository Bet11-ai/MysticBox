using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface IPedidoLN
{
    Task<List<Pedido>> ObtenerPedidos();

    Task<Pedido?> ObtenerPedidoPorId(
        int idPedido
    );

    Task<PedidoDetalleCompletoDTO?>
        ObtenerDetalleCompleto(
            int idPedido
        );

    Task<Pedido> CrearPedido(
        PedidoDTO pedidoDTO
    );

    Task<bool> ActualizarPedido(
        int idPedido,
        PedidoDTO pedidoDTO
    );

    Task<bool> EliminarPedido(
        int idPedido
    );
}