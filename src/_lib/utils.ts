export async function getIpLocation() {
  return {
    "ip":"128.187.16.184",
    "continent_code":"NA",
    "continent_name":"North America",
    "country_code2":"US",
    "country_code3":"USA",
    "country_name":"United States",
    "country_name_official":"United States of America",
    "country_capital":"Washington, D.C.",
    "state_prov":"Utah",
    "state_code":"US-UT",
    "district":"Salt Lake County",
    "city":"Salt Lake City",
    "zipcode":"84111",
    "latitude":40.76056,
    "longitude":-111.88814,
    "is_eu":false,
    "country_flag":"https://ipgeolocation.io/static/flags/us_64.png",
    "geoname_id":"12036213",
    "country_emoji":"🇺🇸",
    "calling_code":"+1",
    "country_tld":".us",
    "languages":"en-US,es-US,haw,fr",
    "isp":"FirstDigital Communications, LLC",
    "connection_type":"",
    "organization":"FirstDigital Communications, LLC",
    "currency":{
      "code":"USD",
      "name":"US Dollar",
      "symbol":"$"
    },
    "time_zone":{
      "name":"America/Denver",
      "offset":-7,
      "offset_with_dst":-7,
      "current_time":"2026-01-24 18:03:43.286-0700",
      "current_time_unix":1769303023.286,
      "current_tz_abbreviation":"MST",
      "current_tz_full_name":"Mountain Standard Time",
      "standard_tz_abbreviation":"MST",
      "standard_tz_full_name":"Mountain Standard Time",
      "is_dst":false,
      "dst_savings":0,
      "dst_exists":true,
      "dst_tz_abbreviation":"MDT",
      "dst_tz_full_name":"Mountain Daylight Time",
      "dst_start":{
        "utc_time":"2026-03-08 TIME 09",
        "duration":"+1H",
        "gap":true,
        "dateTimeAfter":"2026-03-08 TIME 03",
        "dateTimeBefore":"2026-03-08 TIME 02",
        "overlap":false
      },
      "dst_end":{
        "utc_time":"2026-11-01 TIME 08",
        "duration":"-1H",
        "gap":false,
        "dateTimeAfter":"2026-11-01 TIME 01",
        "dateTimeBefore":"2026-11-01 TIME 02",
        "overlap":true
      }
    }
  }
}

export interface MapRegion {
  center: {
    latitude: number;
    longitude: number;
  }
  span: {
    latitudeDelta: number;
    longitudeDelta: number;
  }
}

export const storedMapRegion = {
  get(): MapRegion | null {
    const storedRegion = localStorage.getItem("startup_map_region");
    if (storedRegion) {
      return JSON.parse(storedRegion);
    }
    return null;
  },
  set(region: MapRegion) {
    localStorage.setItem("startup_map_region", JSON.stringify(region));
  }
}