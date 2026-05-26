export interface Product {
    updated_at: Date;
    created_at: Date;
    id: number;
    code: string;
    name: string;
    cepa: string;
    type: string;
    country: string;
    cost: number;
    price: number;
    imageRef: string;
};

export interface Client {
    id: number;
    name: string;
    docType: string;
    document: string;
    address: string;
    email: string;
    phone: string;
};

export interface Supplier {
    id: number;
    name: string;
    docType: string;
    document: string;
    address: string;
    email: string;
    phone: string;
    paymentContact: string;
};

export interface Deposit {
    id: number,
    name: string,
    address: string
}

export interface ProductWithStock {
    updated_at: Date;
    created_at: Date;
    id: number;
    code: string;
    name: string;
    cepa: string;
    type: string;
    country: string;
    cost: number;
    price: number;
    imageRef: string;
    stock: number;
    depositId: number;
    depositName: string;
};

export interface SaleProductWithStock {
    productId: number;
    productCode: string;
    productName: string;
    unitPrice: number;
    productStock: number;
    productDepositId: number;
    productDepositName: string;
    quantity: number;
    discount: number;
};

export interface PurchaseProduct extends Omit<Product, "price" | "imageRef" | "updated_at" | "created_at" | "id"> {
    productId: number;
    quantity: number;
    depositId: number;
    depositName: string;
}

export interface User {
    id: number;
    username: string;
    role: string;
    createdAt: string;
};

export interface Sale {
    id: number;
    createdAt: string;
    clientId: number;
    clientName: string;
    products: SaleProductWithStock[];
    facturado: boolean;
    delivered: boolean;
    facturas: Array<{ id: number; pdfUrl: string }>; // Cambio aquí
    totalPrice: number;
    seller: string;
}

export interface Purchase {
    id: number;
    createdAt: string,
    supplierId: number,
    supplierName: string,
    products: [
        {
            productName: string,
            quantity: number,
            cost: number
        }
    ];
    received: boolean;
    totalPrice: number;
};

export type DataFactura = {
    ptoVta: number,
    tipoCbte: number,
    condVenta: string,
    vendedor: string,
    productosFactura: {
        codigo: string, // code
        descripcion: string, // name
        cantidad: number,
        precioUnit: number,
        bonif: number,
        impBonif: number,
        subtotal: number
    }[],
    mediosDePago: [string],
    importeTotal: number,
    importeNetoNoGravado: number,
    importeNetoGravado: number,
    importeExentoIVA: number,
    importeIVA: number,
    importeTotalTributos: number,
    Iva: [{
        Id: number,
        BaseImp: number,
        Importe: number
    }],
    cliente: {
        tipoDocumento: number,
        documento: number,
        razonSocial: string,
        email: string,
        domicilio: string,
        condIva: number
    }
};

export type ClientFactura = {
    tipoDocumento: number,
    documento: number,
    razonSocial: string,
    email: string,
    domicilio: string,
    condIva: number
};

export type CreateProps = {
    closeModal: () => void;
};

export const condicionesIvaA = [
    {
        desc: 'IVA Responsable Inscripto',
        id: 1
    },
    {
        desc: 'Responsable Monotributo',
        id: 6
    },
    {
        desc: 'Monotributista Social',
        id: 13
    },
    {
        desc: 'Monotributo Trabajador Independiente Promovido',
        id: 16
    }
];

export const condicionesIvaB = [
    // {
    //     desc: 'IVA Sujeto Exento',
    //     id: 4
    // },
    {
        desc: 'Consumidor Final',
        id: 5
    },
    // {
    //     desc: 'Sujeto No Categorizado',
    //     id: 7
    // },
    // {
    //     desc: 'Proveedor del Exterior',
    //     id: 8
    // },
    // {
    //     desc: 'Cliente del Exterior',
    //     id: 9
    // },
    // {
    //     desc: 'IVA Liberado - Ley N° 19.640',
    //     id: 10
    // },
    // {
    //     desc: 'IVA No Alcanzado',
    //     id: 15
    // }
];

export const tiposCbte = [
    {
        code: 6,
        desc: "Factura B"
    },
    // {
    //     code: 7,
    //     desc: "Nota de débito B"
    // },
    {
        code: 8,
        desc: "Nota de crédito B"
    }
];

export const condicionesVenta = [
    "Contado",
    "Cuenta Corriente",
    "Tarjeta de Crédito",
    "Tarjeta de Débito",
    "Cheque",
    "Otro"
];

export const documentos = [
    {
        "id": 80,
        "desc": "CUIT"
    },
    {
        "id": 86,
        "desc": "CUIL"
    },
    {
        "id": 96,
        "desc": "DNI"
    },
    {
        "id": 94,
        "desc": "Pasaporte"
    },
];
