using MysticBox.Dominio.DTO;

namespace MysticBox.Dominio.InterfacesLN;

public interface IUsuarioLN
{
    Task<List<UsuarioDTO>>
        ObtenerClientes();

    Task<UsuarioDTO?>
        ObtenerClientePorId(
            int idUsuario
        );

    Task<bool>
        ActualizarCliente(
            int idUsuario,
            ActualizarUsuarioDTO usuarioDTO
        );

    Task<bool>
        CambiarEstadoCliente(
            int idUsuario,
            bool estado
        );
}