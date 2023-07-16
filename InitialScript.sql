create Database DBEmpleado
use DBEmpleado 

CREATE TABLE Departamento(
	IdDepartamento int primary key identity,
	Nombre varchar(50),
	FechaCreacion datetime default getdate()
)

CREATE TABLE Empleado(
	IdEmpleado int primary key identity,
	NombreCompleto varchar(50),
	IdDepartamento int references Departamento(IdDepartamento),
	Sueldo int,
	FechaContrato datetime,
	FechaCreacion datetime default getdate()
)

insert into Departamento(Nombre) values
('Administracion'),
('Marketing'),
('Ventas'),
('Comercio')

insert into Empleado(NombreCompleto, IdDepartamento,Sueldo, FechaContrato) values
('Franco Hernandez', 1, 1400, getdate())