import json
import os
import random
from datetime import datetime, timedelta

data_dir = "/Users/stevenmathew/Downloads/travelmate/client/public/data"
os.makedirs(data_dir, exist_ok=True)

airlines = [
    {"name": "Emirates", "code": "EK", "logo": "/images/emirates-airlines.png"},
    {"name": "Qatar Airways", "code": "QR", "logo": "/images/qatar-airways.png"},
    {"name": "Singapore Airlines", "code": "SQ", "logo": "/images/singapore-airlines.png"},
    {"name": "Turkish Airlines", "code": "TK", "logo": "/images/turkish-airlines.png"},
    {"name": "Delta Air Lines", "code": "DL", "logo": "/images/singapore-airlines.png"},
    {"name": "British Airways", "code": "BA", "logo": "/images/qatar-airways.png"},
    {"name": "Lufthansa", "code": "LH", "logo": "/images/turkish-airlines.png"},
    {"name": "Air France", "code": "AF", "logo": "/images/emirates-airlines.png"},
    {"name": "Cathay Pacific", "code": "CX", "logo": "/images/singapore-airlines.png"},
    {"name": "Japan Airlines", "code": "JL", "logo": "/images/turkish-airlines.png"}
]

cities = [
    {"city": "New York", "code": "JFK"},
    {"city": "London", "code": "LHR"},
    {"city": "Tokyo", "code": "NRT"},
    {"city": "Paris", "code": "CDG"},
    {"city": "Dubai", "code": "DXB"},
    {"city": "Singapore", "code": "SIN"},
    {"city": "Los Angeles", "code": "LAX"},
    {"city": "Sydney", "code": "SYD"},
    {"city": "Hong Kong", "code": "HKG"},
    {"city": "Istanbul", "code": "IST"},
    {"city": "Frankfurt", "code": "FRA"},
    {"city": "Amsterdam", "code": "AMS"},
    {"city": "Seoul", "code": "ICN"},
    {"city": "Bangkok", "code": "BKK"},
    {"city": "Toronto", "code": "YYZ"}
]

classes = ["Economy", "Premium Economy", "Business", "First Class"]

