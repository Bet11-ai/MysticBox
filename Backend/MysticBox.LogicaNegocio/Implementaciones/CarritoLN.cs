using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class CarritoLN : ICarritoLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public CarritoLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<Carrito>> ObtenerCarritos()
    {
        var respuesta = _unidadTrabajo.TCarrito.Listar();
        return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<Carrito>());
    }

    public async Task<Carrito?> ObtenerCarritoPorId(int idCarrito)
    {
        var respuesta = _unidadTrabajo.TCarrito.ObtenerEntidad(x => x.IdCarrito == idCarrito);
        return await Task.FromResult(respuesta.ValorRetorno);
    }

    public async Task<Carrito> CrearCarrito(CarritoDTO carritoDTO)
    {
        var carrito = new Carrito
        {
            IdUsuario = carritoDTO.IdUsuario,
            FechaCreacion = carritoDTO.FechaCreacion ?? DateTime.Now,
            Estado = carritoDTO.Estado ?? "Activo"
        };

        _unidadTrabajo.TCarrito.Insertar(carrito);
        _unidadTrabajo.Completar();

        return await Task.FromResult(carrito);
    }

    public async Task<bool> ActualizarCarrito(int idCarrito, CarritoDTO carritoDTO)
    {
        var respuesta = _unidadTrabajo.TCarrito.ObtenerEntidad(x => x.IdCarrito == idCarrito);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        var carrito = respuesta.ValorRetorno;

        carrito.IdUsuario = carritoDTO.IdUsuario;
        carrito.FechaCreacion = carritoDTO.FechaCreacion;
        carrito.Estado = carritoDTO.Estado;

        _unidadTrabajo.TCarrito.Modificar(carrito);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }

    public async Task<bool> EliminarCarrito(int idCarrito)
    {
        var respuesta = _unidadTrabajo.TCarrito.ObtenerEntidad(x => x.IdCarrito == idCarrito);

        if (respuesta.ValorRetorno == null)
            return await Task.FromResult(false);

        _unidadTrabajo.TCarrito.Eliminar(respuesta.ValorRetorno);
        _unidadTrabajo.Completar();

        return await Task.FromResult(true);
    }
}