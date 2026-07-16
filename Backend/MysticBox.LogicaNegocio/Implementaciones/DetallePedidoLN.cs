using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class DetallePedidoLN : IDetallePedidoLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public DetallePedidoLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<DetallePedido>> ObtenerDetallesPedido()
    {
        var respuesta = _unidadTrabajo.TDetallePedido.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<DetallePedido>());
    }

    public async Task<DetallePedido?> ObtenerDetallePedidoPorId(int idDetallePedido)
    {
        var respuesta = _unidadTrabajo.TDetallePedido.ObtenerEntidad(x => x.IdDetallePedido == idDetallePedido);
        return await Task.FromResult(respuesta.ValorRetorno);
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

        _unidadTrabajo.TDetallePedido.Insertar(detalle);
        _unidadTrabajo.Completar();

        return await Task.FromResult(detalle);
    }

    public async Task<bool> ActualizarDetallePedido(int idDetallePedido, DetallePedidoDTO detalleDTO)
    {
        var respuesta = _unidadTrabajo.TDetallePedido.ObtenerEntidad(x => x.IdDetallePedido == idDetallePedido);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var detalle = respuesta.ValorRetorno;

        detalle.IdPedido = detalleDTO.IdPedido;
        detalle.IdCaja = detalleDTO.IdCaja;
        detalle.IdPersonalizacion = detalleDTO.IdPersonalizacion;
        detalle.Cantidad = detalleDTO.Cantidad;
        detalle.PrecioUnitario = detalleDTO.PrecioUnitario;
        detalle.Subtotal = detalleDTO.Subtotal;

        _unidadTrabajo.TDetallePedido.Modificar(detalle);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarDetallePedido(int idDetallePedido)
    {
        var respuesta = _unidadTrabajo.TDetallePedido.ObtenerEntidad(x => x.IdDetallePedido == idDetallePedido);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        _unidadTrabajo.TDetallePedido.Eliminar(respuesta.ValorRetorno);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}