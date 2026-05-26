import { documentos, tiposCbte } from "./interfaces";
import { condicionesIvaB } from "./interfaces";

export const getTipoDocumentoId = (tipoDoc: string): number => {
    const tipo = documentos.find(d => d.desc.toLowerCase() === tipoDoc.toLowerCase());
    return tipo!.id;
};

export const getTipoCbteDesc = (tipoCbte: number): string => {
    const tipo = tiposCbte.find(c => c.code === tipoCbte);
    return tipo!.desc;
};

export const getCondIvaId = (condIvaDesc: string): number => {
    const cond = condicionesIvaB.find(c => c.desc.toLowerCase().includes(condIvaDesc.toLowerCase()));
    return cond!.id;
};