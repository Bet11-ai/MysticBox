using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class CalificacionLN : ICalificacionLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public CalificacionLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<Calificacione>> ObtenerCalificaciones()
    {
        var respuesta = _unidadTrabajo.TCalificacion.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<Calificacione>());
    }

    public async Task<Calificacione?> ObtenerCalificacionPorId(int idCalificacion)
    {
        var respuesta = _unidadTrabajo.TCalificacion.ObtenerEntidad(x => x.IdCalificacion == idCalificacion);
        return await Task.FromResult(respuesta.ValorRetorno);
    }

    public async Task<Calificacione> CrearCalificacion(CalificacionDTO calificacionDTO)
    {
        var calificacion = new Calificacione
        {
            IdPedido = calificacionDTO.IdPedido,
            Estrellas = calificacionDTO.Estrellas,
            Comentario = calificacionDTO.Comentario,
            FechaCalificacion = calificacionDTO.FechaCalificacion ?? DateTime.Now
        };

        _unidadTrabajo.TCalificacion.Insertar(calificacion);
        _unidadTrabajo.Completar();

        return await Task.FromResult(calificacion);
    }

    public async Task<bool> ActualizarCalificacion(int idCalificacion, CalificacionDTO calificacionDTO)
    {
        var respuesta = _unidadTrabajo.TCalificacion.ObtenerEntidad(x => x.IdCalificacion == idCalificacion);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var calificacion = respuesta.ValorRetorno;

        calificacion.IdPedido = calificacionDTO.IdPedido;
        calificacion.Estrellas = calificacionDTO.Estrellas;
        calificacion.Comentario = calificacionDTO.Comentario;
        calificacion.FechaCalificacion = calificacionDTO.FechaCalificacion;

        _unidadTrabajo.TCalificacion.Modificar(calificacion);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarCalificacion(int idCalificacion)
    {
        var respuesta = _unidadTrabajo.TCalificacion.ObtenerEntidad(x => x.IdCalificacion == idCalificacion);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        _unidadTrabajo.TCalificacion.Eliminar(respuesta.ValorRetorno);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}