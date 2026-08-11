namespace MysticBox.Dominio.DTO
{
    public class MysticBoxDTO
    {
        public int IdCategoria { get; set; }

        public string NombreCaja { get; set; } = null!;

        public string? Descripcion { get; set; }

        public decimal Precio { get; set; }

        public string? Imagen { get; set; }

        public int Stock { get; set; }

        public bool? Estado { get; set; }

        public bool? EsOferta { get; set; }

        public decimal? PorcentajeOferta { get; set; }

        public bool? EsRecomendada { get; set; }

        public bool? EsDestacada { get; set; }
    }
}
