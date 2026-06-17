using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class UsuarioLN : IUsuarioLN
{
    private readonly IUsuarioAD _usuarioAD;

    public UsuarioLN(IUsuarioAD usuarioAD)
    {
        _usuarioAD = usuarioAD;
    }

    public async Task<List<Usuario>> ObtenerUsuarios()
    {
        return await _usuarioAD.ObtenerUsuarios();
    }

    public async Task<Usuario?> ObtenerUsuarioPorId(int idUsuario)
    {
        return await _usuarioAD.ObtenerUsuarioPorId(idUsuario);
    }

    public async Task<Usuario> CrearUsuario(UsuarioDTO usuarioDTO)
    {
        return await _usuarioAD.CrearUsuario(usuarioDTO);
    }

    public async Task<bool> ActualizarUsuario(int idUsuario, UsuarioDTO usuarioDTO)
    {
        return await _usuarioAD.ActualizarUsuario(idUsuario, usuarioDTO);
    }

    public async Task<bool> EliminarUsuario(int idUsuario)
    {
        return await _usuarioAD.EliminarUsuario(idUsuario);
    }
}