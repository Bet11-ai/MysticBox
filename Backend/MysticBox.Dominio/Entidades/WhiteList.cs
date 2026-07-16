using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class WhiteList
{
    public int IdWhiteList { get; set; }

    public string Correo { get; set; } = null!;

    public bool? Activo { get; set; }

    public DateTime? FechaRegistro { get; set; }
}
