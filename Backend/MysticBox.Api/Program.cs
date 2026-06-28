using MysticBox.AccesoDatos.Implementaciones;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;
using MysticBox.LogicaNegocio.Implementaciones;
using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//builder.Services.AddScoped<UNIDAD>
builder.Services.AddScoped<ICategoriaLN, CategoriaLN>();
builder.Services.AddScoped<ICategoriaAD, CategoriaAD>();



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
