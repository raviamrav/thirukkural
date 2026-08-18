const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Multi-chapter dataset matching Gokulnath structure
const chaptersJsData = `
const chaptersData = {
  1: {
    title_ta: "அதிகாரம் 1: கடவுள் வாழ்த்து",
    title_en: "Chapter 1: In Praise of God",
    title_de: "Kapitel 1: Lob Gottes",
    kurals: [
      {ta1:"அகர முதல எழுத்தெல்லாம் ஆதி", ta2:"பகவன் முதற்றே உலகு.",
       ta_x:"அகரம் எழுத்துகளுக்கு முதன்மை போல, இறைவன் உலகின் மூலகாரணம்.",
       en:"As “A” begins every letter, God begins the world.", en_x:"The alphabet begins with A; the world begins with the primal being.",
       de:"Wie „A“ jeden Buchstaben beginnt, beginnt Gott die Welt.", de_x:"Das Alphabet beginnt mit A; die Welt beginnt mit dem Urwesen."},
      {ta1:"கற்றதனால் ஆய பயனென்கொல் வாலறிவன்", ta2:"நற்றாள் தொழாஅர் எனின்.",
       ta_x:"தூய அறிஞரின் அடி வணங்காதவர் கல்வி பயனற்றது.",
       en:"What use is learning without bowing to pure wisdom?", en_x:"Education is worthless without reverence for true wisdom.",
       de:"Was nützt Lernen ohne Ehrfurcht vor reiner Weisheit?", de_x:"Bildung ist wertlos ohne Ehrfurcht vor wahrer Weisheit."},
      {ta1:"மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்", ta2:"நிலமிசை நீடுவாழ் வார்.",
       ta_x:"மலர் மேல் இறைவன் அடி அடைந்தோர் நீடு வாழ்வர்.",
       en:"Those who reach the flower-treading feet live long.", en_x:"Devotion to the lotus-dwelling divine brings an enduring life.",
       de:"Wer die Füße des Blütenwandlers erreicht, lebt lange.", de_x:"Hingabe an das Göttliche auf der Blüte bringt langes Leben."},
      {ta1:"வேண்டுதல் வேண்டாமை இலானடி சேர்ந்தார்க்கு", ta2:"யாண்டும் இடும்பை இல.",
       ta_x:"விருப்பு வெறுப்பு இல்லானை அடைந்தோர்க்கு துன்பம் இல்லை.",
       en:"No sorrow ever touches those who reach the desireless One.", en_x:"Union with the divine beyond craving ends worldly suffering.",
       de:"Kein Leid trifft die, die den Begierdelosen erreichen.", de_x:"Vereinigung mit dem Göttlichen beendet weltliches Leid."},
      {ta1:"இருள்சேர் இருவினையும் சேரா இறைவன்", ta2:"பொருள்சேர் புகழ்புரிந்தார் மாட்டு.",
       ta_x:"இறைவன் புகழ் போற்றுவோரை நல்-தீ வினை அணுகா.",
       en:"Good and evil deeds don't touch those who praise the Lord.", en_x:"Sincere praise of the divine frees one from karma.",
       de:"Gut und Böse berühren die Lobpreisenden nicht.", de_x:"Aufrichtiges Lob befreit vom Kreislauf des Karmas."},
      {ta1:"பொறிவாயில் ஐந்தவித்தான் பொய்தீர் ஒழுக்க", ta2:"நெறிநின்றார் நீடுவாழ்வார்.",
       ta_x:"ஐம்புலன் வென்றோனின் நெறி பின்பற்றுவோர் நீடு வாழ்வர்.",
       en:"Long live those who follow the five-senses' master.", en_x:"This truthful path brings a full, enduring life.",
       de:"Lange leben die Anhänger des Sinnesmeisters.", de_x:"Dieser Pfad führt zu einem erfüllten, langen Leben."},
      {ta1:"தனக்குவமை இல்லாதான் தாள்சேர்ந்தார்க்", ta2:"கல்லால் மனக்கவலை மாற்றல் அரிது.",
       ta_x:"ஒப்பற்றோன் அடி அடையாவிடின் கவலை நீங்காது.",
       en:"Only the incomparable One's feet dissolve the mind's sorrow.", en_x:"Only surrender to the divine truly ends anxiety.",
       de:"Nur die Füße des Unvergleichlichen lösen die Sorgen.", de_x:"Nur Hingabe an das Göttliche beendet die Angst."},
      {ta1:"அறவாழி அந்தணன் தாள்சேர்ந்தார்க்", ta2:"கல்லால் பிறவாழி நீந்தல் அரிது.",
       ta_x:"அறவாழியை அடையாவிடின் பிறவிக் கடல் கடத்தல் அரிது.",
       en:"Without the virtuous One, the other ocean can't be crossed.", en_x:"Devotion to righteousness makes worldly existence crossable.",
       de:"Ohne den Rechtschaffenen ist der andere Ozean unüberwindbar.", de_x:"Hingabe an Rechtschaffenheit macht das Dasein überwindbar."},
      {ta1:"கோளில் பொறியில் குணமிலவே எண்குணத்தான்", ta2:"தாளை வணங்காத் தலை.",
       ta_x:"எண்குணத்தானை வணங்காத் தலை பயனற்ற பொறி போன்றது.",
       en:"A head that won't bow is as useless as a faulty organ.", en_x:"Ignoring the eight divine virtues is like a blind sense.",
       de:"Ein Haupt ohne Ehrfurcht ist wie ein defektes Organ.", de_x:"Missachtung der acht Tugenden ist wie ein blindes Sinnesorgan."},
      {ta1:"பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார்", ta2:"இறைவன் அடிசேரா தார்.",
       ta_x:"இறைவன் அடி அடையாதோர் பிறவிக் கடல் கடவார்.",
       en:"Only those at the Lord's feet cross the ocean of birth.", en_x:"Refuge at the divine's feet ends the cycle of rebirth.",
       de:"Nur wer beim Herrn Zuflucht sucht, überquert die Geburt.", de_x:"Zuflucht beim Göttlichen beendet den Kreislauf der Wiedergeburt."}
    ]
  },
  2: {
    title_ta: "அதிகாரம் 2: வான் சிறப்பு",
    title_en: "Chapter 2: The Glory of Rain",
    title_de: "Kapitel 2: Die Herrlichkeit des Regens",
    kurals: [
      {ta1:"வானின்று உலகம் வழங்கி வருதலால்", ta2:"தான்அமிழ்தம் என்றுணரப் பாற்று.",
       ta_x:"மழையால் உலகம் வாழ்வதால் மழை அமிழ்தம் எனக் கருதப்படும்.",
       en:"It is the rain that sustains the world, hence called nectar.", en_x:"Rain sustains all life on earth and is regarded as divine nectar.",
       de:"Der Regen erhält die Welt, daher wird er als Nektar bezeichnet.", de_x:"Regen erhält alles Leben auf Erden und gilt als göttlicher Nektar."},
      {ta1:"துப்பார்க்குத் துப்பாய துப்பாக்கித் துப்பார்க்குத்", ta2:"துப்பாய தூஉம் மழை.",
       ta_x:"உண்பவருக்கு உணவை உண்டாக்கித் தானும் உணவாகும் மழை.",
       en:"Rain creates food for consumers and itself becomes food.", en_x:"Rain provides food for all living beings while acting as drink.",
       de:"Regen erzeugt Nahrung für alle und wird selbst zur Nahrung.", de_x:"Regen spendet Nahrung für alle Lebewesen und dient als Trank."},
      {ta1:"விண்இன்று பொய்ப்பின் விரிநீர் வியனுலகத்து", ta2:"உள்நின்று உடற்றும் பசி.",
       ta_x:"மழை பெய்யாவிடின் கடலால் சூழப்பட்ட உலகிலும் பசி வாட்டும்.",
       en:"If clouds fail, hunger torments the ocean-bounded world.", en_x:"Even surrounded by vast oceans, drought brings suffering.",
       de:"Wenn der Regen ausbleibt, quält Hunger die ganze Welt.", de_x:"Selbst umgeben von Ozeanen bringt Dürre großes Leid."},
      {ta1:"ஏரின் உழாஅர் உழவர் புயல்என்னும்", ta2:"வாரி வளங்குன்றிக் கால்.",
       ta_x:"மழை என்னும் வருவாய் குன்றினால் உழவர் ஏர் உழ மாட்டார்.",
       en:"Farmers won't plough if rain's abundance declines.", en_x:"Agricultural work ceases when rainfall shrinks.",
       de:"Bauern pflügen nicht, wenn der Regen ausbleibt.", de_x:"Die Arbeit auf den Feldern ruht, wenn kein Regen fällt."},
      {ta1:"கெடுப்பதூஉம் கெட்டார்க்குச் சார்வாய்மற்று ஆங்கே", ta2:"எடுப்பதூஉம் எல்லாம் மழை.",
       ta_x:"வாழ்வைக் கெடுப்பதும் கெட்டவரை வாழ்விப்பதும் மழையே.",
       en:"Rain ruins and also restores those ruined.", en_x:"Rain has the power both to destroy and to revitalize prosperity.",
       de:"Regen zerstört und richtet Diejenigen wieder auf.", de_x:"Regen kann Wohlstand zerstören und ebenso wiederbelebe."},
      {ta1:"விசும்பின் துளிவீழின் அல்லால்மற்று ஆங்கே", ta2:"பசும்புல் தலைகாண்பு அரிது.",
       ta_x:"வானிலிருந்து மழைத்துளி வீழாவிட்டால் பசும்புல்லும் முளைக்காது.",
       en:"Without raindrops falling, even green grass cannot sprout.", en_x:"Even a blade of grass cannot grow without rain.",
       de:"Ohne Regentropfen kann kein Grashalm sprießen.", de_x:"Selbst ein Grashalm kann ohne Regen nicht wachsen."},
      {ta1:"நெடுங்கடலும் தன்நீர்மை குன்றும் தடிந்தெழிலி", ta2:"தான்நல்கா தாகி விடின்.",
       ta_x:"மேகம் மழை தராவிட்டால் விரிந்த கடலும் வளங்குன்றும்.",
       en:"Even the ocean shrinks if clouds withhold their rain.", en_x:"Vast seas lose their wealth when cloud showers cease.",
       de:"Selbst der Ozean schrumpft, wenn Wolken den Regen zurückhalten.", de_x:"Große Meere verlieren ihren Reichtum, wenn kein Regen fällt."},
      {ta1:"சிறப்பொடு பூசனை செல்லாது வானம்", ta2:"வறக்குமேல் வானோர்க்கும் ஈண்டு.",
       ta_x:"மழை பொய்த்தால் தேவர்க்கும் வழிபாடும் விழாவும் நடைபெறாது.",
       en:"Worship and festivals cease if the sky dries up.", en_x:"Even divine offerings wither when rains fail.",
       de:"Gottesdienste und Feste enden, wenn der Himmel austrocknet.", de_x:"Selbst göttliche Opfergaben versiegen bei Dürre."},
      {ta1:"தானம் தவம்இரண்டும் தங்கா வியனுலகம்", ta2:"வானம் வழங்கா தெனின்.",
       ta_x:"மழை பெய்யாவிட்டால் கொடையும் தவமும் உலகினில் நிலைக்காது.",
       en:"Charity and penance vanish if rain does not fall.", en_x:"Righteous virtues depend upon the blessings of water.",
       de:"Nächstenliebe und Buße schwinden ohne Regen.", de_x:"Rechtschaffene Tugenden hängen vom Segen des Wassers ab."},
      {ta1:"நீர்இன்று அமையாது உலகெனின் யார்யார்க்கும்", ta2:"வான்இன்று அமையாது ஒழுக்கு.",
       ta_x:"நீர் இன்றி உலகு இயங்காது; மழை இன்றி ஒழுக்கம் நிலைக்காது.",
       en:"As life needs water, virtue needs rain from above.", en_x:"No life exists without water; no order exists without rain.",
       de:"Ohne Wasser kein Leben; ohne Regen keine Ordnung.", de_x:"Kein Leben existiert ohne Wasser, keine Ordnung ohne Regen."}
    ]
  },
  3: {
    title_ta: "அதிகாரம் 3: நீத்தார் பெருமை",
    title_en: "Chapter 3: Greatness of Ascetics",
    title_de: "Kapitel 3: Größe der Asketen",
    kurals: [
      {ta1:"ஒழுக்கத்து நீத்தார் பெருமை விழுப்பத்து", ta2:"வேண்டும் பனுவல் துணிவு.",
       ta_x:"ஒழுக்கத்தில் நிலைத்து நின்ற துறவியரின் பெருமையை நூல்கள் போற்றும்.",
       en:"Scriptures praise the greatness of those steadfast in virtue.", en_x:"All sacred texts extol the supreme glory of saintly ascetics.",
       de:"Heilige Schriften loben die Größe derer, die in Tugend verharren.", de_x:"Alle heiligen Texte preisen den höchsten Ruhm heiliger Asketen."},
      {ta1:"துறந்தார் பெருமை துணைக்கூறின் வையத்து", ta2:"இறந்தாரை எண்ணிக் கொண்டற்று.",
       ta_x:"துறந்தாரின் பெருமையை அளவிடுவது உலக இறந்தாரை எண்ணுவது போலாம்.",
       en:"Measuring ascetics' glory is like counting all who have died.", en_x:"The greatness of ascetics is immeasurable.",
       de:"Die Größe der Asketen zu messen ist wie alle Toten zu zählen.", de_x:"Die Größe der Asketen ist unermesslich."},
      {ta1:"இருமை வகைதெரிந்து ஈண்டுஅறம் பூண்டார்", ta2:"பெருமை பிறங்கிற்று உலகு.",
       ta_x:"இப்பிறப்பு மறுபிறப்பு உணர்ந்து அறம் செய்வோரின் பெருமை சிறக்கும்.",
       en:"The glory of those who understand both worlds shines brightly.", en_x:"Wisdom discerning birth and liberation illuminates the world.",
       de:"Der Ruhm derer, die beide Welten verstehen, leuchtet hell.", de_x:"Weisheit, die Geburt und Befreiung unterscheidet, erleuchtet die Welt."},
      {ta1:"உரன்என்னும் தோட்டியான் ஓரைந்தும் காப்பான்", ta2:"வரன்என்னும் வைப்பிற்கோர் வித்து.",
       ta_x:"அறிவு என்னும் அங்குசத்தால் ஐம்புலன் அடக்குவோன் மேலுலக விதை.",
       en:"He who controls five senses with wisdom's hook is a seed for heaven.", en_x:"Mastery over five senses secures eternal bliss.",
       de:"Wer fünf Sinne mit Weisheit beherrscht, ist ein Samen für den Himmel.", de_x:"Die Beherrschung der fünf Sinne sichert ewiges Glück."},
      {ta1:"செயற்கரிய செய்வார் பெரியர் சிறியர்", ta2:"செயற்கரிய செய்கலா தார்.",
       ta_x:"செய்வதற்கு அரிய செயல்களைச் செய்வோரே பெரியோர்.",
       en:"Great are those who achieve difficult deeds; small are those who fail.", en_x:"Greatness is proven by accomplishing impossible tasks.",
       de:"Groß sind die, die Schweres vollbringen; klein, die versagen.", de_x:"Größe zeigt sich im Vollbringen unmöglicher Taten."}
    ]
  }
};
let currentChapter = 1;
`;

// Inject chaptersJsData if not present
if (!html.includes('const chaptersData =')) {
  html = html.replace('const kurals = [', chaptersJsData + '\nconst kurals = [');
}

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Added multi-chapter dataset to index.html');
