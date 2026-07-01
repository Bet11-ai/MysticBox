using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;
using MysticBox.AccesoDatos.Implementaciones;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;
using MysticBox.LogicaNegocio.Implementaciones;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddDbContext<MysticBoxContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// =========================
// CORS
// =========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirIonic", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:8100",
                "http://localhost:8101",
                "http://localhost:8102"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// =========================
// Inyección de dependencias
// =========================
builder.Services.AddScoped<ICarritoLN, CarritoLN>();
builder.Services.AddScoped<IDetalleCarritoLN, DetalleCarritoLN>();
builder.Services.AddScoped<IRolLN, RolLN>();
builder.Services.AddScoped<IPedidoLN, PedidoLN>();
builder.Services.AddScoped<IDetallePedidoLN, DetallePedidoLN>();
builder.Services.AddScoped<IEntregaLN, EntregaLN>();
builder.Services.AddScoped<ICalificacionLN, CalificacionLN>();
builder.Services.AddScoped<IAuthLN, AuthLN>();
builder.Services.AddScoped<IUsuarioLN, UsuarioLN>();

builder.Services.AddScoped<IUnidadTrabajoEF, UnidadTrabajoEF>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddScoped<ICategoriaLN, CategoriaLN>();
builder.Services.AddScoped<ICategoriaAD, CategoriaAD>();
builder.Services.AddScoped<ICuponLN, CuponLN>();
builder.Services.AddScoped<IFacturaLN, FacturaLN>();
builder.Services.AddScoped<IWhiteListLN, WhiteListLN>();
//builder.Services.AddScoped<IMysticBoxLN, MysticBoxLN>();

builder.Services.AddScoped<IMysticBoxLN, MysticBoxLN>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// =========================
// CORS
// =========================
app.UseCors("PermitirIonic");

app.UseAuthorization();

app.MapControllers();

app.Run();