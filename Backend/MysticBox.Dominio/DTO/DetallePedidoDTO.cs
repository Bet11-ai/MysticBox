namespace MysticBox.Dominio.DTO;

public class DetallePedidoDTO
{
    public int IdDetallePedido { get; set; }

    public int IdPedido { get; set; }

    public int IdCaja { get; set; }

    public int? IdPersonalizacion { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal? Subtotal { get; set; }
}