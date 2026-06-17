using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class EntregaLN : IEntregaLN
{
    private readonly IEntregaAD _entregaAD;

    public EntregaLN(IEntregaAD entregaAD)
    {
        _entregaAD = entregaAD;
    }

    public async Task<List<Entrega>> ObtenerEntregas()
    {
        return await _entregaAD.ObtenerEntregas();
    }

    public async Task<Entrega?> ObtenerEntregaPorId(int idEntrega)
    {
        return await _entregaAD.ObtenerEntregaPorId(idEntrega);
    }

    public async Task<Entrega> CrearEntrega(EntregaDTO entregaDTO)
    {
        return await _entregaAD.CrearEntrega(entregaDTO);
    }

    public async Task<bool> ActualizarEntrega(int idEntrega, EntregaDTO entregaDTO)
    {
        return await _entregaAD.ActualizarEntrega(idEntrega, entregaDTO);
    }

    public async Task<bool> EliminarEntrega(int idEntrega)
    {
        return await _entregaAD.EliminarEntrega(idEntrega);
    }
}