// Register GSAP ScrollTrigger Plugin (with safety check)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Language and Theme State
let currentLang = 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

// Bookmarks State
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
let currentEventId = null;
let currentFilteredEvents = [];
let currentSearchTerm = '';

// Timeline Data
const timelineData = [
    {
        id: 1,
        year: 570,
        category: 'prophets',
        title: { en: 'Birth of Prophet Muhammad (PBUH)', ar: 'ولادة النبي محمد صلى الله عليه وسلم' },
        description: { en: 'Prophet Muhammad was born in Mecca', ar: 'ولد النبي محمد في مكة' },
        quranSurah: 68,
        quranAyah: 4,
        hadith: { en: 'Verily, you (O Muhammad) are upon a great morality.', ar: 'وإنك لعلى خلق عظيم' },
        context: { en: 'The Prophet was born in the Year of the Elephant, marking the beginning of the final message to humanity.', ar: 'ولد النبي في عام الفيل، مما يمثل بداية الرسالة الأخيرة للبشرية.' }
    },
    {
        id: 2,
        year: 610,
        category: 'prophets',
        title: { en: 'First Revelation', ar: 'أول وحي' },
        description: { en: 'The Quran was first revealed to Prophet Muhammad', ar: 'أول نزول القرآن على النبي محمد' },
        quranSurah: 96,
        quranAyah: 1,
        hadith: { en: 'Read in the name of your Lord who created.', ar: 'اقرأ باسم ربك الذي خلق' },
        context: { en: 'The first verses of Surah Al-Alaq were revealed in the Cave of Hira, beginning the 23-year period of revelation.', ar: 'نزلت أول آيات سورة العلق في غار حراء، بداية فترة الوحي التي استمرت 23 عاماً.' }
    },
    {
        id: 3,
        year: 622,
        category: 'prophets',
        title: { en: 'The Hijrah (Migration)', ar: 'الهجرة' },
        description: { en: 'Prophet Muhammad migrated from Mecca to Medina', ar: 'هاجر النبي محمد من مكة إلى المدينة' },
        quranSurah: 9,
        quranAyah: 40,
        hadith: { en: 'If you do not aid him, Allah has already aided him.', ar: 'إن تتولوا فإن الله مولاه' },
        context: { en: 'This migration marks the beginning of the Islamic calendar and the establishment of the first Muslim state in Medina.', ar: 'تشير هذه الهجرة إلى بداية التقويم الإسلامي وإنشاء أول دولة إسلامية في المدينة.' }
    },
    {
        id: 4,
        year: 624,
        category: 'battles',
        title: { en: 'Battle of Badr', ar: 'غزوة بدر' },
        description: { en: 'First major battle between Muslims and Quraysh', ar: 'أول معركة كبرى بين المسلمين وقريش' },
        quranSurah: 3,
        quranAyah: 123,
        hadith: { en: 'Allah helped you at Badr when you were weak.', ar: 'وقد نصركم الله ببدر وأنتم أذلة' },
        context: { en: 'A decisive victory for Muslims despite being outnumbered 3 to 1, demonstrating divine assistance.', ar: 'نصر حاسم للمسلمين رغم تفوق العدو 3 إلى 1، مما يظهر المساعدة الإلهية.' }
    },
    {
        id: 5,
        year: 625,
        category: 'battles',
        title: { en: 'Battle of Uhud', ar: 'غزوة أحد' },
        description: { en: 'Second major battle, a test of patience for Muslims', ar: 'المعركة الثانية الكبرى، اختبار صبر للمسلمين' },
        quranSurah: 3,
        quranAyah: 165,
        hadith: { en: 'And it was not for a believing man or a believing woman, when Allah and His Messenger have decided a matter, that they should have any choice.', ar: 'وما كان لمؤمن ولا مؤمنة إذا قضى الله ورسوله أمراً أن يكون لهم الخيرة' },
        context: { en: 'Muslims faced a setback due to disobedience, teaching an important lesson in discipline and obedience.', ar: 'واجه المسلمون نكسة بسبب العصيان، مما يعلم درساً مهماً في الانضباط والطاعة.' }
    },
    {
        id: 6,
        year: 632,
        category: 'prophets',
        title: { en: 'Passing of Prophet Muhammad (PBUH)', ar: 'وفاة النبي محمد صلى الله عليه وسلم' },
        description: { en: 'Prophet Muhammad passed away in Medina', ar: 'توفي النبي محمد في المدينة' },
        quranSurah: 33,
        quranAyah: 40,
        hadith: { en: 'Muhammad is not the father of any man among you, but he is the Messenger of Allah and the Seal of the Prophets.', ar: 'ما كان محمد أبا أحد من رجالكم ولكن رسول الله وخاتم النبيين' },
        context: { en: 'The Prophet completed his mission at age 63, leaving behind the Quran and Sunnah as guidance.', ar: 'أكمل النبي مهمته في سن 63، تاركاً القرآن والسنة كهداية.' }
    },
    {
        id: 7,
        year: 632,
        category: 'caliphs',
        title: { en: 'Caliphate of Abu Bakr', ar: 'خلافة أبو بكر' },
        description: { en: 'First Rightly Guided Caliph', ar: 'أول الخلفاء الراشدين' },
        quranSurah: 9,
        quranAyah: 40,
        hadith: { en: 'If I were to take an intimate friend, I would take Abu Bakr as my intimate friend.', ar: 'لو كنت متخذاً خليلاً لاتخذت أبا بكر خليلاً' },
        context: { en: 'Abu Bakr unified Arabia and compiled the Quran. His caliphate lasted 2 years (632-634 CE).', ar: 'وحد أبو بكر الجزيرة العربية وجمع القرآن. استمرت خلافته سنتين (632-634 م).' }
    },
    {
        id: 8,
        year: 634,
        category: 'caliphs',
        title: { en: 'Caliphate of Umar ibn Al-Khattab', ar: 'خلافة عمر بن الخطاب' },
        description: { en: 'Second Rightly Guided Caliph', ar: 'ثاني الخلفاء الراشدين' },
        quranSurah: 58,
        quranAyah: 22,
        hadith: { en: 'If there were to be a prophet after me, it would have been Umar.', ar: 'لو كان نبي بعدي لكان عمر' },
        context: { en: 'Umar expanded the Muslim state significantly and established many administrative systems. His caliphate lasted 10 years (634-644 CE).', ar: 'وسع عمر الدولة الإسلامية بشكل كبير وأنشأ أنظمة إدارية عديدة. استمرت خلافته 10 سنوات (634-644 م).' }
    },
    {
        id: 9,
        year: 644,
        category: 'caliphs',
        title: { en: 'Caliphate of Uthman ibn Affan', ar: 'خلافة عثمان بن عفان' },
        description: { en: 'Third Rightly Guided Caliph', ar: 'ثالث الخلفاء الراشدين' },
        quranSurah: 48,
        quranAyah: 29,
        hadith: { en: 'Every prophet has an intimate friend, and my intimate friend is Uthman.', ar: 'لكل نبي رفيق ورفيقي عثمان' },
        context: { en: 'Uthman standardized the Quranic text and compiled it into one book. His caliphate lasted 12 years (644-656 CE).', ar: 'وحد عثمان نص القرآن وجمعه في كتاب واحد. استمرت خلافته 12 سنة (644-656 م).' }
    },
    {
        id: 10,
        year: 656,
        category: 'caliphs',
        title: { en: 'Caliphate of Ali ibn Abi Talib', ar: 'خلافة علي بن أبي طالب' },
        description: { en: 'Fourth Rightly Guided Caliph', ar: 'رابع الخلفاء الراشدين' },
        quranSurah: 5,
        quranAyah: 55,
        hadith: { en: 'You are to me like Aaron was to Moses, except that there will be no prophet after me.', ar: 'أنت مني بمنزلة هارون من موسى إلا أنه لا نبي بعدي' },
        context: { en: 'Ali was known for his knowledge and justice. His caliphate lasted 5 years (656-661 CE), ending the era of the Rightly Guided Caliphs.', ar: 'عُرف علي بعلمه وعدله. استمرت خلافته 5 سنوات (656-661 م)، منهية عصر الخلفاء الراشدين.' }
    },
    {
        id: 11,
        year: 870,
        category: 'scholars',
        title: { en: 'Imam Bukhari', ar: 'الإمام البخاري' },
        description: { en: 'Compiler of Sahih al-Bukhari', ar: 'جامع صحيح البخاري' },
        quranSurah: 49,
        quranAyah: 13,
        hadith: { en: 'Verily, the most noble of you in the sight of Allah is the most righteous of you.', ar: 'إن أكرمكم عند الله أتقاكم' },
        context: { en: 'Muhammad ibn Ismail al-Bukhari (810-870 CE) compiled the most authentic collection of Hadith, traveling extensively to verify narrations.', ar: 'محمد بن إسماعيل البخاري (810-870 م) جمع أصح مجموعة حديث، سافر على نطاق واسع للتحقق من الروايات.' }
    },
    {
        id: 12,
        year: 875,
        category: 'scholars',
        title: { en: 'Imam Muslim', ar: 'الإمام مسلم' },
        description: { en: 'Compiler of Sahih Muslim', ar: 'جامع صحيح مسلم' },
        quranSurah: 39,
        quranAyah: 9,
        hadith: { en: 'Are those who know equal to those who do not know?', ar: 'هل يستوي الذين يعلمون والذين لا يعلمون' },
        context: { en: 'Muslim ibn al-Hajjaj (817-875 CE) compiled the second most authentic Hadith collection, working alongside Bukhari and other great scholars.', ar: 'مسلم بن الحجاج (817-875 م) جمع ثاني أصح مجموعة حديث، عمل مع البخاري وعلماء عظماء آخرين.' }
    }
];

