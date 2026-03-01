/**
 * Flight Delay Predictor - Frontend
 * API: https://aviai-production.up.railway.app
 */

const API_BASE = 'https://aviai-production.up.railway.app';
const MISTRAL_API_KEY = 'WOOaYSCNyVxWzMEtD7unH4gX637P6zJR';
const FLIGHTAPI_KEY = '69a34ac0c32d581cf926c37d'; // Get from https://docs.flightapi.io

/** All assets live in docs/ – paths are filenames only (base tag in HTML handles GitHub Pages) */
function getAssetBase() {
  return '';
}

// IATA airline code -> full name lookup (from metadata: AA, AS, B6, DL, F9, G4, HA, MQ, NK, OH, OO, UA, WN, YX)
const AIRLINE_LOOKUP = {
  AA: 'American Airlines',
  AS: 'Alaska Airlines',
  B6: 'JetBlue Airways',
  DL: 'Delta Air Lines',
  F9: 'Frontier Airlines',
  G4: 'Allegiant Air',
  HA: 'Hawaiian Airlines',
  MQ: 'Envoy Air',
  NK: 'Spirit Airlines',
  OH: 'PSA Airlines',
  OO: 'SkyWest Airlines',
  UA: 'United Airlines',
  WN: 'Southwest Airlines',
  YX: 'Republic Airways',
};

function formatAirline(code) {
  const key = String(code || '').trim();
  return AIRLINE_LOOKUP[key] || code;
}

// IATA code -> filename in docs (use placeholder for unknown)
const AIRLINE_LOGO_ASSETS = {
  AA: 'dezeen_American-Airlines-logo-and-livery_4a-300x300.jpg',
  B6: 'jetblue-logo-editorial-illustrative-white-background-logo-icon-vector-logos-icons-set-social-media-flat-banner-vectors-svg-eps-210442882.jpg.webp',
  HA: 'Hawaiian-Airlines-Logo.png',
  NK: 'spirit-airlines-logo-png_seeklogo-278034.png',
  UA: 'united_airlines_icon-logo_brandlogos.net_54inw.png',
  DL: 'delta_c_r.png',
};
const AIRLINE_LOGO_PLACEHOLDER = 'airplane.png';

function getAirlineLogoPath(airlineCode) {
  const code = String(airlineCode || '').trim().toUpperCase();
  const filename = AIRLINE_LOGO_ASSETS[code] || AIRLINE_LOGO_PLACEHOLDER;
  return getAssetBase() + filename;
}

// Aircraft type -> image in docs (Airbus: LH_A380_l.png, Boeing: LH_B744_l.png)
function getAircraftImagePath(aircraftStr) {
  const s = String(aircraftStr || '').trim().toUpperCase();
  if (!s) return '';
  const base = getAssetBase();
  if (/AIRBUS|^A3\d{2}|^A3\d|^A3\b|^A32|^A33|^A34|^A35|^A38/.test(s)) return base + 'LH_A380_l.png';
  if (/BOEING|^B7\d{2}|^B7\d|^B7\b|^B73|^B74|^B75|^B76|^B77|^B78/.test(s)) return base + 'LH_B744_l.png';
  return '';
}

// Major airlines: contact info (address, phone, website). Others show placeholder with *.
const AIRLINE_INFO = {
  AA: {
    address: '1 Skyview Drive, Fort Worth, TX 76155, USA',
    phone: '682 278‑9000',
    phoneNote: 'corporate / HQ',
    website: 'https://aa.com',
  },
  DL: {
    address: 'Hartsfield‑Jackson Atlanta International Airport, Atlanta',
    phone: '1‑800‑221‑1212',
    phoneNote: 'reservations / customer service',
    website: 'https://delta.com',
  },
  UA: {
    address: '1200 E. Algonquin Road, Elk Grove Township, IL ',
    phone: '1‑800‑864‑8331',
    phoneNote: 'reservations',
    website: 'https://united.com',
  },
  WN: {
    address: '2702 Love Field Drive, Dallas, TX 75235 (P.O. Box 36647‑1CR, Dallas, TX 75235)',
    phone: '1‑800‑435‑9792',
    phoneNote: 'customer service',
    website: 'https://southwest.com',
  },
  B6: {
    address: '27‑01 Queen Plaza North, Long Island City, NY 11101 (P.O. Box 17435, Salt Lake City, UT 84117)',
    phone: '1‑800‑538‑2583',
    phoneNote: 'customer support',
    website: 'https://jetblue.com',
  },
  AS: {
    address: '19300 Commerce Way, SeaTac, WA 98198 (P.O. Box 68900, Seattle, WA 98168)',
    phone: '1‑800‑252‑7522',
    phoneNote: 'customer relations',
    website: 'https://alaskaair.com',
  },
  NK: {
    address: '2800 Executive Way, Miramar, FL 33025',
    phone: '1‑855‑728‑3555',
    phoneNote: 'customer relations',
    website: 'https://spirit.com',
  },
  F9: {
    address: '4545 Airport Way, Denver, CO 80239',
    phone: '1‑602‑333‑5925',
    phoneNote: 'customer relations',
    website: 'https://flyfrontier.com',
  },
  HA: {
    address: '3375 Koapaka Street, Suite G‑350, Honolulu, HI 96819 (P.O. Box 30008, Honolulu, HI 96820)',
    phone: '1‑800‑367‑5320',
    phoneNote: 'general customer service',
    website: 'https://hawaiianairlines.com',
  },
  SY: {
    address: '4301 West 78th Street, Minneapolis, MN 55435 (2005 Cargo Road, Minneapolis, MN 55450)',
    phone: '1‑952‑658‑1133',
    phoneNote: 'corporate / customer service',
    website: 'https://suncountry.com',
  },
};

function getAirlineInfo(airlineCode) {
  const code = String(airlineCode || '').trim().toUpperCase();
  return AIRLINE_INFO[code] || null;
}

function renderAirlineDetails(airlineCode) {
  const info = getAirlineInfo(airlineCode);
  if (info) {
    const parts = [
      `<p class="airline-contact-line"><strong>Address:</strong> ${info.address}</p>`,
      `<p class="airline-contact-line"><strong>Phone:</strong> ${info.phone}${info.phoneNote ? ` (${info.phoneNote})` : ''}</p>`,
      `<p class="airline-contact-line"><strong>Website:</strong> <a href="${info.website}" target="_blank" rel="noopener">${info.website.replace(/^https:\/\//, '')}</a></p>`,
    ];
    return parts.join('');
  }
  return '<p class="airline-contact airline-placeholder">Website, phone, and address available from airline.<sup>*</sup></p><p class="airline-placeholder-note"><sup>*</sup> Placeholder — airline not in our database.</p>';
}

