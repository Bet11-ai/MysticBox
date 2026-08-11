namespace MysticBox.Dominio.DTO;

public class RecuperarContrasenaDTO
{
    public string Correo { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string NuevaContrasena { get; set; } = string.Empty;
}
