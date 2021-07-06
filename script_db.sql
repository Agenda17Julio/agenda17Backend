
use agenda;

create table Rol (
	id int not null auto_increment,
    tipo character varying(20) not null,
    constraint pk_rol primary key(id)
);

create table Persona (
	id int not null auto_increment,
    nombre character varying(30),
    apellido character varying(30),
    cedula char(10) not null,
    correo character varying(50),
    constraint pk_persona primary key(id)
);

create table Usuario (
	id int not null auto_increment,
	username character varying(30),
	password char(60),
    rol int not null,
    persona int not null,
    constraint pk_user primary key (id),
    constraint fk_user_rol foreign key(rol)
                references Rol(id)
        on update restrict
        on delete restrict,
        constraint fk_user_persona foreign key(persona)
                references Persona(id)
        on update restrict
        on delete restrict
);

create table Adjunto (
        id bigint not null auto_increment,
    nombre character varying(50),
    constraint pk_adjunto primary key(id)
);

create table Convocatoria (
	id bigint not null auto_increment,
    asunto character varying(50) not null,
    fecha timestamp,
    detalle text,
    adjunto bigint,
    usuario int not null,
    destinatarios text,
    constraint pk_convocatoria primary key(id),
    constraint fk_convocatoria_user foreign key(usuario)
                references Usuario(id)
        on update restrict
        on delete restrict,
    constraint fk_convocatoria_adjunto foreign key(adjunto)
                references Adjunto(id)
        on update restrict
        on delete restrict
);

create table AdjuntoConvocatoria (
	id bigint not null auto_increment,
    convocatoria bigint not null,
    nombre character varying(30),
    constraint pk_adjuntoConvocatoria primary key(id),
    constraint fk_adjunto_convocatoria foreign key(convocatoria)
                references Convocatoria(id)
        on update restrict
        on delete restrict
);


-- agregación de constraint necesarios
alter table Persona add constraint uniq_persona_cedula unique(cedula);
alter table Persona add constraint uniq_persona_correo unique(correo);
alter table Usuario add constraint uniq_user_username unique(username);
alter table Usuario add constraint uniq_user_password unique(password);
alter table Convocatoria modify fecha timestamp default now();
alter table Persona add column img character varying(100);



-- funciones delimitadora para la restricción de acceso a usuarios no autorizados

drop procedure if exists acceso_convocatoria;
delimiter $$
create procedure acceso_convocatoria(id_usuario int)
begin

    declare rol_usuario int;
    declare rol_secretario int;
    declare message character varying(50);


    select rol into rol_usuario from Usuario where id = id_usuario;
    select id into rol_secretario from Rol where tipo = 'secretario';

    if rol_secretario <> rol_usuario then
                set message = concat('Permisos insuficientes para realizar la operacion');
        signal sqlstate '45000'
            set message_text = message;
        end if;
end$$ delimiter ;

drop trigger if exists before_update_convocatoria;
delimiter $$
create trigger before_update_convocatoria
before update
on Convocatoria for each row
begin
    call acceso_convocatoria(new.usuario);
end$$ delimiter ;

drop trigger if exists before_insert_convocatoria;
delimiter $$
create trigger before_insert_convocatoria
before insert
on Convocatoria for each row
begin
    call acceso_convocatoria(new.usuario);
end$$ delimiter ;


-- inserción de roles
insert into Rol(tipo) values
        ('secretario'),
        ('admin'),
		('natural');

-- inserción de personas;
insert into Persona(nombre, apellido, cedula, correo) values
        ('jose','pai','1004198334','jbpaig@gmail.com'),
		('juan','carlos','0804697886','juanx@gmail.com'),
		('prueba','database','1008579334','prueba@gmail.com'),
		('jack','destripador','1003985167','jack@gmail.com'),
        ('jose','breiner','1003198354','pepe.37285@gmail.com');
        
        
insert into Usuario(username, password, rol, persona) values
        ('gt37285','gt37285',1,1),
		('test','test',1,2),
		('admin','admin',2,3),
		('natural','natural',3,4);
        

select * from Convocatoria;

select * from AdjuntoConvocatoria;
select c.id, c.asunto, c.fecha, c.detalle, c.usuario, c.destinatarios as 'to'
from Convocatoria c
where fecha >= '2021-07-05';



select c.id, c.asunto, c.fecha, c.detalle, c.usuario, c.destinatarios as 'to'
from Convocatoria c
where c.destinatarios like '%jbpaig@gmail.com%';