// BTS airport ID -> { iata, city } lookup for common US airports
// Unknown IDs will display as the numeric ID
const BTS_AIRPORT_LOOKUP = {
  10135: { iata: 'ABE', city: 'Allentown' },
  10136: { iata: 'ABI', city: 'Abilene' },
  10140: { iata: 'ABQ', city: 'Albuquerque' },
  10141: { iata: 'ABY', city: 'Albany (GA)' },
  10146: { iata: 'ACK', city: 'Nantucket' },
  10154: { iata: 'ACT', city: 'Waco' },
  10155: { iata: 'ACV', city: 'Arcata/Eureka' },
  10157: { iata: 'ACY', city: 'Atlantic City' },
  10158: { iata: 'ADK', city: 'Adak Island' },
  10165: { iata: 'AEX', city: 'Alexandria' },
  10170: { iata: 'AGS', city: 'Augusta' },
  10185: { iata: 'ALB', city: 'Albany (NY)' },
  10208: { iata: 'AMA', city: 'Amarillo' },
  10245: { iata: 'ANC', city: 'Anchorage' },
  10257: { iata: 'ASE', city: 'Aspen' },
  10268: { iata: 'ATL', city: 'Atlanta' },
  10279: { iata: 'ATW', city: 'Appleton' },
  10299: { iata: 'AUS', city: 'Austin' },
  10333: { iata: 'AVL', city: 'Asheville' },
  10372: { iata: 'AVP', city: 'Scranton/Wilkes-Barre' },
  10397: { iata: 'ATL', city: 'Atlanta' },
  10408: { iata: 'AZO', city: 'Kalamazoo' },
  10409: { iata: 'BDL', city: 'Hartford' },
  10423: { iata: 'AUS', city: 'Austin' },
  10431: { iata: 'BET', city: 'Bethel' },
  10434: { iata: 'BFL', city: 'Bakersfield' },
  10466: { iata: 'BGR', city: 'Bangor' },
  10469: { iata: 'BHM', city: 'Birmingham' },
  10529: { iata: 'BIL', city: 'Billings' },
  10551: { iata: 'BIS', city: 'Bismarck' },
  10558: { iata: 'BNA', city: 'Nashville' },
  10561: { iata: 'BOI', city: 'Boise' },
  10577: { iata: 'BOS', city: 'Boston' },
  10581: { iata: 'BPT', city: 'Beaumont' },
  10599: { iata: 'BQK', city: 'Brunswick' },
  10617: { iata: 'BRO', city: 'Brownsville' },
  10620: { iata: 'BRW', city: 'Barrow' },
  10627: { iata: 'BTM', city: 'Butte' },
  10631: { iata: 'BTR', city: 'Baton Rouge' },
  10666: { iata: 'BTV', city: 'Burlington' },
  10676: { iata: 'BUF', city: 'Buffalo' },
  10685: { iata: 'BUR', city: 'Burbank' },
  10693: { iata: 'BWI', city: 'Baltimore' },
  10713: { iata: 'BZN', city: 'Bozeman' },
  10721: { iata: 'BOS', city: 'Boston' },
  10728: { iata: 'CAE', city: 'Columbia (SC)' },
  10732: { iata: 'CAK', city: 'Akron/Canton' },
  10739: { iata: 'CHA', city: 'Chattanooga' },
  10747: { iata: 'CHO', city: 'Charlottesville' },
  10754: { iata: 'CHS', city: 'Charleston (SC)' },
  10779: { iata: 'CLE', city: 'Cleveland' },
  10781: { iata: 'CLL', city: 'College Station' },
  10785: { iata: 'CLT', city: 'Charlotte' },
  10792: { iata: 'CMH', city: 'Columbus (OH)' },
  10800: { iata: 'COS', city: 'Colorado Springs' },
  10821: { iata: 'CRP', city: 'Corpus Christi' },
  10849: { iata: 'CVG', city: 'Cincinnati' },
  10868: { iata: 'DAB', city: 'Daytona Beach' },
  10874: { iata: 'DAL', city: 'Dallas Love Field' },
  10918: { iata: 'DAY', city: 'Dayton' },
  10926: { iata: 'DBQ', city: 'Dubuque' },
  10980: { iata: 'DEN', city: 'Denver' },
  10990: { iata: 'DFW', city: 'Dallas/Fort Worth' },
  10994: { iata: 'DHN', city: 'Dothan' },
  11003: { iata: 'DLH', city: 'Duluth' },
  11013: { iata: 'DRO', city: 'Durango' },
  11027: { iata: 'DSM', city: 'Des Moines' },
  11041: { iata: 'DTW', city: 'Detroit' },
  11042: { iata: 'DVL', city: 'Devils Lake' },
  11049: { iata: 'EAU', city: 'Eau Claire' },
  11057: { iata: 'ECP', city: 'Panama City' },
  11066: { iata: 'CLT', city: 'Charlotte' },
  11067: { iata: 'ELP', city: 'El Paso' },
  11076: { iata: 'EUG', city: 'Eugene' },
  11097: { iata: 'EVV', city: 'Evansville' },
  11109: { iata: 'EWR', city: 'Newark' },
  11111: { iata: 'EYW', city: 'Key West' },
  11122: { iata: 'FAI', city: 'Fairbanks' },
  11140: { iata: 'FAR', city: 'Fargo' },
  11146: { iata: 'FAT', city: 'Fresno' },
  11193: { iata: 'FLG', city: 'Flagstaff' },
  11203: { iata: 'FLL', city: 'Fort Lauderdale' },
  11233: { iata: 'FNT', city: 'Flint' },
  11252: { iata: 'FSD', city: 'Sioux Falls' },
  11259: { iata: 'DEN', city: 'Denver' },
  11267: { iata: 'FWA', city: 'Fort Wayne' },
  11278: { iata: 'GEG', city: 'Spokane' },
  11283: { iata: 'GFK', city: 'Grand Forks' },
  11288: { iata: 'GGG', city: 'Longview' },
  11292: { iata: 'DFW', city: 'Dallas/Fort Worth' },
  11298: { iata: 'DTW', city: 'Detroit' },
  11308: { iata: 'GJT', city: 'Grand Junction' },
  11315: { iata: 'GNV', city: 'Gainesville' },
  11336: { iata: 'GPT', city: 'Gulfport' },
  11337: { iata: 'GRB', city: 'Green Bay' },
  11413: { iata: 'GSO', city: 'Greensboro' },
  11423: { iata: 'GSP', city: 'Greenville (SC)' },
  11433: { iata: 'EWR', city: 'Newark' },
  11447: { iata: 'GTR', city: 'Columbus (MS)' },
  11468: { iata: 'HDN', city: 'Hayden' },
  11471: { iata: 'HNL', city: 'Honolulu' },
  11481: { iata: 'HOU', city: 'Houston Hobby' },
  11503: { iata: 'HPN', city: 'White Plains' },
  11525: { iata: 'HSV', city: 'Huntsville' },
  11537: { iata: 'IAD', city: 'Washington Dulles' },
  11540: { iata: 'IAH', city: 'Houston' },
  11587: { iata: 'ICT', city: 'Wichita' },
  11603: { iata: 'ILM', city: 'Wilmington (NC)' },
  11612: { iata: 'IND', city: 'Indianapolis' },
  11617: { iata: 'IPL', city: 'Imperial' },
  11618: { iata: 'ISO', city: 'Kinston' },
  11624: { iata: 'JAN', city: 'Jackson (MS)' },
  11630: { iata: 'JAX', city: 'Jacksonville' },
  11637: { iata: 'JFK', city: 'New York JFK' },
  11638: { iata: 'JLN', city: 'Joplin' },
  11641: { iata: 'JMS', city: 'Jamestown' },
  11648: { iata: 'JNU', city: 'Juneau' },
  11695: { iata: 'KOA', city: 'Kona' },
  11697: { iata: 'KTN', city: 'Ketchikan' },
  11711: { iata: 'LAN', city: 'Lansing' },
  11721: { iata: 'LAS', city: 'Las Vegas' },
  11725: { iata: 'LAW', city: 'Lawton' },
  11775: { iata: 'LBB', city: 'Lubbock' },
  11778: { iata: 'LBE', city: 'Latrobe' },
  11823: { iata: 'LEX', city: 'Lexington' },
  11865: { iata: 'LFT', city: 'Lafayette' },
  11867: { iata: 'LGA', city: 'New York LaGuardia' },
  11884: { iata: 'LIT', city: 'Little Rock' },
  11898: { iata: 'LNK', city: 'Lincoln' },
  11905: { iata: 'LRD', city: 'Laredo' },
  11921: { iata: 'LSE', city: 'La Crosse' },
  11953: { iata: 'LWB', city: 'Lewisburg' },
  11973: { iata: 'LYH', city: 'Lynchburg' },
  11977: { iata: 'MAF', city: 'Midland' },
  11980: { iata: 'MBS', city: 'Saginaw' },
  11982: { iata: 'MCI', city: 'Kansas City' },
  11986: { iata: 'MCO', city: 'Orlando' },
  11995: { iata: 'MDT', city: 'Harrisburg' },
  11996: { iata: 'MDW', city: 'Chicago Midway' },
  11997: { iata: 'MEI', city: 'Meridian' },
  12003: { iata: 'MEM', city: 'Memphis' },
  12007: { iata: 'MFE', city: 'McAllen' },
  12012: { iata: 'MFR', city: 'Medford' },
  12016: { iata: 'MGM', city: 'Montgomery' },
  12094: { iata: 'MHK', city: 'Manhattan' },
  12119: { iata: 'MIA', city: 'Miami' },
  12124: { iata: 'MKE', city: 'Milwaukee' },
  12129: { iata: 'MLB', city: 'Melbourne' },
  12156: { iata: 'MLI', city: 'Moline' },
  12173: { iata: 'MLU', city: 'Monroe' },
  12177: { iata: 'MOB', city: 'Mobile' },
  12191: { iata: 'MQT', city: 'Marquette' },
  12197: { iata: 'MRY', city: 'Monterey' },
  12206: { iata: 'MSN', city: 'Madison' },
  12217: { iata: 'MSP', city: 'Minneapolis' },
  12223: { iata: 'MSY', city: 'New Orleans' },
  12250: { iata: 'MTJ', city: 'Montrose' },
  12255: { iata: 'MVY', city: "Martha's Vineyard"},
  12264: { iata: 'MYR', city: 'Myrtle Beach' },
  12265: { iata: 'OAJ', city: 'Jacksonville (NC)' },
  12266: { iata: 'IAH', city: 'Houston' },
  12278: { iata: 'OKC', city: 'Oklahoma City' },
  12280: { iata: 'OMA', city: 'Omaha' },
  12323: { iata: 'ORD', city: "Chicago O'Hare" },
  12335: { iata: 'ORF', city: 'Norfolk' },
  12339: { iata: 'OTH', city: 'North Bend' },
  12343: { iata: 'OTZ', city: 'Kotzebue' },
  12391: { iata: 'PBI', city: 'West Palm Beach' },
  12402: { iata: 'PDX', city: 'Portland (OR)' },
  12441: { iata: 'PHF', city: 'Newport News' },
  12448: { iata: 'PHL', city: 'Philadelphia' },
  12451: { iata: 'PHX', city: 'Phoenix' },
  12478: { iata: 'JFK', city: 'New York JFK' },
  12511: { iata: 'PIA', city: 'Peoria' },
  12519: { iata: 'PIT', city: 'Pittsburgh' },
  12523: { iata: 'PLN', city: 'Pellston' },
  12544: { iata: 'PNS', city: 'Pensacola' },
  12559: { iata: 'PRC', city: 'Prescott' },
  12758: { iata: 'PVD', city: 'Providence' },
  12819: { iata: 'PWM', city: 'Portland (ME)' },
  12878: { iata: 'RAP', city: 'Rapid City' },
  12884: { iata: 'RDU', city: 'Raleigh/Durham' },
  12888: { iata: 'RFD', city: 'Rockford' },
  12889: { iata: 'LAS', city: 'Las Vegas' },
  12891: { iata: 'RIC', city: 'Richmond' },
  12892: { iata: 'LAX', city: 'Los Angeles' },
  12896: { iata: 'RNO', city: 'Reno' },
  12898: { iata: 'ROA', city: 'Roanoke' },
  12899: { iata: 'ROC', city: 'Rochester (NY)' },
  12902: { iata: 'ROW', city: 'Roswell' },
  12915: { iata: 'RSW', city: 'Fort Myers' },
  12917: { iata: 'RST', city: 'Rochester (MN)' },
  12945: { iata: 'SAF', city: 'Santa Fe' },
  12951: { iata: 'SAN', city: 'San Diego' },
  12953: { iata: 'SAT', city: 'San Antonio' },
  12954: { iata: 'SAV', city: 'Savannah' },
  12982: { iata: 'SBA', city: 'Santa Barbara' },
  12992: { iata: 'SBN', city: 'South Bend' },
  13029: { iata: 'SDF', city: 'Louisville' },
  13061: { iata: 'SEA', city: 'Seattle' },
  13076: { iata: 'SFO', city: 'San Francisco' },
  13127: { iata: 'SGF', city: 'Springfield (MO)' },
  13158: { iata: 'SHV', city: 'Shreveport' },
  13184: { iata: 'SIT', city: 'Sitka' },
  13198: { iata: 'SJC', city: 'San Jose' },
  13204: { iata: 'MCO', city: 'Orlando' },
  13211: { iata: 'SJT', city: 'San Angelo' },
  13230: { iata: 'SLC', city: 'Salt Lake City' },
  13232: { iata: 'SLE', city: 'Salem' },
  13241: { iata: 'SMF', city: 'Sacramento' },
  13244: { iata: 'SMX', city: 'Santa Maria' },
  13256: { iata: 'SNA', city: 'Santa Ana' },
  13264: { iata: 'SPI', city: 'Springfield (IL)' },
  13277: { iata: 'SPS', city: 'Wichita Falls' },
  13282: { iata: 'SRQ', city: 'Sarasota' },
  13290: { iata: 'STL', city: 'St. Louis' },
  13296: { iata: 'SUN', city: 'Hailey' },
  13303: { iata: 'MIA', city: 'Miami' },
  13342: { iata: 'SUX', city: 'Sioux City' },
  13360: { iata: 'SWF', city: 'Newburgh' },
  13367: { iata: 'SYR', city: 'Syracuse' },
  13377: { iata: 'TOL', city: 'Toledo' },
  13422: { iata: 'TPA', city: 'Tampa' },
  13433: { iata: 'TRI', city: 'Tri-Cities' },
  13459: { iata: 'TUL', city: 'Tulsa' },
  13476: { iata: 'TUS', city: 'Tucson' },
  13485: { iata: 'MSP', city: 'Minneapolis' },
  13486: { iata: 'TVL', city: 'South Lake Tahoe' },
  13487: { iata: 'TWF', city: 'Twin Falls' },
  13495: { iata: 'TYR', city: 'Tyler' },
  13502: { iata: 'TYS', city: 'Knoxville' },
  13541: { iata: 'VPS', city: 'Fort Walton Beach' },
  13577: { iata: 'WRG', city: 'Wrangell' },
  13795: { iata: 'XNA', city: 'Northwest Arkansas' },
  13796: { iata: 'YAK', city: 'Yakutat' },
  13830: { iata: 'YUM', city: 'Yuma' },
  13851: { iata: 'ABE', city: 'Allentown' },
  13871: { iata: 'ABQ', city: 'Albuquerque' },
  13873: { iata: 'ABY', city: 'Albany (GA)' },
  13891: { iata: 'ACK', city: 'Nantucket' },
  13930: { iata: 'ORD', city: "Chicago O'Hare" },
  13931: { iata: 'ACV', city: 'Arcata/Eureka' },
  13933: { iata: 'ACY', city: 'Atlantic City' },
  13964: { iata: 'AGS', city: 'Augusta' },
  13970: { iata: 'AEX', city: 'Alexandria' },
  14004: { iata: 'ALB', city: 'Albany (NY)' },
  14025: { iata: 'AMA', city: 'Amarillo' },
  14027: { iata: 'ANC', city: 'Anchorage' },
  14057: { iata: 'ASE', city: 'Aspen' },
  14082: { iata: 'ATW', city: 'Appleton' },
  14100: { iata: 'PHL', city: 'Philadelphia' },
  14107: { iata: 'AVL', city: 'Asheville' },
  14108: { iata: 'AVP', city: 'Scranton/Wilkes-Barre' },
  14109: { iata: 'AZO', city: 'Kalamazoo' },
  14112: { iata: 'BDL', city: 'Hartford' },
  14113: { iata: 'PHX', city: 'Phoenix' },
  14120: { iata: 'BET', city: 'Bethel' },
  14122: { iata: 'BFL', city: 'Bakersfield' },
  14150: { iata: 'BGM', city: 'Binghamton' },
  14193: { iata: 'BGR', city: 'Bangor' },
  14222: { iata: 'BHM', city: 'Birmingham' },
  14231: { iata: 'BIL', city: 'Billings' },
  14237: { iata: 'BIS', city: 'Bismarck' },
  14252: { iata: 'BNA', city: 'Nashville' },
  14254: { iata: 'BOI', city: 'Boise' },
  14256: { iata: 'BPT', city: 'Beaumont' },
  14259: { iata: 'BQK', city: 'Brunswick' },
  14262: { iata: 'BRO', city: 'Brownsville' },
  14307: { iata: 'BRW', city: 'Barrow' },
  14314: { iata: 'BTM', city: 'Butte' },
  14321: { iata: 'BTR', city: 'Baton Rouge' },
  14457: { iata: 'BTV', city: 'Burlington' },
  14487: { iata: 'BUF', city: 'Buffalo' },
  14489: { iata: 'BUR', city: 'Burbank' },
  14492: { iata: 'BWI', city: 'Baltimore' },
  14512: { iata: 'BZN', city: 'Bozeman' },
  14520: { iata: 'CAE', city: 'Columbia (SC)' },
  14524: { iata: 'CAK', city: 'Akron/Canton' },
  14534: { iata: 'CHA', city: 'Chattanooga' },
  14543: { iata: 'CHO', city: 'Charlottesville' },
  14570: { iata: 'CHS', city: 'Charleston (SC)' },
  14574: { iata: 'CLE', city: 'Cleveland' },
  14576: { iata: 'CLL', city: 'College Station' },
  14588: { iata: 'CMH', city: 'Columbus (OH)' },
  14633: { iata: 'COS', city: 'Colorado Springs' },
  14635: { iata: 'CRP', city: 'Corpus Christi' },
  14674: { iata: 'CVG', city: 'Cincinnati' },
  14679: { iata: 'DAB', city: 'Daytona Beach' },
  14683: { iata: 'DAL', city: 'Dallas Love Field' },
  14685: { iata: 'DAY', city: 'Dayton' },
  14689: { iata: 'DBQ', city: 'Dubuque' },
  14696: { iata: 'DHN', city: 'Dothan' },
  14698: { iata: 'DLH', city: 'Duluth' },
  14709: { iata: 'DRO', city: 'Durango' },
  14711: { iata: 'DSM', city: 'Des Moines' },
  14716: { iata: 'DVL', city: 'Devils Lake' },
  14730: { iata: 'EAU', city: 'Eau Claire' },
  14747: { iata: 'SEA', city: 'Seattle' },
  14761: { iata: 'ECP', city: 'Panama City' },
  14771: { iata: 'SFO', city: 'San Francisco' },
  14783: { iata: 'ELP', city: 'El Paso' },
  14794: { iata: 'EUG', city: 'Eugene' },
  14812: { iata: 'EVV', city: 'Evansville' },
  14814: { iata: 'EYW', city: 'Key West' },
  14828: { iata: 'FAI', city: 'Fairbanks' },
  14831: { iata: 'FAR', city: 'Fargo' },
  14842: { iata: 'FAT', city: 'Fresno' },
  14843: { iata: 'FLG', city: 'Flagstaff' },
  14869: { iata: 'SLC', city: 'Salt Lake City' },
  14877: { iata: 'FLL', city: 'Fort Lauderdale' },
  14893: { iata: 'FNT', city: 'Flint' },
  14905: { iata: 'FSD', city: 'Sioux Falls' },
  14908: { iata: 'FWA', city: 'Fort Wayne' },
  14952: { iata: 'GEG', city: 'Spokane' },
  14955: { iata: 'GFK', city: 'Grand Forks' },
  14960: { iata: 'GGG', city: 'Longview' },
  14986: { iata: 'GJT', city: 'Grand Junction' },
  15008: { iata: 'GNV', city: 'Gainesville' },
  15016: { iata: 'GPT', city: 'Gulfport' },
  15023: { iata: 'GRB', city: 'Green Bay' },
  15024: { iata: 'GSO', city: 'Greensboro' },
  15027: { iata: 'GSP', city: 'Greenville (SC)' },
  15041: { iata: 'GTR', city: 'Columbus (MS)' },
  15048: { iata: 'HDN', city: 'Hayden' },
  15070: { iata: 'HNL', city: 'Honolulu' },
  15074: { iata: 'HOU', city: 'Houston Hobby' },
  15096: { iata: 'HPN', city: 'White Plains' },
  15249: { iata: 'HSV', city: 'Huntsville' },
  15295: { iata: 'IAD', city: 'Washington Dulles' },
  15304: { iata: 'IAH', city: 'Houston' },
  15323: { iata: 'ICT', city: 'Wichita' },
  15356: { iata: 'ILM', city: 'Wilmington (NC)' },
  15370: { iata: 'IND', city: 'Indianapolis' },
  15376: { iata: 'IPL', city: 'Imperial' },
  15380: { iata: 'ISO', city: 'Kinston' },
  15389: { iata: 'JAN', city: 'Jackson (MS)' },
  15401: { iata: 'JAX', city: 'Jacksonville' },
  15411: { iata: 'JFK', city: 'New York JFK' },
  15412: { iata: 'JLN', city: 'Joplin' },
  15569: { iata: 'JMS', city: 'Jamestown' },
  15624: { iata: 'JNU', city: 'Juneau' },
  15841: { iata: 'KOA', city: 'Kona' },
  15897: { iata: 'KTN', city: 'Ketchikan' },
  15919: { iata: 'LAN', city: 'Lansing' },
  15991: { iata: 'LAW', city: 'Lawton' },
  16218: { iata: 'LBB', city: 'Lubbock' },
  16422: { iata: 'LBE', city: 'Latrobe' },
  16869: { iata: 'LEX', city: 'Lexington' },
};

