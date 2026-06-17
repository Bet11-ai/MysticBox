using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class DetallePedidoLN : IDetallePedidoLN
{
    private readonly IDetallePedidoAD _detallePedidoAD;

    public DetallePedidoLN(IDetallePedidoAD detallePedidoAD)
    {
        _detallePedidoAD = detallePedidoAD;
    }

    public async Task<List<DetallePedido>> ObtenerDetallesPedido()
    {
        return await _detallePedidoAD.ObtenerDetallesPedido();
    }

    public async Task<DetallePedido?> ObtenerDetallePedidoPorId(int idDetallePedido)
    {
        return await _detallePedidoAD.ObtenerDetallePedidoPorId(idDetallePedido);
    }

    public async Task<DetallePedido> CrearDetallePedido(DetallePedidoDTO detalleDTO)
    {
        return await _detallePedidoAD.CrearDetallePedido(detalleDTO);
    }

    public async Task<bool> ActualizarDetallePedido(int idDetallePedido, DetallePedidoDTO detalleDTO)
    {
        return await _detallePedidoAD.ActualizarDetallePedido(idDetallePedido, detalleDTO);
    }

    public async Task<bool> EliminarDetallePedido(int idDetallePedido)
    {
        return await _detallePedidoAD.EliminarDetallePedido(idDetallePedido);
    }
}