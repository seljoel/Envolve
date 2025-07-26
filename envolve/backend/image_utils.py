import exifread

def convert_to_degrees(value):
    d, m, s = [float(x.num) / float(x.den) for x in value.values]
    return d + (m / 60.0) + (s / 3600.0)

def extract_gps(file):
    tags = exifread.process_file(file)
    try:
        lat = convert_to_degrees(tags["GPS GPSLatitude"])
        lon = convert_to_degrees(tags["GPS GPSLongitude"])
        if tags["GPS GPSLatitudeRef"].values != "N":
            lat = -lat
        if tags["GPS GPSLongitudeRef"].values != "E":
            lon = -lon
        return {"lat": lat, "lon": lon}
    except KeyError:
        return None
