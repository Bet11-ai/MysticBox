using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Categoria
{
    public int IdCategoria { get; set; }

    public string NombreCategoria { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<MysticBox> MysticBoxes { get; set; } = new List<MysticBox>();
}
