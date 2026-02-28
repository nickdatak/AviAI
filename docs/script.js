/**
 * Flight Delay Predictor - Frontend
 * API: https://aviai-production.up.railway.app
 */

const API_BASE = 'https://aviai-production.up.railway.app';
const MISTRAL_API_KEY = 'WOOaYSCNyVxWzMEtD7unH4gX637P6zJR';

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

function initElements() {
  elements.airlineSelect = document.getElementById('airline');
  elements.originSelect = document.getElementById('origin');
  elements.destinationSelect = document.getElementById('destination');
  elements.originSearch = document.getElementById('origin-search');
  elements.destinationSearch = document.getElementById('destination-search');
  elements.departureDate = document.getElementById('departure-date');
  elements.departureHour = document.getElementById('departure-hour');
  elements.hourDisplay = document.getElementById('hour-display');
  elements.form = document.getElementById('flight-form');
  elements.submitBtn = document.getElementById('submit-btn');
  elements.loading = document.getElementById('loading');
  elements.resultCard = document.getElementById('result-card');
  elements.resultProbability = document.getElementById('result-probability');
  elements.riskBadge = document.getElementById('risk-badge');
  elements.resultMessage = document.getElementById('result-message');
  elements.formError = document.getElementById('form-error');
  elements.mistralBtn = document.getElementById('mistral-btn');
  elements.mistralLoading = document.getElementById('mistral-loading');
  elements.mistralResult = document.getElementById('mistral-result');
  elements.mistralTimestamp = document.getElementById('mistral-timestamp');
  elements.mistralContent = document.getElementById('mistral-content');
  elements.mistralError = document.getElementById('mistral-error');
}

// Fetch metadata and populate dropdowns
async function loadMetadata() {
  try {
    const res = await fetch(`${API_BASE}/metadata`);
    if (!res.ok) throw new Error('Failed to load metadata');
    metadata = await res.json();
    populateDropdowns();
    setMinDate();
  } catch (err) {
    showFormError('Could not load airlines and airports. Please refresh the page.');
    elements.airlineSelect.innerHTML = '<option value="">Error loading</option>';
    elements.originSelect.innerHTML = '<option value="">Error loading</option>';
    elements.destinationSelect.innerHTML = '<option value="">Error loading</option>';
  }
}

function populateDropdowns() {
  const airlines = metadata.airlines || [];
  const origins = metadata.origins || [];
  const destinations = metadata.destinations || [];

  elements.airlineSelect.innerHTML = '<option value="">Select airline</option>' +
    airlines.map((code) => {
      const displayName = formatAirline(code);
      return `<option value="${code}">${displayName}</option>`;
    }).join('');

  const originOptions = '<option value="">Select origin</option>' +
    origins.map((id) => `<option value="${id}">${formatAirport(id)}</option>`).join('');
  elements.originSelect.innerHTML = originOptions;

  const destOptions = '<option value="">Select destination</option>' +
    destinations.map((id) => `<option value="${id}">${formatAirport(id)}</option>`).join('');
  elements.destinationSelect.innerHTML = destOptions;
}

function setMinDate() {
  const today = new Date().toISOString().slice(0, 10);
  elements.departureDate.setAttribute('min', today);
}

