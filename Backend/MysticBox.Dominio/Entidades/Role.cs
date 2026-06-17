using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Role
{
    public int IdRol { get; set; }

    public string NombreRol { get; set; } = null!;

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
