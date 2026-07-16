using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.InterfacesLN
{
    public interface IWhiteListLN
    {
        Task<List<WhiteList>> ObtenerWhiteLists();

        Task<WhiteList?> ObtenerWhiteListPorId(int idWhiteList);

        Task<WhiteList> CrearWhiteList(WhiteListDTO whiteListDTO);

        Task<bool> ActualizarWhiteList(int idWhiteList, WhiteListDTO whiteListDTO);

        Task<bool> EliminarWhiteList(int idWhiteList);
    }
}
