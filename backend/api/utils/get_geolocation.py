from django.contrib.gis.geoip2 import GeoIP2

def get_geolocation(ip_address):
    g = GeoIP2()
    try:
        geolocation = g.city(ip_address)
        geo_location = {
            "country": geolocation['country_name'],
            "city": geolocation['city'],
            "latitude": geolocation['latitude'],
            "longitude": geolocation['longitude']
        }
        return geo_location
    except Exception:
        return None
