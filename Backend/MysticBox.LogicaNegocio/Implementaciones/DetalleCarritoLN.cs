using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class DetalleCarritoLN : IDetalleCarritoLN
{
    private readonly IDetalleCarritoAD _detalleCarritoAD;

    public DetalleCarritoLN(IDetalleCarritoAD detalleCarritoAD)
    {
        _detalleCarritoAD = detalleCarritoAD;
    }

    public async Task<List<DetalleCarrito>> ObtenerDetallesCarrito()
    {
        return await _detalleCarritoAD.ObtenerDetallesCarrito();
    }

    public async Task<DetalleCarrito?> ObtenerDetalleCarritoPorId(int idDetalleCarrito)
    {
        return await _detalleCarritoAD.ObtenerDetalleCarritoPorId(idDetalleCarrito);
    }

    public async Task<DetalleCarrito> CrearDetalleCarrito(DetalleCarritoDTO detalleDTO)
    {
        return await _detalleCarritoAD.CrearDetalleCarrito(detalleDTO);
    }

    public async Task<bool> ActualizarDetalleCarrito(int idDetalleCarrito, DetalleCarritoDTO detalleDTO)
    {
        return await _detalleCarritoAD.ActualizarDetalleCarrito(idDetalleCarrito, detalleDTO);
    }

    public async Task<bool> EliminarDetalleCarrito(int idDetalleCarrito)
    {
        return await _detalleCarritoAD.EliminarDetalleCarrito(idDetalleCarrito);
    }
}