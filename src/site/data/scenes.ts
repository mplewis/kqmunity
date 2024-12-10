import Baltimore from "../images/scenes/baltimore.jpg";
import Chicago from "../images/scenes/chicago.jpg";
import Denver from "../images/scenes/denver.jpg";
import Indianapolis from "../images/scenes/indianapolis.jpg";
import Jacksonville from "../images/scenes/jacksonville.jpg";
import Minneapolis from "../images/scenes/minneapolis.jpg";
import Portland from "../images/scenes/portland.jpg";
import SF from "../images/scenes/sf.jpg";
import Seattle from "../images/scenes/seattle.jpg";
import SLC from "../images/scenes/slc.jpg";
import SouthFlorida from "../images/scenes/south-florida.jpg";

type Scene = {
  name: string;
  splash: { image: ImageMetadata; alt: string };
  site: { kind: "internal" } | { kind: "external"; href: string };
  discord?: { guildID: string; timezone: string };
};

export const scenes = {
  baltimore: {
    name: "Baltimore",
    splash: { image: Baltimore, alt: "Baltimore skyline over the water" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/baltimorekillerqueen",
    },
  },

  chicago: {
    name: "Chicago",
    splash: { image: Chicago, alt: "Chicago skyline over the lake" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/mercurysquadchicago",
    },
  },

  denver: {
    name: "Denver",
    splash: {
      image: Denver,
      alt: "Denver skyline against the Rocky Mountains",
    },
    site: { kind: "internal" },
    discord: { guildID: "1276250547787268127", timezone: "America/Denver" },
  },

  indianapolis: {
    name: "Indianapolis",
    splash: {
      image: Indianapolis,
      alt: "Fireworks over the Indianapolis skyline",
    },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/551580141097284",
    },
  },

  jacksonville: {
    name: "Jacksonville",
    splash: { image: Jacksonville, alt: "Jacksonville skyline and bridge" },
    site: { kind: "external", href: "https://kqjax.com" },
  },

  minneapolis: {
    name: "Minneapolis",
    splash: {
      image: Minneapolis,
      alt: "Minneapolis skyline and Stone Arch Bridge",
    },
    site: { kind: "external", href: "http://killerqueenmpls.com" },
  },

  portland: {
    name: "Portland",
    splash: { image: Portland, alt: "Portland skyline and bridge" },
    site: { kind: "external", href: "https://killerqueenpdx.buzz" },
  },

  sanFrancisco: {
    name: "San Francisco",
    splash: { image: SF, alt: "Golden Gate Bridge" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/KillerQueenSF",
    },
  },

  seattle: {
    name: "Seattle",
    splash: { image: Seattle, alt: "Seattle skyline and Mt. Helena" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/KQSeattle",
    },
  },

  slc: {
    name: "Salt Lake City",
    splash: { image: SLC, alt: "Salt Lake City skyline against the mountains" },
    site: { kind: "external", href: "https://kqslc.com" },
  },

  "south-florida": {
    name: "South Florida",
    splash: { image: SouthFlorida, alt: "Ft. Lauderdale on the ocean" },
    site: {
      kind: "external",
      href: "https://kqsfl.com",
    },
  },
} as const satisfies Record<string, Scene>;
