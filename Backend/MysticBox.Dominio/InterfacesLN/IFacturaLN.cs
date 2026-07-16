using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.InterfacesLN
{
    public interface IFacturaLN
    {
        Task<List<Factura>> ObtenerFacturas();

        Task<Factura> ObtenerFacturaPorId(int idFactura);

        Task<Factura> CrearFactura(FacturaDTO facturaDTO);

        Task<bool> ActualizarFactura(int idFactura, FacturaDTO facturaDTO);

        Task<bool> EliminarFactura(int idFactura);
    }
}
