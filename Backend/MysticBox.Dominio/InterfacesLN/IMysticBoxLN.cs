using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesLN
{
    public interface IMysticBoxLN
    {
        Task<List<MysticBox.Dominio.Entidades.MysticBox>> ObtenerMysticBoxes();

        Task<MysticBox.Dominio.Entidades.MysticBox?> ObtenerMysticBoxPorId(int idCaja);

        Task<MysticBox.Dominio.Entidades.MysticBox> CrearMysticBox(MysticBoxDTO mysticBoxDTO);
        Task<bool> ActualizarMysticBox(int idCaja, MysticBoxDTO mysticBoxDTO);

        Task<bool> EliminarMysticBox(int idCaja);
    }
}
