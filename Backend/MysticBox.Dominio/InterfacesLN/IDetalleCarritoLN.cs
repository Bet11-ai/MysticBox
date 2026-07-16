using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface IDetalleCarritoLN
{
    Task<List<DetalleCarrito>> ObtenerDetallesCarrito();

    Task<DetalleCarrito?> ObtenerDetalleCarritoPorId(int idDetalleCarrito);

    Task<DetalleCarrito> CrearDetalleCarrito(DetalleCarritoDTO detalleDTO);

    Task<bool> ActualizarDetalleCarrito(int idDetalleCarrito, DetalleCarritoDTO detalleDTO);

    Task<bool> EliminarDetalleCarrito(int idDetalleCarrito);
}