using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class CarritoAD : ICarritoAD
{
    private readonly MysticBoxContext _context;

    public CarritoAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<Carrito>> ObtenerCarritos()
    {
        return await _context.Carritos.ToListAsync();
    }

    public async Task<Carrito?> ObtenerCarritoPorId(int idCarrito)
    {
        return await _context.Carritos
            .FirstOrDefaultAsync(x => x.IdCarrito == idCarrito);
    }

    public async Task<Carrito> CrearCarrito(CarritoDTO carritoDTO)
    {
        var carrito = new Carrito
        {
            IdUsuario = carritoDTO.IdUsuario,
            FechaCreacion = carritoDTO.FechaCreacion,
            Estado = carritoDTO.Estado
        };

        _context.Carritos.Add(carrito);
        await _context.SaveChangesAsync();

        return carrito;
    }

    public async Task<bool> ActualizarCarrito(int idCarrito, CarritoDTO carritoDTO)
    {
        var carrito = await _context.Carritos
            .FirstOrDefaultAsync(x => x.IdCarrito == idCarrito);

        if (carrito == null)
            return false;

        carrito.IdUsuario = carritoDTO.IdUsuario;
        carrito.FechaCreacion = carritoDTO.FechaCreacion;
        carrito.Estado = carritoDTO.Estado;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarCarrito(int idCarrito)
    {
        var carrito = await _context.Carritos
            .FirstOrDefaultAsync(x => x.IdCarrito == idCarrito);

        if (carrito == null)
            return false;

        _context.Carritos.Remove(carrito);

        await _context.SaveChangesAsync();

        return true;
    }
}