def generate_flights(num):
    flights = []
    for i in range(num):
        airline = random.choice(airlines)
        origin = random.choice(cities)
        dest = random.choice([c for c in cities if c != origin])
        flight_class = random.choices(classes, weights=[60, 20, 15, 5])[0]
        
        base_price = random.randint(300, 1500)
        if flight_class == "Premium Economy": base_price *= 1.5
        elif flight_class == "Business": base_price *= 3
        elif flight_class == "First Class": base_price *= 5
        
        has_discount = random.random() > 0.7
        original_price = int(base_price * random.uniform(1.1, 1.4)) if has_discount else None
        
        depart_hour = random.randint(0, 23)
        depart_minute = random.choice([0, 15, 30, 45])
        duration_hours = random.randint(3, 16)
        duration_mins = random.choice([0, 15, 30, 45])
        
        arrive_time_total = depart_hour * 60 + depart_minute + duration_hours * 60 + duration_mins
        arrive_hour = (arrive_time_total // 60) % 24
        arrive_minute = arrive_time_total % 60
        days_added = arrive_time_total // 1440
        
        arrive_str = f"{arrive_hour:02d}:{arrive_minute:02d}"
        if days_added > 0:
            arrive_str += f"+{days_added}"
            
        date = (datetime.now() + timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d")
        
        flights.append({
            "id": f"fl-{1000+i}",
            "airline": airline["name"],
            "airlineCode": airline["code"],
            "flightNumber": f"{airline['code']} {random.randint(100, 999)}",
            "logo": airline["logo"],
            "class": flight_class,
            "from": origin["city"],
            "fromCode": origin["code"],
            "to": dest["city"],
            "toCode": dest["code"],
            "depart": f"{depart_hour:02d}:{depart_minute:02d}",
            "arrive": arrive_str,
            "duration": f"{duration_hours}h {duration_mins}m",
            "stops": random.choices(["Direct", "1 Stop", "2 Stops"], weights=[70, 25, 5])[0],
            "price": int(base_price),
            "originalPrice": original_price,
            "date": date,
            "seats": random.randint(1, 50),
            "amenities": random.sample(["WiFi", "Meals", "Entertainment", "USB", "Extra Legroom", "Lounge Access"], k=random.randint(2, 5)),
            "aircraft": random.choice(["Boeing 777-300ER", "Airbus A350-900", "Boeing 787-9", "Airbus A380", "Boeing 737 MAX"]),
            "baggageIncluded": random.random() > 0.2
        })
    return flights

def generate_hotels(num):
    hotels = []
    adjectives = ["Grand", "Royal", "Luxury", "Boutique", "Central", "Riverside", "Imperial", "Plaza", "Oasis", "Sunset"]
    types = ["Hotel", "Resort", "Suites", "Lodge", "Inn", "Palace"]
    
    images = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1551882547-ff40c0d5b9af?w=600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
    ]
    
    for i in range(num):
        city = random.choice(cities)["city"]
        stars = random.choices([3, 4, 5], weights=[20, 50, 30])[0]
        price = random.randint(80, 250) if stars == 3 else random.randint(150, 400) if stars == 4 else random.randint(350, 1200)
        
        hotels.append({
            "id": f"hotel-{1000+i}",
            "name": f"The {random.choice(adjectives)} {random.choice(types)} {city}",
            "address": f"{random.randint(10, 999)} {random.choice(['Main', 'Park', 'Ocean', 'Market'])} Ave, {city}",
            "city": city,
            "rating": round(random.uniform(3.5, 5.0), 1),
            "reviewCount": random.randint(50, 5000),
            "stars": stars,
            "pricePerNight": price,
            "currency": "USD",
            "image": random.choice(images),
            "amenities": random.sample(["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Parking"], k=random.randint(3, 7)),
            "roomTypes": random.sample(["Standard", "Deluxe", "Suite", "Ocean View", "Club Level"], k=random.randint(2, 4)),
            "breakfast": random.random() > 0.4,
            "refundable": random.random() > 0.3,
            "description": f"Experience the best of {city} at this beautiful {stars}-star property. Centrally located with premium amenities.",
            "checkIn": "15:00",
            "checkOut": "11:00"
        })
    return hotels

flights = generate_flights(250)
hotels = generate_hotels(100)

deals = [
    {"id": "deal-001", "title": "Summer in Paris", "discount": "20%", "destination": "Paris", "validUntil": "2026-06-30", "image": "/images/paris.png"},
    {"id": "deal-002", "title": "Escape to Dubai", "discount": "15%", "destination": "Dubai", "validUntil": "2025-12-31", "image": "/images/dubai.png"},
    {"id": "deal-003", "title": "Tokyo Adventure", "discount": "25%", "destination": "Tokyo", "validUntil": "2026-03-15", "image": "/images/tokyo.png"},
    {"id": "deal-004", "title": "New York Weekend", "discount": "10%", "destination": "New York", "validUntil": "2026-01-31", "image": "/images/newyork.png"},
    {"id": "deal-005", "title": "London Calling", "discount": "30%", "destination": "London", "validUntil": "2026-04-30", "image": "/images/london.png"},
    {"id": "deal-006", "title": "Sydney Explorer", "discount": "15%", "destination": "Sydney", "validUntil": "2026-05-31", "image": "/images/sydney.png"}
]

with open(f"{data_dir}/flights.json", "w") as f:
    json.dump(flights, f, indent=2)

with open(f"{data_dir}/hotels.json", "w") as f:
    json.dump(hotels, f, indent=2)

with open(f"{data_dir}/deals.json", "w") as f:
    json.dump(deals, f, indent=2)

print(f"Generated 250 flights, 100 hotels, and 6 deals in {data_dir}")
