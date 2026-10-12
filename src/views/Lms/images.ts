const unsplash = (id: string, width: number, quality = 72) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

// Free-to-use photos from Unsplash (https://unsplash.com/license)
export const lmsImages = {
  // Vitaly Gariev: grey-haired man in a blazer facing the camera, like a video call
  instructor: unsplash("photo-1738566061874-2160e9f4a064", 1100, 78),
  // Vitaly Gariev: students on a video call
  studentHeadphones: unsplash("photo-1758598304642-54de59f8de4a", 500),
  studentSmiling: unsplash("photo-1752650735119-8929e5f7d1ec", 500),
  studentMan: unsplash("photo-1758873267202-44c33e64f084", 500),
  // Portraits used for demo people
  womanA: unsplash("photo-1494790108377-be9c29b29330", 120, 75),
  womanB: unsplash("photo-1581065178047-8ee15951ede6", 120, 75),
  manA: unsplash("photo-1560250097-0b93528c311a", 120, 75),
  manB: unsplash("photo-1500648767791-00dcc994a43e", 120, 75),
  manC: unsplash("photo-1519085360753-af0119f7cbe7", 120, 75),
};
