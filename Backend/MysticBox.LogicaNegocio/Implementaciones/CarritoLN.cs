using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class CarritoLN : ICarritoLN
{
    private readonly ICarritoAD _carritoAD;

    public CarritoLN(ICarritoAD carritoAD)
    {
        _carritoAD = carritoAD;
    }

    public async Task<List<Carrito>> ObtenerCarritos()
    {
        return await _carritoAD.ObtenerCarritos();
    }

    public async Task<Carrito?> ObtenerCarritoPorId(int idCarrito)
    {
        return await _carritoAD.ObtenerCarritoPorId(idCarrito);
    }

    public async Task<Carrito> CrearCarrito(CarritoDTO carritoDTO)
    {
        return await _carritoAD.CrearCarrito(carritoDTO);
    }

    public async Task<bool> ActualizarCarrito(int idCarrito, CarritoDTO carritoDTO)
    {
        return await _carritoAD.ActualizarCarrito(idCarrito, carritoDTO);
    }

    public async Task<bool> EliminarCarrito(int idCarrito)
    {
        return await _carritoAD.EliminarCarrito(idCarrito);
    }
}