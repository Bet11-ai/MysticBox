using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class PedidoAD : IPedidoAD
{
    private readonly MysticBoxContext _context;

    public PedidoAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<Pedido>> ObtenerPedidos()
    {
        return await _context.Pedidos.ToListAsync();
    }

    public async Task<Pedido?> ObtenerPedidoPorId(int idPedido)
    {
        return await _context.Pedidos
            .FirstOrDefaultAsync(x => x.IdPedido == idPedido);
    }

    public async Task<Pedido> CrearPedido(PedidoDTO pedidoDTO)
    {
        var pedido = new Pedido
        {
            IdUsuario = pedidoDTO.IdUsuario,
            IdCupon = pedidoDTO.IdCupon,
            IdMetodoPago = pedidoDTO.IdMetodoPago,
            FechaPedido = pedidoDTO.FechaPedido,
            Subtotal = pedidoDTO.Subtotal,
            Descuento = pedidoDTO.Descuento,
            Total = pedidoDTO.Total,
            EstadoPedido = pedidoDTO.EstadoPedido
        };

        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync();

        return pedido;
    }

    public async Task<bool> ActualizarPedido(int idPedido, PedidoDTO pedidoDTO)
    {
        var pedido = await _context.Pedidos
            .FirstOrDefaultAsync(x => x.IdPedido == idPedido);

        if (pedido == null)
            return false;

        pedido.IdUsuario = pedidoDTO.IdUsuario;
        pedido.IdCupon = pedidoDTO.IdCupon;
        pedido.IdMetodoPago = pedidoDTO.IdMetodoPago;
        pedido.FechaPedido = pedidoDTO.FechaPedido;
        pedido.Subtotal = pedidoDTO.Subtotal;
        pedido.Descuento = pedidoDTO.Descuento;
        pedido.Total = pedidoDTO.Total;
        pedido.EstadoPedido = pedidoDTO.EstadoPedido;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarPedido(int idPedido)
    {
        var pedido = await _context.Pedidos
            .FirstOrDefaultAsync(x => x.IdPedido == idPedido);

        if (pedido == null)
            return false;

        _context.Pedidos.Remove(pedido);
        await _context.SaveChangesAsync();

        return true;
    }
}