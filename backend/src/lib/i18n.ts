/**
 * Languages (docs/ADMIN_ROADMAP.md, Phase 12). The app sends its language in
 * Accept-Language; API messages are written in English and translated here on
 * the way out, so services keep throwing plain English errors. Anything not in
 * the dictionary stays in English.
 */
export const LOCALES = ['en', 'fr', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);

export function pickLocale(header: string | undefined): Locale {
  for (const part of (header ?? '').split(',')) {
    const base = part.split(';')[0].trim().toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return 'en';
}

type Translations = { fr: string; ar: string };

/** Exact messages. */
const MESSAGES: Record<string, Translations> = {
  // Signing in and access
  'You are not logged in. Please log in to get access.': { fr: 'Vous n’êtes pas connecté. Connectez-vous pour continuer.', ar: 'لم تسجّل الدخول. يرجى تسجيل الدخول للمتابعة.' },
  'Invalid token or token expired.': { fr: 'Session invalide ou expirée. Reconnectez-vous.', ar: 'الجلسة غير صالحة أو منتهية. يرجى تسجيل الدخول مجددًا.' },
  'Failed to load your profile.': { fr: 'Impossible de charger votre profil.', ar: 'تعذّر تحميل ملفك الشخصي.' },
  'Your account has been banned from the community.': { fr: 'Votre compte a été banni de la communauté.', ar: 'تم حظر حسابك من المجتمع.' },
  'Your account is suspended.': { fr: 'Votre compte est suspendu.', ar: 'حسابك موقوف.' },
  'Please complete your application first.': { fr: 'Complétez d’abord votre demande d’inscription.', ar: 'يرجى إكمال طلب الانضمام أولًا.' },
  'Your application is waiting for approval.': { fr: 'Votre demande est en attente de validation.', ar: 'طلبك في انتظار الموافقة.' },
  'Your application was not approved.': { fr: 'Votre demande n’a pas été acceptée.', ar: 'لم تتم الموافقة على طلبك.' },
  'Please read and accept the community guide first.': { fr: 'Lisez et acceptez d’abord le guide de la communauté.', ar: 'يرجى قراءة دليل المجتمع والموافقة عليه أولًا.' },
  'Please pass the community quiz first.': { fr: 'Réussissez d’abord le quiz de la communauté.', ar: 'يرجى اجتياز اختبار المجتمع أولًا.' },
  'You are muted and can only read the community for now.': { fr: 'Vous êtes en sourdine : vous pouvez seulement lire la communauté pour le moment.', ar: 'حسابك مكتوم حاليًا: يمكنك القراءة فقط.' },
  "You don't have permission to do this.": { fr: 'Vous n’avez pas la permission de faire cela.', ar: 'ليست لديك صلاحية للقيام بذلك.' },
  'This username is already taken': { fr: 'Ce nom d’utilisateur est déjà pris', ar: 'اسم المستخدم هذا مستخدم بالفعل' },
  'User no longer exists': { fr: 'Ce compte n’existe plus', ar: 'هذا الحساب لم يعد موجودًا' },
  'Warning not found': { fr: 'Avertissement introuvable', ar: 'التنبيه غير موجود' },
  'Invalid request': { fr: 'Requête invalide', ar: 'طلب غير صالح' },
  'Only for the team': { fr: 'Réservé à l’équipe', ar: 'مخصّص للفريق فقط' },
  'Only members in good standing can review posts.': { fr: 'Seuls les membres sans restriction peuvent relire des publications.', ar: 'يمكن للأعضاء غير المقيّدين فقط مراجعة المنشورات.' },
  'You can review posts once your own first posts have been approved.': { fr: 'Vous pourrez relire des publications une fois vos premières publications validées.', ar: 'يمكنك مراجعة المنشورات بعد الموافقة على منشوراتك الأولى.' },

  // Joining
  'Enter your full name': { fr: 'Entrez votre nom complet', ar: 'أدخل اسمك الكامل' },
  'Enter a valid phone number, e.g. +212 6 12 34 56 78': { fr: 'Entrez un numéro valide, par ex. +212 6 12 34 56 78', ar: 'أدخل رقم هاتف صالحًا، مثل ‎+212 6 12 34 56 78' },
  'Tell us what you create': { fr: 'Dites-nous ce que vous créez', ar: 'أخبرنا بما تصنعه من محتوى' },
  'Add at least one platform': { fr: 'Ajoutez au moins une plateforme', ar: 'أضف منصة واحدة على الأقل' },
  'Add your handle or link': { fr: 'Ajoutez votre pseudo ou votre lien', ar: 'أضف اسم حسابك أو الرابط' },
  'Use 3-30 lowercase letters, numbers or underscores': { fr: 'Utilisez 3 à 30 lettres minuscules, chiffres ou tirets bas', ar: 'استخدم من 3 إلى 30 حرفًا لاتينيًا صغيرًا أو أرقامًا أو شرطة سفلية' },
  'You have already applied.': { fr: 'Vous avez déjà envoyé votre demande.', ar: 'لقد أرسلت طلبك بالفعل.' },
  "You can't use your own referral link.": { fr: 'Vous ne pouvez pas utiliser votre propre lien d’invitation.', ar: 'لا يمكنك استخدام رابط الدعوة الخاص بك.' },
  'This invite link has been turned off.': { fr: 'Ce lien d’invitation a été désactivé.', ar: 'تم تعطيل رابط الدعوة هذا.' },
  'This invite link has expired.': { fr: 'Ce lien d’invitation a expiré.', ar: 'انتهت صلاحية رابط الدعوة هذا.' },
  'This referral link is no longer active.': { fr: 'Ce lien de parrainage n’est plus actif.', ar: 'رابط الإحالة هذا لم يعد فعّالًا.' },
  "This link isn't valid.": { fr: 'Ce lien n’est pas valide.', ar: 'هذا الرابط غير صالح.' },
  'This invite link has reached its limit.': { fr: 'Ce lien d’invitation a atteint sa limite.', ar: 'بلغ رابط الدعوة هذا حدّه الأقصى.' },
  'There is no community guide yet.': { fr: 'Il n’y a pas encore de guide de la communauté.', ar: 'لا يوجد دليل للمجتمع بعد.' },
  'The guide was just updated. Please read the latest version.': { fr: 'Le guide vient d’être mis à jour. Lisez la dernière version.', ar: 'تم تحديث الدليل للتو. يرجى قراءة أحدث نسخة.' },
  'There is no quiz right now.': { fr: 'Il n’y a pas de quiz pour le moment.', ar: 'لا يوجد اختبار حاليًا.' },
  'Answer every question.': { fr: 'Répondez à toutes les questions.', ar: 'أجب عن جميع الأسئلة.' },

  // Feed
  'Add a title or some text': { fr: 'Ajoutez un titre ou un texte', ar: 'أضف عنوانًا أو نصًا' },
  'Choose a space': { fr: 'Choisissez un espace', ar: 'اختر مساحة' },
  'This space does not exist': { fr: 'Cet espace n’existe pas', ar: 'هذه المساحة غير موجودة' },
  'Options cannot be empty': { fr: 'Les options ne peuvent pas être vides', ar: 'لا يمكن ترك الخيارات فارغة' },
  'Comment cannot be empty': { fr: 'Le commentaire ne peut pas être vide', ar: 'لا يمكن أن يكون التعليق فارغًا' },
  'Images must be 5 MB or smaller': { fr: 'Les images doivent faire 5 Mo maximum', ar: 'يجب ألا يتجاوز حجم الصورة 5 ميغابايت' },
  'Invalid image URL': { fr: 'Lien d’image invalide', ar: 'رابط الصورة غير صالح' },
  'Post not found': { fr: 'Publication introuvable', ar: 'المنشور غير موجود' },
  'Comment not found': { fr: 'Commentaire introuvable', ar: 'التعليق غير موجود' },
  'You can only edit your own posts': { fr: 'Vous ne pouvez modifier que vos propres publications', ar: 'يمكنك تعديل منشوراتك فقط' },
  'You can only delete your own posts': { fr: 'Vous ne pouvez supprimer que vos propres publications', ar: 'يمكنك حذف منشوراتك فقط' },
  'You can only edit your own comments': { fr: 'Vous ne pouvez modifier que vos propres commentaires', ar: 'يمكنك تعديل تعليقاتك فقط' },
  'You can only delete your own comments': { fr: 'Vous ne pouvez supprimer que vos propres commentaires', ar: 'يمكنك حذف تعليقاتك فقط' },
  'Only the team can pin posts': { fr: 'Seule l’équipe peut épingler des publications', ar: 'يمكن للفريق فقط تثبيت المنشورات' },
  'You already voted on this poll': { fr: 'Vous avez déjà voté à ce sondage', ar: 'لقد صوّتّ بالفعل في هذا الاستطلاع' },
  'This option is not part of the poll': { fr: 'Cette option ne fait pas partie du sondage', ar: 'هذا الخيار ليس جزءًا من الاستطلاع' },
  "You can't report your own post": { fr: 'Vous ne pouvez pas signaler votre propre publication', ar: 'لا يمكنك الإبلاغ عن منشورك' },
  "You can't report your own comment": { fr: 'Vous ne pouvez pas signaler votre propre commentaire', ar: 'لا يمكنك الإبلاغ عن تعليقك' },
  "You can't review your own post": { fr: 'Vous ne pouvez pas relire votre propre publication', ar: 'لا يمكنك مراجعة منشورك' },
  'This post has already been reviewed': { fr: 'Cette publication a déjà été relue', ar: 'تمت مراجعة هذا المنشور بالفعل' },
  'Only the team can review posts held by the filter': { fr: 'Seule l’équipe peut relire les publications retenues par le filtre', ar: 'يمكن للفريق فقط مراجعة المنشورات المحجوزة بواسطة المرشّح' },
  'Give the author a short reason': { fr: 'Donnez une courte raison à l’auteur', ar: 'اكتب سببًا قصيرًا للكاتب' },
  'Give a short reason': { fr: 'Donnez une courte raison', ar: 'اكتب سببًا قصيرًا' },

  // Events
  'Give the event a title': { fr: 'Donnez un titre à l’événement', ar: 'أعطِ الفعالية عنوانًا' },
  'The event must end after it starts': { fr: 'L’événement doit se terminer après son début', ar: 'يجب أن تنتهي الفعالية بعد بدايتها' },
  'Unknown time zone': { fr: 'Fuseau horaire inconnu', ar: 'منطقة زمنية غير معروفة' },
  'Enter a full link, starting with https://': { fr: 'Entrez un lien complet, commençant par https://', ar: 'أدخل رابطًا كاملًا يبدأ بـ https://' },
  'Event not found': { fr: 'Événement introuvable', ar: 'الفعالية غير موجودة' },
  "You can't create events": { fr: 'Vous ne pouvez pas créer d’événements', ar: 'لا يمكنك إنشاء فعاليات' },
  'Only the host and the team can edit this event': { fr: 'Seuls l’organisateur et l’équipe peuvent modifier cet événement', ar: 'يمكن للمنظّم والفريق فقط تعديل هذه الفعالية' },
  'Only the host and the team can delete this event': { fr: 'Seuls l’organisateur et l’équipe peuvent supprimer cet événement', ar: 'يمكن للمنظّم والفريق فقط حذف هذه الفعالية' },
  'Only the host and the team can see the attendee list': { fr: 'Seuls l’organisateur et l’équipe voient la liste des participants', ar: 'يمكن للمنظّم والفريق فقط رؤية قائمة الحضور' },
  'Only the host and the team can change who can attend': { fr: 'Seuls l’organisateur et l’équipe peuvent changer qui peut participer', ar: 'يمكن للمنظّم والفريق فقط تغيير من يمكنه الحضور' },
  'This event was cancelled': { fr: 'Cet événement a été annulé', ar: 'تم إلغاء هذه الفعالية' },
  "This event isn't published yet": { fr: 'Cet événement n’est pas encore publié', ar: 'لم تُنشر هذه الفعالية بعد' },
  'This event has already ended': { fr: 'Cet événement est déjà terminé', ar: 'انتهت هذه الفعالية بالفعل' },
  'This event is full': { fr: 'Cet événement est complet', ar: 'هذه الفعالية مكتملة' },

  // Courses
  'Give the course a title': { fr: 'Donnez un titre à la formation', ar: 'أعطِ الدورة عنوانًا' },
  'Give the module a title': { fr: 'Donnez un titre au module', ar: 'أعطِ الوحدة عنوانًا' },
  'Give the lesson a title': { fr: 'Donnez un titre à la leçon', ar: 'أعطِ الدرس عنوانًا' },
  'Give the attachment a name': { fr: 'Donnez un nom à la ressource', ar: 'أعطِ المرفق اسمًا' },
  'An attachment is either a link or an uploaded file': { fr: 'Une ressource est soit un lien, soit un fichier envoyé', ar: 'المرفق إما رابط أو ملف مرفوع' },
  'Files must be 50 MB or smaller': { fr: 'Les fichiers doivent faire 50 Mo maximum', ar: 'يجب ألا يتجاوز حجم الملف 50 ميغابايت' },
  'Course not found': { fr: 'Formation introuvable', ar: 'الدورة غير موجودة' },
  'Lesson not found': { fr: 'Leçon introuvable', ar: 'الدرس غير موجود' },
  'Module not found': { fr: 'Module introuvable', ar: 'الوحدة غير موجودة' },
  "You can't create courses": { fr: 'Vous ne pouvez pas créer de formations', ar: 'لا يمكنك إنشاء دورات' },
  'Only the instructor and admins can edit this course': { fr: 'Seuls le formateur et les admins peuvent modifier cette formation', ar: 'يمكن للمدرّب والمشرفين العامّين فقط تعديل هذه الدورة' },
  'Only admins can hand a course to someone else': { fr: 'Seuls les admins peuvent confier une formation à quelqu’un d’autre', ar: 'يمكن للمشرفين العامّين فقط نقل الدورة إلى شخص آخر' },
  'Courses can only belong to instructors and admins': { fr: 'Une formation ne peut appartenir qu’à un formateur ou un admin', ar: 'يمكن أن تكون الدورات ملكًا للمدرّبين والمشرفين العامّين فقط' },
  'Add at least one lesson before publishing': { fr: 'Ajoutez au moins une leçon avant de publier', ar: 'أضف درسًا واحدًا على الأقل قبل النشر' },
  'Unknown badge': { fr: 'Badge inconnu', ar: 'شارة غير معروفة' },
  "You can't take your own course": { fr: 'Vous ne pouvez pas suivre votre propre formation', ar: 'لا يمكنك متابعة دورتك الخاصة' },
  'That file belongs to another course': { fr: 'Ce fichier appartient à une autre formation', ar: 'هذا الملف تابع لدورة أخرى' },
  'The course changed in the meantime. Reload and try again.': { fr: 'La formation a changé entre-temps. Rechargez et réessayez.', ar: 'تغيّرت الدورة في الأثناء. أعد تحميل الصفحة وحاول مجددًا.' },

  // Challenges
  'Give the challenge a title': { fr: 'Donnez un titre au défi', ar: 'أعطِ التحدّي عنوانًا' },
  'The challenge must end after it starts': { fr: 'Le défi doit se terminer après son début', ar: 'يجب أن ينتهي التحدّي بعد بدايته' },
  'Say what you did': { fr: 'Dites ce que vous avez fait', ar: 'اكتب ما أنجزته' },
  'Challenge not found': { fr: 'Défi introuvable', ar: 'التحدّي غير موجود' },
  'Check-in not found': { fr: 'Pointage introuvable', ar: 'تسجيل الإنجاز غير موجود' },
  'Only the team can manage challenges': { fr: 'Seule l’équipe peut gérer les défis', ar: 'يمكن للفريق فقط إدارة التحدّيات' },
  'This challenge was cancelled': { fr: 'Ce défi a été annulé', ar: 'تم إلغاء هذا التحدّي' },
  "This challenge isn't published yet": { fr: 'Ce défi n’est pas encore publié', ar: 'لم يُنشر هذا التحدّي بعد' },
  'This challenge has ended': { fr: 'Ce défi est terminé', ar: 'انتهى هذا التحدّي' },
  'This challenge is locked': { fr: 'Ce défi est verrouillé', ar: 'هذا التحدّي مقفل' },
  "You've already checked in, so you're part of this one": { fr: 'Vous avez déjà pointé : vous faites partie de ce défi', ar: 'لقد سجّلت إنجازًا بالفعل، فأنت مشارك في هذا التحدّي' },
  "You've already submitted": { fr: 'Vous avez déjà envoyé votre participation', ar: 'لقد أرسلت مشاركتك بالفعل' },
  "You've already checked in today. Come back tomorrow!": { fr: 'Vous avez déjà pointé aujourd’hui. Revenez demain !', ar: 'لقد سجّلت إنجاز اليوم بالفعل. عد غدًا!' },
  "You can't remove this check-in": { fr: 'Vous ne pouvez pas retirer ce pointage', ar: 'لا يمكنك حذف تسجيل الإنجاز هذا' },
  'Pick winners once the challenge has ended': { fr: 'Choisissez les gagnants une fois le défi terminé', ar: 'اختر الفائزين بعد انتهاء التحدّي' },
  'Winners must have taken part': { fr: 'Les gagnants doivent avoir participé', ar: 'يجب أن يكون الفائزون من المشاركين' },
  'Nobody has checked in yet': { fr: 'Personne n’a encore pointé', ar: 'لم يسجّل أحد إنجازًا بعد' },

  // Help center
  'Article not found': { fr: 'Article introuvable', ar: 'المقال غير موجود' },
  'Only admins can edit the help center': { fr: 'Seuls les admins peuvent modifier le centre d’aide', ar: 'يمكن للمشرفين العامّين فقط تعديل مركز المساعدة' },
  'Another article already uses this link': { fr: 'Un autre article utilise déjà ce lien', ar: 'يستخدم مقال آخر هذا الرابط بالفعل' },
  'Give the article a title': { fr: 'Donnez un titre à l’article', ar: 'أعطِ المقال عنوانًا' },
  'Pick a section': { fr: 'Choisissez une rubrique', ar: 'اختر قسمًا' },
  'Use lowercase letters, numbers and dashes, e.g. how-points-work': { fr: 'Utilisez des minuscules, des chiffres et des tirets, par ex. how-points-work', ar: 'استخدم حروفًا لاتينية صغيرة وأرقامًا وشرطات، مثل how-points-work' },

  // Profile and settings
  'Enter your name': { fr: 'Saisissez votre nom', ar: 'أدخل اسمك' },
  'Keep your bio under 300 characters': { fr: 'Votre bio doit faire moins de 300 caractères', ar: 'يجب ألا تتجاوز نبذتك 300 حرف' },
  'Pick a photo under 2 MB': { fr: 'Choisissez une photo de moins de 2 Mo', ar: 'اختر صورة أصغر من 2 ميغابايت' },
  // Creator Space
  'A watchlist with this name already exists': { fr: 'Une liste porte déjà ce nom', ar: 'توجد قائمة بهذا الاسم بالفعل' },
  'Automation not found': { fr: 'Automatisation introuvable', ar: 'الأتمتة غير موجودة' },
  'Code is required': { fr: 'Le code est requis', ar: 'الرمز مطلوب' },
  'Competitor not found': { fr: 'Concurrent introuvable', ar: 'المنافس غير موجود' },
  'Content and type are required': { fr: 'Le contenu et le type sont requis', ar: 'المحتوى والنوع مطلوبان' },
  'Creator not found': { fr: 'Créateur introuvable', ar: 'صانع المحتوى غير موجود' },
  'Handle and name are required': { fr: 'Le nom d’utilisateur et le nom sont requis', ar: 'اسم المستخدم والاسم مطلوبان' },
  'Handle is required': { fr: 'Le nom d’utilisateur est requis', ar: 'اسم المستخدم مطلوب' },
  'Handles array is required': { fr: 'Ajoutez au moins un compte', ar: 'أضف حسابًا واحدًا على الأقل' },
  'Hook not found': { fr: 'Hook introuvable', ar: 'الافتتاحية غير موجودة' },
  'Name is required': { fr: 'Le nom est requis', ar: 'الاسم مطلوب' },
  'Project not found': { fr: 'Projet introuvable', ar: 'المشروع غير موجود' },
  'Project updated successfully': { fr: 'Projet mis à jour', ar: 'تم تحديث المشروع' },
  'Script not found': { fr: 'Script introuvable', ar: 'النص غير موجود' },
  'Script template not found': { fr: 'Modèle de script introuvable', ar: 'قالب النص غير موجود' },
  'Title and content structure are required': { fr: 'Le titre et la structure sont requis', ar: 'العنوان والبنية مطلوبان' },
  'URL is required': { fr: 'L’URL est requise', ar: 'الرابط مطلوب' },
  'Unauthorized access to this social account': { fr: 'Vous n’avez pas accès à ce compte social', ar: 'ليس لديك حق الوصول إلى هذا الحساب' },
  'User not authenticated': { fr: 'Vous n’êtes pas connecté', ar: 'لم تسجّل الدخول' },
  'Video not found': { fr: 'Vidéo introuvable', ar: 'الفيديو غير موجود' },
  'Watchlist name is required': { fr: 'Le nom de la liste est requis', ar: 'اسم القائمة مطلوب' },
  'Watchlist not found': { fr: 'Liste introuvable', ar: 'القائمة غير موجودة' },
  // Admin tools
  "The default tier can't be deleted": { fr: 'L’offre par défaut ne peut pas être supprimée', ar: 'لا يمكن حذف الباقة الافتراضية' },
  "The last Super Admin can't be demoted": { fr: 'Le dernier Super Admin ne peut pas être rétrogradé', ar: 'لا يمكن تخفيض دور آخر مدير أعلى' },
  "This member doesn't have that badge": { fr: 'Ce membre n’a pas ce badge', ar: 'لا يملك هذا العضو هذه الشارة' },
  "You can't change roles": { fr: 'Vous ne pouvez pas changer les rôles', ar: 'لا يمكنك تغيير الأدوار' },
  "You can't change your own account": { fr: 'Vous ne pouvez pas modifier votre propre compte', ar: 'لا يمكنك تعديل حسابك الخاص' },
  "You can't create special-member invites": { fr: 'Vous ne pouvez pas créer d’invitations pour membres spéciaux', ar: 'لا يمكنك إنشاء دعوات للأعضاء المميّزين' },
  "You can't give that role": { fr: 'Vous ne pouvez pas attribuer ce rôle', ar: 'لا يمكنك منح هذا الدور' },
  "You can't manage someone with the same or a higher role": { fr: 'Vous ne pouvez pas gérer quelqu’un de rôle égal ou supérieur', ar: 'لا يمكنك إدارة شخص بدور مساوٍ أو أعلى' },
  "You can't restrict members": { fr: 'Vous ne pouvez pas restreindre des membres', ar: 'لا يمكنك تقييد الأعضاء' },
  "You can't warn someone with the same or a higher role": { fr: 'Vous ne pouvez pas avertir quelqu’un de rôle égal ou supérieur', ar: 'لا يمكنك تنبيه شخص بدور مساوٍ أو أعلى' },
  "You can't warn yourself": { fr: 'Vous ne pouvez pas vous avertir vous-même', ar: 'لا يمكنك تنبيه نفسك' },
  'Add at least one section before publishing': { fr: 'Ajoutez au moins une section avant de publier', ar: 'أضف قسمًا واحدًا على الأقل قبل النشر' },
  'Application not found': { fr: 'Demande introuvable', ar: 'الطلب غير موجود' },
  'Badge not found': { fr: 'Badge introuvable', ar: 'الشارة غير موجودة' },
  'Invite link not found': { fr: 'Lien d’invitation introuvable', ar: 'رابط الدعوة غير موجود' },
  'Keep at least one active space': { fr: 'Gardez au moins un espace actif', ar: 'أبقِ مساحة نشطة واحدة على الأقل' },
  'Make another tier the default instead': { fr: 'Mettez plutôt une autre offre par défaut', ar: 'اجعل باقة أخرى افتراضية بدلًا من ذلك' },
  'Member not found': { fr: 'Membre introuvable', ar: 'العضو غير موجود' },
  'Moderators can only restrict members for a limited time': { fr: 'Les modérateurs ne peuvent restreindre que pour une durée limitée', ar: 'يمكن للمشرفين التقييد لمدة محدودة فقط' },
  'No held comment found': { fr: 'Aucun commentaire retenu trouvé', ar: 'لم يُعثر على تعليق محجوز' },
  'Only Super Admins decide which tiers can access content': { fr: 'Seuls les Super Admins décident quelles offres accèdent au contenu', ar: 'يقرّر المدراء الأعلون فقط الباقات التي تصل إلى المحتوى' },
  'Only admins can ban members': { fr: 'Seuls les admins peuvent bannir des membres', ar: 'يمكن للمشرفين العامّين فقط حظر الأعضاء' },
  'Only admins can lift a ban': { fr: 'Seuls les admins peuvent lever un bannissement', ar: 'يمكن للمشرفين العامّين فقط رفع الحظر' },
  'Restore the post first: this comment belongs to a deleted post': { fr: 'Restaurez d’abord la publication : ce commentaire appartient à une publication supprimée', ar: 'استعد المنشور أولًا: هذا التعليق تابع لمنشور محذوف' },
  'Space not found': { fr: 'Espace introuvable', ar: 'المساحة غير موجودة' },
  'The first level must start at 0 points': { fr: 'Le premier niveau doit commencer à 0 point', ar: 'يجب أن يبدأ المستوى الأول من 0 نقطة' },
  'The order must list every active space exactly once': { fr: 'L’ordre doit lister chaque espace actif une seule fois', ar: 'يجب أن يتضمن الترتيب كل مساحة نشطة مرة واحدة' },
  'These reports were already handled': { fr: 'Ces signalements ont déjà été traités', ar: 'تمت معالجة هذه البلاغات بالفعل' },
  'This application has already been reviewed': { fr: 'Cette demande a déjà été examinée', ar: 'تمت مراجعة هذا الطلب بالفعل' },
  'This member already has that badge': { fr: 'Ce membre a déjà ce badge', ar: 'يملك هذا العضو هذه الشارة بالفعل' },
  'This tier does not exist': { fr: 'Cette offre n’existe pas', ar: 'هذه الباقة غير موجودة' },
  'Tier not found': { fr: 'Offre introuvable', ar: 'الباقة غير موجودة' },
  'Two levels can’t start at the same number of points': { fr: 'Deux niveaux ne peuvent pas commencer au même nombre de points', ar: 'لا يمكن أن يبدأ مستويان بالعدد نفسه من النقاط' },
  'Unknown tier': { fr: 'Offre inconnue', ar: 'باقة غير معروفة' },
  'Author actions only apply when removing content': { fr: 'Les actions sur l’auteur ne s’appliquent qu’en retirant le contenu', ar: 'تنطبق الإجراءات على الكاتب عند حذف المحتوى فقط' },
  'Describe the space in a few words': { fr: 'Décrivez l’espace en quelques mots', ar: 'صِف المساحة ببضع كلمات' },
  'Enter a number other than 0': { fr: 'Entrez un nombre différent de 0', ar: 'أدخل رقمًا غير الصفر' },
  'Every level needs a name': { fr: 'Chaque niveau doit avoir un nom', ar: 'يحتاج كل مستوى إلى اسم' },
  'Every question needs text': { fr: 'Chaque question doit avoir un texte', ar: 'يحتاج كل سؤال إلى نص' },
  'Every section needs a title': { fr: 'Chaque section doit avoir un titre', ar: 'يحتاج كل قسم إلى عنوان' },
  'Every section needs some text': { fr: 'Chaque section doit avoir du texte', ar: 'يحتاج كل قسم إلى نص' },
  'Give the badge a name': { fr: 'Donnez un nom au badge', ar: 'أعطِ الشارة اسمًا' },
  'Give the link a name': { fr: 'Donnez un nom au lien', ar: 'أعطِ الرابط اسمًا' },
  'Give the space a name': { fr: 'Donnez un nom à l’espace', ar: 'أعطِ المساحة اسمًا' },
  'Give the tier a name': { fr: 'Donnez un nom à l’offre', ar: 'أعطِ الباقة اسمًا' },
  'Pick an emoji': { fr: 'Choisissez une icône', ar: 'اختر رمزًا' },
  'Pick the correct answer for every question': { fr: 'Indiquez la bonne réponse pour chaque question', ar: 'حدّد الإجابة الصحيحة لكل سؤال' },
  'Use a color like #f59e0b': { fr: 'Utilisez une couleur comme #f59e0b', ar: 'استخدم لونًا مثل #f59e0b' },

  // Leaderboard
  'Failed to load the leaderboard': { fr: 'Impossible de charger le classement', ar: 'تعذّر تحميل لوحة الترتيب' },
  'Failed to load how points work': { fr: 'Impossible de charger le fonctionnement des points', ar: 'تعذّر تحميل طريقة احتساب النقاط' },
};

type Pattern = { match: RegExp; fr: (m: RegExpMatchArray) => string; ar: (m: RegExpMatchArray) => string };

/** Messages with numbers, names or dates in them. */
const PATTERNS: Pattern[] = [
  {
    match: /^Unlocks in (\d+) days?$/,
    fr: (m) => `Se débloque dans ${m[1]} jour${m[1] === '1' ? '' : 's'}`,
    ar: (m) => `يُفتح بعد ${m[1]} ${m[1] === '1' ? 'يوم' : 'أيام'}`,
  },
  { match: /^Reach Level (\d+) \((.+)\)$/, fr: (m) => `Atteignez le niveau ${m[1]} (${m[2]})`, ar: (m) => `بلوغ المستوى ${m[1]} (${m[2]})` },
  { match: /^For (.+) members$/, fr: (m) => `Pour les membres ${m[1].replace(/ or /g, ' ou ')}`, ar: (m) => `لأعضاء ${m[1].replace(/ or /g, ' أو ')}` },
  { match: /^Only the team can post in (.+)$/, fr: (m) => `Seule l’équipe peut publier dans ${m[1]}`, ar: (m) => `يمكن للفريق فقط النشر في ${m[1]}` },
  { match: /^(.+) is archived and closed to new posts$/, fr: (m) => `${m[1]} est archivé et fermé aux nouvelles publications`, ar: (m) => `${m[1]} مؤرشفة ومغلقة أمام المنشورات الجديدة` },
  { match: /^Check-ins open on (.+)$/, fr: (m) => `Les pointages ouvrent le ${m[1]}`, ar: (m) => `يبدأ تسجيل الإنجازات في ${m[1]}` },
  { match: /^This module opens on (.+)$/, fr: (m) => `Ce module s’ouvre le ${m[1]}`, ar: (m) => `تُفتح هذه الوحدة في ${m[1]}` },
  {
    match: /^This module opens (\d+) days after you start the course$/,
    fr: (m) => `Ce module s’ouvre ${m[1]} jours après le début de la formation`,
    ar: (m) => `تُفتح هذه الوحدة بعد ${m[1]} أيام من بدء الدورة`,
  },
  { match: /^Moderators can restrict members for up to (\d+) days$/, fr: (m) => `Les modérateurs peuvent restreindre jusqu’à ${m[1]} jours`, ar: (m) => `يمكن للمشرفين التقييد حتى ${m[1]} أيام` },
  { match: /^Only (posts|comments) deleted in the last (\d+) days can be restored$/, fr: (m) => `Seuls les ${m[1] === 'posts' ? 'publications' : 'commentaires'} supprimés depuis moins de ${m[2]} jours peuvent être restaurés`, ar: (m) => `يمكن استعادة ${m[1] === 'posts' ? 'المنشورات' : 'التعليقات'} المحذوفة خلال آخر ${m[2]} يومًا فقط` },
  {
    match: /^You can review posts after (\d+) days in the community \((\d+) to go\)\.$/,
    fr: (m) => `Vous pourrez relire des publications après ${m[1]} jours dans la communauté (encore ${m[2]}).`,
    ar: (m) => `يمكنك مراجعة المنشورات بعد ${m[1]} يومًا في المجتمع (متبقٍّ ${m[2]}).`,
  },
  // A space prefix in front of a lock reason, e.g. "Pro Vault: Unlocks in 12 days"
  { match: /^([^:]{1,60}): (.+)$/, fr: (m) => `${m[1]} : ${translateMessage(m[2], 'fr')}`, ar: (m) => `${m[1]}: ${translateMessage(m[2], 'ar')}` },
];

const GENERIC: Translations = { fr: 'Une erreur est survenue. Réessayez.', ar: 'حدث خطأ. حاول مجددًا.' };

/** Translates one API message; lock reasons joined with " · " are translated one by one. */
export function translateMessage(text: string, locale: Locale): string {
  if (locale === 'en' || !text) return text;
  if (text.includes(' · ')) return text.split(' · ').map((part) => translateMessage(part, locale)).join(' · ');
  const exact = MESSAGES[text];
  if (exact) return exact[locale];
  for (const pattern of PATTERNS) {
    const match = text.match(pattern.match);
    if (match) return pattern[locale](match);
  }
  if (/^Failed to /.test(text)) return GENERIC[locale];
  return text;
}