// IATA -> { lat, lon } for Open-Meteo weather (major US airports)
const AIRPORT_COORDS = {
  ABQ: { lat: 35.0402, lon: -106.6091 },
  ANC: { lat: 61.1743, lon: -149.9962 },
  ATL: { lat: 33.6367, lon: -84.4281 },
  AUS: { lat: 30.1975, lon: -97.6664 },
  BOS: { lat: 42.3656, lon: -71.0096 },
  BUR: { lat: 34.2006, lon: -118.3587 },
  BWI: { lat: 39.1754, lon: -76.6683 },
  CLE: { lat: 41.4117, lon: -81.8498 },
  CLT: { lat: 35.2144, lon: -80.9473 },
  CVG: { lat: 39.0488, lon: -84.6678 },
  DAL: { lat: 32.8471, lon: -96.8518 },
  DEN: { lat: 39.8561, lon: -104.6737 },
  DFW: { lat: 32.8968, lon: -97.038 },
  DTW: { lat: 42.2124, lon: -83.3534 },
  EWR: { lat: 40.6895, lon: -74.1745 },
  FLL: { lat: 26.0726, lon: -80.1527 },
  HNL: { lat: 21.3187, lon: -157.9225 },
  IAD: { lat: 38.9445, lon: -77.4558 },
  IAH: { lat: 29.9902, lon: -95.3368 },
  IND: { lat: 39.7173, lon: -86.2944 },
  JFK: { lat: 40.6398, lon: -73.7789 },
  LAS: { lat: 36.0840, lon: -115.1537 },
  LAX: { lat: 33.9425, lon: -118.4080 },
  LGA: { lat: 40.7769, lon: -73.8740 },
  MCO: { lat: 28.4312, lon: -81.3081 },
  MDW: { lat: 41.7860, lon: -87.7524 },
  MEM: { lat: 35.0424, lon: -89.9767 },
  MIA: { lat: 25.7959, lon: -80.2870 },
  MSP: { lat: 44.8820, lon: -93.2218 },
  MSY: { lat: 29.9934, lon: -90.2580 },
  OAK: { lat: 37.7213, lon: -122.2207 },
  ONT: { lat: 34.0560, lon: -117.6012 },
  ORD: { lat: 41.9742, lon: -87.9073 },
  PDX: { lat: 45.5887, lon: -122.5975 },
  PHL: { lat: 39.8729, lon: -75.2437 },
  PHX: { lat: 33.4373, lon: -112.0078 },
  PIT: { lat: 40.4915, lon: -80.2329 },
  SAN: { lat: 32.7338, lon: -117.1933 },
  SAT: { lat: 29.5337, lon: -98.4698 },
  SEA: { lat: 47.4502, lon: -122.3088 },
  SFO: { lat: 37.6213, lon: -122.3790 },
  SJC: { lat: 37.3626, lon: -121.9290 },
  SLC: { lat: 40.7899, lon: -111.9791 },
  SNA: { lat: 33.6757, lon: -117.8682 },
  STL: { lat: 38.7487, lon: -90.3700 },
  TPA: { lat: 27.9755, lon: -82.5332 },
  TUS: { lat: 32.1161, lon: -110.9410 },
};

