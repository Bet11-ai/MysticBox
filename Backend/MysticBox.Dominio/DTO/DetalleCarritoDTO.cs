namespace MysticBox.Dominio.DTO;

public class DetalleCarritoDTO
{
    public int IdDetalleCarrito { get; set; }

    public int IdCarrito { get; set; }

    public int IdCaja { get; set; }

    public int? IdPersonalizacion { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal? Subtotal { get; set; }
}