using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class AuthLN : IAuthLN
{
    private readonly MysticBoxContext _context;

    public AuthLN(MysticBoxContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> Login(LoginDTO loginDTO)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(x =>
                x.Correo == loginDTO.Correo &&
                x.Contrasena == loginDTO.Contrasena);
    }

    public async Task<Usuario> Registro(RegistroDTO registroDTO)
    {
        var usuario = new Usuario
        {
            IdRol = registroDTO.IdRol,
            Nombre = registroDTO.Nombre,
            Correo = registroDTO.Correo,
            Telefono = registroDTO.Telefono,
            Direccion = registroDTO.Direccion,
            Contrasena = registroDTO.Contrasena,
            FechaRegistro = DateTime.Now,
            Estado = true
        };

        _context.Usuarios.Add(usuario);

        await _context.SaveChangesAsync();

        return usuario;
    }
}