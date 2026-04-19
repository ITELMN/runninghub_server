// Image size configurations based on ComfyUI workflow aspect ratio options
export const imageSizes = {
  "1024x1024": { width: 1024, height: 1024, aspectRatio: "1:1 square 1024x1024" },
  "896x1152": { width: 896, height: 1152, aspectRatio: "3:4 portrait 896x1152" },
  "832x1216": { width: 832, height: 1216, aspectRatio: "5:8 portrait 832x1216" },
  "768x1344": { width: 768, height: 1344, aspectRatio: "9:16 portrait 768x1344" },
  "640x1536": { width: 640, height: 1536, aspectRatio: "9:21 portrait 640x1536" },
  "1152x896": { width: 1152, height: 896, aspectRatio: "4:3 landscape 1152x896" },
  "1216x832": { width: 1216, height: 832, aspectRatio: "3:2 landscape 1216x832" },
  "1344x768": { width: 1344, height: 768, aspectRatio: "16:9 landscape 1344x768" },
  "1536x640": { width: 1536, height: 640, aspectRatio: "21:9 landscape 1536x640" }
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
