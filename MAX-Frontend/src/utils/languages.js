/**
 * Multilingual Support for MAX AI
 * 100% Pure Language Localization & Native Phonetics
 * When a language is selected, MAX AI speaks and interfaces
 * with native vocabulary and spells all numbers in that language.
 */

import { numberToWords } from './numberWords';

export const SUPPORTED_LANGUAGES = [
  // ==================== TELUGU (తెలుగు) ====================
  {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'నమస్కారం! నేను మీకు ఈ రోజు ఎలా సహాయపడగలను?',
    readyResponse: 'సిస్టమ్ సిద్ధంగా ఉంది. మాక్స్ ఏఐ మీ సేవలో ఉంది.',
    listeningStatus: 'వింటున్నాను...',
    thinkingStatus: 'ఆలోచిస్తున్నాను...',
    speakingStatus: 'మాట్లాడుతున్నాను...',
    defaultStatus: 'నమస్కారం!',
    tasksMsg: (count) => `మీ షెడ్యూల్‌లో ${numberToWords(count, 'te-IN')} ముఖ్యమైన పనులు వేచి ఉన్నాయి.`,
    whoMsg: 'నేను మాక్స్ ఏఐ, మీ తెలివైన వ్యక్తిగత అసిస్టెంట్‌ని. మీ ఆదేశం చెప్పండి.',
    searchMsg: (q) => `"${q}" కోసం చార్ట్ బోర్డ్ విశ్లేషణ తెరవబడింది. న్యూరల్ గణాంకాలు సిద్ధంగా ఉన్నాయి.`,
    defaultDirectiveMsg: (q) => `మీ ఆదేశం "${q}" ప్రాసెస్ చేయబడింది. అన్ని వ్యవస్థలు సజావుగా పనిచేస్తున్నాయి.`,
    girlVoiceMsg: 'గర్ల్ ఏఐ వాయిస్ యాక్టివేట్ చేయబడింది. సహజ స్వర వ్యవస్థ ఆన్‌లో ఉంది.',
    boyVoiceMsg: 'బాయ్ ఏఐ వాయిస్ యాక్టివేట్ చేయబడింది. సహజ స్వర వ్యవస్థ ఆన్‌లో ఉంది.',
    variationSpeakingMsg: 'మాక్స్ ఏఐ తెలుగులో మాట్లాడుతోంది. నా సహజ వాయిస్ సిస్టమ్ ఆన్‌లో ఉంది.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `చార్ట్ బోర్డ్ విశ్లేషణ: "${q || 'డేటా'}" కోసం ${numberToWords(c, 'te-IN')} రికార్డులు కనుగొనబడ్డాయి. ఖచ్చితత్వం ${numberToWords(conf, 'te-IN')} శాతం. రెస్పాన్స్ వేగం ${numberToWords(lat, 'te-IN')} మిల్లీసెకన్లు.`,
    voiceHints: ['Telugu', 'Shruti', 'Mohan', 'te-IN', 'te_IN', 'తెలుగు'],
    femaleVoiceHints: ['Shruti', 'Telugu Female', 'te-IN', 'te'],
    maleVoiceHints: ['Mohan', 'Telugu Male', 'te-IN', 'te']
  },

  // ==================== HINDI (हिन्दी) ====================
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'नमस्ते! मैं आज आपकी क्या सहायता कर सकती हूँ?',
    readyResponse: 'सिस्टम सिंक्रोनाइज़्ड है। मैक्स एआई आपकी सेवा के लिए तैयार है।',
    listeningStatus: 'सुन रही हूँ...',
    thinkingStatus: 'सोच रही हूँ...',
    speakingStatus: 'बोल रही हूँ...',
    defaultStatus: 'नमस्ते!',
    tasksMsg: (count) => `आपके पास ${numberToWords(count, 'hi-IN')} महत्वपूर्ण कार्य लंबित हैं।`,
    whoMsg: 'मैं मैक्स एआई हूँ, आपकी बुद्धिमान व्यक्तिगत सहायक। बताइए मैं क्या करूँ?',
    searchMsg: (q) => `"${q}" के लिए चार्ट बोर्ड विश्लेषण तैयार है।`,
    defaultDirectiveMsg: (q) => `निर्देश "${q}" पूरा हुआ। सभी सिस्टम सामान्य रूप से चल रहे हैं।`,
    girlVoiceMsg: 'गर्ल एआई वॉयस सक्रिय हो गई है। प्राकृतिक न्यूरल आवाज़ तैयार है।',
    boyVoiceMsg: 'बॉय एआई वॉयस सक्रिय हो गई है। प्राकृतिक न्यूरल आवाज़ तैयार है।',
    variationSpeakingMsg: 'मैक्स एआई हिंदी में बोल रही है। सभी सिस्टम तैयार हैं।',
    chartBoardSpoken: (q, c, conf, lat) =>
      `चार्ट बोर्ड विश्लेषण: "${q || 'डेटा'}" के लिए ${numberToWords(c, 'hi-IN')} रिकॉर्ड मिले। सटीकता ${numberToWords(conf, 'hi-IN')} प्रतिशत और गति ${numberToWords(lat, 'hi-IN')} मिलीसेकंड है।`,
    voiceHints: ['Hindi', 'Swara', 'Madhur', 'Kalpana', 'Hemant', 'hi-IN', 'hi_IN'],
    femaleVoiceHints: ['Swara', 'Kalpana', 'Hindi Female', 'hi-IN'],
    maleVoiceHints: ['Madhur', 'Hemant', 'Hindi Male', 'hi-IN']
  },

  // ==================== TAMIL (தமிழ்) ====================
  {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'வணக்கம்! இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    readyResponse: 'கணினி ஒத்திசைக்கப்பட்டது. மேக்ஸ் ஏஐ தயாராக உள்ளது.',
    listeningStatus: 'கேட்கிறேன்...',
    thinkingStatus: 'சிந்திக்கிறேன்...',
    speakingStatus: 'பேசுகிறேன்...',
    defaultStatus: 'வணக்கம்!',
    tasksMsg: (count) => `உங்களிடம் ${numberToWords(count, 'ta-IN')} முக்கியமான பணிகள் நிலுவையில் உள்ளன.`,
    whoMsg: 'நான் மேக்ஸ் ஏஐ, உங்கள் புத்திசாலி தனிப்பட்ட உதவியாளர். உங்கள் கட்டளையை கூறுங்கள்.',
    searchMsg: (q) => `"${q}" க்கான சார்ட் போர்டு பகுப்பாய்வு திறக்கப்பட்டது.`,
    defaultDirectiveMsg: (q) => `கட்டளை "${q}" செயல்படுத்தப்பட்டது. அனைத்து அமைப்புகளும் தயாராக உள்ளன.`,
    girlVoiceMsg: 'கேர்ள் ஏஐ குரல் செயல்படுத்தப்பட்டது.',
    boyVoiceMsg: 'பாய் ஏஐ குரல் செயல்படுத்தப்பட்டது.',
    variationSpeakingMsg: 'மேக்ஸ் ஏஐ தமிழில் பேசுகிறது. அனைத்து அமைப்புகளும் தயார்.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `சார்ட் போர்டு: "${q || 'தகவல்'}" க்காக ${numberToWords(c, 'ta-IN')} முடிவுகள் பெறப்பட்டன. துல்லியம் ${numberToWords(conf, 'ta-IN')} சதவீதம்.`,
    voiceHints: ['Tamil', 'Pallavi', 'Valluvar', 'ta-IN', 'ta_IN', 'தமிழ்'],
    femaleVoiceHints: ['Pallavi', 'Tamil Female', 'ta-IN'],
    maleVoiceHints: ['Valluvar', 'Tamil Male', 'ta-IN']
  },

  // ==================== KANNADA (ಕನ್ನಡ) ====================
  {
    code: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'ನಮಸ್ಕಾರ! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    readyResponse: 'ಸಿಸ್ಟಮ್ ಸಿದ್ಧವಾಗಿದೆ. ಮ್ಯಾಕ್ಸ್ ಎಐ ನಿಮ್ಮ ಆದೇಶಕ್ಕೆ ಕಾಯುತ್ತಿದೆ.',
    listeningStatus: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...',
    thinkingStatus: 'ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...',
    speakingStatus: 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...',
    defaultStatus: 'ನಮಸ್ಕಾರ!',
    tasksMsg: (count) => `ನಿಮ್ಮ ಬಳಿ ${numberToWords(count, 'kn-IN')} ಪ್ರಮುಖ ಕಾರ್ಯಗಳು ಬಾಕಿ ಇವೆ.`,
    whoMsg: 'ನಾನು ಮ್ಯಾಕ್ಸ್ ಎಐ, ನಿಮ್ಮ ಬುದ್ಧಿವಂತ ವೈಯಕ್ತಿಕ ಸಹಾಯಕ. ನಿಮ್ಮ ಆದೇಶವನ್ನು ತಿಳಿಸಿ.',
    searchMsg: (q) => `"${q}" ಗಾಗಿ ಚಾರ್ಟ್ ಬೋರ್ಡ್ ವಿಶ್ಲೇಷಣೆ ಸಿದ್ಧವಾಗಿದೆ.`,
    defaultDirectiveMsg: (q) => `ನಿಮ್ಮ ಆದೇಶ "${q}" ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ.`,
    girlVoiceMsg: 'ಗರ್ಲ್ ಎಐ ಧ್ವನಿ ಸಕ್ರಿಯಗೊಂಡಿದೆ.',
    boyVoiceMsg: 'ಬಾಯ್ ಎಐ ಧ್ವನಿ ಸಕ್ರಿಯಗೊಂಡಿದೆ.',
    variationSpeakingMsg: 'ಮ್ಯಾಕ್ಸ್ ಎಐ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡುತ್ತಿದೆ.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `ಚಾರ್ಟ್ ಬೋರ್ಡ್: "${q || 'ಮಾಹಿತಿ'}" ಗಾಗಿ ${numberToWords(c, 'kn-IN')} ದಾಖಲೆಗಳು ಲಭ್ಯವಿದೆ. ನಿಖರತೆ ${numberToWords(conf, 'kn-IN')} ಶೇಕಡಾ.`,
    voiceHints: ['Kannada', 'Sapna', 'Gagan', 'kn-IN', 'kn_IN', 'ಕನ್ನಡ'],
    femaleVoiceHints: ['Sapna', 'Kannada Female', 'kn-IN'],
    maleVoiceHints: ['Gagan', 'Kannada Male', 'kn-IN']
  },

  // ==================== MALAYALAM (മലയാളം) ====================
  {
    code: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'നമസ്കാരം! ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?',
    readyResponse: 'സിസ്റ്റം സജ്ജമാണ്. മാക്സ് എഐ തയ്യാറാണ്.',
    listeningStatus: 'കേൾക്കുന്നു...',
    thinkingStatus: 'ചിന്തിക്കുന്നു...',
    speakingStatus: 'സംസാരിക്കുന്നു...',
    defaultStatus: 'നമസ്കാരം!',
    tasksMsg: (count) => `നിങ്ങൾക്ക് ${numberToWords(count, 'ml-IN')} പ്രധാനപ്പെട്ട ജോലികൾ ബാക്കിയുണ്ട്.`,
    whoMsg: 'ഞാൻ മാക്സ് എഐ, നിങ്ങളുടെ ബുദ്ധിമാനായ സഹായി. നിങ്ങളുടെ നിർദ്ദേശം നൽകുക.',
    searchMsg: (q) => `"${q}" നായുള്ള ചാർട്ട് ബോർഡ് തയ്യാറാണ്.`,
    defaultDirectiveMsg: (q) => `നിർദ്ദേശം "${q}" പ്രോസസ്സ് ചെയ്തു.`,
    girlVoiceMsg: 'ഗേൾ എഐ ശബ്ദം സജ്ജമാക്കി.',
    boyVoiceMsg: 'ബോയ് എഐ ശബ്ദം സജ്ജമാക്കി.',
    variationSpeakingMsg: 'മാക്സ് എഐ സംസാരിക്കുന്നു.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `ചാർട്ട് ബോർഡ്: "${q || 'ഡാറ്റ'}" ന് ${numberToWords(c, 'ml-IN')} രേഖകൾ കണ്ടെത്തി. കൃത്യത ${numberToWords(conf, 'ml-IN')} ശതമാനം.`,
    voiceHints: ['Malayalam', 'Sobhana', 'Midhun', 'ml-IN', 'ml_IN', 'മലയാളം'],
    femaleVoiceHints: ['Sobhana', 'Malayalam Female', 'ml-IN'],
    maleVoiceHints: ['Midhun', 'Malayalam Male', 'ml-IN']
  },

  // ==================== BENGALI (বাংলা) ====================
  {
    code: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'নমস্কার! আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    readyResponse: 'সিস্টেম প্রস্তুত। ম্যাক্স এআই আপনার সেবায় নিয়োজিত।',
    listeningStatus: 'শুনছি...',
    thinkingStatus: 'ভাবছি...',
    speakingStatus: 'বলছি...',
    defaultStatus: 'নমস্কার!',
    tasksMsg: (count) => `আপনার কাছে ${numberToWords(count, 'bn-IN')}টি গুরুত্বপূর্ণ কাজ অপেক্ষমাণ রয়েছে।`,
    whoMsg: 'আমি ম্যাক্স এআই, আপনার ব্যক্তিগত কৃত্রিম বুদ্ধিমত্তা সহকারী। বলুন কীভাবে সাহায্য করব?',
    searchMsg: (q) => `"${q}" এর জন্য চার্ট বোর্ড প্রস্তুত করা হয়েছে।`,
    defaultDirectiveMsg: (q) => `নির্দেশ "${q}" সম্পন্ন হয়েছে। সকল সিস্টেম প্রস্তুত।`,
    girlVoiceMsg: 'গার্ল এআই ভয়েস সক্রিয় করা হয়েছে।',
    boyVoiceMsg: 'বয় এআই ভয়েস সক্রিয় করা হয়েছে।',
    variationSpeakingMsg: 'ম্যাক্স এআই বাংলায় কথা বলছে। সিস্টেম সক্রিয়।',
    chartBoardSpoken: (q, c, conf, lat) =>
      `চার্ট বোর্ড: "${q || 'তথ্য'}" এর জন্য ${numberToWords(c, 'bn-IN')}টি রেকর্ড পাওয়া গেছে। নির্ভুলতা ${numberToWords(conf, 'bn-IN')} শতাংশ।`,
    voiceHints: ['Bengali', 'Tanishaa', 'Bashkar', 'bn-IN', 'bn_IN', 'বাংলা'],
    femaleVoiceHints: ['Tanishaa', 'Bengali Female', 'bn-IN'],
    maleVoiceHints: ['Bashkar', 'Bengali Male', 'bn-IN']
  },

  // ==================== MARATHI (मराठी) ====================
  {
    code: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'नमस्कार! मी आज आपल्याला कशी मदत करू शकते?',
    readyResponse: 'सिस्टम सज्ज आहे. मॅक्स एआय तयार आहे.',
    listeningStatus: 'ऐकत आहे...',
    thinkingStatus: 'विचार करत आहे...',
    speakingStatus: 'बोलत आहे...',
    defaultStatus: 'नमस्कार!',
    tasksMsg: (count) => `आपल्याकडे ${numberToWords(count, 'mr-IN')} महत्त्वाची कामे प्रलंबित आहेत।`,
    whoMsg: 'मी मॅक्स एआय आहे, आपली बुद्धिमान वैयक्तिक सहाय्यक. मला सांगा मी काय करू शकते.',
    searchMsg: (q) => `"${q}" साठी चार्ट बोर्ड विश्लेषण उघडले आहे.`,
    defaultDirectiveMsg: (q) => `आपला आदेश "${q}" पूर्ण झाला आहे. सर्व प्रणाली कार्यरत आहेत.`,
    girlVoiceMsg: 'गर्ल एआय व्हॉईस सक्रिय झाला आहे.',
    boyVoiceMsg: 'बॉय एआय व्हॉईस सक्रिय झाला आहे.',
    variationSpeakingMsg: 'मॅक्स एआय मराठीत बोलत आहे. सिस्टीम तयार आहे.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `चार्ट बोर्ड विश्लेषण: "${q || 'डेटा'}" साठी ${numberToWords(c, 'mr-IN')} नोंदी सापडल्या. अचूकता ${numberToWords(conf, 'mr-IN')} टक्के आहे.`,
    voiceHints: ['Marathi', 'Aarohi', 'Manohar', 'mr-IN', 'mr_IN', 'मराठी'],
    femaleVoiceHints: ['Aarohi', 'Marathi Female', 'mr-IN'],
    maleVoiceHints: ['Manohar', 'Marathi Male', 'mr-IN']
  },

  // ==================== INDIAN ENGLISH ====================
  {
    code: 'en-IN',
    name: 'Indian English',
    nativeName: 'English (India)',
    flag: '🇮🇳',
    region: 'India',
    greeting: 'Hello! How can I help you today, Commander?',
    readyResponse: 'System synchronized. MAX AI is online and ready to assist you.',
    listeningStatus: 'Listening...',
    thinkingStatus: 'Thinking...',
    speakingStatus: 'Speaking...',
    defaultStatus: 'Hello!',
    tasksMsg: (count) => `You currently have ${numberToWords(count, 'en-IN')} pending assignments scheduled.`,
    whoMsg: 'I am MAX AI, your intelligent neural assistant. Ready for your directive.',
    searchMsg: (q) => `Opening Chart Board for "${q}". Real-time telemetry graphs and analytics active.`,
    defaultDirectiveMsg: (q) => `Processing directive "${q}". All neural subroutines operational.`,
    girlVoiceMsg: 'Switched to realistic Girl AI voice. Feminine neural synthesis active.',
    boyVoiceMsg: 'Switched to realistic Boy AI voice. Masculine neural synthesis active.',
    variationSpeakingMsg: 'Neural voice synthesis operational. MAX AI is speaking in Indian English.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `Chart Board analysis for "${q || 'Query'}": Found ${numberToWords(c, 'en-IN')} matching records with ${numberToWords(conf, 'en-IN')} percent confidence and ${numberToWords(lat, 'en-IN')} milliseconds latency.`,
    voiceHints: ['India', 'Heera', 'Neerja', 'Ravi', 'Prabhat', 'en-IN'],
    femaleVoiceHints: ['Neerja', 'Heera', 'India Female', 'en-IN'],
    maleVoiceHints: ['Ravi', 'Prabhat', 'India Male', 'en-IN']
  },

  // ==================== US ENGLISH ====================
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    region: 'Global',
    greeting: 'Hello! How can I help you today?',
    readyResponse: 'System synchronized. I am online and ready to assist you, Commander.',
    listeningStatus: 'Listening...',
    thinkingStatus: 'Thinking...',
    speakingStatus: 'Speaking...',
    defaultStatus: 'Hello!',
    tasksMsg: (count) => `You currently have ${numberToWords(count, 'en-US')} pending assignments scheduled.`,
    whoMsg: 'I am MAX AI, your intelligent neural assistant. Ready for your directive.',
    searchMsg: (q) => `Opening Chart Board for "${q}". Real-time telemetry graphs and analytics active.`,
    defaultDirectiveMsg: (q) => `Processing directive "${q}". All neural subroutines operational.`,
    girlVoiceMsg: 'Switched to realistic Girl AI voice. Lifelike feminine neural synthesis active.',
    boyVoiceMsg: 'Switched to realistic Boy AI voice. Lifelike masculine neural synthesis active.',
    variationSpeakingMsg: 'Neural voice synthesis operational. MAX AI is speaking.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `Chart Board analysis for "${q || 'Query'}": Found ${numberToWords(c, 'en-US')} matching neural records with ${numberToWords(conf, 'en-US')} percent confidence score and ${numberToWords(lat, 'en-US')} milliseconds retrieval latency.`,
    voiceHints: ['Jenny', 'Aria', 'Guy', 'Natural', 'en-US'],
    femaleVoiceHints: ['Jenny', 'Aria', 'Natural', 'Samantha', 'Zira', 'Female'],
    maleVoiceHints: ['Guy', 'Christopher', 'Natural', 'David', 'Male']
  },

  // ==================== SPANISH (Español) ====================
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Global',
    greeting: '¡Hola! ¿Cómo puedo ayudarte hoy?',
    readyResponse: 'Sistema sincronizado. MAX AI está en línea y listo para ayudarte.',
    listeningStatus: 'Escuchando...',
    thinkingStatus: 'Pensando...',
    speakingStatus: 'Hablando...',
    defaultStatus: '¡Hola!',
    tasksMsg: (count) => `Actualmente tienes ${numberToWords(count, 'es-ES')} tareas pendientes programadas.`,
    whoMsg: 'Soy MAX AI, tu asistente neural inteligente. Listo para tus instrucciones.',
    searchMsg: (q) => `Abriendo el tablero de gráficos para "${q}". Telemetría en tiempo real activa.`,
    defaultDirectiveMsg: (q) => `Procesando directiva "${q}". Todos los sistemas operativos.`,
    girlVoiceMsg: 'Cambiado a la voz femenina realista de Girl AI.',
    boyVoiceMsg: 'Cambiado a la voz masculina realista de Boy AI.',
    variationSpeakingMsg: 'Síntesis de voz neural operativa. MAX AI está hablando en español.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `Análisis del tablero para "${q || 'Datos'}": Se encontraron ${numberToWords(c, 'es-ES')} registros con ${numberToWords(conf, 'es-ES')} por ciento de confianza.`,
    voiceHints: ['Spanish', 'Helena', 'Laura', 'Monica', 'Alvaro', 'es-ES', 'es_ES'],
    femaleVoiceHints: ['Helena', 'Laura', 'Monica', 'Spanish Female', 'es-ES'],
    maleVoiceHints: ['Alvaro', 'Pablo', 'Spanish Male', 'es-ES']
  },

  // ==================== FRENCH (Français) ====================
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'Global',
    greeting: 'Bonjour! Comment puis-je vous aider aujourd’hui?',
    readyResponse: 'Système synchronisé. MAX AI est en ligne et prêt à vous assister.',
    listeningStatus: 'Écoute en cours...',
    thinkingStatus: 'Réflexion en cours...',
    speakingStatus: 'Je parle...',
    defaultStatus: 'Bonjour!',
    tasksMsg: (count) => `Vous avez actuellement ${numberToWords(count, 'fr-FR')} tâches en attente.`,
    whoMsg: 'Je suis MAX AI, votre assistant neural intelligent. Prêt pour vos ordres.',
    searchMsg: (q) => `Ouverture du tableau d’analyse pour "${q}".`,
    defaultDirectiveMsg: (q) => `Traitement de la directive "${q}". Tous les sous-systèmes sont prêts.`,
    girlVoiceMsg: 'Activation de la voix réaliste Girl AI.',
    boyVoiceMsg: 'Activation de la voix réaliste Boy AI.',
    variationSpeakingMsg: 'Synthèse vocale active. MAX AI parle en français.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `Analyse du tableau pour "${q || 'Données'}": ${numberToWords(c, 'fr-FR')} enregistrements trouvés avec ${numberToWords(conf, 'fr-FR')}% de confiance.`,
    voiceHints: ['French', 'Denise', 'Hortense', 'Henri', 'fr-FR', 'fr_FR'],
    femaleVoiceHints: ['Denise', 'Hortense', 'Julie', 'French Female', 'fr-FR'],
    maleVoiceHints: ['Henri', 'Paul', 'French Male', 'fr-FR']
  },

  // ==================== GERMAN (Deutsch) ====================
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'Global',
    greeting: 'Hallo! Wie kann ich Ihnen heute helfen?',
    readyResponse: 'System synchronisiert. MAX AI ist online und einsatzbereit.',
    listeningStatus: 'Ich höre zu...',
    thinkingStatus: 'Ich denke nach...',
    speakingStatus: 'Ich spreche...',
    defaultStatus: 'Hallo!',
    tasksMsg: (count) => `Sie haben derzeit ${numberToWords(count, 'de-DE')} anstehende Aufgaben geplant.`,
    whoMsg: 'Ich bin MAX AI, Ihr intelligenter neuronaler Assistent. Bereit für Ihre Anweisungen.',
    searchMsg: (q) => `Öffne Diagramm-Board für "${q}".`,
    defaultDirectiveMsg: (q) => `Anweisung "${q}" wird verarbeitet. Alle Systeme betriebsbereit.`,
    girlVoiceMsg: 'Auf realistische Girl AI-Stimme umgeschaltet.',
    boyVoiceMsg: 'Auf realistische Boy AI-Stimme umgeschaltet.',
    variationSpeakingMsg: 'Neuronale Sprachsynthese aktiv. MAX AI spricht auf Deutsch.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `Diagramm-Board-Analyse für "${q || 'Daten'}": ${numberToWords(c, 'de-DE')} Datensätze gefunden mit ${numberToWords(conf, 'de-DE')}% Zuverlässigkeit.`,
    voiceHints: ['German', 'Katja', 'Hedda', 'Conrad', 'de-DE', 'de_DE'],
    femaleVoiceHints: ['Katja', 'Hedda', 'German Female', 'de-DE'],
    maleVoiceHints: ['Conrad', 'Stefan', 'German Male', 'de-DE']
  },

  // ==================== JAPANESE (日本語) ====================
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: 'Global',
    greeting: 'こんにちは！本日はどのようなご用件でしょうか？',
    readyResponse: 'システム同期完了。MAX AIがオンラインです。',
    listeningStatus: '聞いています...',
    thinkingStatus: '処理中...',
    speakingStatus: '話しています...',
    defaultStatus: 'こんにちは！',
    tasksMsg: (count) => `現在、${numberToWords(count, 'ja-JP')}件のタスクが予定されています。`,
    whoMsg: '私はMAX AIです。あなたのインテリジェント・アシスタントです。ご指示をどうぞ。',
    searchMsg: (q) => `"${q}" のチャートボード分析を表示します。`,
    defaultDirectiveMsg: (q) => `指示「${q}」を処理しました。全システム正常稼働中です。`,
    girlVoiceMsg: 'ガールAIのリアル音声に切り替えました。',
    boyVoiceMsg: 'ボーイAIのリアル音声に切り替えました。',
    variationSpeakingMsg: '音声合成稼働中。MAX AIが日本語でお話ししています。',
    chartBoardSpoken: (q, c, conf, lat) =>
      `チャートボード分析：「${q || 'データ'}」について${numberToWords(c, 'ja-JP')}件のレコードを検出。信頼度${numberToWords(conf, 'ja-JP')}パーセント。`,
    voiceHints: ['Japanese', 'Nanami', 'Keita', 'ja-JP', 'ja_JP'],
    femaleVoiceHints: ['Nanami', 'Ayumi', 'Japanese Female', 'ja-JP'],
    maleVoiceHints: ['Keita', 'Daichi', 'Japanese Male', 'ja-JP']
  },

  // ==================== ARABIC (العربية) ====================
  {
    code: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    region: 'Global',
    greeting: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    readyResponse: 'تمت مزامنة النظام. ماكس الذكاء الاصطناعي جاهز لمساعدتك.',
    listeningStatus: 'جارٍ الاستماع...',
    thinkingStatus: 'جارٍ التفكير...',
    speakingStatus: 'جارٍ التحدث...',
    defaultStatus: 'مرحباً!',
    tasksMsg: (count) => `لديك حالياً ${numberToWords(count, 'ar-SA')} مهام معلقة في جدولك.`,
    whoMsg: 'أنا ماكس، مساعدك الذكي فائق التطور. في انتظار أوامرك.',
    searchMsg: (q) => `جارٍ فتح لوحة المخططات لـ "${q}".`,
    defaultDirectiveMsg: (q) => `تمت معالجة الأمر "${q}". جميع الأنظمة تعمل بكفاءة.`,
    girlVoiceMsg: 'تم التبديل إلى صوت الذكاء الاصطناعي الأنثوي الواقعي.',
    boyVoiceMsg: 'تم التبديل إلى صوت الذكاء الاصطناعي الذكوري الواقعي.',
    variationSpeakingMsg: 'نظام التوليف الصوتي يعمل الآن باللغة العربية.',
    chartBoardSpoken: (q, c, conf, lat) =>
      `تحليل لوحة المخططات: تم العثور على ${numberToWords(c, 'ar-SA')} سجلات لـ "${q || 'البيانات'}" بنسبة دقة ${numberToWords(conf, 'ar-SA')} بالمائة.`,
    voiceHints: ['Arabic', 'Zariyah', 'Hamed', 'ar-SA', 'ar_SA'],
    femaleVoiceHints: ['Zariyah', 'Fatima', 'Arabic Female', 'ar-SA'],
    maleVoiceHints: ['Hamed', 'Shakir', 'Arabic Male', 'ar-SA']
  }
];

