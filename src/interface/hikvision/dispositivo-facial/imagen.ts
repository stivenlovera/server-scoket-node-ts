export interface IImagen {
    FaceDataRecord: string | Blob,
    img: string | Blob
}

export interface IFaceDataRecord {
    faceLibType: string
    FDID: string
    FPID: string
}
