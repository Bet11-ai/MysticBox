using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesAD;

public interface IDetalleCarritoAD
{
    Task<List<DetalleCarrito>> ObtenerDetallesCarrito();

    Task<DetalleCarrito?> ObtenerDetalleCarritoPorId(int idDetalleCarrito);

    Task<DetalleCarrito> CrearDetalleCarrito(DetalleCarritoDTO detalleDTO);

    Task<bool> ActualizarDetalleCarrito(int idDetalleCarrito, DetalleCarritoDTO detalleDTO);

    Task<bool> EliminarDetalleCarrito(int idDetalleCarrito);
}