using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class RolAD : IRolAD
{
    private readonly MysticBoxContext _context;

    public RolAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<Role>> ObtenerRoles()
    {
        return await _context.Roles.ToListAsync();
    }

    public async Task<Role?> ObtenerRolPorId(int idRol)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(x => x.IdRol == idRol);
    }

    public async Task<Role> CrearRol(RolDTO rolDTO)
    {
        var rol = new Role
        {
            NombreRol = rolDTO.NombreRol
        };

        _context.Roles.Add(rol);
        await _context.SaveChangesAsync();

        return rol;
    }

    public async Task<bool> ActualizarRol(int idRol, RolDTO rolDTO)
    {
        var rol = await _context.Roles
            .FirstOrDefaultAsync(x => x.IdRol == idRol);

        if (rol == null)
            return false;

        rol.NombreRol = rolDTO.NombreRol;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarRol(int idRol)
    {
        var rol = await _context.Roles
            .FirstOrDefaultAsync(x => x.IdRol == idRol);

        if (rol == null)
            return false;

        _context.Roles.Remove(rol);

        await _context.SaveChangesAsync();

        return true;
    }
}