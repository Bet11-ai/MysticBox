using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class RolLN : IRolLN
{
    private readonly IRolAD _rolAD;

    public RolLN(IRolAD rolAD)
    {
        _rolAD = rolAD;
    }

    public async Task<List<Role>> ObtenerRoles()
    {
        return await _rolAD.ObtenerRoles();
    }

    public async Task<Role?> ObtenerRolPorId(int idRol)
    {
        return await _rolAD.ObtenerRolPorId(idRol);
    }

    public async Task<Role> CrearRol(RolDTO rolDTO)
    {
        return await _rolAD.CrearRol(rolDTO);
    }

    public async Task<bool> ActualizarRol(int idRol, RolDTO rolDTO)
    {
        return await _rolAD.ActualizarRol(idRol, rolDTO);
    }

    public async Task<bool> EliminarRol(int idRol)
    {
        return await _rolAD.EliminarRol(idRol);
    }
}