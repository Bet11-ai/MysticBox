using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO;

public class CarritoDTO
{
    public int IdCarrito { get; set; }

    public int IdUsuario { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public string? Estado { get; set; }
}