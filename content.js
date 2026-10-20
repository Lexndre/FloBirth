// Personnalise ici les vidéos, les mots et les photos permanentes.
// Indique un chemin assets/ ou colle un lien Google Drive (partage ou /preview).
// Pour un autre lecteur HTTPS : { src: 'https://…', type: 'iframe' }.
window.BIRTHDAY_CONTENT = {
  portrait: 'assets/portrait.jpg', // Exemple : 'assets/florelle.jpg'
  audio: { background: 'assets/Pineapple.mp3', celebration: '' }, // Exemple : 'assets/musique.mp3', 'assets/mon-message.mp3'
  videos: { fr: '', en: '' }, // Chemin local ou lien Drive : 'https://drive.google.com/file/d/ID_VIDEO/preview'
  wordGroups: [
    {name:'ASSOUA', words:['Adorable', 'Solaire', 'Sincère', 'Optimiste', 'Unique', 'Attentionnée']},
    {name:'EBAH', words:['Éclatante', 'Bienveillante', 'Attachante', 'Harmonieuse']},
    {name:'NANCY', words:['Naturelle', 'Audacieuse', 'Nuancée', 'Créative', 'Yin (Merci a Gpt)']},
    {name:'ERINE', words:['Élégante', 'Rayonnante', 'Inspirante', 'Noble', 'Épatante']},
    {name:'FLORELLE', words:['Fascinante', 'Lumineuse', 'Originale', 'Rieuse', 'Enthousiaste', 'Loyale', 'Libre', 'Exceptionnelle']}
  ],
  // Ces mots sont des propositions à adapter à sa personnalité.
  wordNotes: {
    'Adorable': 'Un peu de douceur dans ce mot, et beaucoup dans ma vie grace a toi.',
    'Solaire': 'Que cette année t’offre autant de lumière que ce mot en évoque.',
    'Sincère': 'Des mots simples, des sentiments vrais : c’est ce que je veux te laisser ici.',
    'Optimiste': 'Tu te dis toujours que les bonnes choses peuvent arriver, I like it.',
    'Unique': 'Il n\'y a pas de Flo sur cette Terre. 🤣',
    'Attentionnée': 'Cala seulement, je peux jahin gater ton nom, tu prends soin de moi même',
    'Éclatante': 'Oui, tu sais faire briller une salle quand tu es presente.',
    'Bienveillante': 'Tu fais toujours passer les autres avant toi, c\'est cool même si je n\'approuve pas toujours.',
    'Attachante': 'Tu laisses toujours un bon souvenir apres ton passage, tu me donnes toujours envie de te revoir a chaque depart.',
    'Harmonieuse': 'Je te souhaite des journées où tu te sens bien, simplement.',
    'Naturelle': 'Continue d’être toi : c’est déjà tres bien.',
    'Audacieuse': 'Tu te brobro ma petite, j\'aime ca.',
    'Nuancée': 'Un seul mot ne suffit pas. C’est pour cela qu’il y en a vingt-huit.',
    'Créative': 'J\'ai tellement aimé tes 23 mots et ta lettre que j\'ai decide d\'en faire pour toi, c\'est ce que j\'ai le plus aimé.',
    'Yin': 'C\'est vrai que tu pleures vite mais tu sais toujours garder ton calme meme quand t\'es poussé a bout.',
    'Élégante': 'Les outfit de la fille la vont me tuer un jour tellement c\'est bien fait.',
    'Rayonnante': 'Aujourd’hui, toute la lumière est pour toi.',
    'Inspirante': 'Oui, tu inspires beaucoup ton entourage, t\'es une superbe personne.',
    'Noble': 'Reste fidèle à ce qui compte pour toi.',
    'Épatante': 'Je suis surpris de ce que je vis actuellement avec toi, je suis comblé',
    'Fascinante': 'Et dire que j\ai pas encore gouté tes plats, je suis sur que tu caches des trucs fascinants encore.',
    'Lumineuse': 'De la lumière pour les grandes journées comme pour les plus petites.',
    'Originale': 'Même ton gâteau est du poulet. Cette journée devait te ressembler.',
    'Rieuse': 'Toi quand tu ries, toute ta machoire est dehors, c\'est même contagieux. 🤣',
    'Enthousiaste': 'Les nouvelles aventures qui te donneront envie de sourire.',
    'Loyale': 'A aucun moment, je me dis que la fille la va me faire un faux we.',
    'Libre': 'Tu mens hein, tu n\'es jamais libre. Tu es a moi 😭',
    'Exceptionnelle': 'Je fais ca pendant que nous sommes en froid, il est 2h54 mais c\'est pas mon souci. Tout ce qui m\'interesse, c\'est que mon site rende ta journée exceptionnelle.'
  },
  // Souvenir Drive : conserve title/caption/alt, remplace src par le lien Drive et type par 'iframe'.
  memories: [
    {title:'Ces petits moments à deux', caption:'Un petit instant, une grande place dans mon cœur.', src:'assets/pic1.jpeg', alt:'Photo de nous deux'},
    {title:'Nos souvenirs préférés', caption:'Le bonheur de partager ces moments avec toi.', src:'https://drive.google.com/file/d/1e5cpStznQlemcatup-p0sDxm9yIKkLx5/preview', type:'iframe', alt:'Un souvenir partagé avec Bebou'},
    {title:'Tout ce qu’il nous reste à vivre', caption:'À nous, et à tous les souvenirs qui nous attendent.', src:'assets/video2.mp4', type:'video', alt:'Une autre photo de nous deux'}
  ]
};
