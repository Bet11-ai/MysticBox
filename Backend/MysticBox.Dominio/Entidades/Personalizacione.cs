using MysticBox.Dominio.Entidades;
using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Personalizacione
{
    public int IdPersonalizacion { get; set; }

    public int IdUsuario { get; set; }

    public int IdCaja { get; set; }

    public string? TamanoCaja { get; set; }

    public string? Preferencias { get; set; }

    public string? Exclusiones { get; set; }

    public string? MensajePersonalizado { get; set; }

    public DateTime? FechaPersonalizacion { get; set; }

    public virtual ICollection<DetalleCarrito> DetalleCarritos { get; set; } = new List<DetalleCarrito>();

    public virtual ICollection<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();

    public virtual MysticBox IdCajaNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