function getCoordsForAirport(iata) {
  const code = String(iata || '').trim().toUpperCase();
  return AIRPORT_COORDS[code] || null;
}

// IATA -> IANA timezone for local time display
const AIRPORT_TIMEZONES = {
  JFK: 'America/New_York', LGA: 'America/New_York', EWR: 'America/New_York',
  LAX: 'America/Los_Angeles', SFO: 'America/Los_Angeles', SAN: 'America/Los_Angeles',
  ORD: 'America/Chicago', MDW: 'America/Chicago', DFW: 'America/Chicago', IAH: 'America/Chicago',
  DEN: 'America/Denver', PHX: 'America/Phoenix',
  ATL: 'America/New_York', MIA: 'America/New_York', BOS: 'America/New_York',
  SEA: 'America/Los_Angeles', PDX: 'America/Los_Angeles', LAS: 'America/Los_Angeles',
  MSP: 'America/Chicago', DTW: 'America/Detroit', CLT: 'America/New_York',
};
function getTimezoneForAirport(iata) {
  const code = String(iata || '').trim().toUpperCase();
  return AIRPORT_TIMEZONES[code] || 'America/New_York';
}

// Format airport for dropdown display
function formatAirport(id) {
  const info = BTS_AIRPORT_LOOKUP[id];
  return info ? `${info.iata} - ${info.city}` : id;
}

