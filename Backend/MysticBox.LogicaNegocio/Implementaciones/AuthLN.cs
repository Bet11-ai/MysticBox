using Microsoft.AspNetCore.Identity;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;
using Microsoft.AspNetCore.Identity;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class AuthLN : IAuthLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;
    private readonly PasswordHasher<Usuario> _passwordHasher;

    public AuthLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
        _passwordHasher = new PasswordHasher<Usuario>();
    }

    public async Task<Usuario?> Login(LoginDTO loginDTO)
    {
        var usuario = _unidadTrabajo.TUsuario.ObtenerEntidad(x =>
            x.Correo == loginDTO.Correo &&
            x.Estado == true);

        if (usuario.ValorRetorno == null)
        {
            return await Task.FromResult<Usuario?>(null);
        }

        var resultado = _passwordHasher.VerifyHashedPassword(
            usuario.ValorRetorno,
            usuario.ValorRetorno.Contrasena,
            loginDTO.Contrasena
        );

        if (resultado == PasswordVerificationResult.Failed)
        {
            return await Task.FromResult<Usuario?>(null);
        }

        return await Task.FromResult(usuario.ValorRetorno);
    }

    public async Task<Usuario> Registro(RegistroDTO registroDTO)
    {
        var usuarioExistente = _unidadTrabajo.TUsuario.ObtenerEntidad(x =>
            x.Correo == registroDTO.Correo);

        if (usuarioExistente.ValorRetorno != null)
        {
            throw new Exception("El correo electrónico ya está registrado.");
        }

        var usuario = new Usuario
        {
            IdRol = registroDTO.IdRol,
            Nombre = registroDTO.Nombre,
            Correo = registroDTO.Correo,
            Telefono = registroDTO.Telefono,
            Direccion = registroDTO.Direccion,
            FechaRegistro = DateTime.Now,
            Estado = true
        };

        usuario.Contrasena = _passwordHasher.HashPassword(
            usuario,
            registroDTO.Contrasena
        );

        _unidadTrabajo.TUsuario.Insertar(usuario);
        _unidadTrabajo.Completar();

        return await Task.FromResult(usuario);
    }
}