from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def extract_gps(image_file):
    image = Image.open(image_file)
    exif_data = image._getexif()

    if not exif_data:
        return None

    gps_info = {}
    for key, val in exif_data.items():
        if TAGS.get(key) == "GPSInfo":
            for t in val:
                gps_info[GPSTAGS.get(t)] = val[t]

    def convert_to_degrees(value):
        d, m, s = value
        return float(d) + float(m) / 60 + float(s) / 3600

    if "GPSLatitude" in gps_info and "GPSLongitude" in gps_info:
        lat = convert_to_degrees(gps_info["GPSLatitude"])
        if gps_info.get("GPSLatitudeRef") == "S":
            lat = -lat
        lon = convert_to_degrees(gps_info["GPSLongitude"])
        if gps_info.get("GPSLongitudeRef") == "W":
            lon = -lon
        return {"lat": lat, "lon": lon}  # <-- use 'lon' instead of 'lng'

    return None
