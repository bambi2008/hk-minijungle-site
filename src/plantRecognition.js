export const plantRecognitionStatus = {
  state: "architecture-ready",
  provider: null,
  model: null,
  endpoint: "/api/plant-identify",
  accepts: ["image/jpeg", "image/png", "image/webp", "image/heic"],
  maxBytes: 12 * 1024 * 1024,
};

export function validatePlantImage(file) {
  if (!file) return { ok: false, code: "missing-file" };
  if (!plantRecognitionStatus.accepts.includes(file.type)) return { ok: false, code: "unsupported-type" };
  if (file.size > plantRecognitionStatus.maxBytes) return { ok: false, code: "file-too-large" };
  return { ok: true };
}

export async function identifyPlant() {
  return {
    status: "model-not-configured",
    candidates: [],
    message: "The upload pipeline is ready, but no AI identification provider is connected.",
  };
}
