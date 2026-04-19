// Image size configurations for ERNIE-Image-Turbo
// This model supports flexible dimensions, common sizes listed below
export const imageSizes = {
  "1024x1024": { width: 1024, height: 1024 },
  "768x1024": { width: 768, height: 1024 },
  "1024x768": { width: 1024, height: 768 },
  "512x512": { width: 512, height: 512 },
  "768x768": { width: 768, height: 768 },
  "1280x720": { width: 1280, height: 720 },
  "720x1280": { width: 720, height: 1280 },
  "1024x576": { width: 1024, height: 576 },
  "576x1024": { width: 576, height: 1024 }
};

export function parseImageSize(sizeStr) {
  const config = imageSizes[sizeStr];
  if (!config) {
    throw new Error(`Unsupported image size: ${sizeStr}. Supported sizes: ${Object.keys(imageSizes).join(", ")}`);
  }
  return config;
}

export function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000000000000);
}