// Get airport label for Mistral prompt (origin/destination names)
function getAirportNameForPrompt(id) {
  const info = BTS_AIRPORT_LOOKUP[id];
  return info ? `${info.iata} (${info.city})` : `airport ${id}`;
}

// DOM elements
let metadata = null;
const elements = {};
// Store last flight origin/dest for Mistral (same data as delay prediction)
let lastOriginBtsId = null;
let lastDestinationBtsId = null;
let lastOriginName = null;
let lastDestinationName = null;

function initElements() {
  elements.flightNumberInput = document.getElementById('flight-number');
  elements.flightNumberStep = document.getElementById('flight-number-step');
  elements.mainContent = document.getElementById('main-content');
  elements.findFlightBtn = document.getElementById('find-flight-btn');
  elements.flightDataSection = document.getElementById('flight-data-section');
  elements.flightDataContent = document.getElementById('flight-data-content');
  elements.flightDataError = document.getElementById('flight-data-error');
  elements.loading = document.getElementById('loading');
  elements.resultCard = document.getElementById('result-card');
  elements.resultProbability = document.getElementById('result-probability');
  elements.resultMessage = document.getElementById('result-message');
  elements.formError = document.getElementById('form-error');
  elements.mistralBtn = document.getElementById('mistral-btn');
  elements.mistralLoading = document.getElementById('mistral-loading');
  elements.mistralResult = document.getElementById('mistral-result');
  elements.mistralTimestamp = document.getElementById('mistral-timestamp');
  elements.mistralContent = document.getElementById('mistral-content');
  elements.mistralError = document.getElementById('mistral-error');
  elements.suggestionBtn = document.getElementById('suggestion-btn');
  elements.suggestionText = document.getElementById('suggestion-text');
  elements.suggestionLoading = document.getElementById('suggestion-loading');
  elements.suggestionResult = document.getElementById('suggestion-result');
  elements.suggestionTimestamp = document.getElementById('suggestion-timestamp');
  elements.suggestionContent = document.getElementById('suggestion-content');
  elements.suggestionError = document.getElementById('suggestion-error');
  elements.weatherSection = document.getElementById('weather-section');
  elements.weatherOriginLabel = document.getElementById('weather-origin-label');
  elements.weatherOriginContent = document.getElementById('weather-origin-content');
  elements.weatherOriginLoading = document.getElementById('weather-origin-loading');
  elements.weatherOriginError = document.getElementById('weather-origin-error');
  elements.weatherDestLabel = document.getElementById('weather-destination-label');
  elements.weatherDestContent = document.getElementById('weather-destination-content');
  elements.weatherDestLoading = document.getElementById('weather-destination-loading');
  elements.weatherDestError = document.getElementById('weather-destination-error');
  elements.flightNumberDisplay = document.getElementById('flight-number-display');
  elements.countdownValue = document.getElementById('countdown-value');
  elements.aircraftType = document.getElementById('aircraft-type');
  elements.aircraftImage = document.getElementById('aircraft-image');
  elements.airlineName = document.getElementById('airline-name');
  elements.airlineDetails = document.getElementById('airline-details');
  elements.airlineLogo = document.getElementById('airline-logo');
  elements.airlineLogoCard = document.getElementById('airline-logo-card');
  elements.depTimeDisplay = document.getElementById('dep-time-display');
  elements.arrTimeDisplay = document.getElementById('arr-time-display');
  elements.mapOriginLabel = document.getElementById('map-origin-label');
  elements.mapDestLabel = document.getElementById('map-dest-label');
  elements.clockOriginLabel = document.getElementById('clock-origin-label');
  elements.clockOriginTime = document.getElementById('clock-origin-time');
  elements.clockDestLabel = document.getElementById('clock-dest-label');
  elements.clockDestTime = document.getElementById('clock-dest-time');
  elements.heroVideo = document.querySelector('.hero-bg-video');
}

// Fetch metadata (needed for IATA -> BTS ID mapping)
async function loadMetadata() {
  try {
    const res = await fetch(`${API_BASE}/metadata`);
    if (!res.ok) throw new Error('Failed to load metadata');
    metadata = await res.json();
  } catch (err) {
    showFormError('Could not load metadata. Please refresh the page.');
  }
}

// Map IATA code to BTS ID using metadata
function getBtsIdFromIata(iata) {
  if (!metadata?.origins || !iata) return null;
  const code = String(iata).trim().toUpperCase();
  for (const id of metadata.origins) {
    const info = BTS_AIRPORT_LOOKUP[id];
    if (info?.iata === code) return id;
  }
  return null;
}

// Map IATA code to BTS ID for DESTINATION using metadata.destinations (backend expects destination from DEST encoder)
function getDestBtsFromIata(iata) {
  if (!iata) return null;
  const code = String(iata).trim().toUpperCase();
  // 1) Match from destinations list (same logic as origin from origins list)
  if (metadata?.destinations?.length) {
    for (const id of metadata.destinations) {
      const info = BTS_AIRPORT_LOOKUP[id];
      if (info?.iata === code) return id;
    }
  }
  // 2) Fallback: resolve BTS ID from IATA (via origins list), then use only if it's in destinations
  const btsIdFromOriginList = getBtsIdFromIata(iata);
  if (btsIdFromOriginList != null && metadata?.destinations?.length) {
    const destSet = new Set(metadata.destinations.map((d) => String(d)));
    if (destSet.has(String(btsIdFromOriginList))) return btsIdFromOriginList;
  }
  // 3) Reverse lookup: find BTS id for this IATA in BTS_AIRPORT_LOOKUP, then check if in destinations
  for (const [id, info] of Object.entries(BTS_AIRPORT_LOOKUP)) {
    if (info?.iata === code && metadata?.destinations?.length) {
      const destSet = new Set(metadata.destinations.map((d) => String(d)));
      if (destSet.has(String(id))) return id;
    }
  }
  return null;
}

// Extract prediction params from flight data
function extractPredictionParams(flightData, parsed) {
  // Handle array (default/API), double-wrapped array, or single object
  let item = Array.isArray(flightData) ? flightData[0] : flightData;
  if (Array.isArray(item)) item = item[0];
  const dep = item?.departure || {};
  const arr = item?.arrival || {};
  const originIata = (dep.airportCode || dep.airport || '').toString().trim();
  const destIata = (arr.airportCode || arr.airport || '').toString().trim();
  const originBts = getBtsIdFromIata(originIata);
  const destBts = getDestBtsFromIata(destIata);

  // Parse date/time from departure
  const today = new Date();
  let dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  let hour = 12;
  const dtStr = dep.departureDateTime || dep.scheduledTime;
  if (dtStr) {
    const d = new Date(dtStr);
    if (!isNaN(d.getTime())) {
      dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      hour = d.getHours();
    }
  }

  const origin = originBts || originIata;
  const destination = destBts || destIata;
  // Human-readable names from flight data for Mistral (same as displayed)
  const originName = (dep.airportCode || dep.airport || '') + (dep.airportCity ? ` (${dep.airportCity})` : '');
  const destName = (arr.airportCode || arr.airport || '') + (arr.airportCity ? ` (${arr.airportCity})` : '');
  return {
    airline: parsed.airline,
    origin,
    destination,
    departureDate: dateStr,
    departureHour: hour,
    originBts: originBts || originIata,
    destBts: destBts || destIata,
    originIata,
    destIata,
    originName: originName.trim() || (originBts ? getAirportNameForPrompt(originBts) : originIata),
    destName: destName.trim() || (destBts ? getAirportNameForPrompt(destBts) : destIata),
  };
}

