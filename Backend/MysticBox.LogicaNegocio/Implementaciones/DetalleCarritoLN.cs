using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class DetalleCarritoLN : IDetalleCarritoLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public DetalleCarritoLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<DetalleCarrito>> ObtenerDetallesCarrito()
    {
        var respuesta = _unidadTrabajo.TDetalleCarrito.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<DetalleCarrito>());
    }

    public async Task<DetalleCarrito?> ObtenerDetalleCarritoPorId(int idDetalleCarrito)
    {
        var respuesta = _unidadTrabajo.TDetalleCarrito.ObtenerEntidad(x => x.IdDetalleCarrito == idDetalleCarrito);
        return await Task.FromResult(respuesta.ValorRetorno);
    }

    public async Task<DetalleCarrito> CrearDetalleCarrito(DetalleCarritoDTO detalleDTO)
    {
        var detalle = new DetalleCarrito
        {
            IdCarrito = detalleDTO.IdCarrito,
            IdCaja = detalleDTO.IdCaja,
            Cantidad = detalleDTO.Cantidad
        };

        _unidadTrabajo.TDetalleCarrito.Insertar(detalle);
        _unidadTrabajo.Completar();

        return await Task.FromResult(detalle);
    }

    public async Task<bool> ActualizarDetalleCarrito(int idDetalleCarrito, DetalleCarritoDTO detalleDTO)
    {
        var respuesta = _unidadTrabajo.TDetalleCarrito.ObtenerEntidad(x => x.IdDetalleCarrito == idDetalleCarrito);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var detalle = respuesta.ValorRetorno;

        detalle.IdCarrito = detalleDTO.IdCarrito;
        detalle.IdCaja = detalleDTO.IdCaja;
        detalle.Cantidad = detalleDTO.Cantidad;

        _unidadTrabajo.TDetalleCarrito.Modificar(detalle);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarDetalleCarrito(int idDetalleCarrito)
    {
        var respuesta = _unidadTrabajo.TDetalleCarrito.ObtenerEntidad(x => x.IdDetalleCarrito == idDetalleCarrito);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        _unidadTrabajo.TDetalleCarrito.Eliminar(respuesta.ValorRetorno);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}