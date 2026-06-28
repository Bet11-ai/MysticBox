using MysticBox.Dominio.Entidades;
using CajaMysticBox = MysticBox.Dominio.Entidades.MysticBox;

namespace MysticBox.Dominio.InterfacesAD;

public interface IUnidadTrabajoEF
{
    IRepositorioAD<Usuario> TUsuario { get; }

    IRepositorioAD<Role> TRol { get; }

    IRepositorioAD<Carrito> TCarrito { get; }

    IRepositorioAD<DetalleCarrito> TDetalleCarrito { get; }

    IRepositorioAD<Pedido> TPedido { get; }

    IRepositorioAD<DetallePedido> TDetallePedido { get; }

    IRepositorioAD<Entrega> TEntrega { get; }

    IRepositorioAD<Calificacione> TCalificacion { get; }

    IRepositorioAD<CajaMysticBox> TMysticBox { get; }

    int Completar();

    void CompletarTran();

    void EmpezarTransaccion();

    void Rollback();

    void CerrarConexion();
}