// Initialize Theme
function initTheme() {
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Toggle Theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    initTheme();
}

// Toggle Language
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
    updateLanguageTexts();
}

// Update all language texts
function updateLanguageTexts() {
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
}

// Fetch Quran Verse
async function fetchQuranVerse(surah, ayah) {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`);
        const data = await response.json();
        if (data.code === 200 && data.data) {
            return {
                arabic: data.data.text,
                english: data.data.edition?.identifier === 'en.asad' ? data.data.text : null
            };
        }
    } catch (error) {
        console.error('Error fetching Quran verse:', error);
    }
    
    // Fallback - try English translation
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/en.asad`);
        const data = await response.json();
        if (data.code === 200 && data.data) {
            return {
                arabic: null,
                english: data.data[0]?.text || null
            };
        }
    } catch (error) {
        console.error('Error fetching Quran verse translation:', error);
    }
    
    return { arabic: null, english: null };
}

// Render Timeline Events
function renderTimeline(events = timelineData) {
    const container = document.getElementById('timelineEvents');
    container.innerHTML = '';
    
    events.forEach((event, index) => {
        const eventCard = createEventCard(event, index);
        container.appendChild(eventCard);
    });
    
    // Animate with GSAP (if available)
    if (typeof gsap !== 'undefined') {
        try {
            gsap.fromTo('.timeline-event', 
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#timelineEvents',
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        } catch (error) {
            console.warn('GSAP animation error:', error);
            // Fallback: simple fade-in
            document.querySelectorAll('.timeline-event').forEach((el, i) => {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.transition = 'opacity 0.3s';
                    el.style.opacity = '1';
                }, i * 50);
            });
        }
    } else {
        // Fallback if GSAP not available
        document.querySelectorAll('.timeline-event').forEach((el, i) => {
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.transition = 'opacity 0.3s';
                el.style.opacity = '1';
            }, i * 50);
        });
    }
}

