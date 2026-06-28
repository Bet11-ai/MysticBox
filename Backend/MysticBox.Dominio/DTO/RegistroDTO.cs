namespace MysticBox.Dominio.DTO;

public class RegistroDTO
{
    public int IdRol { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Correo { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public string Contrasena { get; set; } = string.Empty;
}