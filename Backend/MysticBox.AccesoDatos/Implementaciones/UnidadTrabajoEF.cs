using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;



namespace MysticBox.AccesoDatos.Implementaciones;

public class UnidadTrabajoEF : IUnidadTrabajoEF, IDisposable
{
    private MysticBoxContext _contexto { get; set; }

    private IDbContextTransaction? _transaction = null;

    private RepositorioAD<Usuario>? _TUsuario;
    private RepositorioAD<Role>? _TRol;
    private RepositorioAD<Carrito>? _TCarrito;
    private RepositorioAD<DetalleCarrito>? _TDetalleCarrito;
    private RepositorioAD<Pedido>? _TPedido;
    private RepositorioAD<DetallePedido>? _TDetallePedido;
    private RepositorioAD<Entrega>? _TEntrega;
    private RepositorioAD<Calificacione>? _TCalificacion;

    //private RepositorioAD<CajaMysticBox>? _TMysticBox;

    private RepositorioAD<MysticBox.Dominio.Entidades.MysticBox>? _TMysticBox;

    private RepositorioAD<Cupon>? _TCupon;
    private RepositorioAD<Factura>? _TFactura;
    private RepositorioAD<WhiteList>? _TWhiteList;

    public UnidadTrabajoEF(MysticBoxContext contexto)
    {
        _contexto = contexto;
    }

    public IRepositorioAD<Usuario> TUsuario
    {
        get
        {
            _TUsuario ??= new RepositorioAD<Usuario>(_contexto);
            return _TUsuario;
        }
    }

    public IRepositorioAD<Role> TRol
    {
        get
        {
            _TRol ??= new RepositorioAD<Role>(_contexto);
            return _TRol;
        }
    }

    public IRepositorioAD<Carrito> TCarrito
    {
        get
        {
            _TCarrito ??= new RepositorioAD<Carrito>(_contexto);
            return _TCarrito;
        }
    }

    public IRepositorioAD<DetalleCarrito> TDetalleCarrito
    {
        get
        {
            _TDetalleCarrito ??= new RepositorioAD<DetalleCarrito>(_contexto);
            return _TDetalleCarrito;
        }
    }

    public IRepositorioAD<Pedido> TPedido
    {
        get
        {
            _TPedido ??= new RepositorioAD<Pedido>(_contexto);
            return _TPedido;
        }
    }

    public IRepositorioAD<DetallePedido> TDetallePedido
    {
        get
        {
            _TDetallePedido ??= new RepositorioAD<DetallePedido>(_contexto);
            return _TDetallePedido;
        }
    }

    public IRepositorioAD<Entrega> TEntrega
    {
        get
        {
            _TEntrega ??= new RepositorioAD<Entrega>(_contexto);
            return _TEntrega;
        }
    }

    public IRepositorioAD<Calificacione> TCalificacion
    {
        get
        {
            _TCalificacion ??= new RepositorioAD<Calificacione>(_contexto);
            return _TCalificacion;
        }
    }

    public IRepositorioAD<MysticBox.Dominio.Entidades.MysticBox> TMysticBox
    {
        get
        {
            _TMysticBox ??= new RepositorioAD<MysticBox.Dominio.Entidades.MysticBox>(_contexto);
            return _TMysticBox;
        }
    }

    public IRepositorioAD<Cupon> TCupon
    {
        get
        {
            _TCupon ??= new RepositorioAD<Cupon>(_contexto);
        return _TCupon;
        }
    }

    public IRepositorioAD<Factura> TFactura
    {

        get
        {
            _TFactura ??= new RepositorioAD<Factura>(_contexto);
            return _TFactura;
        }
    }
    public IRepositorioAD<WhiteList> TWhiteList
    {

        get
        {
            _TWhiteList ??= new RepositorioAD<WhiteList>(_contexto);
            return _TWhiteList;
        }
    }

    public int Completar()
    {
        return _contexto.SaveChanges();
    }

    public void EmpezarTransaccion()
    {
        _transaction = _contexto.Database.BeginTransaction();
    }

    public void CompletarTran()
    {
        if (_transaction == null)
            throw new InvalidOperationException("No hay una transacción iniciada.");

        try
        {
            _contexto.SaveChanges();
            _transaction.Commit();
        }
        catch
        {
            _transaction.Rollback();
            throw;
        }
    }

    public void Rollback()
    {
        _transaction?.Rollback();
    }

    public void CerrarConexion()
    {
        _contexto.Database.CloseConnection();
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _contexto.Dispose();
    }
}