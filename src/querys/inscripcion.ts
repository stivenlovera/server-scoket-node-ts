/* const obtenerInscripciones = (): string => {
    return ``;
} */

export function obtenerIncripcionesQuery(idCliente:number): string {
    return `
    SELECT
        cliente.idCliente,
        detalle_inscripcion.idDetalleInscripcion,
        cliente.nomCliente,
        detalle_inscripcion.fechaInicio,
        detalle_inscripcion.fechaFin,
        cliente.fotoCliente
    FROM cliente
    INNER JOIN detalle_inscripcion on cliente.idCliente = detalle_inscripcion.idCliente
    WHERE
        detalle_inscripcion.idInscripcion=${idCliente}
    `;
}
/* 
export function obtenerIncripcionesQuery(): string {
    return `
    SELECT
        cliente.idCliente,
        detalle_inscripcion.idDetalleInscripcion,
        cliente.nomCliente,
        detalle_inscripcion.fechaInicio,
        detalle_inscripcion.fechaFin,
        cliente.fotoCliente
    FROM cliente
    INNER JOIN detalle_inscripcion on cliente.idCliente = detalle_inscripcion.idCliente
    `;
} */