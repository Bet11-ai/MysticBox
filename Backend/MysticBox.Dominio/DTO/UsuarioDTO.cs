using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO;

public class UsuarioDTO
{
    public int IdUsuario { get; set; }

    public int IdRol { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Correo { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public string Contrasena { get; set; } = string.Empty;

    public bool? Estado { get; set; }
}