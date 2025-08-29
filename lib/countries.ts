export enum Regions {
  KE = "Košický",
  BA = "Bratislavský",
  BB = "Banskobystrický",
  PO = "Presovský",
  NR = "Nitriansky",
  TC = "Trenciansky",
  TV = "Trnavský",
  ZA = "Zilinský",
}

export const regionOptions = Object.keys(Regions).map((region) => ({
  label: Regions[region as keyof typeof Regions],
  value: region,
}));

export const getCityOptions = (region: string) => {
  return regions[region as keyof typeof regions].map((value) => ({
    label: value,
    value,
  }));
};

export const KE_cities = [
  "Trebisov",
  "Secovce",
  "Kralovsky chlmec",
  "Cierna nad Tisou",
];

export const PO_cities = [
  "Bardejov",
  "Humenne",
  "Kezmarok",
  "Levoca",
  "Medizlaborce",
  "Poprad",
  "Snina",
  "Stara Lubovna",
  "Stropkov",
  "Svidnik",
  "Vranov nad Toplou",
];

export const ZA_cities = [
  "Cadca",
  "Bytca",
  "Martin",
  "Namestovo",
  "Ruzomberok",
  "Tvrdosin",
  "Zilina",
  "Turcianske Teplice",
  "Liptovsky Mikulas",
];

export const regions = {
  KE: KE_cities,
  PO: PO_cities,
  ZA: ZA_cities,
};
