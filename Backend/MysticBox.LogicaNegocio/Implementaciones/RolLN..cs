using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class RolLN : IRolLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public RolLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<Role>> ObtenerRoles()
    {
        var respuesta = _unidadTrabajo.TRol.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<Role>());
    }

    public async Task<Role?> ObtenerRolPorId(int idRol)
    {
        var respuesta = _unidadTrabajo.TRol.ObtenerEntidad(x => x.IdRol == idRol);
        return await Task.FromResult(respuesta.ValorRetorno);
    }

    public async Task<Role> CrearRol(RolDTO rolDTO)
    {
        var rol = new Role
        {
            NombreRol = rolDTO.NombreRol
        };

        _unidadTrabajo.TRol.Insertar(rol);
        _unidadTrabajo.Completar();

        return await Task.FromResult(rol);
    }

    public async Task<bool> ActualizarRol(int idRol, RolDTO rolDTO)
    {
        var respuesta = _unidadTrabajo.TRol.ObtenerEntidad(x => x.IdRol == idRol);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var rol = respuesta.ValorRetorno;
        rol.NombreRol = rolDTO.NombreRol;

        _unidadTrabajo.TRol.Modificar(rol);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarRol(int idRol)
    {
        var respuesta = _unidadTrabajo.TRol.ObtenerEntidad(x => x.IdRol == idRol);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        _unidadTrabajo.TRol.Eliminar(respuesta.ValorRetorno);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}