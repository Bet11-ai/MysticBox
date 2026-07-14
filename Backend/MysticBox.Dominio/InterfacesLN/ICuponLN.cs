using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN
{
    public interface ICuponLN
    {
        Task<List<Cupon>> ObtenerCupones();

        Task<Cupon?> ObtenerCuponPorId(int idCupon);

        Task<Cupon?> ObtenerCuponPorCodigo(string codigo);

        Task<Cupon> CrearCupon(CuponDTO cuponDTO);

        Task<bool> ActualizarCupon(int idCupon, CuponDTO cuponDTO);

        Task<bool> EliminarCupon(int idCupon);
    }
}