// Create Event Card
function createEventCard(event, index) {
    const card = document.createElement('div');
    card.className = `timeline-event fade-up`;
    card.dataset.category = event.category;
    card.dataset.id = event.id;
    
    const isMobile = window.innerWidth < 768;
    const positionClass = index % 2 === 0 ? 'top-0' : 'bottom-0 md:bottom-auto md:top-0';
    const marginClass = index % 2 === 0 ? 'mb-16 md:mb-0' : 'mt-16 md:mt-0';
    
    card.innerHTML = `
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover-card p-6 border-2 border-transparent hover:border-green-500 dark:hover:border-green-400 transition-all cursor-pointer ${marginClass}">
            <div class="absolute ${isMobile ? 'top-4 left-4' : 'top-1/2 -left-6 md:-left-8'} transform ${isMobile ? '' : 'md:-translate-y-1/2'} z-10">
                <div class="w-4 h-4 md:w-6 md:h-6 bg-green-500 dark:bg-green-400 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
            </div>
            <div class="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">${event.year} CE</div>
            <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">${event.title[currentLang]}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${event.description[currentLang]}</p>
            <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    ${getCategoryName(event.category)}
                </span>
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showEventDetail(event));
    return card;
}

// Get Category Name
function getCategoryName(category) {
    const names = {
        prophets: { en: 'Prophets', ar: 'أنبياء' },
        caliphs: { en: 'Caliphs', ar: 'خلفاء' },
        scholars: { en: 'Scholars', ar: 'علماء' },
        battles: { en: 'Battles', ar: 'معارك' }
    };
    return names[category]?.[currentLang] || category;
}

// Show Event Detail
async function showEventDetail(event) {
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    currentEventId = event.id;
    modalTitle.textContent = event.title[currentLang];
    modalContent.innerHTML = '<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update bookmark button
    updateBookmarkButton(event.id);
    
    // Fetch Quran verse
    const quranData = await fetchQuranVerse(event.quranSurah, event.quranAyah);
    
    // Build modal content
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border-l-4 border-green-500">
                <div class="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                    <span data-en="Historical Context" data-ar="السياق التاريخي">Historical Context</span>
                </div>
                <p class="text-gray-700 dark:text-gray-300">${event.context[currentLang]}</p>
            </div>
            
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                <div class="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span data-en="Quran Verse (Surah ${event.quranSurah}, Ayah ${event.quranAyah})" data-ar="آية قرآنية (سورة ${event.quranSurah}، آية ${event.quranAyah})">Quran Verse (Surah ${event.quranSurah}, Ayah ${event.quranAyah})</span>
                </div>
                ${quranData.arabic ? `
                    <div class="quran-verse-arabic text-right mb-4 text-gray-800 dark:text-gray-200">${quranData.arabic}</div>
                ` : ''}
                ${quranData.english ? `
                    <div class="text-gray-700 dark:text-gray-300 italic leading-relaxed">${quranData.english}</div>
                ` : `
                    <div class="text-gray-600 dark:text-gray-400 italic" data-en="Verse text unavailable" data-ar="نص الآية غير متاح">Verse text unavailable</div>
                `}
            </div>
            
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <div class="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <span data-en="Hadith" data-ar="حديث">Hadith</span>
                </div>
                <div class="hadith-text text-gray-700 dark:text-gray-300 leading-relaxed">${event.hadith[currentLang]}</div>
            </div>
            
            <div class="flex items-center justify-center pt-4">
                <span class="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold text-sm">
                    ${event.year} CE
                </span>
            </div>
        </div>
    `;
    
    updateLanguageTexts();
    
    // Attach event listeners to modal buttons
    document.getElementById('bookmarkBtn').onclick = () => toggleBookmark(event.id);
    document.getElementById('shareBtn').onclick = () => shareEvent(event);
}

