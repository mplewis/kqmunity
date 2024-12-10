import DenverSkyline from "../images/denver-skyline.webp";

type Scene = {
  name: string;
  splash: { image: ImageMetadata; alt: string };
  site: { kind: "internal" } | { kind: "external"; href: string };
  discord?: { guildID: string; timezone: string };
};

export const scenes: Record<string, Scene> = {
  baltimore: {
    name: "Baltimore",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/baltimorekillerqueen",
    },
  },

  chicago: {
    name: "Chicago",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/mercurysquadchicago",
    },
  },

  denver: {
    name: "Denver",
    splash: {
      image: DenverSkyline,
      alt: "Denver skyline against the Rocky Mountains",
    },
    site: { kind: "internal" },
    discord: { guildID: "1276250547787268127", timezone: "America/Denver" },
  },

  indianapolis: {
    name: "Indianapolis",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/348252818671598",
    },
  },

  jacksonville: {
    name: "Jacksonville",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: { kind: "external", href: "https://kqjax.com" },
  },

  minneapolis: {
    name: "Minneapolis",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: { kind: "external", href: "http://killerqueenmpls.com" },
  },

  portland: {
    name: "Portland",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: { kind: "external", href: "https://killerqueenpdx.buzz" },
  },

  sanFrancisco: {
    name: "San Francisco",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/KillerQueenSF",
    },
  },

  seattle: {
    name: "Seattle",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/KQSeattle",
    },
  },

  slc: {
    name: "Salt Lake City",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: { kind: "external", href: "https://kqslc.com" },
  },

  southFlorida: {
    name: "South Florida",
    splash: { image: DenverSkyline, alt: "TODO" },
    site: {
      kind: "external",
      href: "https://www.facebook.com/groups/KillerQueenSouthFlorida",
    },
  },
};
