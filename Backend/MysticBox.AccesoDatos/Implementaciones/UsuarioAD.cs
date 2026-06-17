using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;

namespace MysticBox.AccesoDatos.Implementaciones;

public class UsuarioAD : IUsuarioAD
{
    private readonly MysticBoxContext _context;

    public UsuarioAD(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<List<Usuario>> ObtenerUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }

    public async Task<Usuario?> ObtenerUsuarioPorId(int idUsuario)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(x => x.IdUsuario == idUsuario);
    }

    public async Task<Usuario> CrearUsuario(UsuarioDTO usuarioDTO)
    {
        var usuario = new Usuario
        {
            IdRol = usuarioDTO.IdRol,
            Nombre = usuarioDTO.Nombre,
            Correo = usuarioDTO.Correo,
            Telefono = usuarioDTO.Telefono,
            Direccion = usuarioDTO.Direccion,
            Contrasena = usuarioDTO.Contrasena,
            FechaRegistro = DateTime.Now,
            Estado = usuarioDTO.Estado ?? true
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return usuario;
    }

    public async Task<bool> ActualizarUsuario(int idUsuario, UsuarioDTO usuarioDTO)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(x => x.IdUsuario == idUsuario);

        if (usuario == null)
            return false;

        usuario.IdRol = usuarioDTO.IdRol;
        usuario.Nombre = usuarioDTO.Nombre;
        usuario.Correo = usuarioDTO.Correo;
        usuario.Telefono = usuarioDTO.Telefono;
        usuario.Direccion = usuarioDTO.Direccion;
        usuario.Contrasena = usuarioDTO.Contrasena;
        usuario.Estado = usuarioDTO.Estado;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarUsuario(int idUsuario)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(x => x.IdUsuario == idUsuario);

        if (usuario == null)
            return false;

        usuario.Estado = false;

        await _context.SaveChangesAsync();

        return true;
    }
}