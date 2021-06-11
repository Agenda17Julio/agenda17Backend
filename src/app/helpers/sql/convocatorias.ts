import {Request,Response} from 'express';

export const searchconv = (req:Request, res:Response):any => {
    const { pagina } = req.params;

    const {
        asunto_check,
        autor_check,
        fecha_check,
        asunto,
        autor,
        fecha
    } = req.body;


    if( !asunto_check && !autor_check && !fecha_check ) {
        return res.status(400).json({
            ok: false,
            msg: 'Por favor selecciona un criterio de busqueda'
        })
    };

    if( !pagina ) return res.status(400).json({
        ok: false,
        msg: 'Por favor ingrese la pagina que desea consultar'
    });

    const cant_registros = 10;3
    const inicio = cant_registros * Number(pagina) - cant_registros;
    let sql = `select c.id, c.asunto, c.fecha, c.detalle,u.username as usuario
        from Convocatoria c 
        inner join Usuario u 
        on c.usuario=u.id`;

    let sql_registros = ``;

    if(asunto_check && autor_check && fecha_check){
        sql = `${sql} where c.asunto like '%${asunto}%'
            and u.username like '%${autor}%'
            and c.fecha like '${fecha}%'
            limit ${cant_registros} 
            offset ${inicio};`;

        sql_registros = `select count(*) as registros
            from Convocatoria c 
            inner join Usuario u 
            on c.usuario=u.id 
            where c.asunto like '%${asunto}%'
            and u.username like '%${autor}%'
            and c.fecha like '${fecha}%'`;

    }else if(asunto_check && autor_check && !fecha_check) {
        sql = `${sql} where c.asunto like '%${asunto}%'
            and u.username like '%${autor}%'
            limit ${cant_registros} 
            offset ${inicio};`;

            sql_registros = `select count(*) as registros
                from Convocatoria c 
                inner join Usuario u 
                on c.usuario=u.id 
                where c.asunto like '%${asunto}%'
                and u.username like '%${autor}%'`;

    }else if(asunto_check && fecha_check && !autor_check) {
        sql = `${sql} 
            where c.asunto like '%${asunto}%'
            and c.fecha like '${fecha}%'
            limit ${cant_registros} 
            offset ${inicio};`;
        
        sql_registros = `select count(*) as registros from Convocatoria where asunto like '%${asunto}%' and fecha like '${fecha}%'`;

    }else if(autor_check && fecha_check && !asunto_check){
        sql = `${sql} where u.username like '%${autor}%'
            and c.fecha like '${fecha}%'
            limit ${cant_registros} 
            offset ${inicio};`;

            sql_registros = `select count(*) as registros
                from Convocatoria c 
                inner join Usuario u 
                on c.usuario=u.id 
                where u.username like '%${autor}%'
                and c.fecha like '${fecha}%'`;

    }else if( asunto_check ){
        sql = `${sql} where asunto like '%${asunto}%' limit ${cant_registros} offset ${inicio};`;

        sql_registros = `select count(*) as registros
            from Convocatoria c 
            inner join Usuario u 
            on c.usuario=u.id 
            where c.asunto like '%${asunto}%'`;

    }else if ( autor_check ){
        sql = `${sql} where u.username like '%${autor}%'
            limit ${cant_registros} 
            offset ${inicio};`;

        sql_registros = `select count(*) as registros
            from Convocatoria c 
            inner join Usuario u 
            on c.usuario=u.id 
            where u.username like '%${autor}%'`;
        

    }else if ( fecha_check ){
        sql = `${sql} where fecha like '${fecha}%' limit ${cant_registros} offset ${inicio};`;
        sql_registros = `select count(*) as registros from Convocatoria where fecha like '${fecha}%'`;
    }

    return {
        sql,
        sql_registros
    }
}