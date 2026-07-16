namespace MysticBox.Dominio.DTO;

public class CalificacionDTO
{
    public int IdCalificacion { get; set; }

    public int IdPedido { get; set; }

    public int Estrellas { get; set; }

    public string? Comentario { get; set; }

    public DateTime? FechaCalificacion { get; set; }
}