import { PhotoDataInterface } from "../types/interfaces";

export const photoData: PhotoDataInterface = {
  interior: [
    { src: "/photos/interior/room1.jpg", caption: "Living Room" },
    { src: "/photos/interior/room2.jpg", caption: "Other Living Room" },
    { src: "/photos/interior/fireplace.jpg", caption: "Fireplace" },
  ],
  exterior: [
    {
      src: "/photos/exterior/cabin1.jpg",
      caption: "View of the cabin",
    },
    {
      src: "/photos/exterior/cabin2.jpg",
      caption: "A different view of the cabin",
    },
    {
      src: "/photos/exterior/cabin3.jpg",
      caption: "Cabin deck",
    },
  ],
  landscape: [
    {
      src: "/photos/island/point.jpg",
      caption: "Point of land",
    },
    {
      src: "/photos/island/road.jpg",
      caption: "Island road",
    },
    {
      src: "/photos/island/beach.jpg",
      caption: "Island beach",
    },
  ],
};
