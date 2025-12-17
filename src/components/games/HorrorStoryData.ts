export interface StoryNode {
    id: string;
    text: string;
    choices: Choice[];
    bgEffect?: 'normal' | 'heartbeat' | 'glitch' | 'red-flash';
}

export interface Choice {
    text: string;
    nextNodeId: string;
    effect?: (state: GameState) => Partial<GameState>;
    requiredState?: (state: GameState) => boolean;
}

export interface GameState {
    sanity: number; // 0-100
    trust: number; // 0-100 (Trust with the killer)
    hasWeapon: boolean;
    knowsName: boolean;
    isInjured: boolean;
}

export const INITIAL_STATE: GameState = {
    sanity: 100,
    trust: 0,
    hasWeapon: false,
    knowsName: false,
    isInjured: false,
};

export const STORY_NODES: Record<string, StoryNode> = {
    'start': {
        id: 'start',
        text: "Dingin. Lembab. Bau besi berkarat memenuhi hidungmu.\n\nKamu membuka mata perlahan. Gelap gulita. Tanganmu terikat kuat ke sandaran kursi kayu yang keras. Kepala terasa pening, seperti habis dipukul benda tumpul.\n\nSuara tetesan air terdengar dari kejauhan... *Tes... Tes...*",
        choices: [
            { text: "Berteriak minta tolong!", nextNodeId: 'scream_1', effect: (s) => ({ sanity: s.sanity - 10 }) },
            { text: "Diam dan observasi sekitar.", nextNodeId: 'observe_1', effect: (s) => ({ sanity: s.sanity + 5 }) },
            { text: "Mencoba melepaskan ikatan.", nextNodeId: 'struggle_1' },
        ]
    },
    'scream_1': {
        id: 'scream_1',
        text: "KAMU BERTERIAK SEKUAT TENAGA!\n\n\"TOLONG!! SIAPAPUN!!\"\n\nSuaramu menggema di ruangan kosong itu. Tidak ada jawaban. Hanya suara langkah kaki berat yang perlahan mendekat dari balik pintu besi di depanmu.\n\n*Jantungmu berdegup kencang.*",
        bgEffect: 'heartbeat',
        choices: [
            { text: "Tahan napas, pura-pura pingsan.", nextNodeId: 'fake_faint' },
            { text: "Tatap pintu itu dengan marah.", nextNodeId: 'glare_door', effect: (s) => ({ sanity: s.sanity - 5 }) },
        ]
    },
    'observe_1': {
        id: 'observe_1',
        text: "Mata kamu mulai terbiasa dengan kegelapan. Ini seperti ruang bawah tanah (basement). Ada meja operasi tua di sudut dengan noda kering... darah?\n\nDi dinding tergantung berbagai macam alat: gergaji, palu, dan pahat. Orang ini bukan sekadar penculik. Dia seorang 'seniman'.",
        choices: [
            { text: "Cari benda tajam di dekatmu.", nextNodeId: 'search_sharp' },
            { text: "Tunggu kedatangannya.", nextNodeId: 'wait_calmly', effect: (s) => ({ sanity: s.sanity + 10 }) },
        ]
    },
    'struggle_1': {
        id: 'struggle_1',
        text: "Kamu meronta sekuat tenaga. Talinya kasar, menggesek kulit pergelangan tanganmu hingga perih. Percuma. Simpulnya terlalu rumit.\n\nKREK.\n\nPintu besi di depan terbuka perlahan. Cahaya remang-remang dari lorong masuk, menampilkan siluet tinggi besar.",
        choices: [
            { text: "Siapa kamu?!", nextNodeId: 'meet_sculptor' },
            { text: "Diam.", nextNodeId: 'meet_sculptor_silent' },
        ]
    },
    'fake_faint': {
        id: 'fake_faint',
        text: "Kamu memejamkan mata dan melemaskan tubuh. Langkah kaki itu berhenti tepat di depanmu. Hembusan napas hangat menerpa wajahmu.\n\n\"Aku tahu kau sudah sadar, manis... Detak jantungmu terlalu ribut.\"\n\nDia tertawa kecil. Suaranya berat dan serak.",
        choices: [
            { text: "Buka mata.", nextNodeId: 'meet_sculptor' },
            { text: "Ludahi wajahnya.", nextNodeId: 'spit_face', effect: (s) => ({ trust: s.trust - 20, isInjured: true }) },
        ]
    },
    'meet_sculptor': {
        id: 'meet_sculptor',
        text: "Seorang pria dengan apron kulit berdiri di depanmu. Wajahnya tertutup topeng porselen retak yang hanya menampilkan satu mata. Dia memegang sebuah palu kecil.\n\n\"Selamat datang di studiopku. Panggil saja aku... The Sculptor.\"",
        choices: [
            { text: "Apa mau mu?! Uang?!", nextNodeId: 'ask_money', effect: (s) => ({ trust: s.trust - 5 }) },
            { text: "Kenapa aku ada di sini?", nextNodeId: 'ask_why', effect: (s) => ({ trust: s.trust + 5 }) },
            { text: "Tolong lepaskan aku...", nextNodeId: 'beg_release' },
        ]
    },
    'spit_face': {
        id: 'spit_face',
        text: "CUIH!\n\nAir liurmu mendarat tepat di topengnya. Dia terdiam sejenak. Perlahan, dia menyeka topeng itu dengan jarinya.\n\nBAM!\n\nPukulan keras mendarat di perutmu. Kamu terbatuk-batuk hingga sesak napas.\n\n\"Kasar sekali. Bahan karyaku tidak boleh cacat mental seperti ini.\"",
        bgEffect: 'red-flash',
        choices: [
            { text: "Maaf... Maafkan aku...", nextNodeId: 'beg_release' },
            { text: "Bunuh saja aku brengsek!", nextNodeId: 'provoke_death' },
        ]
    },
    'ask_why': {
        id: 'ask_why',
        text: "\"Pertanyaan bagus. Kebanyakan orang langsung menangis minta pulang.\"\n\nDia menarik kursi besi dan duduk di depanmu.\n\n\"Aku sedang mencari 'Muse'. Inspirasi. Wajah ketakutan murni adalah seni yang paling jujur. Dan kau... punya struktur tulang yang indah.\"",
        choices: [
            { text: "Puji topeng/karyanya.", nextNodeId: 'flatter', effect: (s) => ({ trust: s.trust + 15 }) },
            { text: "Kau gila.", nextNodeId: 'insult', effect: (s) => ({ trust: s.trust - 10 }) },
        ]
    },
    'flatter': {
        id: 'flatter',
        text: "\"Topengmu... indah. Detail retakannya sangat artistik.\"\n\nDia berhenti memutar-mutar palunya. Dia mendekatkan wajahnya.\n\n\"Kau paham? Akhirnya! Seseorang yang paham! Mereka bilang aku monster, tapi aku hanya ingin mengabadikan keindahan abadi!\"\n\nDia terlihat bersemangat.",
        choices: [
            { text: "Ceritakan lebih banyak.", nextNodeId: 'listen_story', effect: (s) => ({ trust: s.trust + 10 }) },
            { text: "Manfaatkan kelengahannya, tendang dia!", nextNodeId: 'kick_him', effect: (s) => ({ hasWeapon: true }) }, // Lucky chance
        ]
    },
    'kick_him': {
        id: 'kick_him',
        text: "DUAGH!\n\nKamu menendang selangkangannya sekuat tenaga! Dia mengerang kesakitan dan jatuh terduduk, menjatuhkan pisau kecil dari sakunya.\n\nKursi tempatmu terikat ikut terguling, ikatan tanganmu melonggar karena benturan!",
        bgEffect: 'heartbeat',
        choices: [
            { text: "Ambil pisau itu dan lari!", nextNodeId: 'escape_run', effect: (s) => ({ hasWeapon: true }) },
            { text: "Habisi dia saat dia lengah!", nextNodeId: 'kill_attempt' },
        ]
    },
    'escape_run': {
        id: 'escape_run',
        text: "Kamu menyambar pisau itu, memotong sisa tali, dan berlari ke pintu yang setengah terbuka. Lorong di depan bercabang dua.\n\nKanan gelap gulita. Kiri ada sedikit cahaya lampu neon yang berkedip.",
        bgEffect: 'heartbeat',
        choices: [
            { text: "Lari ke Kanan (Gelap).", nextNodeId: 'run_dark' },
            { text: "Lari ke Kiri (Cahaya).", nextNodeId: 'run_light' },
        ]
    },
    'run_dark': {
        id: 'run_dark',
        text: "Kamu berlari ke kegelapan. Tiba-tiba kakimu tersandung sesuatu yang lunak. Bau busuk menyeruak.\n\nMayat. Tumpukan mayat 'karya' gagal sebelumnya. Kamu menahan muntah, tapi di ujung lorong ada jendela kecil ventilasi!",
        choices: [
            { text: "Panjat ventilasi itu!", nextNodeId: 'ending_escaped' },
        ]
    },
    'run_light': {
        id: 'run_light',
        text: "Kamu berlari ke arah cahaya. TERNYATA ITU JEBAKAN! Itu adalah ruang kerjanya yang lain. Penuh dengan gergaji mesin.\n\nLangkah kaki terdengar di belakangmu. Dia sudah bangkit.\n\n\"Sayang sekali... Kita bahkan belum mulai sesi utamanya.\"",
        bgEffect: 'red-flash',
        choices: [
            { text: "Lawan!!!", nextNodeId: 'ending_bad_fight' },
        ]
    },
    // ENDINGS
    'ending_escaped': {
        id: 'ending_escaped',
        text: "ENDING: SURVIVOR\n\nKamu berhasil memecahkan kaca ventilasi dan merangkak keluar. Udara malam yang dingin tidak pernah terasa senikmat ini. Kamu berlari ke jalan raya, memberhentikan truk yang lewat.\n\nPolisi tidak pernah menemukan 'The Sculptor' di basement itu. Tapi setidaknya, kamu hidup.",
        choices: [],
        bgEffect: 'normal'
    },
    'ending_bad_fight': {
        id: 'ending_bad_fight',
        text: "ENDING: MASTERPIECE\n\nKamu mencoba melawan dengan pisau kecil itu, tapi dia terlalu kuat. Dia menangkap tanganmu dan mematahkannya dengan mudah.\n\n\"Gerakan yang bagus. Ekspresi sakit itu... sempurna.\"\n\nPandanganmu menggelap. Kamu akan menjadi koleksi terbarunya.",
        choices: [],
        bgEffect: 'red-flash'
    },
    'listen_story': {
        id: 'listen_story',
        text: "Dia bercerita panjang lebar tentang filosofi 'menghentikan waktu' lewat kematian. Kamu mendengarkan dengan seksama, atau setidaknya pura-pura.\n\n\"Kau tahu... kau pendengar yang baik. Mungkin aku tidak akan membedahmu hari ini. Mau jadi asistenku?\"",
        choices: [
            { text: "Ya, aku akan membantumu (Sumpah Palsu)", nextNodeId: 'ending_psycho_partner', effect: (s) => ({ sanity: 0 }) },
            { text: "Tidak sudi! Ludahi dia!", nextNodeId: 'spit_face' }
        ]
    },
    'ending_psycho_partner': {
        id: 'ending_psycho_partner',
        text: "ENDING: THE APPRENTICE\n\nKamu memilih untuk bertahan hidup dengan cara apapun. Bahkan jika itu artinya kehilangan kemanusiaanmu.\n\nBertahun-tahun kemudian, berita melaporkan duo pembunuh berantai yang meneror kota. Guru dan Murid. Apakah kamu masih berpura-pura, atau topeng itu sudah menjadi wajah aslimu?",
        choices: [],
        bgEffect: 'glitch'
    },
    // Add placeholder fallbacks ensuring no dead ends in early dev
    'search_sharp': { id: 'search_sharp', text: "Tidak ada apa-apa yang bisa dijangkau. Sial.", choices: [{ text: "Kembali", nextNodeId: 'struggle_1' }] },
    'wait_calmly': { id: 'wait_calmly', text: "Kamu menunggu layaknya patung. Dia masuk dan terkesan dengan ketenanganmu.", choices: [{ text: "Lanjut", nextNodeId: 'meet_sculptor' }] },
    'meet_sculptor_silent': { id: 'meet_sculptor_silent', text: "Dia menatapmu yang diam membisu. \"Bisu? Atau sombong? Kita lihat nanti.\"", choices: [{ text: "...", nextNodeId: 'meet_sculptor' }] },
    'ask_money': { id: 'ask_money', text: "\"Uang? Hahaha! Kertas tidak bernilai bagiku.\"", choices: [{ text: "Apa maumu?", nextNodeId: 'ask_why' }] },
    'beg_release': { id: 'beg_release', text: "\"Melepaskanmu? Saat kanvasnya sudah siap? Tidak mungkin.\"", choices: [{ text: "Tolong...", nextNodeId: 'spit_face' }] },
    'provoke_death': { id: 'provoke_death', text: "\"Terburu-buru sekali. Baiklah, jika itu maumu.\"", choices: [{ text: "Mati", nextNodeId: 'ending_bad_fight' }] },
    'kill_attempt': { id: 'kill_attempt', text: "Kamu mencoba menusuknya, tapi dia menangkis. Tenaganya luar biasa.", choices: [{ text: "Sial...", nextNodeId: 'ending_bad_fight' }] },
};
