export interface IIncripcionQuery {
    idCliente: number
    idInscripcion: number
    idDetalleInscripcion: number
    nomCliente: string
    fechaInicio: Date
    fechaFin: Date,
    fotoCliente: string | null
}