// Update dashboard cards from flight data (countdown, aircraft, airline, map, clocks)
function updateDashboardFromFlight(flightData, parsed, params) {
  const item = Array.isArray(flightData) ? flightData[0] : flightData;
  const dep = item?.departure || {};
  const arr = item?.arrival || {};

  if (elements.flightNumberDisplay) {
    elements.flightNumberDisplay.textContent = (parsed?.airline || '') + (parsed?.num || '') || '—';
  }

  const depDate = new Date(params.departureDate + 'T' + String(params.departureHour).padStart(2, '0') + ':00:00');
  const now = Date.now();
  const hrs = Math.max(0, Math.floor((depDate.getTime() - now) / (1000 * 60 * 60)));
  if (elements.countdownValue) {
    elements.countdownValue.textContent = hrs + 'hrs';
  }

  const aircraft = item?.aircraft || item?.aircraftType || item?.equipment || item?.aircraft_type || item?.equipment_code || 'Airbus A380';
  if (elements.aircraftType) elements.aircraftType.textContent = aircraft || 'Airbus A380';
  const aircraftImagePath = getAircraftImagePath(aircraft);
  if (elements.aircraftImage) {
    elements.aircraftImage.src = aircraftImagePath;
    elements.aircraftImage.alt = aircraft ? `${aircraft} image` : '';
  }

  const airlineName = item?.airline || formatAirline(parsed?.airline) || '—';
  if (elements.airlineName) elements.airlineName.textContent = airlineName;
  const logoPath = getAirlineLogoPath(parsed?.airline);
  if (elements.airlineLogo) {
    elements.airlineLogo.src = logoPath;
    elements.airlineLogo.alt = airlineName;
  }
  if (elements.airlineLogoCard) {
    elements.airlineLogoCard.src = logoPath;
    elements.airlineLogoCard.alt = airlineName;
  }
  if (elements.airlineDetails) {
    elements.airlineDetails.innerHTML = renderAirlineDetails(parsed?.airline);
  }

  const depTimeStr = formatTime24(dep.scheduledTime || dep.departureDateTime);
  const arrTimeStr = formatTime24(arr.scheduledTime || arr.estimatedTime || arr.arrivalDateTime || arr.arrival_time || arr.time);
  if (elements.depTimeDisplay) elements.depTimeDisplay.textContent = depTimeStr || '—';
  if (elements.arrTimeDisplay) elements.arrTimeDisplay.textContent = arrTimeStr || '—';

  const originLabel = params.originName || (dep.airportCode || dep.airport || '') + ' ' + (dep.airportCity || '');
  const destLabel = params.destName || (arr.airportCode || arr.airport || '') + ' ' + (arr.airportCity || '');
  if (elements.mapOriginLabel) elements.mapOriginLabel.textContent = (dep.airportCode || dep.airport || '') + ' ' + (dep.airportCity || 'Origin');
  if (elements.mapDestLabel) elements.mapDestLabel.textContent = (arr.airportCode || arr.airport || '') + ' ' + (arr.airportCity || 'Destination');

  function updateClocks() {
    const tzOrigin = getTimezoneForAirport(params.originIata);
    const tzDest = getTimezoneForAirport(params.destIata);
    const cityOrigin = dep.airportCity || params.originIata || 'Origin';
    const cityDest = arr.airportCity || params.destIata || 'Destination';
    if (elements.clockOriginLabel) elements.clockOriginLabel.textContent = cityOrigin;
    if (elements.clockDestLabel) elements.clockDestLabel.textContent = cityDest;
    try {
      if (elements.clockOriginTime) {
        elements.clockOriginTime.textContent = new Date().toLocaleTimeString('en-US', { timeZone: tzOrigin, hour: 'numeric', minute: '2-digit' });
      }
      if (elements.clockDestTime) {
        elements.clockDestTime.textContent = new Date().toLocaleTimeString('en-US', { timeZone: tzDest, hour: 'numeric', minute: '2-digit' });
      }
    } catch (_) {
      if (elements.clockOriginTime) elements.clockOriginTime.textContent = '—';
      if (elements.clockDestTime) elements.clockDestTime.textContent = '—';
    }
  }
  updateClocks();
  setInterval(updateClocks, 60000);
}

// Run delay prediction
async function runPrediction(params) {
  hideFormError();
  hideResult();
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        airline: params.airline,
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departureDate,
        departure_hour: params.departureHour,
        distance: 500,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || 'Prediction failed');
    showResult(data);
  } catch (err) {
    showFormError(err.message || 'Could not predict delay. Please try again.');
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  elements.loading?.classList.toggle('hidden', !on);
}

function showResult(data) {
  const prob = (data.delay_probability * 100).toFixed(1);
  elements.resultProbability.textContent = `${prob}%`;
  elements.resultMessage.textContent = data.is_delayed
    ? 'This flight is likely to be delayed.'
    : 'This flight looks on time.';
  elements.resultCard?.classList.remove('hidden');
}

function hideResult() {
  elements.resultCard?.classList.add('hidden');
}

function showFormError(msg) {
  elements.formError.textContent = msg;
  elements.formError?.classList.remove('hidden');
}

// Fetch weather from Open-Meteo for a location
async function fetchWeather(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m');
  url.searchParams.set('forecast_days', '3');
  url.searchParams.set('timezone', 'auto');
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
}

// Render weather data to HTML
function renderWeather(data) {
  const cur = data?.current;
  if (!cur) return 'No data';
  const temp = cur.temperature_2m;
  const unit = data.current_units?.temperature_2m ?? '°C';
  const wmo = cur.weather_code;
  const desc = getWeatherDesc(wmo);
  const humidity = cur.relative_humidity_2m ?? '';
  const wind = cur.wind_speed_10m;
  const windUnit = data.current_units?.wind_speed_10m ?? 'km/h';
  const parts = [`<div class="temp">${temp}${unit}</div>`, `<div class="desc">${desc}</div>`];
  if (humidity !== '') parts.push(`<div class="meta">Humidity: ${humidity}%</div>`);
  if (wind != null) parts.push(`<div class="meta">Wind: ${wind} ${windUnit}</div>`);
  return parts.join('');
}

function getWeatherDesc(wmo) {
  const map = {
    0: 'Clear',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
  };
  return map[wmo] ?? 'Unknown';
}

