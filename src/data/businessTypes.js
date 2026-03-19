// Complete Schema.org LocalBusiness type hierarchy
// Source: schema.org/LocalBusiness — verified March 2026

export const BUSINESS_CATEGORIES = [
  {
    category: "General",
    parent: "Organization",
    types: [
      { value: "Organization", label: "Organization (Default)", keywords: ["organization", "company", "nonprofit", "corporation", "general"] },
    ]
  },
  {
    category: "Automotive",
    parent: "AutomotiveBusiness",
    types: [
      { value: "AutomotiveBusiness", label: "Automotive Business (General)", keywords: ["auto", "car", "vehicle"] },
      { value: "AutoBodyShop", label: "Auto Body Shop", keywords: ["collision", "body work", "paint", "dent"] },
      { value: "AutoDealer", label: "Auto Dealer", keywords: ["car dealer", "dealership", "new car", "used car"] },
      { value: "AutoPartsStore", label: "Auto Parts Store", keywords: ["parts", "autozone", "napa", "oreilly"] },
      { value: "AutoRental", label: "Auto Rental", keywords: ["car rental", "rent a car", "enterprise", "hertz"] },
      { value: "AutoRepair", label: "Auto Repair", keywords: ["mechanic", "repair shop", "service center", "garage"] },
      { value: "AutoWash", label: "Auto Wash", keywords: ["car wash", "detailing"] },
      { value: "GasStation", label: "Gas Station", keywords: ["fuel", "gas", "petrol", "filling station"] },
      { value: "MotorcycleDealer", label: "Motorcycle Dealer", keywords: ["motorcycle", "bike dealer", "harley"] },
      { value: "MotorcycleRepair", label: "Motorcycle Repair", keywords: ["motorcycle repair", "bike repair"] },
    ]
  },
  {
    category: "Food & Drink",
    parent: "FoodEstablishment",
    types: [
      { value: "FoodEstablishment", label: "Food Establishment (General)", keywords: ["food", "dining", "eatery"] },
      { value: "Bakery", label: "Bakery", keywords: ["bakery", "pastry", "bread", "cake"] },
      { value: "BarOrPub", label: "Bar or Pub", keywords: ["bar", "pub", "tavern", "drinks"] },
      { value: "Brewery", label: "Brewery", keywords: ["brewery", "brewpub", "craft beer"] },
      { value: "CafeOrCoffeeShop", label: "Cafe or Coffee Shop", keywords: ["cafe", "coffee", "tea", "espresso"] },
      { value: "Distillery", label: "Distillery", keywords: ["distillery", "spirits", "whiskey", "vodka"] },
      { value: "FastFoodRestaurant", label: "Fast Food Restaurant", keywords: ["fast food", "quick service", "drive through"] },
      { value: "IceCreamShop", label: "Ice Cream Shop", keywords: ["ice cream", "frozen yogurt", "gelato"] },
      { value: "Restaurant", label: "Restaurant", keywords: ["restaurant", "dining", "dinner", "lunch"] },
      { value: "Winery", label: "Winery", keywords: ["winery", "wine", "vineyard", "tasting room"] },
    ]
  },
  {
    category: "Health & Medical",
    parent: "MedicalBusiness",
    types: [
      { value: "MedicalBusiness", label: "Medical Business (General)", keywords: ["medical", "healthcare", "health"] },
      { value: "CommunityHealth", label: "Community Health", keywords: ["community health", "public clinic"] },
      { value: "Dentist", label: "Dentist", keywords: ["dentist", "dental", "orthodontist", "teeth"] },
      { value: "Dermatology", label: "Dermatology", keywords: ["dermatologist", "skin", "dermatology"] },
      { value: "DietNutrition", label: "Diet & Nutrition", keywords: ["dietitian", "nutritionist", "diet"] },
      { value: "Emergency", label: "Emergency (Medical)", keywords: ["ER", "emergency room", "urgent care"] },
      { value: "Geriatric", label: "Geriatric Care", keywords: ["geriatric", "elderly", "senior care"] },
      { value: "Gynecologic", label: "Gynecology / OB-GYN", keywords: ["gynecologist", "obgyn", "women's health"] },
      { value: "MedicalClinic", label: "Medical Clinic", keywords: ["clinic", "walk-in", "medical center"] },
      { value: "Midwifery", label: "Midwifery", keywords: ["midwife", "birthing", "doula"] },
      { value: "Nursing", label: "Nursing Facility", keywords: ["nursing", "skilled nursing", "care facility"] },
      { value: "Obstetric", label: "Obstetrics", keywords: ["obstetrics", "prenatal", "maternity"] },
      { value: "Oncologic", label: "Oncology", keywords: ["oncologist", "cancer", "oncology"] },
      { value: "Optician", label: "Optician", keywords: ["optician", "glasses", "eyewear", "optical"] },
      { value: "Optometric", label: "Optometry", keywords: ["optometrist", "eye doctor", "vision", "eye exam"] },
      { value: "Otolaryngologic", label: "ENT (Otolaryngology)", keywords: ["ENT", "ear nose throat", "otolaryngologist"] },
      { value: "Pediatric", label: "Pediatrics", keywords: ["pediatrician", "children", "kids doctor"] },
      { value: "Pharmacy", label: "Pharmacy", keywords: ["pharmacy", "drugstore", "prescription"] },
      { value: "Physician", label: "Physician", keywords: ["doctor", "physician", "general practitioner", "MD"] },
      { value: "Physiotherapy", label: "Physical Therapy", keywords: ["physical therapy", "PT", "rehab", "physiotherapy"] },
      { value: "PlasticSurgery", label: "Plastic Surgery", keywords: ["plastic surgery", "cosmetic surgery"] },
      { value: "Podiatric", label: "Podiatry", keywords: ["podiatrist", "foot doctor", "ankle"] },
      { value: "PrimaryCare", label: "Primary Care", keywords: ["primary care", "family medicine", "family doctor"] },
      { value: "Psychiatric", label: "Psychiatry", keywords: ["psychiatrist", "mental health", "psychology"] },
      { value: "PublicHealth", label: "Public Health", keywords: ["public health", "health department"] },
    ]
  },
  {
    category: "Beauty & Wellness",
    parent: "HealthAndBeautyBusiness",
    types: [
      { value: "HealthAndBeautyBusiness", label: "Health & Beauty (General)", keywords: ["beauty", "wellness"] },
      { value: "BeautySalon", label: "Beauty Salon", keywords: ["beauty salon", "makeup", "cosmetics"] },
      { value: "DaySpa", label: "Day Spa", keywords: ["spa", "day spa", "massage", "facial"] },
      { value: "HairSalon", label: "Hair Salon / Barber", keywords: ["hair salon", "barber", "haircut", "stylist"] },
      { value: "HealthClub", label: "Health Club", keywords: ["health club", "fitness center"] },
      { value: "NailSalon", label: "Nail Salon", keywords: ["nail salon", "manicure", "pedicure", "nails"] },
      { value: "TattooParlor", label: "Tattoo Parlor", keywords: ["tattoo", "piercing", "ink"] },
    ]
  },
  {
    category: "Home Services & Construction",
    parent: "HomeAndConstructionBusiness",
    types: [
      { value: "HomeAndConstructionBusiness", label: "Home & Construction (General)", keywords: ["home service", "construction", "contractor"] },
      { value: "Electrician", label: "Electrician", keywords: ["electrician", "electrical", "wiring"] },
      { value: "GeneralContractor", label: "General Contractor", keywords: ["general contractor", "builder", "remodeling"] },
      { value: "HVACBusiness", label: "HVAC Business", keywords: ["HVAC", "heating", "cooling", "air conditioning"] },
      { value: "HousePainter", label: "House Painter", keywords: ["painter", "painting", "house painter"] },
      { value: "Locksmith", label: "Locksmith", keywords: ["locksmith", "lock", "key", "security"] },
      { value: "MovingCompany", label: "Moving Company", keywords: ["moving", "movers", "relocation"] },
      { value: "Plumber", label: "Plumber", keywords: ["plumber", "plumbing", "pipes", "drain"] },
      { value: "RoofingContractor", label: "Roofing Contractor", keywords: ["roofer", "roofing", "roof repair", "shingles"] },
    ]
  },
  {
    category: "Retail & Shopping",
    parent: "Store",
    types: [
      { value: "Store", label: "Store (General)", keywords: ["store", "shop", "retail"] },
      { value: "BikeStore", label: "Bike Store", keywords: ["bicycle", "bike shop"] },
      { value: "BookStore", label: "Book Store", keywords: ["bookstore", "books"] },
      { value: "ClothingStore", label: "Clothing Store", keywords: ["clothing", "fashion", "apparel", "boutique"] },
      { value: "ComputerStore", label: "Computer Store", keywords: ["computer", "tech", "IT"] },
      { value: "ConvenienceStore", label: "Convenience Store", keywords: ["convenience", "corner store", "mini mart"] },
      { value: "DepartmentStore", label: "Department Store", keywords: ["department store", "macys", "nordstrom"] },
      { value: "ElectronicsStore", label: "Electronics Store", keywords: ["electronics", "best buy", "gadgets"] },
      { value: "Florist", label: "Florist", keywords: ["florist", "flowers", "floral"] },
      { value: "FurnitureStore", label: "Furniture Store", keywords: ["furniture", "home furnishing"] },
      { value: "GardenStore", label: "Garden Store / Nursery", keywords: ["garden", "nursery", "plants"] },
      { value: "GroceryStore", label: "Grocery Store", keywords: ["grocery", "supermarket", "food store"] },
      { value: "HardwareStore", label: "Hardware Store", keywords: ["hardware", "home depot", "tools"] },
      { value: "HobbyShop", label: "Hobby Shop", keywords: ["hobby", "craft", "model"] },
      { value: "HomeGoodsStore", label: "Home Goods Store", keywords: ["home goods", "housewares", "decor"] },
      { value: "JewelryStore", label: "Jewelry Store", keywords: ["jewelry", "jeweler", "rings", "diamonds"] },
      { value: "LiquorStore", label: "Liquor Store", keywords: ["liquor", "wine shop", "spirits"] },
      { value: "MensClothingStore", label: "Men's Clothing Store", keywords: ["mens clothing", "menswear"] },
      { value: "MobilePhoneStore", label: "Mobile Phone Store", keywords: ["cell phone", "mobile", "phone store"] },
      { value: "MovieRentalStore", label: "Movie Rental Store", keywords: ["movie rental", "video"] },
      { value: "MusicStore", label: "Music Store", keywords: ["music store", "instruments", "guitar"] },
      { value: "OfficeEquipmentStore", label: "Office Equipment Store", keywords: ["office supply", "staples"] },
      { value: "OutletStore", label: "Outlet Store", keywords: ["outlet", "factory outlet", "discount"] },
      { value: "PawnShop", label: "Pawn Shop", keywords: ["pawn", "pawnbroker"] },
      { value: "PetStore", label: "Pet Store", keywords: ["pet store", "pet supply", "animals"] },
      { value: "ShoeStore", label: "Shoe Store", keywords: ["shoes", "footwear"] },
      { value: "SportingGoodsStore", label: "Sporting Goods Store", keywords: ["sporting goods", "sports equipment"] },
      { value: "TireShop", label: "Tire Shop", keywords: ["tires", "tire dealer"] },
      { value: "ToyStore", label: "Toy Store", keywords: ["toys", "games"] },
      { value: "WholesaleStore", label: "Wholesale Store", keywords: ["wholesale", "costco", "sams club", "bulk"] },
    ]
  },
  {
    category: "Legal Services",
    parent: "LegalService",
    types: [
      { value: "LegalService", label: "Legal Service (General)", keywords: ["legal", "law"] },
      { value: "Attorney", label: "Attorney / Law Firm", keywords: ["attorney", "lawyer", "law firm", "counsel"] },
      { value: "Notary", label: "Notary", keywords: ["notary", "notary public", "notarize"] },
    ]
  },
  {
    category: "Financial Services",
    parent: "FinancialService",
    types: [
      { value: "FinancialService", label: "Financial Service (General)", keywords: ["financial", "finance"] },
      { value: "AccountingService", label: "Accounting Service", keywords: ["accountant", "CPA", "bookkeeper", "tax"] },
      { value: "AutomatedTeller", label: "ATM", keywords: ["ATM", "cash machine"] },
      { value: "BankOrCreditUnion", label: "Bank or Credit Union", keywords: ["bank", "credit union", "banking"] },
      { value: "InsuranceAgency", label: "Insurance Agency", keywords: ["insurance", "agent", "broker", "policy"] },
    ]
  },
  {
    category: "Entertainment",
    parent: "EntertainmentBusiness",
    types: [
      { value: "EntertainmentBusiness", label: "Entertainment (General)", keywords: ["entertainment", "fun"] },
      { value: "AdultEntertainment", label: "Adult Entertainment", keywords: ["adult entertainment"] },
      { value: "AmusementPark", label: "Amusement Park", keywords: ["amusement park", "theme park", "water park"] },
      { value: "ArtGallery", label: "Art Gallery", keywords: ["art gallery", "gallery", "exhibition"] },
      { value: "Casino", label: "Casino", keywords: ["casino", "gambling", "gaming"] },
      { value: "ComedyClub", label: "Comedy Club", keywords: ["comedy", "improv", "stand-up"] },
      { value: "MovieTheater", label: "Movie Theater", keywords: ["movie", "cinema", "theater", "film"] },
      { value: "NightClub", label: "Night Club", keywords: ["nightclub", "club", "dance", "lounge"] },
    ]
  },
  {
    category: "Sports & Recreation",
    parent: "SportsActivityLocation",
    types: [
      { value: "SportsActivityLocation", label: "Sports & Recreation (General)", keywords: ["sports", "recreation"] },
      { value: "BowlingAlley", label: "Bowling Alley", keywords: ["bowling"] },
      { value: "ExerciseGym", label: "Gym / Exercise Studio", keywords: ["gym", "fitness", "crossfit", "workout", "yoga"] },
      { value: "GolfCourse", label: "Golf Course", keywords: ["golf", "country club", "driving range"] },
      { value: "PublicSwimmingPool", label: "Public Swimming Pool", keywords: ["swimming pool", "aquatic"] },
      { value: "SkiResort", label: "Ski Resort", keywords: ["ski", "snowboard", "ski resort"] },
      { value: "SportsClub", label: "Sports Club", keywords: ["sports club", "athletic club"] },
      { value: "StadiumOrArena", label: "Stadium or Arena", keywords: ["stadium", "arena", "sports venue"] },
      { value: "TennisComplex", label: "Tennis Complex", keywords: ["tennis", "tennis court"] },
    ]
  },
  {
    category: "Lodging & Hospitality",
    parent: "LodgingBusiness",
    types: [
      { value: "LodgingBusiness", label: "Lodging (General)", keywords: ["lodging", "accommodation"] },
      { value: "BedAndBreakfast", label: "Bed and Breakfast", keywords: ["B&B", "bed and breakfast", "inn"] },
      { value: "Campground", label: "Campground", keywords: ["campground", "camping", "RV park"] },
      { value: "Hostel", label: "Hostel", keywords: ["hostel", "backpacker"] },
      { value: "Hotel", label: "Hotel", keywords: ["hotel"] },
      { value: "Motel", label: "Motel", keywords: ["motel", "motor lodge"] },
      { value: "Resort", label: "Resort", keywords: ["resort", "vacation resort"] },
    ]
  },
  {
    category: "Emergency Services",
    parent: "EmergencyService",
    types: [
      { value: "EmergencyService", label: "Emergency Service (General)", keywords: ["emergency"] },
      { value: "FireStation", label: "Fire Station", keywords: ["fire department", "fire station"] },
      { value: "Hospital", label: "Hospital", keywords: ["hospital", "medical center"] },
      { value: "PoliceStation", label: "Police Station", keywords: ["police", "sheriff", "law enforcement"] },
    ]
  },
  {
    category: "Professional Services",
    parent: "ProfessionalService",
    types: [
      { value: "ProfessionalService", label: "Professional Service (General)", keywords: ["professional", "consulting", "agency", "marketing", "IT services", "photographer", "architect"] },
    ]
  },
  {
    category: "Other Business Types",
    parent: "LocalBusiness",
    types: [
      { value: "LocalBusiness", label: "Local Business (Generic Fallback)", keywords: ["business", "local"] },
      { value: "AnimalShelter", label: "Animal Shelter", keywords: ["animal shelter", "rescue", "adoption", "pet"] },
      { value: "ArchiveOrganization", label: "Archive Organization", keywords: ["archive", "records", "historical"] },
      { value: "ChildCare", label: "Child Care / Daycare", keywords: ["childcare", "daycare", "preschool", "after school"] },
      { value: "DryCleaningOrLaundry", label: "Dry Cleaning / Laundry", keywords: ["dry cleaner", "laundry", "laundromat"] },
      { value: "EmploymentAgency", label: "Employment Agency", keywords: ["staffing", "recruiter", "temp agency", "employment"] },
      { value: "GovernmentOffice", label: "Government Office", keywords: ["government", "city hall", "DMV"] },
      { value: "PostOffice", label: "Post Office", keywords: ["post office", "mail", "USPS"] },
      { value: "InternetCafe", label: "Internet Cafe", keywords: ["internet cafe", "cyber cafe"] },
      { value: "Library", label: "Library", keywords: ["library", "books", "reading"] },
      { value: "RadioStation", label: "Radio Station", keywords: ["radio", "broadcasting", "FM", "AM"] },
      { value: "RealEstateAgent", label: "Real Estate Agent", keywords: ["real estate", "realtor", "property", "broker"] },
      { value: "RecyclingCenter", label: "Recycling Center", keywords: ["recycling", "waste", "scrap"] },
      { value: "SelfStorage", label: "Self Storage", keywords: ["storage", "self storage", "storage unit"] },
      { value: "ShoppingCenter", label: "Shopping Center / Mall", keywords: ["mall", "shopping center", "plaza"] },
      { value: "TelevisionStation", label: "Television Station", keywords: ["TV station", "television", "broadcasting"] },
      { value: "TouristInformationCenter", label: "Tourist Information Center", keywords: ["tourist info", "visitor center", "welcome center"] },
      { value: "TravelAgency", label: "Travel Agency", keywords: ["travel agency", "tour operator", "travel booking"] },
    ]
  },
];

// Flat list for easy lookup
export const ALL_BUSINESS_TYPES = BUSINESS_CATEGORIES.flatMap(cat =>
  cat.types.map(t => ({ ...t, category: cat.category }))
);

// Search function
export function searchBusinessTypes(query) {
  if (!query || query.trim().length === 0) return ALL_BUSINESS_TYPES;
  const q = query.toLowerCase().trim();
  return ALL_BUSINESS_TYPES.filter(t =>
    t.label.toLowerCase().includes(q) ||
    t.value.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q))
  );
}
