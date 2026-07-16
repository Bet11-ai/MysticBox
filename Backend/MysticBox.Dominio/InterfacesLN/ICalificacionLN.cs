using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface ICalificacionLN
{
    Task<List<Calificacione>> ObtenerCalificaciones();

    Task<Calificacione?> ObtenerCalificacionPorId(int idCalificacion);

    Task<Calificacione> CrearCalificacion(CalificacionDTO calificacionDTO);

    Task<bool> ActualizarCalificacion(int idCalificacion, CalificacionDTO calificacionDTO);

    Task<bool> EliminarCalificacion(int idCalificacion);
}