// Load and display weather for origin and destination
async function loadWeather(params) {
  const { originIata, destIata, originName, destName } = params;
  if (!elements.weatherSection) return;

  elements.weatherSection.classList.remove('hidden');
  elements.weatherOriginLabel.textContent = originName || 'Origin';
  elements.weatherDestLabel.textContent = destName || 'Destination';

  const originIataForCoords = originIata || (params.originBts && BTS_AIRPORT_LOOKUP[params.originBts] && BTS_AIRPORT_LOOKUP[params.originBts].iata);
  const destIataForCoords = destIata || (params.destBts && BTS_AIRPORT_LOOKUP[params.destBts] && BTS_AIRPORT_LOOKUP[params.destBts].iata);
  const originCoords = getCoordsForAirport(originIataForCoords);
  const destCoords = getCoordsForAirport(destIataForCoords);

  const showOriginLoading = () => {
    elements.weatherOriginContent.innerHTML = '';
    elements.weatherOriginLoading.classList.remove('hidden');
    elements.weatherOriginError.classList.add('hidden');
  };
  const showDestLoading = () => {
    elements.weatherDestContent.innerHTML = '';
    elements.weatherDestLoading.classList.remove('hidden');
    elements.weatherDestError.classList.add('hidden');
  };
  const showOriginResult = (html) => {
    elements.weatherOriginLoading.classList.add('hidden');
    elements.weatherOriginError.classList.add('hidden');
    elements.weatherOriginContent.innerHTML = html;
  };
  const showDestResult = (html) => {
    elements.weatherDestLoading.classList.add('hidden');
    elements.weatherDestError.classList.add('hidden');
    elements.weatherDestContent.innerHTML = html;
  };
  const showOriginErr = (msg) => {
    elements.weatherOriginLoading.classList.add('hidden');
    elements.weatherOriginContent.innerHTML = '';
    elements.weatherOriginError.textContent = msg;
    elements.weatherOriginError.classList.remove('hidden');
  };
  const showDestErr = (msg) => {
    elements.weatherDestLoading.classList.add('hidden');
    elements.weatherDestContent.innerHTML = '';
    elements.weatherDestError.textContent = msg;
    elements.weatherDestError.classList.remove('hidden');
  };

  if (originCoords) {
    showOriginLoading();
    try {
      const data = await fetchWeather(originCoords.lat, originCoords.lon);
      showOriginResult(renderWeather(data));
    } catch (err) {
      showOriginErr(err.message || 'Could not load weather');
    }
  } else {
    showOriginErr(`No coordinates for ${originIata || 'origin'}`);
  }

  if (destCoords) {
    showDestLoading();
    try {
      const data = await fetchWeather(destCoords.lat, destCoords.lon);
      showDestResult(renderWeather(data));
    } catch (err) {
      showDestErr(err.message || 'Could not load weather');
    }
  } else {
    showDestErr(`No coordinates for ${destIata || 'destination'}`);
  }
}

function hideFormError() {
  elements.formError?.classList.add('hidden');
}

// Mistral - Check for Disruptions
function setupMistralButton() {
  elements.mistralBtn.addEventListener('click', async () => {
  if (!lastOriginName || !lastDestinationName) {
    elements.mistralError.textContent = 'Find a flight first to check for disruptions.';
    elements.mistralError?.classList.remove('hidden');
    return;
  }

  if (MISTRAL_API_KEY === 'YOUR_KEY_HERE') {
    elements.mistralError.textContent = 'Please set your API key in script.js.';
    elements.mistralError?.classList.remove('hidden');
    return;
  }

  // Use same origin/destination as delay prediction (from flight data)
  const originName = lastOriginName;
  const destinationName = lastDestinationName;
  const prompt = `Are there any current flight disruptions, strikes, airspace closures or extreme weather affecting flights from ${originName} to ${destinationName} today? Answer in 2-3 sentences.`;

  elements.mistralResult?.classList.add('hidden');
  elements.mistralError?.classList.add('hidden');
  elements.mistralLoading.classList.remove('hidden');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${MISTRAL_API_KEY}`,
  };

  try {
    // Step 1: Create agent with web_search tool
    const agentRes = await fetch('https://api.mistral.ai/v1/agents', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'mistral-small-latest',
        name: 'Flight Disruptions Check',
        description: 'Check for flight disruptions, strikes, weather.',
        instructions: 'Use web search to find current flight disruptions. Answer concisely in 2-3 sentences.',
        tools: [{ type: 'web_search' }],
      }),
    });

    const agentData = await agentRes.json();
    if (!agentRes.ok) {
      const errMsg = agentData.message || agentData.error?.message || `API error ${agentRes.status}`;
      throw new Error(errMsg);
    }
    const agentId = agentData.id;
    if (!agentId) throw new Error('Failed to create agent');

    // Step 2: Start conversation with agent (web search enabled)
    const convRes = await fetch('https://api.mistral.ai/v1/conversations', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        agent_id: agentId,
        inputs: prompt,
        stream: false,
      }),
    });

    const convData = await convRes.json();
    if (!convRes.ok) {
      const errMsg = convData.message || convData.error?.message || `API error ${convRes.status}`;
      throw new Error(errMsg);
    }

    // Extract text from outputs (can be message.output with content array)
    const outputs = convData.outputs || [];
    let content = '';
    for (const out of outputs) {
      if (out.type === 'message.output' && out.content) {
        for (const c of out.content) {
          if (c.type === 'text' && c.text) content += c.text;
        }
      } else if (out.content && typeof out.content === 'string') {
        content = out.content;
        break;
      }
    }
    if (!content) throw new Error('No response from service.');

    elements.mistralContent.textContent = content.trim();
    elements.mistralTimestamp.textContent = new Date().toLocaleString();
    elements.mistralResult?.classList.remove('hidden');
  } catch (err) {
    elements.mistralError.textContent = err.message || 'Failed to check disruptions.';
    elements.mistralError?.classList.remove('hidden');
  } finally {
    elements.mistralLoading.classList.add('hidden');
  }
});
}

// Mistral - Airport suggestions (tips for origin/destination airports, not disruptions)
async function runMistralSuggestion(originName, destinationName) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${MISTRAL_API_KEY}`,
  };

  const prompt = `A traveler is flying from ${originName} to ${destinationName}. Give 2-3 practical suggestions or tips specifically about these airports (origin and destination). Focus on: best times to arrive, terminal tips, security wait times, parking, lounges, or other airport-specific advice. Do NOT mention flight disruptions, strikes, or weather. Answer in 2-4 short sentences.`;

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 256,
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errMsg = data?.message || data?.error?.message || data?.choices?.[0]?.message?.content || `API error ${res.status}`;
    throw new Error(errMsg);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error('No response from service.');
  return content.trim();
}

function setupSuggestionButton() {
  const btn = elements.suggestionBtn;
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (!lastOriginName || !lastDestinationName) {
      if (elements.suggestionError) {
        elements.suggestionError.textContent = 'Find a flight first to get suggestions.';
        elements.suggestionError.classList.remove('hidden');
      }
      return;
    }

    if (MISTRAL_API_KEY === 'YOUR_KEY_HERE') {
      if (elements.suggestionError) {
        elements.suggestionError.textContent = 'Please set your API key in script.js.';
        elements.suggestionError.classList.remove('hidden');
      }
      return;
    }

    if (elements.suggestionText) elements.suggestionText.classList.add('hidden');
    if (elements.suggestionResult) elements.suggestionResult.classList.add('hidden');
    if (elements.suggestionError) {
      elements.suggestionError.classList.add('hidden');
      elements.suggestionError.textContent = '';
    }
    if (elements.suggestionLoading) elements.suggestionLoading.classList.remove('hidden');

    try {
      const content = await runMistralSuggestion(lastOriginName, lastDestinationName);
      if (elements.suggestionContent) elements.suggestionContent.textContent = content;
      if (elements.suggestionTimestamp) elements.suggestionTimestamp.textContent = new Date().toLocaleString();
      if (elements.suggestionResult) elements.suggestionResult.classList.remove('hidden');
      if (elements.suggestionText) elements.suggestionText.classList.add('hidden');
    } catch (err) {
      if (elements.suggestionError) {
        elements.suggestionError.textContent = err.message || 'Failed to load suggestions.';
        elements.suggestionError.classList.remove('hidden');
      }
      if (elements.suggestionText) elements.suggestionText.classList.remove('hidden');
    } finally {
      if (elements.suggestionLoading) elements.suggestionLoading.classList.add('hidden');
    }
  });
}

// Parse flight number (e.g. "AA123" -> { airline: "AA", num: "123" })
function parseFlightNumber(input) {
  const s = String(input || '').trim().toUpperCase();
  const match = s.match(/^([A-Z0-9]{2})(\d+)$/);
  if (match) return { airline: match[1], num: match[2] };
  return null;
}

