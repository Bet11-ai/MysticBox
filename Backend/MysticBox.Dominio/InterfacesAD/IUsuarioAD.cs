using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesAD;

public interface IUsuarioAD
{
    Task<List<Usuario>> ObtenerUsuarios();

    Task<Usuario?> ObtenerUsuarioPorId(int idUsuario);

    Task<Usuario> CrearUsuario(UsuarioDTO usuarioDTO);

    Task<bool> ActualizarUsuario(int idUsuario, UsuarioDTO usuarioDTO);

    Task<bool> EliminarUsuario(int idUsuario);
}