interface i_paginacion {
    table: string;
    registros: number;
    pagina: number;
}

export const Paginacion = ({ table,registros,pagina }:i_paginacion) => {

    const inicio = registros * pagina - registros;
    const sql = `select * from ? limit ?  offset ? order by fecha`;

    return {
        sql,
        data: [table, registros, inicio ]
    };
}