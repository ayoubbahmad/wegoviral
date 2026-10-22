/**
 * French and Arabic versions of the starter spaces, badges and levels (Phase 12c).
 * `yarn translations:seed` writes them to records that have no translations yet and whose
 * English text is still the one translated here, so the team's own edits are never overwritten.
 */
type Text = Record<string, string>;
export interface SeedTranslation {
  en: Text;
  fr: Text;
  ar: Text;
}

export const SPACE_TRANSLATIONS: Record<string, SeedTranslation> = {
  offtopic: {
    en: { name: 'Off-topic', description: 'Everything else. Take a break and hang out.' },
    fr: { name: 'Hors sujet', description: 'Tout le reste. Faites une pause et discutez.' },
    ar: { name: 'خارج الموضوع', description: 'كل ما عدا ذلك. خذ استراحة ودردش معنا.' },
  },
  announcements: {
    en: { name: 'Announcements', description: 'News and updates from the WeGoViral team.' },
    fr: { name: 'Annonces', description: 'Les nouvelles et mises à jour de l’équipe WeGoViral.' },
    ar: { name: 'الإعلانات', description: 'أخبار فريق WeGoViral وتحديثاته.' },
  },
  introductions: {
    en: { name: 'Introduce Yourself', description: 'New here? Tell us who you are, what you create and where.' },
    fr: { name: 'Présentez-vous', description: 'Nouveau ici ? Dites-nous qui vous êtes, ce que vous créez et où.' },
    ar: { name: 'عرّف بنفسك', description: 'جديد هنا؟ أخبرنا من أنت، وماذا تصنع، وأين.' },
  },
  wins: {
    en: { name: 'Wins', description: 'Share your milestones, viral moments and small victories.' },
    fr: { name: 'Victoires', description: 'Partagez vos étapes clés, vos moments viraux et vos petites victoires.' },
    ar: { name: 'الإنجازات', description: 'شارك محطّاتك المهمّة ولحظات انتشارك وانتصاراتك الصغيرة.' },
  },
  feedback: {
    en: { name: 'Feedback', description: 'Post a hook, script or video and get honest feedback.' },
    fr: { name: 'Retours', description: 'Publiez un hook, un script ou une vidéo et recevez un avis honnête.' },
    ar: { name: 'الآراء', description: 'انشر جملة افتتاحية أو نصًّا أو فيديو واحصل على رأي صريح.' },
  },
  collabs: {
    en: { name: 'Collabs', description: 'Find creators to collaborate with.' },
    fr: { name: 'Collabs', description: 'Trouvez des créateurs avec qui collaborer.' },
    ar: { name: 'التعاون', description: 'ابحث عن صنّاع محتوى للتعاون معهم.' },
  },
  questions: {
    en: { name: 'Questions', description: 'Ask anything about growth, editing, tools or monetization.' },
    fr: { name: 'Questions', description: 'Posez toutes vos questions sur la croissance, le montage, les outils ou la monétisation.' },
    ar: { name: 'الأسئلة', description: 'اسأل عن أي شيء في النموّ والمونتاج والأدوات وتحقيق الدخل.' },
  },
  hooks: {
    en: { name: 'Hooks & Scripts', description: 'Share hooks that worked and workshop your scripts together.' },
    fr: { name: 'Hooks et scripts', description: 'Partagez les hooks qui ont marché et retravaillez vos scripts ensemble.' },
    ar: { name: 'الافتتاحيات والنصوص', description: 'شارك الجمل الافتتاحية التي نجحت وطوّروا نصوصكم معًا.' },
  },
  editing: {
    en: { name: 'Editing', description: 'Editing workflows, transitions, captions and software tips.' },
    fr: { name: 'Montage', description: 'Méthodes de montage, transitions, sous-titres et astuces logicielles.' },
    ar: { name: 'المونتاج', description: 'طرق المونتاج والانتقالات والنصوص على الشاشة ونصائح البرامج.' },
  },
  monetization: {
    en: { name: 'Monetization', description: 'Brand deals, creator funds, products and pricing your work.' },
    fr: { name: 'Monétisation', description: 'Partenariats de marque, fonds pour créateurs, produits et tarifs.' },
    ar: { name: 'تحقيق الدخل', description: 'صفقات العلامات التجارية وصناديق صنّاع المحتوى والمنتجات وتسعير عملك.' },
  },
  challenges: {
    en: { name: 'Challenges', description: 'Join community challenges and post your progress.' },
    fr: { name: 'Défis', description: 'Rejoignez les défis de la communauté et partagez vos progrès.' },
    ar: { name: 'التحدّيات', description: 'انضم إلى تحدّيات المجتمع وانشر تقدّمك.' },
  },
  gear: {
    en: { name: 'Tools & Gear', description: 'Cameras, mics, lighting, apps — what are you using?' },
    fr: { name: 'Outils et matériel', description: 'Caméras, micros, éclairage, applis : vous utilisez quoi ?' },
    ar: { name: 'الأدوات والمعدّات', description: 'كاميرات وميكروفونات وإضاءة وتطبيقات: ماذا تستخدم؟' },
  },
};

