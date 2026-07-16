using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class EntregaLN : IEntregaLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public EntregaLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<Entrega>> ObtenerEntregas()
    {
        var respuesta = _unidadTrabajo.TEntrega.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<Entrega>());
    }

    public async Task<Entrega?> ObtenerEntregaPorId(int idEntrega)
    {
        var respuesta = _unidadTrabajo.TEntrega.ObtenerEntidad(x => x.IdEntrega == idEntrega);
        return await Task.FromResult(respuesta.ValorRetorno);
    }

    public async Task<Entrega> CrearEntrega(EntregaDTO entregaDTO)
    {
        var entrega = new Entrega
        {
            IdPedido = entregaDTO.IdPedido,
            DireccionEntrega = entregaDTO.DireccionEntrega,
            EstadoEntrega = entregaDTO.EstadoEntrega ?? "Pendiente",
            FechaEstimada = entregaDTO.FechaEstimada,
            FechaEntrega = entregaDTO.FechaEntrega,
            UbicacionReferencia = entregaDTO.UbicacionReferencia
        };

        _unidadTrabajo.TEntrega.Insertar(entrega);
        _unidadTrabajo.Completar();

        return await Task.FromResult(entrega);
    }

    public async Task<bool> ActualizarEntrega(int idEntrega, EntregaDTO entregaDTO)
    {
        var respuesta = _unidadTrabajo.TEntrega.ObtenerEntidad(x => x.IdEntrega == idEntrega);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var entrega = respuesta.ValorRetorno;

        entrega.IdPedido = entregaDTO.IdPedido;
        entrega.DireccionEntrega = entregaDTO.DireccionEntrega;
        entrega.EstadoEntrega = entregaDTO.EstadoEntrega;
        entrega.FechaEstimada = entregaDTO.FechaEstimada;
        entrega.FechaEntrega = entregaDTO.FechaEntrega;
        entrega.UbicacionReferencia = entregaDTO.UbicacionReferencia;

        _unidadTrabajo.TEntrega.Modificar(entrega);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarEntrega(int idEntrega)
    {
        var respuesta = _unidadTrabajo.TEntrega.ObtenerEntidad(x => x.IdEntrega == idEntrega);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        _unidadTrabajo.TEntrega.Eliminar(respuesta.ValorRetorno);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}