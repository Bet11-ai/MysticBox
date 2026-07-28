using Microsoft.AspNetCore.Identity;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class AuthLN : IAuthLN
{
    private const int RolAdministrador = 1;
    private const int RolCliente = 2;

    private readonly IUnidadTrabajoEF _unidadTrabajo;
    private readonly PasswordHasher<Usuario> _passwordHasher;

    public AuthLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
        _passwordHasher = new PasswordHasher<Usuario>();
    }

    public async Task<LoginResponseDTO?> Login(
        LoginDTO loginDTO
    )
    {
        var correo = loginDTO.Correo
            .Trim()
            .ToLower();

        var respuestaUsuario =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.Correo.ToLower() == correo &&
                        usuario.Estado == true
                );

        var usuario = respuestaUsuario.ValorRetorno;

        if (usuario == null)
        {
            return await Task.FromResult<LoginResponseDTO?>(
                null
            );
        }

        var resultadoContrasena =
            _passwordHasher.VerifyHashedPassword(
                usuario,
                usuario.Contrasena,
                loginDTO.Contrasena
            );

        if (
            resultadoContrasena ==
            PasswordVerificationResult.Failed
        )
        {
            return await Task.FromResult<LoginResponseDTO?>(
                null
            );
        }

        var respuestaRol =
            _unidadTrabajo
                .TRol
                .ObtenerEntidad(
                    rol =>
                        rol.IdRol == usuario.IdRol
                );

        var nombreRol =
            respuestaRol.ValorRetorno?.NombreRol ??
            "Sin rol";

        var respuesta = CrearRespuestaLogin(
            usuario,
            nombreRol
        );

        return await Task.FromResult(respuesta);
    }

    public async Task<LoginResponseDTO> Registro(
        RegistroDTO registroDTO
    )
    {
        var correo = registroDTO.Correo
            .Trim()
            .ToLower();

        var usuarioExistente =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.Correo.ToLower() == correo
                );

        if (usuarioExistente.ValorRetorno != null)
        {
            throw new InvalidOperationException(
                "El correo electrónico ya está registrado."
            );
        }

        /*
         * El registro público siempre crea clientes.
         * No se utiliza el IdRol enviado desde Ionic.
         */
        var usuario = new Usuario
        {
            IdRol = RolCliente,
            Nombre = registroDTO.Nombre.Trim(),
            Correo = correo,
            Telefono = registroDTO.Telefono?.Trim(),
            Direccion = registroDTO.Direccion?.Trim(),
            FechaRegistro = DateTime.Now,
            Estado = true,
            Contrasena = string.Empty
        };

        usuario.Contrasena =
            _passwordHasher.HashPassword(
                usuario,
                registroDTO.Contrasena
            );

        _unidadTrabajo
            .TUsuario
            .Insertar(usuario);

        _unidadTrabajo.Completar();

        var respuestaRol =
            _unidadTrabajo
                .TRol
                .ObtenerEntidad(
                    rol =>
                        rol.IdRol == usuario.IdRol
                );

        var nombreRol =
            respuestaRol.ValorRetorno?.NombreRol ??
            "Cliente";

        var respuesta = CrearRespuestaLogin(
            usuario,
            nombreRol
        );

        return await Task.FromResult(respuesta);
    }

    public async Task<LoginResponseDTO>
        CrearAdministradorInicial(
            RegistroDTO registroDTO
        )
    {
        /*
         * Solo permite crear un administrador
         * cuando todavía no existe ninguno activo.
         */
        var respuestaAdministrador =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.IdRol == RolAdministrador &&
                        usuario.Estado == true
                );

        if (
            respuestaAdministrador.ValorRetorno != null
        )
        {
            throw new InvalidOperationException(
                "Ya existe un administrador activo en la base de datos."
            );
        }

        var correo = registroDTO.Correo
            .Trim()
            .ToLower();

        var respuestaUsuarioExistente =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.Correo.ToLower() == correo
                );

        if (
            respuestaUsuarioExistente.ValorRetorno != null
        )
        {
            throw new InvalidOperationException(
                "El correo electrónico ya está registrado."
            );
        }

        var administrador = new Usuario
        {
            IdRol = RolAdministrador,
            Nombre = registroDTO.Nombre.Trim(),
            Correo = correo,
            Telefono = registroDTO.Telefono?.Trim(),
            Direccion = registroDTO.Direccion?.Trim(),
            FechaRegistro = DateTime.Now,
            Estado = true,
            Contrasena = string.Empty
        };

        administrador.Contrasena =
            _passwordHasher.HashPassword(
                administrador,
                registroDTO.Contrasena
            );

        _unidadTrabajo
            .TUsuario
            .Insertar(administrador);

        _unidadTrabajo.Completar();

        var respuestaRol =
            _unidadTrabajo
                .TRol
                .ObtenerEntidad(
                    rol =>
                        rol.IdRol == administrador.IdRol
                );

        var nombreRol =
            respuestaRol.ValorRetorno?.NombreRol ??
            "Administrador";

        var respuesta = CrearRespuestaLogin(
            administrador,
            nombreRol
        );

        return await Task.FromResult(respuesta);
    }

    private static LoginResponseDTO CrearRespuestaLogin(
        Usuario usuario,
        string nombreRol
    )
    {
        return new LoginResponseDTO
        {
            IdUsuario = usuario.IdUsuario,
            IdRol = usuario.IdRol,
            NombreRol = nombreRol,
            Nombre = usuario.Nombre,
            Correo = usuario.Correo,
            Telefono = usuario.Telefono,
            Direccion = usuario.Direccion,
            FechaRegistro = usuario.FechaRegistro,
            Estado = usuario.Estado
        };
    }
}