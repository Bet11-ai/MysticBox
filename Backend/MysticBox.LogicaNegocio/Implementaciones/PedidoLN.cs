using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class PedidoLN : IPedidoLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public PedidoLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<Pedido>> ObtenerPedidos()
    {
        var respuesta = _unidadTrabajo.TPedido.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<Pedido>());
    }

    public async Task<Pedido?> ObtenerPedidoPorId(int idPedido)
    {
        var respuesta = _unidadTrabajo.TPedido.ObtenerEntidad(x => x.IdPedido == idPedido);
        return await Task.FromResult(respuesta.ValorRetorno);
    }

    public async Task<Pedido> CrearPedido(PedidoDTO pedidoDTO)
    {
        var pedido = new Pedido
        {
            IdUsuario = pedidoDTO.IdUsuario,
            IdCupon = pedidoDTO.IdCupon,
            IdMetodoPago = pedidoDTO.IdMetodoPago,
            FechaPedido = pedidoDTO.FechaPedido ?? DateTime.Now,
            Subtotal = pedidoDTO.Subtotal,
            Descuento = pedidoDTO.Descuento,
            Total = pedidoDTO.Total,
            EstadoPedido = pedidoDTO.EstadoPedido ?? "Pendiente"
        };

        _unidadTrabajo.TPedido.Insertar(pedido);
        _unidadTrabajo.Completar();

        return await Task.FromResult(pedido);
    }

    public async Task<bool> ActualizarPedido(int idPedido, PedidoDTO pedidoDTO)
    {
        var respuesta = _unidadTrabajo.TPedido.ObtenerEntidad(x => x.IdPedido == idPedido);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var pedido = respuesta.ValorRetorno;

        pedido.IdUsuario = pedidoDTO.IdUsuario;
        pedido.IdCupon = pedidoDTO.IdCupon;
        pedido.IdMetodoPago = pedidoDTO.IdMetodoPago;
        pedido.FechaPedido = pedidoDTO.FechaPedido;
        pedido.Subtotal = pedidoDTO.Subtotal;
        pedido.Descuento = pedidoDTO.Descuento;
        pedido.Total = pedidoDTO.Total;
        pedido.EstadoPedido = pedidoDTO.EstadoPedido;

        _unidadTrabajo.TPedido.Modificar(pedido);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarPedido(int idPedido)
    {
        var respuesta = _unidadTrabajo.TPedido.ObtenerEntidad(x => x.IdPedido == idPedido);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        _unidadTrabajo.TPedido.Eliminar(respuesta.ValorRetorno);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}