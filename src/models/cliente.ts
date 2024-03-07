import { Table, Column, DataType, Model } from 'sequelize-typescript';
@Table({
    timestamps: false,
    tableName: "cliente",
    modelName: "Cliente"
})
/* export class Cliente extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare idCliente: number;

    docCliente!: number;
    nomCliente!: string;
    tel1Cliente!: number|null;
    tel2Cliente!: number;
    dirCliente!: string;
    mailCliente!: string;
    CondicionCliente!: number;
} */

export class Cliente extends Model {

    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare idCliente: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    docCliente!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nomCliente!: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    tel1Cliente!: number;
    
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    tel2Cliente!: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    dirCliente!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    mailCliente!: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    CondicionCliente!: number;
}
