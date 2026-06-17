using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class CalificacionLN : ICalificacionLN
{
    private readonly ICalificacionAD _calificacionAD;

    public CalificacionLN(ICalificacionAD calificacionAD)
    {
        _calificacionAD = calificacionAD;
    }

    public async Task<List<Calificacione>> ObtenerCalificaciones()
    {
        return await _calificacionAD.ObtenerCalificaciones();
    }

    public async Task<Calificacione?> ObtenerCalificacionPorId(int idCalificacion)
    {
        return await _calificacionAD.ObtenerCalificacionPorId(idCalificacion);
    }

    public async Task<Calificacione> CrearCalificacion(CalificacionDTO calificacionDTO)
    {
        return await _calificacionAD.CrearCalificacion(calificacionDTO);
    }

    public async Task<bool> ActualizarCalificacion(int idCalificacion, CalificacionDTO calificacionDTO)
    {
        return await _calificacionAD.ActualizarCalificacion(idCalificacion, calificacionDTO);
    }

    public async Task<bool> EliminarCalificacion(int idCalificacion)
    {
        return await _calificacionAD.EliminarCalificacion(idCalificacion);
    }
}