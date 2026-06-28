using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO
{
    public class CuponDTO
    {
        public string Codigo { get; set; } = null!;

        public string? Descripcion {  get; set; }

        public decimal? PorcentajeDescuento { get; set; }

        public decimal? MontoDescuento { get; set; }

        public DateOnly FechaInicio { get; set; }

        public DateOnly FechaFin {  get; set; }

        public bool? Activo {  get; set; }
    }
}
