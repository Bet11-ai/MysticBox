using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class UsuarioLN : IUsuarioLN
{
    private const int RolCliente = 2;

    private readonly IUnidadTrabajoEF
        _unidadTrabajo;

    public UsuarioLN(
        IUnidadTrabajoEF unidadTrabajo
    )
    {
        _unidadTrabajo =
            unidadTrabajo;
    }

    public async Task<List<UsuarioDTO>>
        ObtenerClientes()
    {
        var respuesta =
            _unidadTrabajo
                .TUsuario
                .Listar();

        var usuarios =
            respuesta
                .ValorRetorno
                ?.ToList() ??
            new List<Usuario>();

        var clientes =
            usuarios
                .Where(
                    usuario =>
                        usuario.IdRol ==
                        RolCliente
                )
                .OrderByDescending(
                    usuario =>
                        usuario.FechaRegistro
                )
                .ThenBy(
                    usuario =>
                        usuario.Nombre
                )
                .Select(
                    MapearUsuarioDTO
                )
                .ToList();

        return await Task.FromResult(
            clientes
        );
    }

    public async Task<UsuarioDTO?>
        ObtenerClientePorId(
            int idUsuario
        )
    {
        var respuesta =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.IdUsuario ==
                        idUsuario &&
                        usuario.IdRol ==
                        RolCliente
                );

        if (
            respuesta.ValorRetorno ==
            null
        )
        {
            return await Task
                .FromResult<UsuarioDTO?>(
                    null
                );
        }

        var cliente =
            MapearUsuarioDTO(
                respuesta.ValorRetorno
            );

        return await Task.FromResult(
            cliente
        );
    }

    public async Task<bool>
        ActualizarCliente(
            int idUsuario,
            ActualizarUsuarioDTO usuarioDTO
        )
    {
        var respuesta =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.IdUsuario ==
                        idUsuario &&
                        usuario.IdRol ==
                        RolCliente
                );

        if (
            respuesta.ValorRetorno ==
            null
        )
        {
            return await Task.FromResult(
                false
            );
        }

        var correo =
            usuarioDTO.Correo
                .Trim()
                .ToLower();

        var correoExistente =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.Correo
                            .ToLower() ==
                        correo &&
                        usuario.IdUsuario !=
                        idUsuario
                );

        if (
            correoExistente
                .ValorRetorno != null
        )
        {
            throw new
                InvalidOperationException(
                    "El correo electrónico ya está registrado por otro usuario."
                );
        }

        var usuario =
            respuesta.ValorRetorno;

        usuario.Nombre =
            usuarioDTO.Nombre.Trim();

        usuario.Correo =
            correo;

        usuario.Telefono =
            usuarioDTO.Telefono
                ?.Trim();

        usuario.Direccion =
            usuarioDTO.Direccion
                ?.Trim();

        /*
         * No se modifica:
         *
         * - IdRol
         * - Contrasena
         * - FechaRegistro
         *
         * Esos datos no deben cambiar
         * desde administración de clientes.
         */

        _unidadTrabajo
            .TUsuario
            .Modificar(usuario);

        _unidadTrabajo.Completar();

        return await Task.FromResult(
            true
        );
    }

    public async Task<bool>
        CambiarEstadoCliente(
            int idUsuario,
            bool estado
        )
    {
        var respuesta =
            _unidadTrabajo
                .TUsuario
                .ObtenerEntidad(
                    usuario =>
                        usuario.IdUsuario ==
                        idUsuario &&
                        usuario.IdRol ==
                        RolCliente
                );

        if (
            respuesta.ValorRetorno ==
            null
        )
        {
            return await Task.FromResult(
                false
            );
        }

        var usuario =
            respuesta.ValorRetorno;

        usuario.Estado =
            estado;

        _unidadTrabajo
            .TUsuario
            .Modificar(usuario);

        _unidadTrabajo.Completar();

        return await Task.FromResult(
            true
        );
    }

    private static UsuarioDTO
        MapearUsuarioDTO(
            Usuario usuario
        )
    {
        return new UsuarioDTO
        {
            IdUsuario =
                usuario.IdUsuario,

            IdRol =
                usuario.IdRol,

            NombreRol =
                usuario.IdRol ==
                RolCliente
                    ? "Cliente"
                    : "Usuario",

            Nombre =
                usuario.Nombre,

            Correo =
                usuario.Correo,

            Telefono =
                usuario.Telefono,

            Direccion =
                usuario.Direccion,

            FechaRegistro =
                usuario.FechaRegistro,

            Estado =
                usuario.Estado ??
                false
        };
    }
}