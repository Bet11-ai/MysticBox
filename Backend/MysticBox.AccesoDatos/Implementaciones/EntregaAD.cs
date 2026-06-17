using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class EntregaAD : IEntregaAD
{
    private readonly MysticBoxContext _context;

    public EntregaAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<Entrega>> ObtenerEntregas()
    {
        return await _context.Entregas.ToListAsync();
    }

    public async Task<Entrega?> ObtenerEntregaPorId(int idEntrega)
    {
        return await _context.Entregas
            .FirstOrDefaultAsync(x => x.IdEntrega == idEntrega);
    }

    public async Task<Entrega> CrearEntrega(EntregaDTO entregaDTO)
    {
        var entrega = new Entrega
        {
            IdPedido = entregaDTO.IdPedido,
            DireccionEntrega = entregaDTO.DireccionEntrega,
            EstadoEntrega = entregaDTO.EstadoEntrega,
            FechaEstimada = entregaDTO.FechaEstimada,
            FechaEntrega = entregaDTO.FechaEntrega,
            UbicacionReferencia = entregaDTO.UbicacionReferencia
        };

        _context.Entregas.Add(entrega);
        await _context.SaveChangesAsync();

        return entrega;
    }

    public async Task<bool> ActualizarEntrega(int idEntrega, EntregaDTO entregaDTO)
    {
        var entrega = await _context.Entregas
            .FirstOrDefaultAsync(x => x.IdEntrega == idEntrega);

        if (entrega == null)
            return false;

        entrega.IdPedido = entregaDTO.IdPedido;
        entrega.DireccionEntrega = entregaDTO.DireccionEntrega;
        entrega.EstadoEntrega = entregaDTO.EstadoEntrega;
        entrega.FechaEstimada = entregaDTO.FechaEstimada;
        entrega.FechaEntrega = entregaDTO.FechaEntrega;
        entrega.UbicacionReferencia = entregaDTO.UbicacionReferencia;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarEntrega(int idEntrega)
    {
        var entrega = await _context.Entregas
            .FirstOrDefaultAsync(x => x.IdEntrega == idEntrega);

        if (entrega == null)
            return false;

        _context.Entregas.Remove(entrega);
        await _context.SaveChangesAsync();

        return true;
    }
}