// Fetch flight data from FlightAPI
async function fetchFlightData(airlineCode, flightNum, dateStr) {
  const url = `https://api.flightapi.io/airline/${FLIGHTAPI_KEY}?num=${encodeURIComponent(flightNum)}&name=${encodeURIComponent(airlineCode)}&date=${dateStr}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 404 || res.status === 410) {
      throw new Error('No flight found for this date. Try today or another date.');
    }
    throw new Error(data?.message || `API error ${res.status}`);
  }
  // API returns array: [ { departure }, { arrival } ] — merge into single flight item(s)
  const raw = Array.isArray(data) ? data : data?.flights ?? data?.data ?? (data ? [data] : []);
  const rawList = Array.isArray(raw) ? raw : [raw];
  let out = [];
  if (rawList.length >= 2 && rawList[0].departure && !rawList[0].arrival && rawList[1].arrival) {
    out = [{ ...rawList[0], departure: rawList[0].departure, arrival: rawList[1].arrival }];
  } else {
    for (let i = 0; i < rawList.length; i++) {
      const curr = rawList[i] || {};
      const next = rawList[i + 1];
      const dep = curr.departure || curr;
      const arr = curr.arrival || (next && (next.arrival || next.departure)) || {};
      out.push({ ...curr, departure: dep, arrival: arr });
    }
  }
  if (out.length === 0 && rawList.length > 0) {
    out.push({ departure: rawList[0].departure || rawList[0], arrival: rawList[1]?.arrival || rawList[1] || {} });
  }
  return out;
}

// Default mock flight data when API key is not set
function getDefaultFlightData(parsed) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time1 = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const time2 = new Date(today.getTime() + 180 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return [
    {
      airline: formatAirline(parsed?.airline || 'AA'),
      aircraft: 'Boeing 737-800',
      departure: {
        airportCode: 'JFK',
        airport: 'JFK',
        airportCity: 'New York',
        scheduledTime: `${time1}, ${dateStr}`,
        terminal: '4',
        gate: 'B12',
      },
      arrival: {
        airportCode: 'LAX',
        airport: 'LAX',
        airportCity: 'Los Angeles',
        scheduledTime: `${time2}, ${dateStr}`,
        terminal: '5',
        gate: '52A',
      },
    },
  ];
}

// Ticket layout: origin | dashed line + black pill (plane + duration) + date below | destination; bottom: Terminal, Gate (no seat)
function renderFlightData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '<p class="flight-data-empty">No flight data returned.</p>';
  }
  const item = data[0];
  const dep = item.departure || {};
  const arr = item.arrival || {};
  const depTime = dep.scheduledTime || dep.departureDateTime || '';
  const arrTime = arr.scheduledTime || arr.estimatedTime || arr.arrivalDateTime || '';
  let durationText = '';
  if (depTime && arrTime) {
    try {
      const d1 = new Date(depTime);
      const d2 = new Date(arrTime);
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const min = Math.round((d2 - d1) / 60000);
        const h = Math.floor(min / 60);
        const m = min % 60;
        durationText = (h ? h + 'h ' : '') + (m ? m + 'm' : '');
      }
    } catch (_) {}
  }
  const dateLong = formatDateLong(depTime);
  return `
    <div class="flight-data-card flight-data-card-ticket">
      <div class="flight-data-row-route flight-data-row-route-vertical">
        <div class="flight-data-col-origin">
          <span class="flight-data-airport">${dep.airportCode || dep.airport || ''}</span>
          <span class="flight-data-city"><span class="flight-data-pin" aria-hidden="true"></span>${dep.airportCity || ''}</span>
        </div>
        <div class="flight-data-col-center">
          <div class="flight-data-dashed-line">
            <span class="flight-data-duration">${durationText}</span>
          </div>
          <span class="flight-data-date-below">${dateLong}</span>
        </div>
        <div class="flight-data-col-destination">
          <span class="flight-data-airport">${arr.airportCode || arr.airport || ''}</span>
          <span class="flight-data-city"><span class="flight-data-pin" aria-hidden="true"></span>${arr.airportCity || ''}</span>
        </div>
      </div>
      <div class="flight-data-row-meta">
        <span class="flight-data-meta-item">Terminal: ${dep.terminal || ''}</span>
        <span class="flight-data-meta-item">Gate: ${dep.gate || ''}</span>
      </div>
    </div>
  `;
}

function formatDateLong(isoOrTime) {
  if (!isoOrTime) return '';
  const d = new Date(isoOrTime);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateForDisplay(isoOrTime) {
  if (!isoOrTime) return '';
  const d = new Date(isoOrTime);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase();
}

function formatTime24(isoOrTime) {
  if (!isoOrTime) return '';
  const d = new Date(isoOrTime);
  if (isNaN(d.getTime())) return String(isoOrTime).replace(/,/g, '').trim().slice(0, 8);
  const s = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  return s.replace(/,/g, '').trim();
}

function formatTimeForDisplay(isoOrTime) {
  if (!isoOrTime) return '';
  const d = new Date(isoOrTime);
  if (isNaN(d.getTime())) return String(isoOrTime).replace(/,/g, '').trim().slice(0, 12);
  const s = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return s.replace(/,/g, '').trim();
}

// Find Flight button - fetch flight data, show main form and flight data
function setupFindFlightButton() {
  elements.findFlightBtn.addEventListener('click', async () => {
    const input = elements.flightNumberInput.value.trim();
    if (!input) {
      alert('Please enter a flight number (e.g. AA123, UA456)');
      return;
    }

    const parsed = parseFlightNumber(input);
    if (!parsed) {
      alert('Please use format: AirlineCode + Number (e.g. AA123, DL456)');
      return;
    }

    elements.flightNumberStep.classList.add('hidden');
    elements.mainContent.classList.remove('hidden');
    elements.flightDataSection.classList.remove('hidden');

    // Start hero video (after user gesture so autoplay is allowed)
    const heroVideo = elements.heroVideo;
    if (heroVideo) {
      heroVideo.play().catch(() => {
        const playOnInteraction = () => {
          heroVideo.play().catch(() => {});
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
      });
    }

    // Ensure metadata loaded for IATA->BTS mapping
    if (!metadata) await loadMetadata();

    if (FLIGHTAPI_KEY === 'YOUR_FLIGHTAPI_KEY_HERE') {
      const defaultData = getDefaultFlightData(parsed);
      elements.flightDataContent.innerHTML = renderFlightData(defaultData) +
        '<p class="flight-data-empty" style="margin-top: 1rem; font-size: 0.85rem;">Demo data. <a href="https://docs.flightapi.io" target="_blank" rel="noopener">Add your FlightAPI key</a> for real lookups.</p>';
      elements.flightDataError.classList.add('hidden');
      const params = extractPredictionParams(defaultData, parsed);
      lastOriginBtsId = params.originBts;
      lastDestinationBtsId = params.destBts;
      lastOriginName = params.originName;
      lastDestinationName = params.destName;
      updateDashboardFromFlight(defaultData, parsed, params);
      if (params.originBts && params.destBts) {
        await runPrediction(params);
      } else {
        hideResult();
        showFormError('Delay prediction is not available for this route.');
      }
      loadWeather(params);
      return;
    }

    elements.findFlightBtn.disabled = true;
    elements.findFlightBtn.textContent = 'Finding...';
    elements.flightDataError.classList.add('hidden');
    elements.flightDataContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Looking up flight...</p></div>';

    const today = new Date();
    const dateStr = today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');

    try {
      const data = await fetchFlightData(parsed.airline, parsed.num, dateStr);
      elements.flightDataContent.innerHTML = renderFlightData(data);
      const params = extractPredictionParams(data, parsed);
      lastOriginBtsId = params.originBts;
      lastDestinationBtsId = params.destBts;
      lastOriginName = params.originName;
      lastDestinationName = params.destName;
      updateDashboardFromFlight(data, parsed, params);
      if (params.originBts && params.destBts) {
        await runPrediction(params);
      } else {
        hideResult();
        showFormError('Delay prediction is not available for this route. Origin or destination is not in the supported set.');
      }
      loadWeather(params);
    } catch (err) {
      const msg = err.message || 'Could not find flight. Try a different date or flight number.';
      elements.flightDataError.textContent = msg + (err.message?.includes('CORS') ? ' Try proxying through your backend.' : '');
      elements.flightDataError.classList.remove('hidden');
      elements.flightDataContent.innerHTML = '<p class="flight-data-empty">No flight data available.</p>';
    } finally {
      elements.findFlightBtn.disabled = false;
      elements.findFlightBtn.textContent = 'Find Flight';
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initElements();
  loadMetadata();
  setupFindFlightButton();
  setupMistralButton();
  setupSuggestionButton();
});
