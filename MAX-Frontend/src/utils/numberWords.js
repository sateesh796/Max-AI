/**
 * Comprehensive Number-to-Words Phonetic Engine for MAX AI
 * Converts numbers and time digits into 100% native language words
 * across all supported Indian and International languages.
 */

// ================= TELUGU =================
const TELUGU_UNITS = [
  'సున్నా', 'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు',
  'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది', 'పది',
  'పదకొండు', 'పన్నెండు', 'పదమూడు', 'పద్నాలుగు', 'పదిహేను',
  'పదహారు', 'పదిహేడు', 'పద్దెనిమిది', 'పందొమ్మిది'
];
const TELUGU_TENS = {
  20: 'ఇరవై',
  30: 'ముప్పై',
  40: 'నలభై',
  50: 'యాభై',
  60: 'అరవై',
  70: 'డెబ్బై',
  80: 'ఎనభై',
  90: 'తొంబై'
};

function teluguNumber(n) {
  if (n < 20) return TELUGU_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? TELUGU_TENS[t] : `${TELUGU_TENS[t]} ${TELUGU_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'వంద' : `${TELUGU_UNITS[h]} వందలు`;
    return r === 0 ? hStr : `${hStr} ${teluguNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'వెయ్యి' : `${teluguNumber(th)} వేల`;
    return r === 0 ? (th === 1 ? 'వెయ్యి' : `${teluguNumber(th)} వేలు`) : `${thStr} ${teluguNumber(r)}`;
  }
  return String(n);
}

// ================= HINDI =================
const HINDI_0_TO_100 = [
  'शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
  'इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ',
  'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सरसठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
  'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्नासी', 'अस्सी',
  'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सतासी', 'अट्ठासी', 'नवासी', 'नब्बे',
  'इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पंचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे', 'सौ'
];

