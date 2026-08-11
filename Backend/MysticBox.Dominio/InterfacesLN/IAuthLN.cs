using MysticBox.Dominio.DTO;

namespace MysticBox.Dominio.InterfacesLN;

public interface IAuthLN
{
    Task<LoginResponseDTO?> Login(
        LoginDTO loginDTO
    );

    Task<LoginResponseDTO> Registro(
        RegistroDTO registroDTO
    );

    Task<LoginResponseDTO> CrearAdministradorInicial(
        RegistroDTO registroDTO
    );

    Task<bool> RecuperarContrasena(
        RecuperarContrasenaDTO recuperarDTO
    );
}