using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface ICarritoLN
{
    Task<List<Carrito>> ObtenerCarritos();

    Task<Carrito?> ObtenerCarritoPorId(int idCarrito);

    Task<Carrito> CrearCarrito(CarritoDTO carritoDTO);

    Task<bool> ActualizarCarrito(int idCarrito, CarritoDTO carritoDTO);

    Task<bool> EliminarCarrito(int idCarrito);
}