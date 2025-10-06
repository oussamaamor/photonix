// src/lib/simulation.ts

export interface MaterialParams {
  Eg0: number; // eV
  alpha: number; // Varshni coefficient
  beta: number; // Varshni parameter
  // Optionally extend later with BE model params
}

export interface SimulationConfig {
  Tmin: number;
  Tmax: number;
  steps: number;
  peakFwhm: number; // eV
  amplitude: number;
  instrumentResolution: number; // eV, optional Gaussian convolution width
}

export interface Spectrum {
  temperature: number;
  energies: number[];
  intensities: number[];
  Eg: number; // bandgap at this T
}

/**
 * Varshni bandgap model: Eg(T) = Eg0 - alpha * T^2 / (T + beta)
 */
export function bandgapVarshni(T: number, params: MaterialParams): number {
  const { Eg0, alpha, beta } = params;
  return Eg0 - (alpha * T * T) / (T + beta);
}

/**
 * Generate a Gaussian emission line centered at Eg with given width (FWHM)
 */
function gaussian(x: number, center: number, fwhm: number): number {
  const sigma = fwhm / (2 * Math.sqrt(2 * Math.log(2)));
  return Math.exp(-0.5 * Math.pow((x - center) / sigma, 2));
}

/**
 * Generate PL spectrum for a given T and material
 */
export function generateSpectrum(
  T: number,
  material: MaterialParams,
  config: SimulationConfig
): Spectrum {
  const Eg = bandgapVarshni(T, material);
  const { peakFwhm, amplitude } = config;

  // Energy axis around Eg
  const energies: number[] = [];
  const intensities: number[] = [];

  const E_min = Eg - 0.5;
  const E_max = Eg + 0.5;
  const N = 400;

  for (let i = 0; i < N; i++) {
    const E = E_min + (i / (N - 1)) * (E_max - E_min);
    const intensity = amplitude * gaussian(E, Eg, peakFwhm);
    energies.push(E);
    intensities.push(intensity);
  }

  return { temperature: T, energies, intensities, Eg };
}

/**
 * Sweep over temperature range and return all spectra
 */
export function runTemperatureSweep(
  material: MaterialParams,
  config: SimulationConfig
): Spectrum[] {
  const { Tmin, Tmax, steps } = config;
  const spectra: Spectrum[] = [];
  const dT = (Tmax - Tmin) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const T = Tmin + i * dT;
    spectra.push(generateSpectrum(T, material, config));
  }

  return spectra;
}
