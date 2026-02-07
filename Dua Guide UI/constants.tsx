
import { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'umrah-steps',
    name: 'Umrah Procedure',
    description: 'Step-by-step guidance for the Umrah pilgrimage.',
    icon: 'fa-kaaba',
    color: 'bg-emerald-600',
    duas: [
      {
        id: 'ihram-niyyah',
        title: 'Niyyah for Umrah',
        arabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
        transliteration: 'Labbayka Allāhumma ‘umrah',
        translation: 'O Allah, here I am for Umrah.',
        reference: 'Sahih Bukhari',
        benefits: 'This signifies the start of the sacred state of Ihram.'
      },
      {
        id: 'talbiyah',
        title: 'The Talbiyah',
        arabic: 'لَبَّيْكَ اللهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        transliteration: 'Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna al-ḥamda wa-n-ni‘mata laka wa-l-mulk, lā sharīka lak',
        translation: 'Labbayk, O Allah, Labbayk. Labbayk, You have no partner, Labbayk. Indeed, all praise, grace, and sovereignty belong to You. You have no partner.',
        reference: 'Muslim'
      },
      {
        id: 'tawaf-start',
        title: 'Starting Tawaf',
        arabic: 'بِسْمِ اللهِ وَاللهُ أَكْبَرُ',
        transliteration: 'Bismillāhi wa-Llāhu akbar',
        translation: 'In the name of Allah, Allah is the Greatest.',
        benefits: 'Recited at the Black Stone (Hajar al-Aswad).'
      }
    ]
  },
  {
    id: 'daily-adhkar',
    name: 'Daily Adhkar',
    description: 'Essential morning and evening remembrances.',
    icon: 'fa-sun',
    color: 'bg-amber-600',
    duas: [
      {
        id: 'morning-protection',
        title: 'Protection from Harm',
        arabic: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: 'Bismillāh-il-ladhī lā yaḍurru ma‘as-mihi shay’un fil-arḍi wa lā fis-samā’i wa huwas-samī‘ul-‘alīm',
        translation: 'In the name of Allah with whose name nothing can harm on earth or in the heaven, and He is the All-Hearing, All-Knowing.',
        benefits: 'Recite three times for protection from all evil.'
      }
    ]
  },
  {
    id: 'travel-duas',
    name: 'Travel Duas',
    description: 'Supplications for leaving home and traveling.',
    icon: 'fa-plane',
    color: 'bg-blue-600',
    duas: [
      {
        id: 'travel-mount',
        title: 'Mounting the Vehicle',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        transliteration: 'Subḥān-alladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā rabbinā lamunqalibūn',
        translation: 'Glory is to Him Who has subjected this to us, and we could never have it by our efforts. And surely, to our Lord we are returning.',
        reference: 'Surah Az-Zukhruf 13-14'
      }
    ]
  }
];
