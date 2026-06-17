using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;

namespace MysticBox.Dominio.InterfacesAD;

public interface ICarritoAD
{
    Task<List<Carrito>> ObtenerCarritos();

    Task<Carrito?> ObtenerCarritoPorId(int idCarrito);

    Task<Carrito> CrearCarrito(CarritoDTO carritoDTO);

    Task<bool> ActualizarCarrito(int idCarrito, CarritoDTO carritoDTO);

    Task<bool> EliminarCarrito(int idCarrito);
}