using MysticBox.AccesoDatos.Implementaciones;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class PedidoLN : IPedidoLN
{
    private readonly IPedidoAD _pedidoAD;

    public PedidoLN(IPedidoAD pedidoAD)
    {
        _pedidoAD = pedidoAD;
    }

    public async Task<List<Pedido>> ObtenerPedidos()
    {
        return await _pedidoAD.ObtenerPedidos();
    }

    public async Task<Pedido?> ObtenerPedidoPorId(int idPedido)
    {
        return await _pedidoAD.ObtenerPedidoPorId(idPedido);
    }

    public async Task<Pedido> CrearPedido(PedidoDTO pedidoDTO)
    {
        return await _pedidoAD.CrearPedido(pedidoDTO);
    }

    public async Task<bool> ActualizarPedido(int idPedido, PedidoDTO pedidoDTO)
    {
        return await _pedidoAD.ActualizarPedido(idPedido, pedidoDTO);
    }

    public async Task<bool> EliminarPedido(int idPedido)
    {
        return await _pedidoAD.EliminarPedido(idPedido);
    }
}