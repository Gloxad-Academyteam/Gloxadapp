// Full screen for an element (the video frame). Safari uses the webkit-prefixed names.
type TFullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type TFullscreenDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void };

export const isFullscreen = () => {
  const doc = document as TFullscreenDocument;
  return Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
};

export const toggleFullscreen = (element: HTMLElement | null) => {
  if (!element) return;
  const doc = document as TFullscreenDocument;
  if (isFullscreen()) {
    (doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc);
    return;
  }
  const target = element as TFullscreenElement;
  (target.requestFullscreen || target.webkitRequestFullscreen)?.call(target);
};
