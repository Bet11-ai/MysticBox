using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class CalificacionAD : ICalificacionAD
{
    private readonly MysticBoxContext _context;

    public CalificacionAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<Calificacione>> ObtenerCalificaciones()
    {
        return await _context.Calificaciones.ToListAsync();
    }

    public async Task<Calificacione?> ObtenerCalificacionPorId(int idCalificacion)
    {
        return await _context.Calificaciones
            .FirstOrDefaultAsync(x => x.IdCalificacion == idCalificacion);
    }

    public async Task<Calificacione> CrearCalificacion(CalificacionDTO calificacionDTO)
    {
        var calificacion = new Calificacione
        {
            IdPedido = calificacionDTO.IdPedido,
            Estrellas = calificacionDTO.Estrellas,
            Comentario = calificacionDTO.Comentario,
            FechaCalificacion = calificacionDTO.FechaCalificacion
        };

        _context.Calificaciones.Add(calificacion);
        await _context.SaveChangesAsync();

        return calificacion;
    }

    public async Task<bool> ActualizarCalificacion(int idCalificacion, CalificacionDTO calificacionDTO)
    {
        var calificacion = await _context.Calificaciones
            .FirstOrDefaultAsync(x => x.IdCalificacion == idCalificacion);

        if (calificacion == null)
            return false;

        calificacion.IdPedido = calificacionDTO.IdPedido;
        calificacion.Estrellas = calificacionDTO.Estrellas;
        calificacion.Comentario = calificacionDTO.Comentario;
        calificacion.FechaCalificacion = calificacionDTO.FechaCalificacion;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarCalificacion(int idCalificacion)
    {
        var calificacion = await _context.Calificaciones
            .FirstOrDefaultAsync(x => x.IdCalificacion == idCalificacion);

        if (calificacion == null)
            return false;

        _context.Calificaciones.Remove(calificacion);

        await _context.SaveChangesAsync();

        return true;
    }
}