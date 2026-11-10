// Produtos citados nos guias de equipamento. O link do site é /go/amazon/<id>, que leva à busca do
// produto na loja Amazon do país do visitante (src/app/go/amazon/[product]/route.ts).

export type GearProduct = { id: string; name: string; query: string };

export const gearProducts: GearProduct[] = [
  { id: "logitech-g-pro-x-superlight-2", name: "Logitech G Pro X Superlight 2", query: "Logitech G Pro X Superlight 2" },
  { id: "razer-deathadder-v3", name: "Razer DeathAdder V3", query: "Razer DeathAdder V3" },
  { id: "zowie-ec2-c", name: "Zowie EC2-C", query: "Zowie EC2-C mouse" },
  { id: "zowie-g-sr", name: "Zowie G-SR", query: "Zowie G-SR mousepad" },
  { id: "steelseries-qck-heavy", name: "SteelSeries QcK Heavy", query: "SteelSeries QcK Heavy" },
  { id: "hyperx-cloud-ii", name: "HyperX Cloud II", query: "HyperX Cloud II headset" },
  { id: "steelseries-apex-pro-tkl", name: "SteelSeries Apex Pro TKL", query: "SteelSeries Apex Pro TKL" },
  { id: "zowie-xl2546k", name: "BenQ Zowie XL2546K", query: "BenQ Zowie XL2546K" },
];

export const getGearProduct = (id: string) => gearProducts.find((product) => product.id === id);
