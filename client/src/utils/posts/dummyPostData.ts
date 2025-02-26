import {IPost} from "@/types/posts.types";


const data: IPost[] = [
  {
    _id: "67be25e0de8affa70ecbdd11",
    description: "Beautiful Sunset Painting",
    owner: {
      username: "artlover123",
      avatar: {url: "https://img.favpng.com/5/8/8/samsung-galaxy-s6-samsung-galaxy-s5-smartphone-wallpaper-png-favpng-Rg3QQBfgSzzsefjAX99F063Tx_t.jpg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg",
        public_id: "sunset_painting",
        _id: "67be25e0de8affa70rcbdd12"
      },
      {
        url: "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg",
        public_id: "sunset_painting",
        _id: "67be25e0deraffa70ecbdd12"
      },
      {
        url: "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg",
        public_id: "sunset_painting",
        _id: "67be25r0de8affa70ecbdd12"
      }
    ],
    comments: [],
    reactions: [],
    shares: 2,
    location: {city: "Mumbai", country: "India"},
    isArchived: false,
    tags: ["Painting", "Nature"],
    createdAt: new Date("2025-02-25T20:19:44.484+00:00"),
    updatedAt: new Date("2025-02-25T20:19:44.484+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd21",
    description: "Abstract Art Experiment",
    owner: {
      username: "creative_soul",
      avatar: {url: "https://images.pexels.com/photos/1234853/pexels-photo-1234853.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/1234853/pexels-photo-1234853.jpeg",
        public_id: "abstract_art",
        _id: "67be25e0de8affa70ecbdd22"
      }
    ],
    comments: [],
    reactions: [],
    shares: 1,
    location: {city: "Delhi", country: "India"},
    isArchived: false,
    tags: ["Abstract", "Art"],
    createdAt: new Date("2025-02-24T18:15:30.123+00:00"),
    updatedAt: new Date("2025-02-24T18:15:30.123+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd31",
    description: "Sculpture Art Masterpiece",
    owner: {
      username: "sculptor_pro",
      avatar: {url: "https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg",
        public_id: "sculpture_art",
        _id: "67be25e0de8affa70ecbdd32"
      }
    ],
    comments: [],
    reactions: [],
    shares: 0,
    location: {city: "Jaipur", country: "India"},
    isArchived: false,
    tags: ["Sculpture", "Art"],
    createdAt: new Date("2025-02-23T14:10:22.789+00:00"),
    updatedAt: new Date("2025-02-23T14:10:22.789+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd41",
    description: "Rangoli Festival Design",
    owner: {
      username: "rangoli_artist",
      avatar: {url: "https://images.pexels.com/photos/4083850/pexels-photo-4083850.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/4083850/pexels-photo-4083850.jpeg",
        public_id: "rangoli_design",
        _id: "67be25e0de8affa70ecbdd42"
      }
    ],
    comments: [],
    reactions: [],
    shares: 5,
    location: {city: "Bangalore", country: "India"},
    isArchived: false,
    tags: ["Rangoli", "Festival"],
    createdAt: new Date("2025-02-22T10:05:15.567+00:00"),
    updatedAt: new Date("2025-02-22T10:05:15.567+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd51",
    description: "Modern Calligraphy",
    owner: {
      username: "calligraphy_master",
      avatar: {url: "https://images.pexels.com/photos/6331875/pexels-photo-6331875.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/6331875/pexels-photo-6331875.jpeg",
        public_id: "calligraphy",
        _id: "67be25e0de8affa70ecbdd52"
      }
    ],
    comments: [],
    reactions: [],
    shares: 3,
    location: {city: "Pune", country: "India"},
    isArchived: false,
    tags: ["Calligraphy", "Typography"],
    createdAt: new Date("2025-02-21T08:00:45.321+00:00"),
    updatedAt: new Date("2025-02-21T08:00:45.321+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd61",
    description: "Mehndi Art Collection",
    owner: {
      username: "mehndi_queen",
      avatar: {url: "https://images.pexels.com/photos/5386750/pexels-photo-5386750.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/5386750/pexels-photo-5386750.jpeg",
        public_id: "mehndi_art",
        _id: "67be25e0de8affa70ecbdd62"
      }
    ],
    comments: [],
    reactions: [],
    shares: 4,
    location: {city: "Kolkata", country: "India"},
    isArchived: false,
    tags: ["Mehndi", "Traditional"],
    createdAt: new Date("2025-02-20T06:45:33.210+00:00"),
    updatedAt: new Date("2025-02-20T06:45:33.210+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd71",
    description: "Digital Art Showcase",
    owner: {
      username: "digital_dreamer",
      avatar: {url: "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg",
        public_id: "digital_art",
        _id: "67be25e0de8affa70ecbdd72"
      }
    ],
    comments: [],
    reactions: [],
    shares: 7,
    location: {city: "Chennai", country: "India"},
    isArchived: false,
    tags: ["Digital", "Art"],
    createdAt: new Date("2025-02-19T05:30:15.123+00:00"),
    updatedAt: new Date("2025-02-19T05:30:15.123+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd81",
    description: "Photography Portfolio",
    owner: {
      username: "photo_enthusiast",
      avatar: {url: "https://images.pexels.com/photos/1234853/pexels-photo-1234853.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/1234853/pexels-photo-1234853.jpeg",
        public_id: "photography_portfolio",
        _id: "67be25e0de8affa70ecbdd82"
      }
    ],
    comments: [],
    reactions: [],
    shares: 6,
    location: {city: "Hyderabad", country: "India"},
    isArchived: false,
    tags: ["Photography", "Portfolio"],
    createdAt: new Date("2025-02-18T04:15:45.456+00:00"),
    updatedAt: new Date("2025-02-18T04:15:45.456+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdd91",
    description: "Street Art Exploration",
    owner: {
      username: "street_artist",
      avatar: {url: "https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg",
        public_id: "street_art",
        _id: "67be25e0de8affa70ecbdd92"
      }
    ],
    comments: [],
    reactions: [],
    shares: 2,
    location: {city: "Ahmedabad", country: "India"},
    isArchived: false,
    tags: ["Street", "Art"],
    createdAt: new Date("2025-02-17T03:00:10.789+00:00"),
    updatedAt: new Date("2025-02-17T03:00:10.789+00:00")
  },
  {
    _id: "67be25e0de8affa70ecbdda1",
    description: "Oil Painting Techniques",
    owner: {
      username: "oil_paint_expert",
      avatar: {url: "https://images.pexels.com/photos/4083850/pexels-photo-4083850.jpeg"}
    },
    media: [
      {
        url: "https://images.pexels.com/photos/4083850/pexels-photo-4083850.jpeg",
        public_id: "oil_painting",
        _id: "67be25e0de8affa70ecbdda2"
      }
    ],
    comments: [],
    reactions: [],
    shares: 3,
    location: {city: "Lucknow", country: "India"},
    isArchived: false,
    tags: ["Oil", "Painting"],
    createdAt: new Date("2025-02-16T02:45:30.321+00:00"),
    updatedAt: new Date("2025-02-16T02:45:30.321+00:00")
  }
];

export default data;