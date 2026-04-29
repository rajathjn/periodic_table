export interface ElementImage {
  title: string;
  url: string;
  local_url?: string;
  attribution: string;
}

export interface Element {
  number: number;
  symbol: string;
  name: string;
  atomic_mass: number;
  category: string;
  category_normalized: string;
  appearance: string | null;
  phase: string;
  density: number | null;
  melt: number | null;
  boil: number | null;
  molar_heat: number | null;
  period: number;
  group: number | null;
  block: string;
  electron_configuration: string;
  electron_configuration_semantic: string;
  shells: number[];
  electronegativity_pauling: number | null;
  electron_affinity: number | null;
  ionization_energies: number[];
  discovered_by: string | null;
  named_by: string | null;
  summary: string;
  summary_extended?: string;
  source: string;
  xpos: number;
  ypos: number;
  cpk_hex: string | null;
  spectral_img: string | null;
  local_spectral_img?: string;
  image: ElementImage | null;
  bohr_model_image: string | null;
  local_bohr_model_image?: string;
  bohr_model_3d: string | null;
  local_bohr_model_3d?: string;
  oxidation_states: string;
  group_name: string | null;
}
