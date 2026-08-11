using Microsoft.EntityFrameworkCore;
using MysticBox.Dominio.Entidades;
using System.Reflection.Emit;

namespace MysticBox.AccesoDatos.Contexto;

public partial class MysticBoxContext : DbContext
{
    public MysticBoxContext()
    {
    }

    public MysticBoxContext(DbContextOptions<MysticBoxContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Calificacione> Calificaciones { get; set; }

    public virtual DbSet<Carrito> Carritos { get; set; }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<Cupon> Cupones { get; set; }

    public virtual DbSet<DetalleCarrito> DetalleCarritos { get; set; }

    public virtual DbSet<DetallePedido> DetallePedidos { get; set; }

    public virtual DbSet<Entrega> Entregas { get; set; }

    public virtual DbSet<Factura> Facturas { get; set; }

    public virtual DbSet<MetodosPago> MetodosPagos { get; set; }

   
    public virtual DbSet<MysticBox.Dominio.Entidades.MysticBox> MysticBoxes { get; set; }

    public virtual DbSet<Pedido> Pedidos { get; set; }

    public virtual DbSet<Personalizacione> Personalizaciones { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<WhiteList> WhiteLists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Calificacione>(entity =>
        {
            entity.HasKey(e => e.IdCalificacion).HasName("PK__Califica__40E4A7517EEC5AA0");

            entity.Property(e => e.Comentario)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.Property(e => e.FechaCalificacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdPedidoNavigation).WithMany(p => p.Calificaciones)
                .HasForeignKey(d => d.IdPedido)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Calificac__IdPed__70DDC3D8");
        });

        modelBuilder.Entity<Carrito>(entity =>
        {
            entity.HasKey(e => e.IdCarrito).HasName("PK__Carrito__8B4A618C2F5A6C14");

            entity.ToTable("Carrito");

            entity.Property(e => e.Estado)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Activo");

            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Carritos)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Carrito__IdUsuar__4BAC3F29");
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.IdCategoria).HasName("PK__Categori__A3C02A1056869958");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.Property(e => e.NombreCategoria)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Cupon>(entity =>
        {
            entity.HasKey(e => e.IdCupon).HasName("PK__Cupones__08DFC342070D0D58");

            entity.HasIndex(e => e.Codigo, "UQ__Cupones__06370DAC341B458B").IsUnique();

            entity.Property(e => e.Activo).HasDefaultValue(true);

            entity.Property(e => e.Codigo)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.Property(e => e.MontoDescuento).HasColumnType("decimal(10, 2)");

            entity.Property(e => e.PorcentajeDescuento).HasColumnType("decimal(5, 2)");
        });

        modelBuilder.Entity<DetalleCarrito>(entity =>
        {
            entity.HasKey(e => e.IdDetalleCarrito).HasName("PK__DetalleC__27A5F83B27AB31B5");

            entity.ToTable("DetalleCarrito");

            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(10, 2)");

            entity.Property(e => e.Subtotal)
                .HasComputedColumnSql("([Cantidad]*[PrecioUnitario])", false)
                .HasColumnType("decimal(21, 2)");

            entity.HasOne(d => d.IdCajaNavigation).WithMany(p => p.DetalleCarritos)
                .HasForeignKey(d => d.IdCaja)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DetalleCa__IdCaj__4F7CD00D");

            entity.HasOne(d => d.IdCarritoNavigation).WithMany(p => p.DetalleCarritos)
                .HasForeignKey(d => d.IdCarrito)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DetalleCa__IdCar__4E88ABD4");

            entity.HasOne(d => d.IdPersonalizacionNavigation).WithMany(p => p.DetalleCarritos)
                .HasForeignKey(d => d.IdPersonalizacion)
                .HasConstraintName("FK__DetalleCa__IdPer__5070F446");
        });

        modelBuilder.Entity<DetallePedido>(entity =>
        {
            entity.HasKey(e => e.IdDetallePedido).HasName("PK__DetalleP__48AFFD9552353EEF");

            entity.ToTable("DetallePedido");

            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(10, 2)");

            entity.Property(e => e.Subtotal)
                .HasComputedColumnSql("([Cantidad]*[PrecioUnitario])", false)
                .HasColumnType("decimal(21, 2)");

            entity.HasOne(d => d.IdCajaNavigation).WithMany(p => p.DetallePedidos)
                .HasForeignKey(d => d.IdCaja)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DetallePe__IdCaj__619B8048");

            entity.HasOne(d => d.IdPedidoNavigation).WithMany(p => p.DetallePedidos)
                .HasForeignKey(d => d.IdPedido)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DetallePe__IdPed__60A75C0F");

            entity.HasOne(d => d.IdPersonalizacionNavigation).WithMany(p => p.DetallePedidos)
                .HasForeignKey(d => d.IdPersonalizacion)
                .HasConstraintName("FK__DetallePe__IdPer__628FA481");
        });

        modelBuilder.Entity<Entrega>(entity =>
        {
            entity.HasKey(e => e.IdEntrega).HasName("PK__Entregas__C852F553B9884E23");

            entity.Property(e => e.DireccionEntrega)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.Property(e => e.EstadoEntrega)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Pendiente");

            entity.Property(e => e.UbicacionReferencia)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdPedidoNavigation).WithMany(p => p.Entregas)
                .HasForeignKey(d => d.IdPedido)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Entregas__IdPedi__6C190EBB");
        });

        modelBuilder.Entity<Factura>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("PK__Facturas__50E7BAF1E1C5D9EB");

            entity.HasIndex(e => e.NumeroFactura, "UQ__Facturas__CF12F9A6C61CA568").IsUnique();

            entity.Property(e => e.Descuento)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(10, 2)");

            entity.Property(e => e.FechaFactura)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.NumeroFactura)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Subtotal).HasColumnType("decimal(10, 2)");

            entity.Property(e => e.Total).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdPedidoNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdPedido)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Facturas__IdPedi__68487DD7");
        });

        modelBuilder.Entity<MetodosPago>(entity =>
        {
            entity.HasKey(e => e.IdMetodoPago).HasName("PK__MetodosP__6F49A9BEFB30D5EB");

            entity.ToTable("MetodosPago");

            entity.Property(e => e.NombreMetodo)
                .HasMaxLength(50)
                .IsUnicode(false);
        });
        modelBuilder.Entity<MysticBox.Dominio.Entidades.MysticBox>(entity =>
        {
            entity.HasKey(e => e.IdCaja).HasName("PK__MysticBo__3B7BF2C512FFE442");

            entity.ToTable("MysticBox");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(300)
                .IsUnicode(false);

            entity.Property(e => e.Estado).HasDefaultValue(true);

            entity.Property(e => e.Imagen)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.Property(e => e.NombreCaja)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.Precio).HasColumnType("decimal(10, 2)");

            entity.Property(e => e.EsOferta).HasDefaultValue(false);

            entity.Property(e => e.PorcentajeOferta).HasColumnType("decimal(5, 2)");

            entity.Property(e => e.EsRecomendada).HasDefaultValue(false);

            entity.Property(e => e.EsDestacada).HasDefaultValue(false);

            entity.HasOne(d => d.IdCategoriaNavigation).WithMany(p => p.MysticBoxes)
                .HasForeignKey(d => d.IdCategoria)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MysticBox__IdCat__4222D4EF");
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.IdPedido).HasName("PK__Pedidos__9D335DC3260D0A73");

            entity.Property(e => e.Descuento)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(10, 2)");

            entity.Property(e => e.EstadoPedido)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Pendiente");

            entity.Property(e => e.FechaPedido)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.Subtotal).HasColumnType("decimal(10, 2)");

            entity.Property(e => e.Total).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdCuponNavigation).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.IdCupon)
                .HasConstraintName("FK__Pedidos__IdCupon__5CD6CB2B");

            entity.HasOne(d => d.IdMetodoPagoNavigation).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.IdMetodoPago)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Pedidos__IdMetod__5DCAEF64");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Pedidos__IdUsuar__5BE2A6F2");
        });

        modelBuilder.Entity<Personalizacione>(entity =>
        {
            entity.HasKey(e => e.IdPersonalizacion).HasName("PK__Personal__643859B2465368B2");

            entity.Property(e => e.Exclusiones)
                .HasMaxLength(300)
                .IsUnicode(false);

            entity.Property(e => e.FechaPersonalizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.MensajePersonalizado)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.Property(e => e.Preferencias)
                .HasMaxLength(300)
                .IsUnicode(false);

            entity.Property(e => e.TamanoCaja)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.IdCajaNavigation).WithMany(p => p.Personalizaciones)
                .HasForeignKey(d => d.IdCaja)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Personali__IdCaj__46E78A0C");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Personalizaciones)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Personali__IdUsu__45F365D3");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("PK__Roles__2A49584CDC135044");

            entity.Property(e => e.NombreRol)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__Usuarios__5B65BF971301657D");

            entity.HasIndex(e => e.Correo, "UQ__Usuarios__60695A1913DBD5C6").IsUnique();

            entity.Property(e => e.Contrasena)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.Property(e => e.Correo)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.Direccion)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.Property(e => e.Estado).HasDefaultValue(true);

            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdRol)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Usuarios__IdRol__3C69FB99");
        });

        modelBuilder.Entity<WhiteList>(entity =>
        {
            entity.HasKey(e => e.IdWhiteList).HasName("PK__WhiteLis__06F06ADAF359A686");

            entity.ToTable("WhiteList");

            entity.HasIndex(e => e.Correo, "UQ__WhiteLis__60695A19D7123777").IsUnique();

            entity.Property(e => e.Activo).HasDefaultValue(true);

            entity.Property(e => e.Correo)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}