export function getDefaultLanguage() {
  if (typeof window === 'undefined') return 'en-US';
  return localStorage.getItem('max_language') || 'en-US';
}

export function saveLanguage(langCode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('max_language', langCode);
  }
}

export function getLanguageByCode(code) {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

/**
 * Generate accurate, natural localized speech for real Date and Time
 * All hours, minutes, day numbers, and years are spelled out into native words!
 */
export function getLocalizedDateTimeSpeech(date = new Date(), langCode = 'en-US') {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const display12 = hours % 12 || 12;
  const dayNum = date.getDate();
  const year = date.getFullYear();

  switch (langCode) {
    case 'te-IN': {
      const days = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
      const months = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const periodName = hours >= 12 ? (hours < 16 ? 'మధ్యాహ్నం' : hours < 20 ? 'సాయంత్రం' : 'రాత్రి') : 'ఉదయం';
      const hWord = numberToWords(display12, 'te-IN');
      const mWord = minutes === 0 ? '' : `${numberToWords(minutes, 'te-IN')} నిమిషాలు`;
      const dWord = numberToWords(dayNum, 'te-IN');
      const yWord = numberToWords(year, 'te-IN');
      return `ప్రస్తుత సమయం ${periodName} ${hWord} గంటల ${mWord ? mWord + ', ' : ''}మరియు ఈ రోజు ${dayName}, ${dWord} ${monthName} ${yWord}.`;
    }

    case 'hi-IN': {
      const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
      const months = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const periodName = hours >= 12 ? (hours < 16 ? 'दोपहर' : hours < 20 ? 'शाम' : 'रात') : 'सुबह';
      const hWord = numberToWords(display12, 'hi-IN');
      const mWord = numberToWords(minutes, 'hi-IN');
      const dWord = numberToWords(dayNum, 'hi-IN');
      const yWord = numberToWords(year, 'hi-IN');
      return `वर्तमान समय ${periodName} के ${hWord} बजकर ${mWord} मिनट है, और आज ${dayName}, ${dWord} ${monthName} ${yWord} है।`;
    }

    case 'ta-IN': {
      const days = ['ஞாயிற்றுக்கிழமை', 'திங்கட்கிழமை', 'செவ்வாய்க்கிழமை', 'புதன்கிழமை', 'வியாழக்கிழமை', 'வெள்ளிக்கிழமை', 'சனிக்கிழமை'];
      const months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const hWord = numberToWords(display12, 'ta-IN');
      const mWord = numberToWords(minutes, 'ta-IN');
      const dWord = numberToWords(dayNum, 'ta-IN');
      const yWord = numberToWords(year, 'ta-IN');
      return `தற்போதைய நேரம் ${hWord} மணி ${mWord} நிமிடங்கள் ${period === 'PM' ? 'மாலை' : 'காலை'}, மற்றும் இன்றைய நாள் ${dayName}, ${monthName} ${dWord}, ${yWord}.`;
    }

    case 'bn-IN': {
      const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const hWord = numberToWords(display12, 'bn-IN');
      const mWord = numberToWords(minutes, 'bn-IN');
      const dWord = numberToWords(dayNum, 'bn-IN');
      const yWord = numberToWords(year, 'bn-IN');
      return `বর্তমান সময় ${hWord}টা বেজে ${mWord} মিনিট, এবং আজ ${dayName}, ${dWord}ই ${monthName} ${yWord}।`;
    }

    case 'kn-IN': {
      const days = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];
      const months = ['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const hWord = numberToWords(display12, 'kn-IN');
      const mWord = numberToWords(minutes, 'kn-IN');
      const dWord = numberToWords(dayNum, 'kn-IN');
      const yWord = numberToWords(year, 'kn-IN');
      return `ಪ್ರಸ್ತುತ ಸಮಯ ${hWord} ಗಂಟೆ ${mWord} ನಿಮಿಷಗಳು, ಮತ್ತು ಇಂದು ${dayName}, ${dWord} ${monthName} ${yWord}.`;
    }

    case 'ml-IN': {
      const days = ['ഞായറാഴ്ച', 'തിങ്കളാഴ്ച', 'ചൊവ്വാഴ്ച', 'ബുധനാഴ്ച', 'വ്യാഴാഴ്ച', 'വെള്ളിയാഴ്ച', 'ശനിയാഴ്ച'];
      const months = ['ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മേ', 'ജൂൺ', 'ജൂലൈ', 'ആഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const hWord = numberToWords(display12, 'ml-IN');
      const mWord = numberToWords(minutes, 'ml-IN');
      const dWord = numberToWords(dayNum, 'ml-IN');
      const yWord = numberToWords(year, 'ml-IN');
      return `ഇപ്പോഴത്തെ സമയം ${hWord} മണി ${mWord} മിനിറ്റ്, ഇന്നത്തെ തീയതി ${dayName}, ${monthName} ${dWord}, ${yWord}.`;
    }

    case 'mr-IN': {
      const days = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
      const months = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const hWord = numberToWords(display12, 'mr-IN');
      const mWord = numberToWords(minutes, 'mr-IN');
      const dWord = numberToWords(dayNum, 'mr-IN');
      const yWord = numberToWords(year, 'mr-IN');
      return `सध्याची वेळ ${hWord} वाजून ${mWord} मिनिटे आहे, आणि आज ${dayName}, ${dWord} ${monthName} ${yWord} आहे.`;
    }

    case 'es-ES': {
      const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const hWord = numberToWords(display12, 'es-ES');
      const mWord = minutes === 0 ? 'en punto' : numberToWords(minutes, 'es-ES');
      const dWord = numberToWords(dayNum, 'es-ES');
      const yWord = numberToWords(year, 'es-ES');
      return `La hora actual es las ${hWord} y ${mWord} ${period}, y hoy es ${days[date.getDay()]}, ${dWord} de ${months[date.getMonth()]} de ${yWord}.`;
    }

    case 'fr-FR': {
      const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      const hWord = numberToWords(hours, 'fr-FR');
      const mWord = minutes === 0 ? '' : numberToWords(minutes, 'fr-FR');
      const dWord = numberToWords(dayNum, 'fr-FR');
      const yWord = numberToWords(year, 'fr-FR');
      return `L'heure actuelle est ${hWord} heures ${mWord}, et aujourd'hui nous sommes le ${days[date.getDay()]} ${dWord} ${months[date.getMonth()]} ${yWord}.`;
    }

    case 'de-DE': {
      const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
      const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
      const hWord = numberToWords(hours, 'de-DE');
      const mWord = minutes === 0 ? '' : numberToWords(minutes, 'de-DE');
      const dWord = numberToWords(dayNum, 'de-DE');
      const yWord = numberToWords(year, 'de-DE');
      return `Die aktuelle Uhrzeit ist ${hWord} Uhr ${mWord}, und heute ist ${days[date.getDay()]}, der ${dWord}. ${months[date.getMonth()]} ${yWord}.`;
    }

    case 'ja-JP': {
      const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
      const periodStr = hours >= 12 ? '午後' : '午前';
      const hWord = numberToWords(display12, 'ja-JP');
      const mWord = numberToWords(minutes, 'ja-JP');
      const dWord = numberToWords(dayNum, 'ja-JP');
      const yWord = numberToWords(year, 'ja-JP');
      const moWord = numberToWords(date.getMonth() + 1, 'ja-JP');
      return `現在の時刻は${periodStr}${hWord}時${mWord}分、本日の日付は${yWord}年${moWord}月${dWord}日${days[date.getDay()]}です。`;
    }

    case 'ar-SA': {
      const hWord = numberToWords(display12, 'ar-SA');
      const mWord = numberToWords(minutes, 'ar-SA');
      const periodStr = period === 'PM' ? 'مساءً' : 'صباحاً';
      const dWord = numberToWords(dayNum, 'ar-SA');
      const yWord = numberToWords(year, 'ar-SA');
      return `الوقت الحالي هو ${hWord} و${mWord} دقيقة ${periodStr}، واليوم هو ${dWord} في الشهر، سنة ${yWord}.`;
    }

    case 'en-IN':
    case 'en-US':
    default: {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const hWord = numberToWords(display12, 'en-US');
      const mWord = minutes === 0 ? "o'clock" : numberToWords(minutes, 'en-US');
      const dWord = numberToWords(dayNum, 'en-US');
      const yWord = numberToWords(year, 'en-US');
      return `The current time is ${hWord} ${mWord} ${period}, and today is ${days[date.getDay()]}, ${months[date.getMonth()]} ${dWord}, ${yWord}.`;
    }
  }
}
