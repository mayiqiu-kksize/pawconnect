var PETS = [
  {
    id: "p1", name: "Milo", species: "Cat", breed: "Ragdoll", age: "2 years", sex: "Male", size: "Medium",
    temperament: "Gentle, affectionate and relaxed", health: "Vaccinated and desexed", vaccination: "F3 vaccination up to date (booster due March 2027)", shelter: "Harbour Paws Rescue", suburb: "Newtown", status: "Available", photo: "images/p1.jpg",
    description: "Milo is a soft-hearted cat who enjoys sunny shelves and quiet company. He would love a calm home where he can settle in at his own pace."
  },
  {
    id: "p2", name: "Luna", species: "Cat", breed: "British Longhair", age: "1 year", sex: "Female", size: "Medium",
    temperament: "Curious, playful and people-friendly", health: "Vaccinated and desexed", vaccination: "F3 vaccination up to date (booster due May 2027)", shelter: "Harbour Paws Rescue", suburb: "Surry Hills", status: "Available", photo: "images/p2.jpg",
    description: "Luna loves a gentle game and a cosy nap beside her people. She is ready to bring plenty of personality to her new family."
  },
  {
    id: "p3", name: "Sunny", species: "Dog", breed: "West Highland White Terrier", age: "8 months", sex: "Male", size: "Small",
    temperament: "Cheerful, social and eager to learn", health: "Vaccinated; desexing scheduled", vaccination: "Puppy C5 course completed; first adult booster due February 2027", shelter: "Western Sydney Animal Care", suburb: "Parramatta", status: "Available", photo: "images/p3.jpg",
    photos: ["images/p3.jpg", "images/p3-2.jpg", "images/p3-3.jpg", "images/p3-4.jpg"],
    description: "Sunny is a happy young dog who greets each day with enthusiasm. He is looking for an active family with time for training and adventures."
  },
  {
    id: "p4", name: "Daisy", species: "Dog", breed: "West Highland White Terrier", age: "3 years", sex: "Female", size: "Small",
    temperament: "Sweet-natured, friendly and confident", health: "Vaccinated and desexed", vaccination: "C5 vaccination up to date (booster due June 2027)", shelter: "Western Sydney Animal Care", suburb: "Ashfield", status: "Available", photo: "images/p4.jpg",
    photos: ["images/p4.jpg", "images/p4-2.jpg", "images/p4-3.jpg"],
    description: "Daisy is a bright little companion who enjoys walks and making new friends. She would suit a loving home ready to include her in everyday life."
  },
  {
    id: "p5", name: "Archie", species: "Dog", breed: "Bichon Frise", age: "4 years", sex: "Male", size: "Small",
    temperament: "Loyal, gentle and cuddly", health: "Vaccinated and desexed", vaccination: "C5 vaccination up to date (booster due January 2027)", shelter: "Harbour Paws Rescue", suburb: "Chatswood", status: "Reserved", photo: "images/p5.jpg",
    description: "Archie is a loving dog with a fondness for soft toys and close company. He is currently reserved while his adoption is being finalised."
  },
  {
    id: "p6", name: "Pip", species: "Dog", breed: "West Highland White Terrier", age: "1 year", sex: "Female", size: "Small",
    temperament: "Bright, lively and affectionate", health: "Vaccinated and desexed", vaccination: "C5 vaccination up to date (booster due April 2027)", shelter: "Western Sydney Animal Care", suburb: "Bondi", status: "Adopted", photo: "images/p6.jpg",
    description: "Pip is a spirited young terrier who has found her forever family. Her adoption is complete, and she is no longer available."
  }
];

// US7: every pet has a photo list for the profile gallery; the first photo is also used on Browse Pets.
PETS.forEach(function (pet) { if (!pet.photos || !pet.photos.length) pet.photos = [pet.photo]; });
