using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class DetallePedidoAD : IDetallePedidoAD
{
    private readonly MysticBoxContext _context;

    public DetallePedidoAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<DetallePedido>> ObtenerDetallesPedido()
    {
        return await _context.DetallePedidos.ToListAsync();
    }

    public async Task<DetallePedido?> ObtenerDetallePedidoPorId(int idDetallePedido)
    {
        return await _context.DetallePedidos
            .FirstOrDefaultAsync(x => x.IdDetallePedido == idDetallePedido);
    }

    public async Task<DetallePedido> CrearDetallePedido(DetallePedidoDTO detalleDTO)
    {
        var detalle = new DetallePedido
        {
            IdPedido = detalleDTO.IdPedido,
            IdCaja = detalleDTO.IdCaja,
            IdPersonalizacion = detalleDTO.IdPersonalizacion,
            Cantidad = detalleDTO.Cantidad,
            PrecioUnitario = detalleDTO.PrecioUnitario,
            Subtotal = detalleDTO.Subtotal
        };

        _context.DetallePedidos.Add(detalle);
        await _context.SaveChangesAsync();

        return detalle;
    }

    public async Task<bool> ActualizarDetallePedido(int idDetallePedido, DetallePedidoDTO detalleDTO)
    {
        var detalle = await _context.DetallePedidos
            .FirstOrDefaultAsync(x => x.IdDetallePedido == idDetallePedido);

        if (detalle == null)
            return false;

        detalle.IdPedido = detalleDTO.IdPedido;
        detalle.IdCaja = detalleDTO.IdCaja;
        detalle.IdPersonalizacion = detalleDTO.IdPersonalizacion;
        detalle.Cantidad = detalleDTO.Cantidad;
        detalle.PrecioUnitario = detalleDTO.PrecioUnitario;
        detalle.Subtotal = detalleDTO.Subtotal;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarDetallePedido(int idDetallePedido)
    {
        var detalle = await _context.DetallePedidos
            .FirstOrDefaultAsync(x => x.IdDetallePedido == idDetallePedido);

        if (detalle == null)
            return false;

        _context.DetallePedidos.Remove(detalle);
        await _context.SaveChangesAsync();

        return true;
    }
}