// Search Events
function searchEvents(searchTerm) {
    currentSearchTerm = searchTerm.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    applyFiltersAndSearch(activeFilter, currentSearchTerm);
}

// Filter Events
function filterEvents(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
            btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
        } else {
            btn.classList.remove('active');
            btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
        }
    });
    
    applyFiltersAndSearch(category, currentSearchTerm);
}

// Apply filters and search together
function applyFiltersAndSearch(category, searchTerm) {
    let filteredEvents = category === 'all' 
        ? timelineData 
        : timelineData.filter(event => event.category === category);
    
    if (searchTerm) {
        filteredEvents = filteredEvents.filter(event => 
            event.title.en.toLowerCase().includes(searchTerm) ||
            event.title.ar.includes(searchTerm) ||
            event.description.en.toLowerCase().includes(searchTerm) ||
            event.description.ar.includes(searchTerm) ||
            event.year.toString().includes(searchTerm)
        );
    }
    
    currentFilteredEvents = filteredEvents;
    renderTimeline(filteredEvents);
    updateEventCount(filteredEvents.length);
    updateProgressBar(filteredEvents);
}

// Update Event Count
function updateEventCount(count) {
    const countElement = document.getElementById('countNumber');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Update Progress Bar
function updateProgressBar(events) {
    if (events.length === 0) return;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (!progressBar || !progressText) return;
    
    const years = events.map(e => e.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const range = 1500 - 570;
    const progress = ((maxYear - 570) / range) * 100;
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${minYear} - ${maxYear} CE`;
}

// Bookmark Management
function toggleBookmark(eventId) {
    const index = bookmarks.indexOf(eventId);
    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(eventId);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkUI();
    updateBookmarkButton(eventId);
}

function isBookmarked(eventId) {
    return bookmarks.includes(eventId);
}

function updateBookmarkUI() {
    const count = bookmarks.length;
    const bookmarkCountEl = document.getElementById('bookmarkCount');
    if (bookmarkCountEl) {
        bookmarkCountEl.textContent = count;
    }
}

function updateBookmarkButton(eventId) {
    const btn = document.getElementById('bookmarkBtn');
    if (!btn) return;
    const icon = btn.querySelector('svg');
    if (isBookmarked(eventId)) {
        btn.classList.add('text-amber-500');
        if (icon) icon.classList.add('fill-amber-500');
    } else {
        btn.classList.remove('text-amber-500');
        if (icon) icon.classList.remove('fill-amber-500');
    }
}

function showBookmarks() {
    if (bookmarks.length === 0) {
        alert(currentLang === 'en' ? 'No bookmarked events yet.' : 'لا توجد أحداث محفوظة بعد.');
        return;
    }
    
    const bookmarkedEvents = timelineData.filter(event => bookmarks.includes(event.id));
    currentFilteredEvents = bookmarkedEvents;
    renderTimeline(bookmarkedEvents);
    updateEventCount(bookmarkedEvents.length);
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
    });
}

// Share Event
function shareEvent(event) {
    const shareText = `${event.title[currentLang]}\n${event.description[currentLang]}\n\nYear: ${event.year} CE\n\n${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: event.title[currentLang],
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            const btn = document.getElementById('shareBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    }
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    currentEventId = null;
}

// Initialize App
function init() {
    try {
        // Initialize filtered events with all timeline data
        currentFilteredEvents = [...timelineData];
        
        initTheme();
        renderTimeline();
        updateBookmarkUI();
        updateEventCount(timelineData.length);
        updateProgressBar(timelineData);
        
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Language Toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                toggleLanguage();
                // Update search placeholder
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    const placeholder = searchInput.getAttribute(`data-${currentLang}-placeholder`);
                    if (placeholder) {
                        searchInput.setAttribute('placeholder', placeholder);
                    }
                }
            });
        }
        
        // Search Input
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearch');
    
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value;
                if (term) {
                    if (clearSearchBtn) clearSearchBtn.classList.remove('hidden');
                    searchEvents(term);
                } else {
                    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
                    currentSearchTerm = '';
                    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
                    applyFiltersAndSearch(activeFilter, '');
                }
            });
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                clearSearchBtn.classList.add('hidden');
                currentSearchTerm = '';
                const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
                applyFiltersAndSearch(activeFilter, '');
                if (searchInput) searchInput.focus();
            });
        }
        
        // Bookmarks Button
        const bookmarksBtn = document.getElementById('bookmarksBtn');
        if (bookmarksBtn) {
            bookmarksBtn.addEventListener('click', showBookmarks);
        }
    
        // Filter Buttons (exclude bookmarks button)
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.id && btn.id === 'bookmarksBtn') return;
            btn.addEventListener('click', () => {
                filterEvents(btn.dataset.filter);
                // Clear search when filtering
                if (searchInput) searchInput.value = '';
                if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
                currentSearchTerm = '';
            });
        });
    
        // Close Modal
        const closeModalBtn = document.getElementById('closeModal');
        const eventModal = document.getElementById('eventModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        if (eventModal) {
            eventModal.addEventListener('click', (e) => {
                if (e.target.id === 'eventModal') closeModal();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modal
            if (e.key === 'Escape') closeModal();
            
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchInput) searchInput.focus();
            }
            
            // Arrow keys for timeline navigation (when modal is closed)
            if (eventModal && !eventModal.classList.contains('active')) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    const events = Array.from(document.querySelectorAll('.timeline-event'));
                    if (events.length > 0) {
                        const visibleIndex = events.findIndex(el => {
                            const rect = el.getBoundingClientRect();
                            return rect.left >= 0 && rect.right <= window.innerWidth;
                        });
                        const targetIndex = e.key === 'ArrowLeft' 
                            ? Math.max(0, visibleIndex - 1)
                            : Math.min(events.length - 1, visibleIndex + 1);
                        if (events[targetIndex]) {
                            events[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            }
        });
        
        // Update language texts on initialization
        updateLanguageTexts();
        
        // Update search placeholder
        if (searchInput) {
            const placeholder = searchInput.getAttribute(`data-${currentLang}-placeholder`);
            if (placeholder) {
                searchInput.setAttribute('placeholder', placeholder);
            }
        }
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

// Re-render on window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        try {
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            applyFiltersAndSearch(activeFilter, currentSearchTerm);
        } catch (error) {
            console.error('Error on resize:', error);
        }
    }, 250);
});

// Update progress bar on scroll
window.addEventListener('DOMContentLoaded', () => {
    const timelineEvents = document.getElementById('timelineEvents');
    if (timelineEvents) {
        timelineEvents.addEventListener('scroll', () => {
            try {
                updateProgressBar(currentFilteredEvents);
            } catch (error) {
                console.error('Error updating progress bar:', error);
            }
        });
    }
});