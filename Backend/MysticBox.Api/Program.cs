using MysticBox.AccesoDatos.Implementaciones;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;
using MysticBox.LogicaNegocio.Implementaciones;
using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<MysticBoxContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IUsuarioAD, UsuarioAD>();
builder.Services.AddScoped<IUsuarioLN, UsuarioLN>();
builder.Services.AddScoped<ICarritoAD, CarritoAD>();
builder.Services.AddScoped<ICarritoLN, CarritoLN>();
builder.Services.AddScoped<IDetalleCarritoAD, DetalleCarritoAD>();
builder.Services.AddScoped<IDetalleCarritoLN, DetalleCarritoLN>();
builder.Services.AddScoped<IRolAD, RolAD>();
builder.Services.AddScoped<IRolLN, RolLN>();
builder.Services.AddScoped<IPedidoAD, PedidoAD>();
builder.Services.AddScoped<IPedidoLN, PedidoLN>();
builder.Services.AddScoped<IDetallePedidoAD, DetallePedidoAD>();
builder.Services.AddScoped<IDetallePedidoLN, DetallePedidoLN>();
builder.Services.AddScoped<IEntregaAD, EntregaAD>();
builder.Services.AddScoped<IEntregaLN, EntregaLN>();
builder.Services.AddScoped<ICalificacionAD, CalificacionAD>();
builder.Services.AddScoped<ICalificacionLN, CalificacionLN>();
builder.Services.AddScoped<IAuthLN, AuthLN>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
