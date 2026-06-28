using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.DTO;

namespace MysticBox.Dominio.InterfacesLN
{
    public interface ICuponLN
    {
        Task<List<Cupon>> ObtenerCupones();

        Task<Cupon?> ObtenerCuponPorId(int idCupon);

        Task<Cupon> CrearCupon(CuponDTO cuponDTO);

        Task<bool> ActualizarCupon(int idCupon, CuponDTO cuponDTO);

        Task<bool> EliminarCupon(int idCupon);
    }
}
