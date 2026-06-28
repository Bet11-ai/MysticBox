using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN;

public interface IAuthLN
{
    Task<Usuario?> Login(LoginDTO loginDTO);

    Task<Usuario> Registro(RegistroDTO registroDTO);
}