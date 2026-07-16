namespace MysticBox.Dominio.DTO;

public class EntregaDTO
{
    public int IdEntrega { get; set; }

    public int IdPedido { get; set; }

    public string DireccionEntrega { get; set; } = string.Empty;

    public string? EstadoEntrega { get; set; }

    public DateOnly? FechaEstimada { get; set; }

    public DateOnly? FechaEntrega { get; set; }

    public string? UbicacionReferencia { get; set; }
}