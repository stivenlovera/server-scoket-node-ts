import sequelize from "../config/database";
import { Cliente } from "../models/cliente";
import { Inscripcion } from "../models/inscripcion";
export default sequelize.addModels([Inscripcion, Cliente]);