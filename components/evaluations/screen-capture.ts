"use client";

/**
 * Partage de l'écran entier pendant l'évaluation. Rien n'est enregistré en continu :
 * une seule image est prise quand la page se verrouille, pour montrer à l'enseignant ce qui était à l'écran.
 * Le flux reste dans ce module : il survit aux rafraîchissements de la page côté Next, pas à un rechargement.
 */

type Capture = { stream: MediaStream; video: HTMLVideoElement };

let current: Capture | null = null;
const endedListeners = new Set<() => void>();

export function captureSupported() {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getDisplayMedia);
}

export function captureActive() {
  return Boolean(current && current.stream.getVideoTracks().some((track) => track.readyState === "live"));
}

/** Demande le partage de l'écran entier (à appeler depuis un clic). */
export async function startScreenCapture(): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!captureSupported()) return { ok: false, reason: "Ce navigateur ne permet pas le partage d'écran." };
  if (captureActive()) return { ok: true };
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "monitor", frameRate: 2 } as MediaTrackConstraints,
      audio: false,
      // Chrome : proposer l'écran entier en premier, sans l'onglet courant.
      ...({ selfBrowserSurface: "exclude", monitorTypeSurfaces: "include", surfaceSwitching: "exclude" } as object),
    } as DisplayMediaStreamOptions);
  } catch {
    return { ok: false, reason: "Le partage d'écran a été refusé." };
  }
  const track = stream.getVideoTracks()[0];
  const surface = (track?.getSettings() as { displaySurface?: string })?.displaySurface;
  if (surface && surface !== "monitor") {
    stream.getTracks().forEach((item) => item.stop());
    return { ok: false, reason: "Il faut partager l'écran entier (pas une fenêtre ni un onglet)." };
  }
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  await video.play().catch(() => undefined);
  track.addEventListener("ended", () => {
    current = null;
    endedListeners.forEach((listener) => listener());
  });
  current = { stream, video };
  return { ok: true };
}

export function stopScreenCapture() {
  current?.stream.getTracks().forEach((track) => track.stop());
  current = null;
}

export function onCaptureEnded(listener: () => void) {
  endedListeners.add(listener);
  return () => {
    endedListeners.delete(listener);
  };
}

/** Image de l'écran partagé, en JPEG réduit (moins d'environ 1 Mo), ou null sans partage. */
export async function grabScreenshot(maxWidth = 1280): Promise<string | null> {
  if (!current || !captureActive()) return null;
  const track = current.stream.getVideoTracks()[0];
  let source: CanvasImageSource | null = null;
  let width = 0;
  let height = 0;
  try {
    const ImageCaptureCtor = (window as unknown as { ImageCapture?: new (track: MediaStreamTrack) => { grabFrame(): Promise<ImageBitmap> } }).ImageCapture;
    if (ImageCaptureCtor) {
      const bitmap = await new ImageCaptureCtor(track).grabFrame();
      source = bitmap;
      width = bitmap.width;
      height = bitmap.height;
    }
  } catch {
    source = null;
  }
  if (!source) {
    const { video } = current;
    if (!video.videoWidth) return null;
    source = video;
    width = video.videoWidth;
    height = video.videoHeight;
  }
  const scale = Math.min(1, maxWidth / width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.6, 0.45, 0.3]) {
    const url = canvas.toDataURL("image/jpeg", quality);
    if (url.length < 1_400_000) return url;
  }
  return null;
}
