namespace MysticBox.Dominio.DTO;

public class UsuarioDTO
{
    public int IdUsuario { get; set; }

    public int IdRol { get; set; }

    public string NombreRol { get; set; } =
        string.Empty;

    public string Nombre { get; set; } =
        string.Empty;

    public string Correo { get; set; } =
        string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public bool Estado { get; set; }
}

public class ActualizarUsuarioDTO
{
    public string Nombre { get; set; } =
        string.Empty;

    public string Correo { get; set; } =
        string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }
}

public class CambiarEstadoUsuarioDTO
{
    public bool Estado { get; set; }
}