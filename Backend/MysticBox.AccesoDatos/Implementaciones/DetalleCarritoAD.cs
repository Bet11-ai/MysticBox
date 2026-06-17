using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class DetalleCarritoAD : IDetalleCarritoAD
{
    private readonly MysticBoxContext _context;

    public DetalleCarritoAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<DetalleCarrito>> ObtenerDetallesCarrito()
    {
        return await _context.DetalleCarritos.ToListAsync();
    }

    public async Task<DetalleCarrito?> ObtenerDetalleCarritoPorId(int idDetalleCarrito)
    {
        return await _context.DetalleCarritos
            .FirstOrDefaultAsync(x => x.IdDetalleCarrito == idDetalleCarrito);
    }

    public async Task<DetalleCarrito> CrearDetalleCarrito(DetalleCarritoDTO detalleDTO)
    {
        var detalle = new DetalleCarrito
        {
            IdCarrito = detalleDTO.IdCarrito,
            IdCaja = detalleDTO.IdCaja,
            IdPersonalizacion = detalleDTO.IdPersonalizacion,
            Cantidad = detalleDTO.Cantidad,
            PrecioUnitario = detalleDTO.PrecioUnitario,
            Subtotal = detalleDTO.Subtotal
        };

        _context.DetalleCarritos.Add(detalle);
        await _context.SaveChangesAsync();

        return detalle;
    }

    public async Task<bool> ActualizarDetalleCarrito(int idDetalleCarrito, DetalleCarritoDTO detalleDTO)
    {
        var detalle = await _context.DetalleCarritos
            .FirstOrDefaultAsync(x => x.IdDetalleCarrito == idDetalleCarrito);

        if (detalle == null)
            return false;

        detalle.IdCarrito = detalleDTO.IdCarrito;
        detalle.IdCaja = detalleDTO.IdCaja;
        detalle.IdPersonalizacion = detalleDTO.IdPersonalizacion;
        detalle.Cantidad = detalleDTO.Cantidad;
        detalle.PrecioUnitario = detalleDTO.PrecioUnitario;
        detalle.Subtotal = detalleDTO.Subtotal;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarDetalleCarrito(int idDetalleCarrito)
    {
        var detalle = await _context.DetalleCarritos
            .FirstOrDefaultAsync(x => x.IdDetalleCarrito == idDetalleCarrito);

        if (detalle == null)
            return false;

        _context.DetalleCarritos.Remove(detalle);
        await _context.SaveChangesAsync();

        return true;
    }
}