(() => {
  if (typeof opportunities === 'undefined') return;

  const byName = name => opportunities.find(o => o.name === name);

  const stage = byName('Stage 1A — Toulouse');
  if (stage) {
    Object.assign(stage, {
      desc: 'Stage découverte 1A · industrie aéronautique et spatiale · Toulouse',
      tag: 'Objectif été 2027',
      status: 'À préparer',
      priority: 'Très haute',
      next: 'Préparer le profil avant la réunion ENSMA du 12 octobre 2026',
      notes: `OBJECTIF\nObtenir à l’été 2027 un stage de découverte à Toulouse qui maximise exposition à l’aéronautique/spatial, réseau et apprentissage — pas seulement satisfaire l’obligation ENSMA.\n\nCIBLES À ÉVALUER\nAirbus · ONERA · Safran Power Units · Liebherr-Aerospace Toulouse · ATR · Thales Alenia Space · CNES · PME/startups pertinentes.\n\nCRITÈRES DE CLASSEMENT\n1. Fit technique\n2. Prestige / réseau\n3. Accessibilité aux élèves de 1A\n4. Probabilité d’acceptation\n5. ROI carrière\n6. Environnement de travail / exposition terrain\n\nTIMELINE STRATÉGIQUE\nAoût–septembre 2026 : CV, LinkedIn, projets/portfolio, compréhension du stage.\n12 octobre 2026 : réunion ENSMA “stage découverte de l’entreprise” → récupérer règles, durée, convention, dates et contraintes officielles.\n15 octobre 2026 : Forum entreprise ENSMA → repérer recruteurs, alumni et contacts.\nOctobre–novembre : construire shortlist et contacts.\n19 novembre : Journée MBDA → comprendre les attentes industrielles et enrichir le réseau.\nNovembre–janvier : premières approches / candidatures ciblées.\nJanvier–printemps : suivi jusqu’à obtention.\n\nDEADLINE OFFICIELLE\nÀ confirmer après la réunion ENSMA du 12 octobre ; ne pas inventer une date avant.`
    });
  }

  const oldUnitar = byName('UNITAR / ONU');
  if (oldUnitar) oldUnitar.status = 'Archivé';

  const additions = [
    {
      name:'Les Houches — WE-Heraeus Winter School 2027',
      category:'school',
      desc:'Mécanique des fluides · mélange · simulations · expériences',
      tag:'Hiver 2027',
      status:'À surveiller',
      priority:'Haute',
      deadline:'',
      next:'Vérifier ouverture des candidatures, coût et éligibilité',
      url:'https://www.we-heraeus-stiftung.de/veranstaltungen/ice-melting-and-mixing-from-the-lab-to-the-ocean/',
      notes:'Édition annoncée du 14 au 19 février 2027 aux Houches. Thème : Ice Melting and Mixing: From the Lab to the Ocean. Même si le sujet n’est pas aéronautique, la valeur vient de la mécanique des fluides, des phénomènes de mélange, des expériences et simulations numériques. À garder uniquement si coût raisonnable et niveau compatible ENSMA 1A.'
    },
    {
      name:'UNITAR — Global Youth Scholars',
      category:'international',
      desc:'SDGs · évaluation de terrain · leadership international',
      tag:'UNITAR · priorité',
      status:'À surveiller',
      priority:'Haute',
      deadline:'',
      next:'Surveiller la prochaine cohorte 2026–2027',
      url:'https://unitar.org/about/news-stories/news/call-applications-global-youth-scholars-development-programme-evaluating-sdgs-ground',
      notes:'Piste UNITAR n°1. L’édition précédente était gratuite et ouverte aux 18–24 ans de tous pays. Formation en ligne, projet d’évaluation locale lié aux SDGs et possibilité de valorisation à Genève pour les meilleurs travaux. Fort ROI si une nouvelle cohorte comparable ouvre : coût faible, dimension internationale réelle et projet concret.'
    },
    {
      name:'UNITAR — Diplomacy 4.0',
      category:'international',
      desc:'IA · cybersécurité · gouvernance numérique · science diplomacy',
      tag:'UNITAR · watchlist',
      status:'À surveiller',
      priority:'Haute',
      deadline:'',
      next:'Surveiller prochaine édition et vérifier coût / bourses',
      url:'https://event.unitar.org/full-catalog/diplomacy-40-beyond-digital-frontier-2026',
      notes:'Très bon alignement avec le profil ingénieur + IA + international. Le programme mélange diplomatie, intelligence artificielle, cybersécurité, Internet governance et science diplomacy. À privilégier par rapport aux formations diplomatiques généralistes si coût raisonnable ou bourse disponible.'
    },
    {
      name:'UNITAR — Science Policy & Diplomatic Practice',
      category:'international',
      desc:'Science diplomacy · énergie · IA · espace · engineering diplomacy',
      tag:'UNITAR · conditionnel',
      status:'À surveiller',
      priority:'Moyenne',
      deadline:'',
      next:'Vérifier tarif étudiant et possibilités de financement',
      url:'https://unitar.org/sustainable-development-goals/multilateral-diplomacy/our-portfolio/professional-certificate-science-policy-and-diplomatic-practice/professional-certificate-science-policy-and-diplomatic-practice',
      notes:'Professional Certificate sur environ 14 semaines, destiné notamment aux scientifiques et ingénieurs. Couvre science diplomacy, IA, climat, énergie, espace et engineering diplomacy, avec possible composante Genève. Contenu extrêmement pertinent mais à conserver uniquement si le coût/bourse rend le programme raisonnable.'
    },
    {
      name:'UNITAR — Free Events & Conferences',
      category:'international',
      desc:'Événements ponctuels · ONU · Genève · diplomatie scientifique',
      tag:'Opportuniste',
      status:'À explorer',
      priority:'Moyenne',
      deadline:'',
      next:'Sélectionner seulement quelques événements gratuits à fort intérêt',
      url:'https://unitar.org/events',
      notes:'Pas un programme à maintenir activement. Utiliser comme radar opportuniste : conférences, webinaires ou événements gratuits/peu coûteux compatibles avec ENSMA. Objectif : une ou deux expériences utiles, pas une accumulation de certificats.'
    }
  ];

  additions.forEach(item => {
    item.key = slug(item.name);
    if (!opportunities.some(o => o.key === item.key)) opportunities.push(item);
  });

  try {
    const saved = JSON.parse(localStorage.getItem('assann-opportunities-v1') || '{}');
    additions.forEach(item => {
      if (saved[item.key]) Object.assign(item, saved[item.key]);
    });
  } catch {}

  const rerender = () => {
    const filter = document.getElementById('opportunityFilter')?.value || 'all';
    if (typeof renderOpportunities === 'function') renderOpportunities(filter);
    if (typeof renderOverview === 'function') renderOverview();
    if (typeof renderCalendar === 'function') renderCalendar();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', rerender);
  else rerender();
})();
