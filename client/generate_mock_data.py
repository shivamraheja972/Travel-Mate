import json
import os

data_dir = "/Users/stevenmathew/Downloads/travelmate/client/public/data"
os.makedirs(data_dir, exist_ok=True)

flights = [
  {
    "id": "fl-001",
    "airline": "Emirates",
    "airlineCode": "EK",
    "flightNumber": "EK 203",
    "logo": "/images/emirates-airlines.png",
    "class": "Economy",
    "from": "New York",
    "fromCode": "JFK",
    "to": "Dubai",
    "toCode": "DXB",
    "depart": "22:05",
    "arrive": "18:40+1",
    "duration": "12h 35m",
    "stops": "Direct",
    "price": 649,
    "originalPrice": 820,
    "date": "2025-12-24",
    "seats": 14,
    "amenities": ["WiFi", "Meals", "Entertainment", "USB"],
    "aircraft": "Boeing 777-300ER",
    "baggageIncluded": True
  },
  {
    "id": "fl-002",
    "airline": "Qatar Airways",
    "airlineCode": "QR",
    "flightNumber": "QR 702",
    "logo": "/images/qatar-airways.png",
    "class": "Business",
    "from": "London",
    "fromCode": "LHR",
    "to": "Tokyo",
    "toCode": "NRT",
    "depart": "08:15",
    "arrive": "06:45+1",
    "duration": "13h 30m",
    "stops": "Direct",
    "price": 2850,
    "originalPrice": 3400,
    "date": "2025-12-24",
    "seats": 4,
    "amenities": ["Flat Bed", "WiFi", "Meals", "Lounge Access", "Chauffeur"],
    "aircraft": "Airbus A380",
    "baggageIncluded": True
  },
  {
    "id": "fl-003",
    "airline": "Turkish Airlines",
    "airlineCode": "TK",
    "flightNumber": "TK 3",
    "logo": "/images/turkish-airlines.png",
    "class": "Economy",
    "from": "Istanbul",
    "fromCode": "IST",
    "to": "New York",
    "toCode": "JFK",
    "depart": "18:30",
    "arrive": "22:15",
    "duration": "10h 45m",
    "stops": "Direct",
    "price": 520,
    "originalPrice": 720,
    "date": "2025-12-26",
    "seats": 28,
    "amenities": ["WiFi", "Meals", "Entertainment"],
    "aircraft": "Boeing 787-9",
    "baggageIncluded": True
  },
  {
    "id": "fl-004",
    "airline": "Singapore Airlines",
    "airlineCode": "SQ",
    "flightNumber": "SQ 21",
    "logo": "/images/singapore-airlines.png",
    "class": "Economy",
    "from": "Singapore",
    "fromCode": "SIN",
    "to": "Los Angeles",
    "toCode": "LAX",
    "depart": "23:55",
    "arrive": "06:05+1",
    "duration": "17h 10m",
    "stops": "Direct",
    "price": 780,
    "originalPrice": 980,
    "date": "2025-12-28",
    "seats": 22,
    "amenities": ["WiFi", "Meals", "Entertainment", "USB"],
    "aircraft": "Airbus A350-900ULR",
    "baggageIncluded": True
  }
]

hotels = [
  {
    "id": "hotel-001",
    "name": "The Grand Palace Hotel",
    "address": "123 Main Blvd, Tokyo",
    "city": "Tokyo",
    "rating": 4.8,
    "reviewCount": 2341,
    "stars": 5,
    "pricePerNight": 280,
    "currency": "USD",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "amenities": ["WiFi", "Pool", "Spa", "Gym"],
    "roomTypes": ["Deluxe King", "Suite"],
    "breakfast": True,
    "refundable": True,
    "description": "Luxury 5-star hotel in the heart of the city.",
    "checkIn": "15:00",
    "checkOut": "11:00"
  },
  {
    "id": "hotel-002",
    "name": "Comfort Inn & Suites",
    "address": "456 Park Ave, New York",
    "city": "New York",
    "rating": 4.3,
    "reviewCount": 876,
    "stars": 4,
    "pricePerNight": 120,
    "currency": "USD",
    "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
    "amenities": ["WiFi", "Gym", "Parking"],
    "roomTypes": ["Standard Queen", "Deluxe Double"],
    "breakfast": False,
    "refundable": True,
    "description": "Modern 4-star hotel with excellent value.",
    "checkIn": "14:00",
    "checkOut": "12:00"
  }
]

deals = [
  {
    "id": "deal-001",
    "title": "Summer in Paris",
    "discount": "20%",
    "destination": "Paris",
    "validUntil": "2026-06-30",
    "image": "/images/paris.png"
  },
  {
    "id": "deal-002",
    "title": "Escape to Dubai",
    "discount": "15%",
    "destination": "Dubai",
    "validUntil": "2025-12-31",
    "image": "/images/dubai.png"
  }
]

blog = [
  {
    "id": "blog-001",
    "title": "Top 10 Destinations for 2026",
    "author": "Jane Doe",
    "content": "Discover the most amazing places to visit next year. From the bustling streets of Tokyo to the serene beaches of Bali...",
    "tags": ["Travel", "Tips"],
    "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600"
  },
  {
    "id": "blog-002",
    "title": "How to Pack Like a Pro",
    "author": "John Smith",
    "content": "Packing for a long trip can be daunting. Here are some tips to maximize your luggage space...",
    "tags": ["Packing", "Guide"],
    "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600"
  }
]

with open(f"{data_dir}/flights.json", "w") as f:
    json.dump(flights, f, indent=2)

with open(f"{data_dir}/hotels.json", "w") as f:
    json.dump(hotels, f, indent=2)

with open(f"{data_dir}/deals.json", "w") as f:
    json.dump(deals, f, indent=2)

with open(f"{data_dir}/blog.json", "w") as f:
    json.dump(blog, f, indent=2)

print(f"Mock data generated successfully in {data_dir}")
