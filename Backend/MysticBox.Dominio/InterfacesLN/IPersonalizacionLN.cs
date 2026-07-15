using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Dominio.InterfacesLN
{
    public interface IPersonalizacionLN
    {
        Task<List<PersonalizacionDTO>> ObtenerPersonalizaciones();

        Task<PersonalizacionDTO?> ObtenerPersonalizacionPorId(
            int idPersonalizacion
        );

        Task<PersonalizacionDTO> CrearPersonalizacion(
            PersonalizacionDTO personalizacionDTO
        );

        Task<PersonalizacionDTO?> ActualizarPersonalizacion(
            int idPersonalizacion,
            PersonalizacionDTO personalizacionDTO
        );
    }
}
