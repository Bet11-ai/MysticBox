using MysticBox.Dominio.Entidades;


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

    //IRepositorioAD<Dominio.Entidades.MysticBox> TMysticBox { get; }//

    IRepositorioAD<MysticBox.Dominio.Entidades.MysticBox> TMysticBox { get; }



    IRepositorioAD<Cupon> TCupon { get; }

    IRepositorioAD <Factura> TFactura { get; }
    
    IRepositorioAD <WhiteList> TWhiteList { get; }

    int Completar();

    void CompletarTran();

    void EmpezarTransaccion();

    void Rollback();

    void CerrarConexion();
}