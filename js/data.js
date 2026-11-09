const PRODUCTS = [
  {
    id: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "Women",
    price: 39.99,
    compare: 49.99,
    rating: 4.8,
    reviews: 124,
    badge: "-20%",
    bestseller: true,
    isNew: false,
    colors: ["Lilac", "Black", "Cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    description:
      "A heavyweight fleece hoodie with a dropped shoulder and room to layer. Brushed inside, clean outside, and cut to feel like a day off."
  },
  {
    id: "graphic-tee",
    name: "Graphic T-Shirt",
    category: "Men",
    price: 24.99,
    compare: null,
    rating: 4.6,
    reviews: 98,
    badge: "",
    bestseller: true,
    isNew: false,
    colors: ["White", "Black", "Washed Lilac"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft cotton with a relaxed chest and a small studio graphic. Washed so the color looks lived-in from the first wear."
  },
  {
    id: "classic-cap",
    name: "Classic Cap",
    category: "Accessories",
    price: 19.99,
    compare: null,
    rating: 4.7,
    reviews: 76,
    badge: "",
    bestseller: true,
    isNew: false,
    colors: ["Black", "Lilac", "Stone"],
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80",
    description:
      "A six-panel cap in cotton twill with an adjustable strap and a quiet Véora mark. Curved brim, everyday fit."
  },
  {
    id: "running-shoes",
    name: "Running Shoes",
    category: "Footwear",
    price: 64.99,
    compare: null,
    rating: 4.9,
    reviews: 112,
    badge: "",
    bestseller: true,
    isNew: false,
    colors: ["White / Lilac", "Black", "Cloud"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description:
      "Light trainers with a cushioned sole and a breathable knit upper. Built for long walks, short runs, and everything between."
  },
  {
    id: "lilac-bomber",
    name: "Lilac Bomber",
    category: "Women",
    price: 89.99,
    compare: 110,
    rating: 4.8,
    reviews: 41,
    badge: "New",
    bestseller: false,
    isNew: true,
    colors: ["Lilac", "Midnight"],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    description:
      "A smooth bomber with ribbed cuffs and a slightly cropped hem. Light enough for travel, sharp enough for evening."
  },
  {
    id: "relaxed-crew",
    name: "Relaxed Crewneck",
    category: "Men",
    price: 44.99,
    compare: null,
    rating: 4.5,
    reviews: 63,
    badge: "New",
    bestseller: false,
    isNew: true,
    colors: ["Heather", "Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5a9f79c?auto=format&fit=crop&w=900&q=80",
    description:
      "Midweight loopback cotton with a clean crew neck and a straight hem. The layer you reach for when the hoodie stays home."
  },
  {
    id: "city-tote",
    name: "City Tote",
    category: "Accessories",
    price: 54,
    compare: null,
    rating: 4.7,
    reviews: 88,
    badge: "",
    bestseller: false,
    isNew: false,
    colors: ["Black", "Tan", "Lilac"],
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    description:
      "Structured leather-look tote with a zip pocket and handles that sit on the shoulder. Fits a laptop, a jacket, and the rest of the day."
  },
  {
    id: "court-sneaker",
    name: "Court Sneaker",
    category: "Footwear",
    price: 72,
    compare: 85,
    rating: 4.8,
    reviews: 54,
    badge: "-15%",
    bestseller: false,
    isNew: true,
    colors: ["White", "Lilac", "Black"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    description:
      "A clean court shoe in smooth leather with a cupsole and a lilac accent. Dress it up with tailoring or down with the oversized hoodie."
  },
  {
    id: "oval-sunglasses",
    name: "Oval Sunglasses",
    category: "Accessories",
    price: 29,
    compare: null,
    rating: 4.4,
    reviews: 37,
    badge: "New",
    bestseller: false,
    isNew: true,
    colors: ["Black", "Tortoise", "Lilac"],
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    description:
      "Slim oval frames with UV400 lenses. Light on the face, strong in the sun, easy with every Véora cap."
  },
  {
    id: "pleated-midi",
    name: "Pleated Midi Skirt",
    category: "Women",
    price: 48,
    compare: null,
    rating: 4.6,
    reviews: 29,
    badge: "New",
    bestseller: false,
    isNew: true,
    colors: ["Lilac", "Black", "Ivory"],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
    description:
      "Knife pleats that move when you walk, with a hidden elastic waist. Pair it with the graphic tee or a tucked crewneck."
  },
  {
    id: "denim-jacket",
    name: "Washed Denim Jacket",
    category: "Men",
    price: 79,
    compare: null,
    rating: 4.7,
    reviews: 51,
    badge: "",
    bestseller: false,
    isNew: true,
    colors: ["Indigo", "Black"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
    description:
      "A classic trucker jacket in a soft wash with metal buttons and two chest pockets. Broken in so it layers over knits immediately."
  },
  {
    id: "knit-beanie",
    name: "Rib Knit Beanie",
    category: "Accessories",
    price: 18,
    compare: null,
    rating: 4.5,
    reviews: 44,
    badge: "",
    bestseller: false,
    isNew: false,
    colors: ["Lilac", "Black", "Cream"],
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80",
    description:
      "Fine rib knit with a deep fold. Warm without the bulk, and dyed to match the lilac hoodie."
  }
];

const CATEGORIES = [
  {
    name: "Women",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    href: "shop.html?cat=Women"
  },
  {
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    href: "shop.html?cat=Men"
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    href: "shop.html?cat=Accessories"
  },
  {
    name: "Footwear",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    href: "shop.html?cat=Footwear"
  }
];
