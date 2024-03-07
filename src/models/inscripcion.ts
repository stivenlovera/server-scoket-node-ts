import { Table, Column, DataType, Model } from 'sequelize-typescript';
@Table({
    timestamps: false,
    tableName: "inscripcion",
    modelName: "Inscripcion"
})
export class Inscripcion extends Model {

    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare idInscripcion: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    create_time!: Date;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    idCliente!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    fechaInscripcion!: Date;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    impuestoInscripcion!: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    estadoInscripcion!: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    idUsuario!: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    idTipoPago!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    idTipoComprobante!: number;
}

