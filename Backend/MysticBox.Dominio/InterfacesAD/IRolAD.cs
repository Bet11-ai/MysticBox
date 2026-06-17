using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesAD;

public interface IRolAD
{
    Task<List<Role>> ObtenerRoles();

    Task<Role?> ObtenerRolPorId(int idRol);

    Task<Role> CrearRol(RolDTO rolDTO);

    Task<bool> ActualizarRol(int idRol, RolDTO rolDTO);

    Task<bool> EliminarRol(int idRol);
}