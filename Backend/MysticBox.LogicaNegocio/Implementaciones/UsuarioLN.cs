using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class UsuarioLN : IUsuarioLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public UsuarioLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<Usuario>> ObtenerUsuarios()
    {
        var respuesta = _unidadTrabajo.TUsuario.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<Usuario>());
    }

    public async Task<Usuario?> ObtenerUsuarioPorId(int idUsuario)
    {
        var respuesta = _unidadTrabajo.TUsuario.ObtenerEntidad(x => x.IdUsuario == idUsuario);
        return await Task.FromResult(respuesta.ValorRetorno);
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

        _unidadTrabajo.TUsuario.Insertar(usuario);
        _unidadTrabajo.Completar();

        return await Task.FromResult(usuario);
    }

    public async Task<bool> ActualizarUsuario(int idUsuario, UsuarioDTO usuarioDTO)
    {
        var respuesta = _unidadTrabajo.TUsuario.ObtenerEntidad(x => x.IdUsuario == idUsuario);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var usuario = respuesta.ValorRetorno;

        usuario.IdRol = usuarioDTO.IdRol;
        usuario.Nombre = usuarioDTO.Nombre;
        usuario.Correo = usuarioDTO.Correo;
        usuario.Telefono = usuarioDTO.Telefono;
        usuario.Direccion = usuarioDTO.Direccion;
        usuario.Contrasena = usuarioDTO.Contrasena;
        usuario.Estado = usuarioDTO.Estado;

        _unidadTrabajo.TUsuario.Modificar(usuario);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarUsuario(int idUsuario)
    {
        var respuesta = _unidadTrabajo.TUsuario.ObtenerEntidad(x => x.IdUsuario == idUsuario);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var usuario = respuesta.ValorRetorno;
        usuario.Estado = false;

        _unidadTrabajo.TUsuario.Modificar(usuario);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}