using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface IRolLN
{
    Task<List<Role>> ObtenerRoles();

    Task<Role?> ObtenerRolPorId(int idRol);

    Task<Role> CrearRol(RolDTO rolDTO);

    Task<bool> ActualizarRol(int idRol, RolDTO rolDTO);

    Task<bool> EliminarRol(int idRol);
}