// Searchable airport dropdowns - input and dropdown are connected
function setupSearchable(selectId, searchId) {
  const select = document.getElementById(selectId);
  const search = document.getElementById(searchId);
  const dropdown = document.getElementById(`${selectId}-dropdown`);
  const container = search.closest('.searchable-select');

  if (!select || !search || !dropdown || !container) return;

  function filterAndShowOptions() {
    const query = search.value.trim().toLowerCase();
    const options = Array.from(select.options).filter((opt) => opt.value !== '');
    const filtered = query
      ? options.filter((opt) => opt.textContent.toLowerCase().includes(query))
      : options;

    dropdown.innerHTML = '';
    if (filtered.length === 0) {
      dropdown.innerHTML = '<div class="airport-dropdown-empty">No airports match</div>';
    } else {
      filtered.forEach((opt) => {
        const div = document.createElement('div');
        div.className = 'airport-dropdown-option';
        div.textContent = opt.textContent;
        div.dataset.value = opt.value;
        div.dataset.label = opt.textContent;
        div.setAttribute('role', 'option');
        div.tabIndex = 0;
        // Use mousedown so selection happens before blur closes dropdown
        div.addEventListener('mousedown', (e) => {
          e.preventDefault();
          select.value = opt.value;
          search.value = opt.textContent;
          dropdown.classList.remove('is-open');
          search.blur();
        });
        dropdown.appendChild(div);
      });
    }
    dropdown.classList.add('is-open');
  }

  function closeDropdown() {
    dropdown.classList.remove('is-open');
  }

  search.addEventListener('focus', filterAndShowOptions);
  search.addEventListener('input', () => {
    filterAndShowOptions();
    const selected = select.options[select.selectedIndex];
    if (!search.value.trim() || (selected && search.value !== selected.textContent)) {
      select.value = '';
    }
  });
  search.addEventListener('blur', () => {
    setTimeout(closeDropdown, 150);
  });

  // Close when clicking outside (more reliable than blur)
  document.addEventListener('click', function handleOutsideClick(e) {
    if (!dropdown.classList.contains('is-open')) return;
    if (container.contains(e.target)) return;
    closeDropdown();
  });

  select.addEventListener('change', () => {
    const selected = select.options[select.selectedIndex];
    if (selected && selected.value) {
      search.value = selected.textContent;
    }
  });
}

// Form submit - predict
function setupFormSubmit() {
  elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideFormError();
  hideResult();

  const airline = elements.airlineSelect?.value;
  const origin = elements.originSelect?.value;
  const destination = elements.destinationSelect?.value;
  const departureDate = elements.departureDate?.value;
  const departureHour = parseInt(elements.departureHour?.value ?? 12, 10);

  if (!airline || !origin || !destination || !departureDate) {
    showFormError('Please fill in all fields.');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        airline,
        origin,
        destination,
        departure_date: departureDate,
        departure_hour: departureHour,
        distance: 500,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || 'Prediction failed');
    }

    showResult(data);
  } catch (err) {
    showFormError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
});
}

function setLoading(on) {
  elements.loading?.classList.toggle('hidden', !on);
  elements.submitBtn.disabled = on;
}

function showResult(data) {
  const prob = (data.delay_probability * 100).toFixed(1);
  elements.resultProbability.textContent = `${prob}%`;
  elements.riskBadge.textContent = data.risk_level;
  elements.riskBadge.className = 'risk-badge ' + data.risk_level.toLowerCase();
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

function hideFormError() {
  elements.formError?.classList.add('hidden');
}

// Mistral - Check for Disruptions
function setupMistralButton() {
  elements.mistralBtn.addEventListener('click', async () => {
  const origin = elements.originSelect?.value;
  const destination = elements.destinationSelect?.value;

  if (!origin || !destination) {
    elements.mistralError.textContent = 'Please select origin and destination first.';
    elements.mistralError?.classList.remove('hidden');
    return;
  }

  if (MISTRAL_API_KEY === 'YOUR_KEY_HERE') {
    elements.mistralError.textContent = 'Please set your Mistral API key in script.js.';
    elements.mistralError?.classList.remove('hidden');
    return;
  }

  const originName = getAirportNameForPrompt(origin);
  const destinationName = getAirportNameForPrompt(destination);
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
    if (!content) throw new Error('No response from Mistral.');

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

// Init
document.addEventListener('DOMContentLoaded', () => {
  initElements();
  elements.departureHour.addEventListener('input', (e) => {
    elements.hourDisplay.textContent = e.target.value;
  });
  setupFormSubmit();
  setupMistralButton();
  loadMetadata();
  setupSearchable('origin', 'origin-search');
  setupSearchable('destination', 'destination-search');
});
