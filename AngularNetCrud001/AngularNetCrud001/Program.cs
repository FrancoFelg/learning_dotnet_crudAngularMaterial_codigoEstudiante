using AngularNetCrud001.Models;
using AngularNetCrud001.Services.Implementations;
using AngularNetCrud001.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddDbContext<DbempleadoContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("CadenaSQL"));  
});

builder.Services.AddScoped<IDepartamentoService, DepartamentoService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
