using MysticBox.Dominio.Entidades;

using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class MysticBox
{
    public int IdCaja { get; set; }

    public int IdCategoria { get; set; }

    public string NombreCaja { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal Precio { get; set; }

    public string? Imagen { get; set; }

    public int Stock { get; set; }

    public bool? Estado { get; set; }

    public virtual ICollection<DetalleCarrito> DetalleCarritos { get; set; } = new List<DetalleCarrito>();

    public virtual ICollection<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();

    public virtual Categoria IdCategoriaNavigation { get; set; } = null!;

    public virtual ICollection<Personalizacione> Personalizaciones { get; set; } = new List<Personalizacione>();
}
