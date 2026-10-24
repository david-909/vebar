/**
 * Packages and prices for the Google Ads landing page (/izrada-sajta).
 * Prices are in RSD.
 */
export type Package = {
    id: string;
    name: string;
    price: number;
    /** The price is a starting point ("od 120.000"). */
    isFrom?: boolean;
    isFeatured?: boolean;
    summary: string;
    audience: string;
    duration: string;
    features: string[];
};

export const PACKAGES: Package[] = [
    {
        id: 'start',
        name: 'Start',
        price: 36000,
        summary: 'Sajt na jednoj strani',
        audience: 'Za zanatlije, servise, ordinacije i lokalne usluge.',
        duration: 'oko 2 nedelje',
        features: [
            'Jedna strana sa svim bitnim: usluge, cene, radno vreme',
            'Kontakt forma i poziv jednim dodirom',
            'Google mapa i podaci o firmi',
            'Radi na telefonu, tabletu i računaru',
        ],
    },
    {
        id: 'biznis',
        name: 'Biznis',
        price: 60000,
        isFeatured: true,
        summary: 'Prezentacioni sajt do 7 strana',
        audience: 'Za firme kojima treba više od vizitkarte.',
        duration: '2–3 nedelje',
        features: [
            'Do 7 strana: usluge, o nama, reference, kontakt',
            'Galerija radova i kontakt forma',
            'Osnovno SEO podešavanje za Google',
            'Domen .rs i poslovni mejl prve godine',
        ],
    },
    {
        id: 'prodavnica',
        name: 'Prodavnica',
        price: 120000,
        isFrom: true,
        summary: 'Web prodavnica',
        audience: 'Za prodaju robe preko interneta.',
        duration: '4–6 nedelja',
        features: [
            'Neograničen broj proizvoda',
            'Kartično plaćanje i pouzeće',
            'Povezivanje sa kurirskom službom',
            'Obuka za samostalno unošenje robe',
        ],
    },
];

export const MAINTENANCE = [
    {
        name: 'Osnovno',
        price: 2500,
        includes:
            'Hosting, domen, poslovni mejl, SSL sertifikat, rezervne kopije i ažuriranja.',
    },
    {
        name: 'Standard',
        price: 5000,
        includes:
            'Sve iz osnovnog, plus do 1 sat izmena mesečno i nadzor da sajt radi.',
    },
    {
        name: 'Plus',
        price: 9000,
        includes:
            'Sve iz osnovnog, plus do 3 sata izmena mesečno, unos proizvoda i prioritetna podrška.',
    },
];

/** 36000 -> "36.000" */
export function formatPrice(value: number): string {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function packagePrice(item: Package): string {
    return `${item.isFrom ? 'od ' : ''}${formatPrice(item.price)} RSD`;
}