function hindiNumber(n) {
  if (n <= 100) return HINDI_0_TO_100[n];
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'एक सौ' : `${HINDI_0_TO_100[h]} सौ`;
    return r === 0 ? hStr : `${hStr} ${hindiNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'एक हज़ार' : `${hindiNumber(th)} हज़ार`;
    return r === 0 ? thStr : `${thStr} ${hindiNumber(r)}`;
  }
  return String(n);
}

// ================= TAMIL =================
const TAMIL_UNITS = [
  'பூஜ்ஜியம்', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து',
  'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது', 'பத்து',
  'பதினொன்று', 'பன்னிரண்டு', 'பதின்மூன்று', 'பதினான்கு', 'பதினைந்து',
  'பதினாறு', 'பதினேழு', 'பதினெட்டு', 'பத்தொன்பது'
];
const TAMIL_TENS = {
  20: 'இருபது',
  30: 'முப்பது',
  40: 'நாற்பது',
  50: 'ஐம்பது',
  60: 'அறுபது',
  70: 'எழுபது',
  80: 'எண்பது',
  90: 'தொண்ணூறு'
};
const TAMIL_TENS_PREFIX = {
  20: 'இருபத்து',
  30: 'முப்பத்து',
  40: 'நாற்பத்து',
  50: 'ஐம்பத்து',
  60: 'அறுபத்து',
  70: 'எழுபத்து',
  80: 'எண்பத்து',
  90: 'தொண்ணூற்று'
};

function tamilNumber(n) {
  if (n < 20) return TAMIL_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? TAMIL_TENS[t] : `${TAMIL_TENS_PREFIX[t]} ${TAMIL_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'நூறு' : `${TAMIL_UNITS[h]} நூறு`;
    return r === 0 ? hStr : `${hStr} ${tamilNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'ஆயிரத்து' : (th === 2 ? 'இரண்டாயிரத்து' : `${tamilNumber(th)} ஆயிரத்து`);
    const thFull = th === 1 ? 'ஆயிரம்' : (th === 2 ? 'இரண்டாயிரம்' : `${tamilNumber(th)} ஆயிரம்`);
    return r === 0 ? thFull : `${thStr} ${tamilNumber(r)}`;
  }
  return String(n);
}

// ================= KANNADA =================
const KANNADA_UNITS = [
  'ಸೊನ್ನೆ', 'ಒಂದು', 'ಎರಡು', 'ಮೂರು', 'ನಾಲ್ಕು', 'ಐದು',
  'ಆರು', 'ಏಳು', 'ಎಂಟು', 'ಒಂಬತ್ತು', 'ಹತ್ತು',
  'ಹನ್ನೊಂದು', 'ಹನ್ನೆರಡು', 'ಹದಿಮೂರು', 'ಹದಿನಾಲ್ಕು', 'ಹದಿನೈದು',
  'ಹದಿನಾರು', 'ಹದಿನೇಳು', 'ಹದಿನೆಂಟು', 'ಹತ್ತೊಂಬತ್ತು'
];
const KANNADA_TENS = {
  20: 'ಇಪ್ಪತ್ತು',
  30: 'ಮೂವತ್ತು',
  40: 'ನಲವತ್ತು',
  50: 'ಐವತ್ತು',
  60: 'ಅರವತ್ತು',
  70: 'ಎಪ್ಪತ್ತು',
  80: 'ಎಂಬತ್ತು',
  90: 'ತೊಂಬತ್ತು'
};

function kannadaNumber(n) {
  if (n < 20) return KANNADA_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? KANNADA_TENS[t] : `${KANNADA_TENS[t]} ${KANNADA_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'ನೂರು' : `${KANNADA_UNITS[h]} ನೂರು`;
    return r === 0 ? hStr : `${hStr} ${kannadaNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'ಸಾವಿರದ' : `${kannadaNumber(th)} ಸಾವಿರದ`;
    const thFull = th === 1 ? 'ಒಂದು ಸಾವಿರ' : `${kannadaNumber(th)} ಸಾವಿರ`;
    return r === 0 ? thFull : `${thStr} ${kannadaNumber(r)}`;
  }
  return String(n);
}

// ================= MALAYALAM =================
const MALAYALAM_UNITS = [
  'പൂജ്യം', 'ഒന്ന്', 'രണ്ട്', 'മൂന്ന്', 'നാല്', 'അഞ്ച്',
  'ആറ്', 'ഏഴ്', 'എട്ട്', 'ഒമ്പത്', 'പത്ത്',
  'പതിനൊന്ന്', 'പന്ത്രണ്ട്', 'പതിമൂന്ന്', 'പതിനാല്', 'പതിനഞ്ച്',
  'പതിനാറ്', 'പതിനേഴ്', 'പതിനെട്ട്', 'പത്തൊൻപത്'
];
const MALAYALAM_TENS = {
  20: 'ഇരുപത്',
  30: 'മുപ്പത്',
  40: 'നാൽപ്പത്',
  50: 'അമ്പത്',
  60: 'അറുപത്',
  70: 'എഴുപത്',
  80: 'എൺപത്',
  90: 'തൊണ്ണൂറ്'
};
const MALAYALAM_TENS_PREFIX = {
  20: 'ഇരുപത്തി',
  30: 'മുപ്പത്തി',
  40: 'നാൽപ്പത്തി',
  50: 'അമ്പത്തി',
  60: 'അറുപത്തി',
  70: 'എഴുപത്തി',
  80: 'എൺപത്തി',
  90: 'തൊണ്ണൂറ്റി'
};

function malayalamNumber(n) {
  if (n < 20) return MALAYALAM_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? MALAYALAM_TENS[t] : `${MALAYALAM_TENS_PREFIX[t]} ${MALAYALAM_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'നൂറ്' : `${MALAYALAM_UNITS[h]} നൂറ്`;
    return r === 0 ? hStr : `${hStr} ${malayalamNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'ആയിരത്തി' : (th === 2 ? 'രണ്ടായിരത്തി' : `${malayalamNumber(th)} ആയിരത്തി`);
    const thFull = th === 1 ? 'ആയിരം' : (th === 2 ? 'രണ്ടായിരം' : `${malayalamNumber(th)} ആയിരം`);
    return r === 0 ? thFull : `${thStr} ${malayalamNumber(r)}`;
  }
  return String(n);
}

// ================= BENGALI =================
const BENGALI_UNITS = [
  'শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ',
  'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
  'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো',
  'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ'
];
const BENGALI_TENS = {
  20: 'কুড়ি',
  30: 'ত্রিশ',
  40: 'চল্লিশ',
  50: 'পঞ্চাশ',
  60: 'ষাট',
  70: 'সত্তর',
  80: 'আশি',
  90: 'নব্বই'
};
const BENGALI_SPECIAL = {
  21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ', 26: 'ছাব্বিশ',
  27: 'সাতাশ', 28: 'আঠাশ', 29: 'উনত্রিশ'
};

function bengaliNumber(n) {
  if (n < 20) return BENGALI_UNITS[n];
  if (BENGALI_SPECIAL[n]) return BENGALI_SPECIAL[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? BENGALI_TENS[t] : `${BENGALI_TENS[t]} ${BENGALI_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'একশ' : `${BENGALI_UNITS[h]} শত`;
    return r === 0 ? hStr : `${hStr} ${bengaliNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = `${bengaliNumber(th)} হাজার`;
    return r === 0 ? thStr : `${thStr} ${bengaliNumber(r)}`;
  }
  return String(n);
}

// ================= MARATHI =================
const MARATHI_UNITS = [
  'शून्य', 'एक', 'दोन', 'तीन', 'चार', 'पाच',
  'सहा', 'सात', 'आठ', 'नऊ', 'दहा',
  'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा',
  'सोळा', 'सतरा', 'अठरा', 'एकोणीस'
];
const MARATHI_TENS = {
  20: 'वीस',
  30: 'तीस',
  40: 'चाळीस',
  50: 'पन्नास',
  60: 'साठ',
  70: 'सत्तर',
  80: 'ऐंशी',
  90: 'नव्वद'
};
const MARATHI_SPECIAL = {
  21: 'एकवीस', 22: 'बावीस', 23: 'तेवीस', 24: 'चोवीस', 25: 'पंचवीस', 26: 'सव्वीस',
  27: 'सत्तावीस', 28: 'अठ्ठावीस', 29: 'एकोणतीस',
  31: 'एकतीस', 32: 'बत्तीस', 33: 'तेहतीस', 34: 'चौतीस', 35: 'पस्तीस', 36: 'छत्तीस'
};

function marathiNumber(n) {
  if (n < 20) return MARATHI_UNITS[n];
  if (MARATHI_SPECIAL[n]) return MARATHI_SPECIAL[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? MARATHI_TENS[t] : `${MARATHI_TENS[t]} आणि ${MARATHI_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'शंभर' : `${MARATHI_UNITS[h]} शे`;
    return r === 0 ? hStr : `${hStr} ${marathiNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = `${marathiNumber(th)} हजार`;
    return r === 0 ? thStr : `${thStr} ${marathiNumber(r)}`;
  }
  return String(n);
}

// ================= SPANISH =================
const SPANISH_UNITS = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco',
  'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince',
  'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
];
const SPANISH_TENS = {
  20: 'veinte',
  30: 'treinta',
  40: 'cuarenta',
  50: 'cincuenta',
  60: 'sesenta',
  70: 'setenta',
  80: 'ochenta',
  90: 'noventa'
};
const SPANISH_20S = {
  21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés', 24: 'veinticuatro',
  25: 'veinticinco', 26: 'veintiséis', 27: 'veintisiete', 28: 'veintiocho', 29: 'veintinueve'
};

function spanishNumber(n) {
  if (n < 20) return SPANISH_UNITS[n];
  if (SPANISH_20S[n]) return SPANISH_20S[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? SPANISH_TENS[t] : `${SPANISH_TENS[t]} y ${SPANISH_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? (r === 0 ? 'cien' : 'ciento') : `${SPANISH_UNITS[h]}cientos`;
    return r === 0 ? hStr : `${hStr} ${spanishNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'mil' : `${spanishNumber(th)} mil`;
    return r === 0 ? thStr : `${thStr} ${spanishNumber(r)}`;
  }
  return String(n);
}

// ================= FRENCH =================
const FRENCH_UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq',
  'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze',
  'seize', 'dix-sept', 'dix-huit', 'dix-neuf'
];
const FRENCH_TENS = {
  20: 'vingt',
  30: 'trente',
  40: 'quarante',
  50: 'cinquante',
  60: 'soixante',
  70: 'soixante-dix',
  80: 'quatre-vingts',
  90: 'quatre-vingt-dix'
};

function frenchNumber(n) {
  if (n < 20) return FRENCH_UNITS[n];
  if (n < 70) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    if (r === 0) return FRENCH_TENS[t];
    if (r === 1) return `${FRENCH_TENS[t]}-et-un`;
    return `${FRENCH_TENS[t]}-${FRENCH_UNITS[r]}`;
  }
  if (n < 80) {
    const r = n - 60;
    return `soixante-${frenchNumber(r)}`;
  }
  if (n < 100) {
    const r = n - 80;
    if (r === 0) return 'quatre-vingts';
    return `quatre-vingt-${frenchNumber(r)}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'cent' : `${FRENCH_UNITS[h]} cent`;
    return r === 0 ? hStr : `${hStr} ${frenchNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'mille' : `${frenchNumber(th)} mille`;
    return r === 0 ? thStr : `${thStr} ${frenchNumber(r)}`;
  }
  return String(n);
}

// ================= GERMAN =================
const GERMAN_UNITS = [
  'null', 'eins', 'zwei', 'drei', 'vier', 'fünf',
  'sechs', 'sieben', 'acht', 'neun', 'zehn',
  'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn',
  'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
];
const GERMAN_TENS = {
  20: 'zwanzig',
  30: 'dreißig',
  40: 'vierzig',
  50: 'fünfzig',
  60: 'sechzig',
  70: 'siebzig',
  80: 'achtzig',
  90: 'neunzig'
};

function germanNumber(n) {
  if (n < 20) return GERMAN_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    if (r === 0) return GERMAN_TENS[t];
    const unitPart = r === 1 ? 'ein' : GERMAN_UNITS[r];
    return `${unitPart}und${GERMAN_TENS[t]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'einhundert' : `${GERMAN_UNITS[h]}hundert`;
    return r === 0 ? hStr : `${hStr}${germanNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'eintausend' : `${germanNumber(th)}tausend`;
    return r === 0 ? thStr : `${thStr}${germanNumber(r)}`;
  }
  return String(n);
}

// ================= JAPANESE =================
const JAPANESE_DIGITS = ['ゼロ', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function japaneseNumber(n) {
  if (n < 10) return JAPANESE_DIGITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const r = n % 10;
    const tStr = t === 1 ? '十' : `${JAPANESE_DIGITS[t]}十`;
    return r === 0 ? tStr : `${tStr}${JAPANESE_DIGITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? '百' : `${JAPANESE_DIGITS[h]}百`;
    return r === 0 ? hStr : `${hStr}${japaneseNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? '千' : `${japaneseNumber(th)}千`;
    return r === 0 ? thStr : `${thStr}${japaneseNumber(r)}`;
  }
  return String(n);
}

// ================= ARABIC =================
const ARABIC_UNITS = [
  'صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة',
  'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
  'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
  'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'
];
const ARABIC_TENS = {
  20: 'عشرون',
  30: 'ثلاثون',
  40: 'أربعون',
  50: 'خمسون',
  60: 'ستون',
  70: 'سبعون',
  80: 'ثمانون',
  90: 'تسعون'
};

function arabicNumber(n) {
  if (n < 20) return ARABIC_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? ARABIC_TENS[t] : `${ARABIC_UNITS[r]} و${ARABIC_TENS[t]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h === 1 ? 'مائة' : `${ARABIC_UNITS[h]} مائة`;
    return r === 0 ? hStr : `${hStr} و${arabicNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'ألف' : (th === 2 ? 'ألفين' : `${arabicNumber(th)} آلاف`);
    return r === 0 ? thStr : `${thStr} و${arabicNumber(r)}`;
  }
  return String(n);
}

// ================= ENGLISH =================
const ENGLISH_UNITS = [
  'zero', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const ENGLISH_TENS = {
  20: 'twenty',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
  60: 'sixty',
  70: 'seventy',
  80: 'eighty',
  90: 'ninety'
};

function englishNumber(n) {
  if (n < 20) return ENGLISH_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    return r === 0 ? ENGLISH_TENS[t] : `${ENGLISH_TENS[t]}-${ENGLISH_UNITS[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = `${ENGLISH_UNITS[h]} hundred`;
    return r === 0 ? hStr : `${hStr} and ${englishNumber(r)}`;
  }
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = `${englishNumber(th)} thousand`;
    return r === 0 ? thStr : `${thStr} ${englishNumber(r)}`;
  }
  return String(n);
}

/**
 * Convert any integer into the spelled-out native words for a given language code
 */
export function numberToWords(num, langCode = 'en-US') {
  const n = parseInt(num, 10);
  if (isNaN(n)) return String(num);
  if (n < 0) return `${numberToWords(Math.abs(n), langCode)}`;

  const lang = (langCode || 'en-US').toLowerCase();

  if (lang.startsWith('te')) return teluguNumber(n);
  if (lang.startsWith('hi')) return hindiNumber(n);
  if (lang.startsWith('ta')) return tamilNumber(n);
  if (lang.startsWith('kn')) return kannadaNumber(n);
  if (lang.startsWith('ml')) return malayalamNumber(n);
  if (lang.startsWith('bn')) return bengaliNumber(n);
  if (lang.startsWith('mr')) return marathiNumber(n);
  if (lang.startsWith('es')) return spanishNumber(n);
  if (lang.startsWith('fr')) return frenchNumber(n);
  if (lang.startsWith('de')) return germanNumber(n);
  if (lang.startsWith('ja')) return japaneseNumber(n);
  if (lang.startsWith('ar')) return arabicNumber(n);

  return englishNumber(n);
}

/**
 * Convert full clock time (hours, minutes) into natural spoken words in the target language
 */
export function timeToWords(hours, minutes, langCode = 'en-US') {
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  const display12 = h % 12 || 12;
  const lang = (langCode || 'en-US').toLowerCase();

  const hWord = numberToWords(display12, langCode);
  const mWord = m === 0 ? '' : numberToWords(m, langCode);

  if (lang.startsWith('te')) {
    return m === 0 ? `${hWord} గంటలు` : `${hWord} గంటల ${mWord} నిమిషాలు`;
  }
  if (lang.startsWith('hi')) {
    return m === 0 ? `${hWord} बजे` : `${hWord} बजकर ${mWord} मिनट`;
  }
  if (lang.startsWith('ta')) {
    return m === 0 ? `${hWord} மணி` : `${hWord} மணி ${mWord} நிமிடங்கள்`;
  }
  if (lang.startsWith('kn')) {
    return m === 0 ? `${hWord} ಗಂಟೆ` : `${hWord} ಗಂಟೆ ${mWord} ನಿಮಿಷಗಳು`;
  }
  if (lang.startsWith('ml')) {
    return m === 0 ? `${hWord} മണി` : `${hWord} മണി ${mWord} മിനിറ്റ്`;
  }
  if (lang.startsWith('bn')) {
    return m === 0 ? `${hWord}টা` : `${hWord}টা বেজে ${mWord} মিনিট`;
  }
  if (lang.startsWith('mr')) {
    return m === 0 ? `${hWord} वाजता` : `${hWord} वाजून ${mWord} मिनिटे`;
  }
  if (lang.startsWith('es')) {
    return m === 0 ? `las ${hWord}` : `las ${hWord} y ${mWord}`;
  }
  if (lang.startsWith('fr')) {
    return m === 0 ? `${hWord} heures` : `${hWord} heures ${mWord}`;
  }
  if (lang.startsWith('de')) {
    return m === 0 ? `${hWord} Uhr` : `${hWord} Uhr ${mWord}`;
  }
  if (lang.startsWith('ja')) {
    return `${hWord}時${mWord ? mWord + '分' : ''}`;
  }
  if (lang.startsWith('ar')) {
    return m === 0 ? `الساعة ${hWord}` : `الساعة ${hWord} و${mWord} دقيقة`;
  }

  return m === 0 ? `${hWord} o'clock` : `${hWord} ${mWord}`;
}

/**
 * Scan arbitrary text and spell out all numbers into native words
 * for the designated language so speech synthesis articulates them naturally.
 */
export function convertNumbersInTextToWords(text, langCode = 'en-US') {
  if (!text || typeof text !== 'string') return text;

  let result = text;

  // 1. Convert HH:MM clock patterns (e.g. 14:30 or 09:15)
  result = result.replace(/\b(\d{1,2}):(\d{2})\b/g, (match, hh, mm) => {
    return timeToWords(parseInt(hh, 10), parseInt(mm, 10), langCode);
  });

  // 2. Convert percentage notations (e.g. 98% or 100%)
  const lang = (langCode || 'en-US').toLowerCase();
  result = result.replace(/\b(\d+)\s*%/g, (match, num) => {
    const spelled = numberToWords(parseInt(num, 10), langCode);
    if (lang.startsWith('te')) return `${spelled} శాతం`;
    if (lang.startsWith('hi')) return `${spelled} प्रतिशत`;
    if (lang.startsWith('ta')) return `${spelled} சதவீதம்`;
    if (lang.startsWith('kn')) return `${spelled} ಶೇಕಡಾ`;
    if (lang.startsWith('ml')) return `${spelled} ശതമാനം`;
    if (lang.startsWith('bn')) return `${spelled} শতাংশ`;
    if (lang.startsWith('mr')) return `${spelled} टक्के`;
    if (lang.startsWith('es')) return `${spelled} por ciento`;
    if (lang.startsWith('fr')) return `${spelled} pour cent`;
    if (lang.startsWith('de')) return `${spelled} Prozent`;
    if (lang.startsWith('ja')) return `${spelled}パーセント`;
    if (lang.startsWith('ar')) return `${spelled} بالمائة`;
    return `${spelled} percent`;
  });

  // 3. Convert all remaining standalone digits (e.g. 2026, 7, 3, 45, etc.)
  result = result.replace(/\b\d+\b/g, (match) => {
    return numberToWords(parseInt(match, 10), langCode);
  });

  return result;
}