export const BADGE_TRANSLATIONS: Record<string, SeedTranslation> = {
  'first-post': {
    en: { name: 'First post', description: 'Published a first post' },
    fr: { name: 'Première publication', description: 'A publié sa première publication' },
    ar: { name: 'أول منشور', description: 'نشر أول منشور له' },
  },
  regular: {
    en: { name: 'Regular', description: 'Published 10 posts' },
    fr: { name: 'Habitué', description: 'A publié 10 publications' },
    ar: { name: 'عضو منتظم', description: 'نشر 10 منشورات' },
  },
  conversationalist: {
    en: { name: 'Conversationalist', description: 'Wrote 50 comments' },
    fr: { name: 'Pilier des discussions', description: 'A écrit 50 commentaires' },
    ar: { name: 'محاور نشيط', description: 'كتب 50 تعليقًا' },
  },
  'crowd-favorite': {
    en: { name: 'Crowd favorite', description: 'Received 100 likes' },
    fr: { name: 'Coup de cœur', description: 'A reçu 100 j’aime' },
    ar: { name: 'المفضّل لدى الجمهور', description: 'حصل على 100 إعجاب' },
  },
  'event-goer': {
    en: { name: 'Event goer', description: 'Joined 5 events' },
    fr: { name: 'Habitué des événements', description: 'A participé à 5 événements' },
    ar: { name: 'حاضر الفعاليات', description: 'شارك في 5 فعاليات' },
  },
  'rising-star': {
    en: { name: 'Rising star', description: 'Reached 500 points' },
    fr: { name: 'Étoile montante', description: 'A atteint 500 points' },
    ar: { name: 'نجم صاعد', description: 'وصل إلى 500 نقطة' },
  },
  ambassador: {
    en: { name: 'Ambassador', description: 'Represents WeGoViral' },
    fr: { name: 'Ambassadeur', description: 'Représente WeGoViral' },
    ar: { name: 'سفير', description: 'يمثّل WeGoViral' },
  },
  'member-of-the-month': {
    en: { name: 'Member of the month', description: 'Chosen by the team' },
    fr: { name: 'Membre du mois', description: 'Choisi par l’équipe' },
    ar: { name: 'عضو الشهر', description: 'اختاره الفريق' },
  },
  'course-graduate': {
    en: { name: 'Course graduate', description: 'Finished a course' },
    fr: { name: 'Diplômé', description: 'A terminé une formation' },
    ar: { name: 'خرّيج دورة', description: 'أكمل دورة' },
  },
  'challenge-finisher': {
    en: { name: 'Challenge finisher', description: 'Finished a challenge' },
    fr: { name: 'Défi relevé', description: 'A terminé un défi' },
    ar: { name: 'مُنجز التحدّي', description: 'أكمل تحدّيًا' },
  },
  'challenge-winner': {
    en: { name: 'Challenge winner', description: 'Won a community challenge' },
    fr: { name: 'Vainqueur de défi', description: 'A gagné un défi de la communauté' },
    ar: { name: 'بطل التحدّي', description: 'فاز بتحدٍّ في المجتمع' },
  },
};

/** Keyed by level number */
export const LEVEL_TRANSLATIONS: Record<number, SeedTranslation> = {
  1: { en: { name: 'Rookie' }, fr: { name: 'Débutant' }, ar: { name: 'مبتدئ' } },
  2: { en: { name: 'Starter' }, fr: { name: 'Lancé' }, ar: { name: 'منطلق' } },
  3: { en: { name: 'Rising' }, fr: { name: 'En progression' }, ar: { name: 'صاعد' } },
  4: { en: { name: 'Creator' }, fr: { name: 'Créateur' }, ar: { name: 'صانع محتوى' } },
  5: { en: { name: 'Trending' }, fr: { name: 'Tendance' }, ar: { name: 'رائج' } },
  6: { en: { name: 'Influencer' }, fr: { name: 'Influenceur' }, ar: { name: 'مؤثّر' } },
  7: { en: { name: 'Viral' }, fr: { name: 'Viral' }, ar: { name: 'واسع الانتشار' } },
  8: { en: { name: 'Icon' }, fr: { name: 'Icône' }, ar: { name: 'أيقونة' } },
  9: { en: { name: 'Legend' }, fr: { name: 'Légende' }, ar: { name: 'أسطورة' } },
};
