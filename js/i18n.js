// ── Language Support ──

let _langEsCache = null;
function getLangEs() {
  if (!_langEsCache) _langEsCache = _buildLangEs();
  return _langEsCache;
}
function _buildLangEs() { return {
  labels: {
    // Core words
    'core-i': 'yo', 'core-want': 'quiero', 'core-dont-want': 'no quiero',
    'core-more': 'm\u00e1s', 'core-help': 'ayuda',
    'core-yes': 's\u00ed', 'core-no': 'no', 'core-stop': 'para',
    // 6x6 extras
    't-yes': 's\u00ed', 't-no': 'no', 't-stop': 'para', 't-go': 'ir',
    't-like': 'me gusta', 't-need': 'necesito', 't-you': 'tu', 't-my': 'mi',
    't-it': 'eso', 't-is': 'es', 't-please': 'por favor', 't-hi': 'hola',
    't-bye': 'adios', 't-big': 'grande', 't-little': 'pequeno',
    't-dont': 'no', 't-eat': 'comer', 't-drink': 'beber',
    't-play': 'jugar', 't-open': 'abrir',
    // Folders
    'folder-general': 'Social', 'folder-food': 'Comida', 'folder-drinks': 'Bebidas',
    'folder-people': 'Personas', 'folder-feelings': 'Sentimientos', 'folder-actions': 'Acciones',
    'folder-toys': 'Juguetes', 'folder-body': 'Mi Cuerpo', 'folder-places': 'Lugares',
    'folder-things': 'Cosas', 'folder-questions': 'Preguntas', 'folder-clothes': 'Ropa',
    'folder-colors': 'Colores', 'folder-shapes': 'Formas', 'folder-123': '123', 'folder-abc': 'ABC',
    'folder-animals': 'Animales', 'folder-descriptors': 'Descriptores', 'folder-time': 'Tiempo',
    'folder-where': 'Donde', 'folder-nature': 'Naturaleza', 'folder-school': 'Escuela',
    'folder-senses': 'Siento', 'folder-quick': 'Frases Rapidas',
    // Social
    'gen-i': 'yo', 'gen-want': 'quiero', 'gen-dont-want': 'no quiero',
    'gen-need': 'necesito', 'gen-help': 'ayuda', 'gen-dont-know': 'no se',
    'gen-yes': 'si', 'gen-no': 'no', 'gen-ok': 'OK', 'gen-im-fine': 'estoy bien',
    'gen-please': 'por favor', 'gen-thank-you': 'gracias', 'gen-hi': 'hola', 'gen-bye': 'adios',
    'gen-more': 'mas', 'gen-stop': 'para', 'gen-go': 'ir', 'gen-like': 'me gusta',
    'gen-all-done': 'termine', 'gen-wait': 'espera', 'gen-look': 'mira',
    'gen-my-turn': 'mi turno', 'gen-sorry': 'lo siento', 'gen-excuse-me': 'con permiso',
    'gen-hello': 'hola', 'gen-good-morning': 'buenos dias', 'gen-goodnight': 'buenas noches',
    'gen-see-you': 'nos vemos', 'gen-yr-welcome': 'de nada',
    'gen-no-thank-you': 'no gracias', 'gen-cool': 'genial', 'gen-awesome': 'increible',
    'gen-thats-funny': 'que chistoso', 'gen-me-too': 'yo tambien', 'gen-wow': 'guau',
    'gen-i-did-it': 'lo logre', 'gen-i-like-it': 'me gusta',
    'gen-want-play': 'quieres jugar?', 'gen-your-turn': 'tu turno',
    'gen-tell-me': 'dime mas',
    // Food
    'food-apple': 'manzana', 'food-banana': 'platano', 'food-cookie': 'galleta',
    'food-crackers': 'galletas saladas', 'food-pizza': 'pizza',
    'food-nuggets': 'nuggets de pollo', 'food-pasta': 'pasta', 'food-sandwich': 'sandwich',
    'food-rice': 'arroz', 'food-fries': 'papas fritas', 'food-grilled-ch': 'queso a la plancha',
    'food-pancakes': 'panqueques', 'food-yogurt': 'yogur', 'food-fruit-snk': 'frutas',
    'food-ice-cream': 'helado', 'food-cereal': 'cereal', 'food-soup': 'sopa',
    'food-bread': 'pan', 'food-cheese': 'queso', 'food-strawberry': 'fresa',
    'food-grapes': 'uvas', 'food-eggs': 'huevos', 'food-cake': 'pastel',
    'food-hungry': 'hambre', 'food-yummy': 'rico',
    'food-blueberry': 'arandanos', 'food-watermelon': 'sandia', 'food-orange': 'naranja',
    'food-pineapple': 'pina', 'food-mango': 'mango', 'food-peach': 'durazno', 'food-pear': 'pera',
    'food-broccoli': 'brocoli', 'food-carrots': 'zanahorias', 'food-corn': 'maiz',
    'food-peas': 'chicharos', 'food-green-beans': 'ejotes', 'food-potatoes': 'papas',
    'food-tomato': 'tomate', 'food-cucumber': 'pepino',
    'food-popcorn': 'palomitas', 'food-chips': 'papitas', 'food-pretzels': 'pretzels',
    'food-granola': 'barra de granola', 'food-goldfish': 'galletas de pescado',
    'food-peanut-butter': 'mantequilla de mani', 'food-jelly': 'mermelada',
    'food-applesauce': 'puree de manzana',
    'food-mac-cheese': 'macarrones con queso', 'food-hot-dog': 'hot dog',
    'food-hamburger': 'hamburguesa', 'food-taco': 'taco', 'food-meatballs': 'albondigas',
    'food-toast': 'tostada', 'food-oatmeal': 'avena', 'food-waffle': 'waffle',
    // Drinks
    'drink-water': 'agua', 'drink-milk': 'leche', 'drink-choc-milk': 'leche con chocolate',
    'drink-apple-juice': 'jugo de manzana', 'drink-orange-juice': 'jugo de naranja',
    'drink-lemonade': 'limonada', 'drink-hot-choc': 'chocolate caliente',
    'drink-smoothie': 'licuado', 'drink-thirsty': 'sed',
    'drink-grape-juice': 'jugo de uva', 'drink-straw-milk': 'leche de fresa',
    'drink-tea': 'te', 'drink-soda': 'refresco',
    // People
    'ppl-mom': 'mama', 'ppl-dad': 'papa', 'ppl-sister': 'hermana', 'ppl-brother': 'hermano',
    'ppl-grandma': 'abuela', 'ppl-grandpa': 'abuelo', 'ppl-teacher': 'maestra',
    'ppl-friend': 'amigo', 'ppl-baby': 'bebe',
    'ppl-doctor': 'doctor', 'ppl-me': 'yo', 'ppl-you': 'tu',
    'ppl-aunt': 'tia', 'ppl-uncle': 'tio', 'ppl-cousin': 'primo',
    'ppl-neighbor': 'vecino', 'ppl-therapist': 'terapeuta',
    // Clothes
    'clo-shirt': 'camisa', 'clo-pants': 'pantalones', 'clo-shoes': 'zapatos',
    'clo-socks': 'calcetines', 'clo-underwear': 'ropa interior', 'clo-jacket': 'chaqueta',
    'clo-hat': 'sombrero', 'clo-pajamas': 'pijama', 'clo-dress': 'vestido',
    'clo-shorts': 'shorts', 'clo-boots': 'botas', 'clo-gloves': 'guantes',
    'clo-coat': 'abrigo', 'clo-swimsuit': 'traje de bano', 'clo-diaper': 'panal',
    'clo-scarf': 'bufanda',
    // Body
    'body-head': 'cabeza', 'body-tummy': 'barriga', 'body-arm': 'brazo', 'body-leg': 'pierna',
    'body-hand': 'mano', 'body-foot': 'pie', 'body-eyes': 'ojos', 'body-ears': 'orejas',
    'body-mouth': 'boca', 'body-nose': 'nariz', 'body-teeth': 'dientes', 'body-back': 'espalda',
    'body-hurts': 'duele', 'body-sick': 'enfermo', 'body-fever': 'fiebre',
    'body-medicine': 'medicina', 'body-bathroom': 'bano', 'body-itchy': 'pica',
    'body-dizzy': 'mareado', 'body-too-loud': 'muy fuerte', 'body-too-bright': 'muy brillante',
    'body-allergic': 'alergico',
    'body-wash-hands': 'lavar manos', 'body-brush-teeth': 'cepillar dientes',
    'body-go-potty': 'ir al bano', 'body-take-bath': 'banarse',
    'body-get-dressed': 'vestirse', 'body-put-on': 'ponerse',
    'body-take-off': 'quitarse', 'body-dry-off': 'secarse',
    'body-comb-hair': 'peinar', 'body-flush': 'jalar la cadena',
    // Feelings
    'feel-happy': 'feliz', 'feel-sad': 'triste', 'feel-angry': 'enojado',
    'feel-scared': 'asustado', 'feel-tired': 'cansado', 'feel-excited': 'emocionado',
    'feel-frustrated': 'frustrado', 'feel-calm': 'tranquilo', 'feel-nervous': 'nervioso',
    'feel-silly': 'tonto', 'feel-proud': 'orgulloso', 'feel-bored': 'aburrido',
    'feel-confused': 'confundido', 'feel-love': 'amor', 'feel-worried': 'preocupado',
    'feel-overwhelmed': 'abrumado', 'feel-lonely': 'solo', 'feel-shy': 'timido',
    'feel-safe': 'seguro', 'feel-need-break': 'necesito un descanso',
    // Actions
    'act-eat': 'comer', 'act-drink': 'beber', 'act-play': 'jugar', 'act-read': 'leer',
    'act-run': 'correr', 'act-jump': 'saltar', 'act-sit': 'sentarse', 'act-stand': 'pararse',
    'act-walk': 'caminar', 'act-sleep': 'dormir', 'act-wash': 'lavar', 'act-open': 'abrir',
    'act-close': 'cerrar', 'act-push': 'empujar', 'act-pull': 'jalar', 'act-give': 'dar',
    'act-listen': 'escuchar', 'act-draw': 'dibujar', 'act-sing': 'cantar',
    'act-dance': 'bailar', 'act-hug': 'abrazar', 'act-throw': 'tirar',
    'act-share': 'compartir', 'act-build': 'construir',
    'act-chase': 'perseguir', 'act-hide': 'esconder', 'act-find': 'encontrar',
    'act-catch': 'atrapar', 'act-tickle': 'cosquillas', 'act-climb': 'trepar',
    'act-dig': 'cavar', 'act-pour': 'verter', 'act-blow': 'soplar',
    'act-say': 'decir', 'act-tell': 'contar', 'act-show': 'mostrar',
    'act-ask': 'preguntar', 'act-cook': 'cocinar', 'act-taste': 'probar',
    'act-cut': 'cortar', 'act-stir': 'revolver', 'act-bite': 'morder',
    'act-watch': 'mirar', 'act-swim': 'nadar', 'act-brush': 'cepillar',
    'act-try': 'intentar', 'act-get': 'agarrar', 'act-touch': 'tocar',
    'act-look': 'ver', 'act-wait': 'esperar', 'act-squeeze': 'apretar',
    'act-hold': 'sostener', 'act-pick': 'escoger', 'act-dry': 'secar',
    'act-kick': 'patear', 'act-point': 'señalar',
    'act-mix': 'mezclar', 'act-press': 'presionar', 'act-splash': 'salpicar',
    'act-rinse': 'enjuagar', 'act-put-on': 'poner', 'act-take-off': 'quitar',
    'act-turn-on': 'prender', 'act-turn-off': 'apagar',
    'act-rub': 'frotar', 'act-chew': 'masticar', 'act-slide': 'deslizar',
    'act-swing': 'columpiar', 'act-kiss': 'besar', 'act-zip': 'cerrar cierre',
    'act-button': 'abotonar', 'act-clap': 'aplaudir', 'act-wave': 'saludar',
    'act-drive': 'manejar', 'act-buckle': 'abrochar', 'act-shake': 'agitar',
    'act-smell': 'oler', 'act-turn': 'voltear', 'act-breathe': 'respirar',
    'act-paint': 'pintar', 'act-glue': 'pegar', 'act-color': 'colorear',
    'act-carry': 'cargar', 'act-put': 'poner', 'act-pause': 'pausar',
    'act-float': 'flotar', 'act-spray': 'rociar', 'act-comb': 'peinar',
    'act-spit': 'escupir', 'act-take': 'tomar', 'act-reach': 'alcanzar',
    // Toys
    'toy-ball': 'pelota', 'toy-blocks': 'bloques', 'toy-doll': 'muneca', 'toy-car': 'carro',
    'toy-train': 'tren', 'toy-puzzle': 'rompecabezas', 'toy-bubbles': 'burbujas',
    'toy-crayons': 'crayones', 'toy-book': 'libro', 'toy-tablet': 'tableta',
    'toy-swing': 'columpio', 'toy-slide': 'resbaladilla', 'toy-bike': 'bicicleta',
    'toy-teddy': 'osito', 'toy-playdoh': 'plastilina', 'toy-stickers': 'estampas',
    'toy-lego': 'Lego', 'toy-game': 'juego', 'toy-balloon': 'globo',
    'toy-trampoline': 'trampolin',
    // Places
    'plc-home': 'casa', 'plc-school': 'escuela', 'plc-bathroom': 'bano', 'plc-park': 'parque',
    'plc-outside': 'afuera', 'plc-inside': 'adentro', 'plc-store': 'tienda', 'plc-car': 'carro',
    'plc-bedroom': 'cuarto', 'plc-kitchen': 'cocina', 'plc-playground': 'patio de juegos',
    'plc-hospital': 'hospital', 'plc-library': 'biblioteca', 'plc-pool': 'piscina',
    // Animals
    'ani-fish': 'pez', 'ani-bird': 'pajaro', 'ani-horse': 'caballo',
    'ani-bunny': 'conejo', 'ani-bear': 'oso', 'ani-frog': 'rana',
    'ani-butterfly': 'mariposa', 'ani-dinosaur': 'dinosaurio', 'ani-elephant': 'elefante',
    'ani-monkey': 'mono', 'ani-duck': 'pato', 'ani-cow': 'vaca',
    'ani-pig': 'cerdo', 'ani-chicken': 'pollo', 'ani-snake': 'serpiente',
    'ani-turtle': 'tortuga',
    // Descriptors
    'desc-hot': 'caliente', 'desc-cold': 'fr\u00edo', 'desc-wet': 'mojado',
    'desc-dry': 'seco', 'desc-fast': 'r\u00e1pido', 'desc-slow': 'lento',
    'desc-loud': 'fuerte', 'desc-quiet': 'silencioso', 'desc-soft': 'suave',
    'desc-hard': 'duro', 'desc-tall': 'alto', 'desc-short': 'bajo',
    'desc-long': 'largo', 'desc-heavy': 'pesado', 'desc-light': 'ligero',
    'desc-full': 'lleno', 'desc-empty': 'vac\u00edo', 'desc-clean': 'limpio',
    'desc-dirty': 'sucio', 'desc-new': 'nuevo', 'desc-old': 'viejo',
    'desc-same': 'igual', 'desc-different': 'diferente', 'desc-broken': 'roto',
    'desc-yucky': 'asqueroso', 'desc-nice': 'bonito',
    // Time
    'time-first': 'primero', 'time-then': 'entonces', 'time-next': 'siguiente',
    'time-last': '\u00faltimo', 'time-before': 'antes', 'time-after': 'despu\u00e9s',
    'time-now': 'ahora', 'time-later': 'm\u00e1s tarde', 'time-soon': 'pronto',
    'time-today': 'hoy', 'time-tomorrow': 'ma\u00f1ana', 'time-yesterday': 'ayer',
    'time-morning': 'ma\u00f1ana', 'time-afternoon': 'tarde', 'time-night': 'noche',
    // Where
    'where-in': 'en', 'where-on': 'sobre', 'where-under': 'debajo',
    'where-behind': 'detr\u00e1s', 'where-next-to': 'al lado', 'where-up': 'arriba',
    'where-down': 'abajo', 'where-out': 'fuera', 'where-off': 'apagado',
    'where-over': 'encima', 'where-here': 'aqu\u00ed', 'where-there': 'all\u00ed',
    'where-away': 'lejos', 'where-between': 'entre',
    // Nature
    'nat-sun': 'sol', 'nat-rain': 'lluvia', 'nat-snow': 'nieve',
    'nat-cloud': 'nube', 'nat-wind': 'viento', 'nat-tree': '\u00e1rbol',
    'nat-flower': 'flor', 'nat-grass': 'pasto', 'nat-bug': 'bicho',
    'nat-rock': 'roca', 'nat-water': 'agua', 'nat-sky': 'cielo',
    'nat-moon': 'luna', 'nat-stars': 'estrellas',
    // School
    'sch-circle-time': 'hora del c\u00edrculo', 'sch-line-up': 'hacer fila',
    'sch-recess': 'recreo', 'sch-art': 'arte', 'sch-music': 'm\u00fasica',
    'sch-story': 'hora del cuento', 'sch-lunch': 'almuerzo',
    'sch-snack': 'hora de merienda', 'sch-paint': 'pintar', 'sch-glue': 'pegamento',
    'sch-marker': 'marcador', 'sch-backpack': 'mochila', 'sch-paper': 'papel',
    'sch-helper': 'ayudante',
    // Colors
    'clr-red': 'rojo', 'clr-blue': 'azul', 'clr-yellow': 'amarillo', 'clr-green': 'verde',
    'clr-orange': 'naranja', 'clr-purple': 'morado', 'clr-pink': 'rosa',
    'clr-black': 'negro', 'clr-white': 'blanco', 'clr-brown': 'cafe',
    'clr-gray': 'gris', 'clr-rainbow': 'arco\u00edris',
    // Shapes
    'shp-circle': 'c\u00edrculo', 'shp-square': 'cuadrado', 'shp-triangle': 'tri\u00e1ngulo',
    'shp-rectangle': 'rect\u00e1ngulo', 'shp-star': 'estrella', 'shp-heart': 'coraz\u00f3n',
    'shp-diamond': 'diamante', 'shp-oval': '\u00f3valo',
    // Questions
    'q-what': 'qu\u00e9', 'q-where': 'd\u00f3nde', 'q-when': 'cu\u00e1ndo', 'q-who': 'qui\u00e9n',
    'q-why': 'por qu\u00e9', 'q-how': 'c\u00f3mo', 'q-can-i': 'puedo', 'q-is-it': 'es',
    'q-do-you': 't\u00fa', 'q-which': 'cu\u00e1l',
    // Things
    'thg-cup': 'vaso', 'thg-plate': 'plato', 'thg-spoon': 'cuchara', 'thg-fork': 'tenedor',
    'thg-napkin': 'servilleta', 'thg-blanket': 'cobija', 'thg-pillow': 'almohada',
    'thg-toothbrush': 'cepillo de dientes', 'thg-towel': 'toalla', 'thg-backpack': 'mochila',
    'thg-scissors': 'tijeras', 'thg-phone': 'tel\u00e9fono', 'thg-tv': 'TV',
    'thg-headphones': 'aud\u00edfonos', 'thg-tissue': 'pa\u00f1uelo', 'thg-soap': 'jab\u00f3n',
    'thg-pencil': 'l\u00e1piz', 'thg-paper': 'papel', 'thg-light': 'luz', 'thg-fan': 'ventilador',
    // Entertainment
    'ent-watch': 'ver', 'ent-movie': 'pel\u00edcula', 'ent-show': 'programa',
    'ent-video': 'video', 'ent-cartoon': 'caricatura', 'ent-music': 'm\u00fasica',
    'ent-song': 'canci\u00f3n', 'ent-remote': 'control remoto',
    'ent-turn-on': 'prender', 'ent-turn-off': 'apagar', 'ent-pause': 'pausa',
    'ent-again': 'otra vez', 'ent-funny': 'gracioso', 'ent-scary': 'da miedo',
    'ent-favorite': 'favorito', 'ent-this-one': 'este', 'ent-that-one': 'ese',
    'ent-different': 'otro diferente',
  },
  speakOverrides: {},
  symbolKeywords: {
    'core-i': 'yo', 'core-want': 'querer', 'core-dont-want': 'no querer',
    'core-more': 'm\u00e1s', 'core-help': 'ayuda',
    'core-yes': 's\u00ed', 'core-no': 'no', 'core-stop': 'parar',
    'food-apple': 'manzana', 'food-banana': 'platano', 'food-cookie': 'galleta',
    'food-crackers': 'galleta salada', 'food-pizza': 'pizza', 'food-nuggets': 'pollo',
    'food-pasta': 'pasta', 'food-sandwich': 'sandwich', 'food-rice': 'arroz',
    'food-fries': 'patatas fritas', 'food-grilled-ch': 'queso', 'food-pancakes': 'panqueque',
    'food-yogurt': 'yogur', 'food-fruit-snk': 'fruta', 'food-ice-cream': 'helado',
    'food-cereal': 'cereal', 'food-soup': 'sopa', 'food-bread': 'pan',
    'food-cheese': 'queso', 'food-strawberry': 'fresa', 'food-grapes': 'uva',
    'food-eggs': 'huevo', 'food-cake': 'pastel', 'food-hungry': 'hambre',
    'food-yummy': 'delicioso',
    'food-blueberry': 'arandano', 'food-watermelon': 'sandia', 'food-orange': 'naranja',
    'food-pineapple': 'pina', 'food-mango': 'mango', 'food-peach': 'durazno', 'food-pear': 'pera',
    'food-broccoli': 'brocoli', 'food-carrots': 'zanahoria', 'food-corn': 'maiz',
    'food-peas': 'chicharos', 'food-green-beans': 'ejotes', 'food-potatoes': 'papa',
    'food-tomato': 'tomate', 'food-cucumber': 'pepino',
    'food-popcorn': 'palomitas', 'food-chips': 'papitas', 'food-pretzels': 'pretzels',
    'food-granola': 'granola', 'food-goldfish': 'galleta pescado',
    'food-peanut-butter': 'mani', 'food-jelly': 'mermelada',
    'food-applesauce': 'manzana pure',
    'food-mac-cheese': 'macarrones queso', 'food-hot-dog': 'hot dog',
    'food-hamburger': 'hamburguesa', 'food-taco': 'taco', 'food-meatballs': 'albondigas',
    'food-toast': 'tostada', 'food-oatmeal': 'avena', 'food-waffle': 'waffle',
    'drink-water': 'agua', 'drink-milk': 'leche', 'drink-choc-milk': 'chocolate',
    'drink-apple-juice': 'jugo', 'drink-orange-juice': 'naranja', 'drink-lemonade': 'limonada',
    'drink-hot-choc': 'chocolate', 'drink-smoothie': 'licuado', 'drink-thirsty': 'sed',
    'ppl-mom': 'mama', 'ppl-dad': 'papa', 'ppl-sister': 'hermana', 'ppl-brother': 'hermano',
    'ppl-grandma': 'abuela', 'ppl-grandpa': 'abuelo', 'ppl-teacher': 'profesora',
    'ppl-friend': 'amigo', 'ppl-baby': 'bebe',
    'ppl-doctor': 'doctor', 'ppl-me': 'yo', 'ppl-you': 'tu',
    'ppl-aunt': 'tia', 'ppl-uncle': 'tio', 'ppl-cousin': 'primo',
    'ppl-neighbor': 'vecino', 'ppl-therapist': 'terapeuta',
    'toy-ball': 'pelota', 'toy-blocks': 'bloques', 'toy-doll': 'muneca', 'toy-car': 'coche',
    'toy-train': 'tren', 'toy-puzzle': 'rompecabezas', 'toy-bubbles': 'burbujas',
    'toy-crayons': 'crayones', 'toy-book': 'libro', 'toy-tablet': 'tableta',
    'toy-swing': 'columpio', 'toy-slide': 'tobogan', 'toy-bike': 'bicicleta',
    'toy-teddy': 'oso de peluche', 'toy-playdoh': 'plastilina', 'toy-stickers': 'pegatina',
    'toy-lego': 'lego', 'toy-game': 'juego', 'toy-balloon': 'globo',
    'toy-trampoline': 'trampolin',
    'ani-fish': 'pez', 'ani-bird': 'pajaro', 'ani-horse': 'caballo',
    'ani-bunny': 'conejo', 'ani-bear': 'oso', 'ani-frog': 'rana',
    'ani-butterfly': 'mariposa', 'ani-dinosaur': 'dinosaurio', 'ani-elephant': 'elefante',
    'ani-monkey': 'mono', 'ani-duck': 'pato', 'ani-cow': 'vaca',
    'ani-pig': 'cerdo', 'ani-chicken': 'pollo', 'ani-snake': 'serpiente',
    'ani-turtle': 'tortuga',
    'desc-hot': 'caliente', 'desc-cold': 'fr\u00edo', 'desc-wet': 'mojado',
    'desc-dry': 'seco', 'desc-fast': 'r\u00e1pido', 'desc-slow': 'lento',
    'desc-loud': 'fuerte', 'desc-quiet': 'silencioso', 'desc-soft': 'suave',
    'desc-hard': 'duro', 'desc-tall': 'alto', 'desc-short': 'bajo',
    'desc-long': 'largo', 'desc-heavy': 'pesado', 'desc-light': 'ligero',
    'desc-full': 'lleno', 'desc-empty': 'vac\u00edo', 'desc-clean': 'limpio',
    'desc-dirty': 'sucio', 'desc-new': 'nuevo', 'desc-old': 'viejo',
    'desc-same': 'igual', 'desc-different': 'diferente', 'desc-broken': 'roto',
    'desc-yucky': 'asqueroso', 'desc-nice': 'bonito',
    'time-first': 'primero', 'time-then': 'entonces', 'time-next': 'siguiente',
    'time-last': '\u00faltimo', 'time-before': 'antes', 'time-after': 'despu\u00e9s',
    'time-now': 'ahora', 'time-later': 'm\u00e1s tarde', 'time-soon': 'pronto',
    'time-today': 'hoy', 'time-tomorrow': 'ma\u00f1ana', 'time-yesterday': 'ayer',
    'time-morning': 'ma\u00f1ana', 'time-afternoon': 'tarde', 'time-night': 'noche',
    'where-in': 'dentro', 'where-on': 'sobre', 'where-under': 'debajo',
    'where-behind': 'detr\u00e1s', 'where-next-to': 'al lado', 'where-up': 'arriba',
    'where-down': 'abajo', 'where-out': 'fuera', 'where-off': 'apagado',
    'where-over': 'encima', 'where-here': 'aqu\u00ed', 'where-there': 'all\u00ed',
    'where-away': 'lejos', 'where-between': 'entre',
    'nat-sun': 'sol', 'nat-rain': 'lluvia', 'nat-snow': 'nieve',
    'nat-cloud': 'nube', 'nat-wind': 'viento', 'nat-tree': '\u00e1rbol',
    'nat-flower': 'flor', 'nat-grass': 'pasto', 'nat-bug': 'bicho',
    'nat-rock': 'roca', 'nat-water': 'agua', 'nat-sky': 'cielo',
    'nat-moon': 'luna', 'nat-stars': 'estrellas',
    'sch-circle-time': 'circulo', 'sch-line-up': 'fila', 'sch-recess': 'recreo',
    'sch-art': 'arte', 'sch-music': 'musica', 'sch-story': 'cuento',
    'sch-lunch': 'almuerzo', 'sch-snack': 'merienda', 'sch-paint': 'pintar',
    'sch-glue': 'pegamento', 'sch-marker': 'marcador', 'sch-backpack': 'mochila',
    'sch-paper': 'papel', 'sch-helper': 'ayudante',
    // I Feel (Sensory/Regulation)
    'sense-hungry': 'hambre', 'sense-thirsty': 'sed', 'sense-hot': 'caliente',
    'sense-cold': 'frio', 'sense-tight': 'apretado', 'sense-shaky': 'temblar',
    'sense-too-fast': 'rapido', 'sense-too-close': 'cerca', 'sense-too-much': 'demasiado',
    'sense-stinky': 'oler', 'sense-need-squeeze': 'apretar abrazo',
    'sense-need-quiet': 'silencio', 'sense-need-space': 'espacio solo',
    'sense-want-hug': 'abrazo', 'sense-want-blanket': 'cobija manta',
    'sense-cover-ears': 'oidos tapar', 'sense-close-eyes': 'ojos cerrar',
    'sense-deep-breath': 'respirar profundo',
    // Quick Phrases
    'qp-potty': 'bano', 'qp-hurts': 'dolor', 'qp-dont-like': 'no gustar',
    'qp-stop-it': 'parar', 'qp-scared': 'miedo', 'qp-more-please': 'mas por favor',
    'qp-help-me': 'ayuda', 'qp-want-that': 'querer', 'qp-all-done': 'terminar',
    'qp-go-home': 'casa ir', 'qp-thank-you': 'gracias', 'qp-love-you': 'amor querer',
    'qp-play-with-me': 'jugar amigo', 'qp-need-break': 'descanso', 'qp-too-loud': 'fuerte ruido',
    'qp-like-that': 'gustar', 'qp-dont-want': 'no querer', 'qp-need-help': 'ayuda necesitar',
    'qp-hungry': 'hambre', 'qp-thirsty': 'sed', 'qp-not-feel-good': 'mal sentir',
    'qp-tired': 'cansado', 'qp-yes-please': 'si por favor', 'qp-no-thank-you': 'no gracias',
    'qp-wait-please': 'espera por favor', 'qp-want-mommy': 'querer mama', 'qp-want-daddy': 'querer papa',
    'qp-leave-alone': 'dejar solo', 'qp-look-at-this': 'mira esto', 'qp-want-hug': 'querer abrazo',
    'qp-where-going': 'donde ir', 'qp-thats-funny': 'gracioso',
    'act-chase': 'perseguir', 'act-hide': 'esconder', 'act-find': 'encontrar',
    'act-catch': 'atrapar', 'act-tickle': 'cosquillas', 'act-climb': 'trepar',
    'act-dig': 'cavar', 'act-pour': 'verter', 'act-blow': 'soplar',
    'act-say': 'decir', 'act-tell': 'contar', 'act-show': 'mostrar',
    'act-ask': 'preguntar', 'act-cook': 'cocinar', 'act-taste': 'probar',
    'act-cut': 'cortar', 'act-stir': 'revolver', 'act-bite': 'morder',
    'body-wash-hands': 'lavar manos', 'body-brush-teeth': 'cepillar dientes',
    'body-go-potty': 'bano', 'body-take-bath': 'banarse',
    'body-get-dressed': 'vestirse', 'body-put-on': 'ponerse',
    'body-take-off': 'quitarse', 'body-dry-off': 'secarse',
    'body-comb-hair': 'peinar', 'body-flush': 'cadena',
    'drink-grape-juice': 'jugo de uva', 'drink-straw-milk': 'leche de fresa',
    'drink-tea': 'te', 'drink-soda': 'refresco',
    // I Feel (Sensory/Regulation)
    'sense-hungry': 'hambriento', 'sense-thirsty': 'sediento',
    'sense-hot': 'calor', 'sense-cold': 'frio',
    'sense-tight': 'apretado', 'sense-shaky': 'tembloroso',
    'sense-too-fast': 'muy rapido', 'sense-too-close': 'muy cerca',
    'sense-too-much': 'demasiado', 'sense-stinky': 'apestoso',
    'sense-need-squeeze': 'necesito apretar', 'sense-need-quiet': 'necesito silencio',
    'sense-need-space': 'necesito espacio', 'sense-want-hug': 'quiero abrazo',
    'sense-want-blanket': 'quiero cobija', 'sense-cover-ears': 'tapar oidos',
    'sense-close-eyes': 'cerrar ojos', 'sense-deep-breath': 'respirar profundo',
    // Quick Phrases
    'qp-potty': 'necesito ir al bano', 'qp-hurts': 'me duele la panza',
    'qp-dont-like': 'no me gusta eso', 'qp-stop-it': 'para',
    'qp-scared': 'tengo miedo', 'qp-more-please': 'puedo tener mas',
    'qp-help-me': 'ayudame por favor', 'qp-want-that': 'quiero eso',
    'qp-all-done': 'ya termin\u00e9', 'qp-go-home': 'quiero ir a casa',
    'qp-thank-you': 'gracias', 'qp-love-you': 'te quiero',
    'qp-play-with-me': 'juega conmigo',
    'qp-need-break': 'necesito un descanso', 'qp-too-loud': 'esta muy fuerte',
    'qp-like-that': 'me gusta eso', 'qp-dont-want': 'no quiero eso',
    'qp-need-help': 'necesito ayuda', 'qp-hungry': 'tengo hambre',
    'qp-thirsty': 'tengo sed', 'qp-not-feel-good': 'no me siento bien',
    'qp-tired': 'estoy cansado', 'qp-yes-please': 'si por favor',
    'qp-no-thank-you': 'no gracias', 'qp-wait-please': 'espera por favor',
    'qp-want-mommy': 'quiero a mi mama', 'qp-want-daddy': 'quiero a mi papa',
    'qp-leave-alone': 'dejame solo', 'qp-look-at-this': 'mira esto',
    'qp-want-hug': 'puedo tener un abrazo', 'qp-where-going': 'a donde vamos',
    'qp-thats-funny': 'que gracioso',
    // Entertainment
    'ent-watch': 'ver', 'ent-movie': 'pelicula', 'ent-show': 'programa',
    'ent-video': 'video', 'ent-cartoon': 'caricatura', 'ent-music': 'musica',
    'ent-song': 'cancion', 'ent-remote': 'control',
    'ent-turn-on': 'prender', 'ent-turn-off': 'apagar', 'ent-pause': 'pausa',
    'ent-again': 'otra vez', 'ent-funny': 'gracioso', 'ent-scary': 'miedo',
    'ent-favorite': 'favorito', 'ent-this-one': 'este', 'ent-that-one': 'ese',
    'ent-different': 'diferente',
  },
  nounGender: {
    'food-apple': 'f', 'food-banana': 'm', 'food-cookie': 'f', 'food-crackers': 'f',
    'food-pizza': 'f', 'food-pasta': 'f', 'food-sandwich': 'm', 'food-rice': 'm',
    'food-soup': 'f', 'food-bread': 'm', 'food-cheese': 'm', 'food-strawberry': 'f',
    'food-grapes': 'f', 'food-eggs': 'm', 'food-cake': 'm', 'food-cereal': 'm',
    'food-yogurt': 'm', 'food-ice-cream': 'm', 'food-pancakes': 'm',
    'food-blueberry': 'm', 'food-watermelon': 'f', 'food-orange': 'f',
    'food-pineapple': 'f', 'food-mango': 'm', 'food-peach': 'm', 'food-pear': 'f',
    'food-broccoli': 'm', 'food-carrots': 'f', 'food-corn': 'm',
    'food-peas': 'm', 'food-green-beans': 'm', 'food-potatoes': 'f',
    'food-tomato': 'm', 'food-cucumber': 'm',
    'food-popcorn': 'f', 'food-chips': 'f', 'food-pretzels': 'm',
    'food-granola': 'f', 'food-goldfish': 'f',
    'food-peanut-butter': 'f', 'food-jelly': 'f', 'food-applesauce': 'm',
    'food-mac-cheese': 'm', 'food-hot-dog': 'm',
    'food-hamburger': 'f', 'food-taco': 'm', 'food-meatballs': 'f',
    'food-toast': 'f', 'food-oatmeal': 'f', 'food-waffle': 'm',
    'ent-movie': 'f', 'ent-show': 'm', 'ent-video': 'm',
    'ent-cartoon': 'f', 'ent-music': 'f', 'ent-song': 'f', 'ent-remote': 'm',
    'drink-water': 'f', 'drink-milk': 'f', 'drink-lemonade': 'f',
    'toy-ball': 'f', 'toy-doll': 'f', 'toy-car': 'm', 'toy-train': 'm',
    'toy-book': 'm', 'toy-bike': 'f', 'toy-balloon': 'm',
    'thg-cup': 'm', 'thg-plate': 'm', 'thg-spoon': 'f', 'thg-fork': 'm',
    'thg-blanket': 'f', 'thg-pillow': 'f', 'thg-towel': 'f', 'thg-backpack': 'f',
    'thg-phone': 'm', 'thg-pencil': 'm', 'thg-paper': 'm', 'thg-light': 'f',
  },
  verbForms: {
    'querer':    { yo: 'quiero',    third: 'quiere',     past: 'quiso' },
    'necesitar': { yo: 'necesito',  third: 'necesita',   past: 'necesito' },
    'comer':     { yo: 'como',      third: 'come',       past: 'comio' },
    'beber':     { yo: 'bebo',      third: 'bebe',       past: 'bebio' },
    'jugar':     { yo: 'juego',     third: 'juega',      past: 'jugo' },
    'leer':      { yo: 'leo',       third: 'lee',        past: 'leyo' },
    'correr':    { yo: 'corro',     third: 'corre',      past: 'corrio' },
    'saltar':    { yo: 'salto',     third: 'salta',      past: 'salto' },
    'sentarse':  { yo: 'me siento', third: 'se sienta',  past: 'se sento' },
    'pararse':   { yo: 'me paro',   third: 'se para',    past: 'se paro' },
    'caminar':   { yo: 'camino',    third: 'camina',     past: 'camino' },
    'dormir':    { yo: 'duermo',    third: 'duerme',     past: 'durmio' },
    'lavar':     { yo: 'lavo',      third: 'lava',       past: 'lavo' },
    'abrir':     { yo: 'abro',      third: 'abre',       past: 'abrio' },
    'cerrar':    { yo: 'cierro',    third: 'cierra',     past: 'cerro' },
    'empujar':   { yo: 'empujo',    third: 'empuja',     past: 'empujo' },
    'jalar':     { yo: 'jalo',      third: 'jala',       past: 'jalo' },
    'dar':       { yo: 'doy',       third: 'da',         past: 'dio' },
    'escuchar':  { yo: 'escucho',   third: 'escucha',    past: 'escucho' },
    'dibujar':   { yo: 'dibujo',    third: 'dibuja',     past: 'dibujo' },
    'cantar':    { yo: 'canto',     third: 'canta',      past: 'canto' },
    'bailar':    { yo: 'bailo',     third: 'baila',      past: 'bailo' },
    'abrazar':   { yo: 'abrazo',    third: 'abraza',     past: 'abrazo' },
    'tirar':     { yo: 'tiro',      third: 'tira',       past: 'tiro' },
    'compartir': { yo: 'comparto',  third: 'comparte',   past: 'compartio' },
    'construir': { yo: 'construyo', third: 'construye',  past: 'construyo' },
    'ir':        { yo: 'voy',       third: 'va',         past: 'fue' },
    'parar':     { yo: 'paro',      third: 'para',       past: 'paro' },
    'esperar':   { yo: 'espero',    third: 'espera',     past: 'espero' },
    'mirar':     { yo: 'miro',      third: 'mira',       past: 'miro' },
  },
  pluralOverrides: {
    'lapiz': 'lapices', 'pez': 'peces', 'luz': 'luces', 'vez': 'veces',
  },
  uncountable: new Set([
    'agua', 'leche', 'arroz', 'pan', 'queso', 'sopa', 'cereal',
    'yogur', 'pasta', 'medicina', 'jabon', 'papel', 'helado',
    'leche con chocolate', 'jugo de manzana', 'jugo de naranja',
    'chocolate caliente', 'limonada', 'plastilina', 'sed', 'hambre'
  ]),
  uiStrings: {
    'tab.talk': 'Hablar',
    'tab.insights': 'Datos',
    'settings.title': 'Ajustes',
    'settings.buttons': 'Botones', 'settings.addButton': 'Agregar un boton a la vista actual',
    'settings.quickPhoto': 'Agregar rapido con foto',
    'settings.editHint': 'Toca cualquier boton del tablero para editarlo mientras el modo padre esta activo.',
    'settings.voice': 'Voz', 'settings.chooseVoice': 'Elegir voz',
    'settings.slowerVoice': 'Voz mas lenta', 'settings.fasterVoice': 'Voz mas rapida',
    'settings.lowerPitch': 'Tono mas bajo', 'settings.higherPitch': 'Tono mas alto',
    'settings.testVoice': 'Probar voz',
    'settings.gridSize': 'Tamano de cuadricula',
    'settings.language': 'Idioma',
    'settings.languageHint': 'Cambia el idioma del tablero. "Both" muestra ingles y espanol en cada boton.',
    'settings.grammar': 'Asistencia gramatical',
    'settings.grammarHint': 'La gramatica solo afecta la voz. Las etiquetas de botones no cambian.',
    'settings.plurals': 'Auto-plurales',
    'settings.verbs': 'Formas verbales',
    'settings.articles': 'Agregar articulos',
    'settings.symbols': 'Simbolos',
    'settings.redownload': 'Re-descargar simbolos de ARASAAC',
    'settings.symbolsHint': 'Descarga simbolos pictograficos AAC para todos los botones. Requiere internet.',
    'settings.sensory': 'Preferencias sensoriales',
    'settings.reducedMotion': 'Reducir movimiento',
    'settings.reducedMotionHint': 'Minimiza animaciones y movimiento en la app.',
    'settings.highContrast': 'Alto contraste',
    'settings.highContrastHint': 'Colores mas fuertes y bordes para legibilidad.',
    'settings.quietMode': 'Modo silencioso',
    'settings.quietModeHint': 'Silencia sonidos y efectos. La voz no se afecta.',
    'settings.predictions': 'Predicciones',
    'settings.autoSpeak': 'Auto-hablar oraciones',
    'settings.autoSpeakHint': 'Cuando esta activo, tocar un sustantivo en predicciones habla la oracion completa.',
    'settings.resetPredictions': 'Reiniciar predicciones aprendidas',
    'settings.resetPredictionsHint': 'Borra datos de prediccion. Util cuando cambias de usuario.',
    'settings.data': 'Datos',
    'settings.resetDefaults': 'Reiniciar todo a valores predeterminados',
    'settings.done': 'Listo',
    'edit.title': 'Editar Boton', 'edit.label': 'Palabra / Etiqueta',
    'edit.labelEs': 'Etiqueta en espanol',
    'edit.color': 'Color', 'edit.image': 'Imagen',
    'edit.upload': 'Subir Imagen', 'edit.camera': 'Tomar Foto',
    'edit.symbols': 'Buscar Simbolos', 'edit.removeImage': 'Quitar Imagen',
    'edit.cancel': 'Cancelar', 'edit.delete': 'Eliminar', 'edit.save': 'Guardar',
    'symbol.title': 'Buscar Simbolos', 'symbol.cancel': 'Cancelar',
    'symbol.searchHint': 'Busca un simbolo por nombre',
    'toast.buttonSaved': 'Boton guardado', 'toast.buttonDeleted': 'Boton eliminado',
    'toast.imageRemoved': 'Imagen eliminada', 'toast.predictionsReset': 'Predicciones reiniciadas',
    'toast.usageCleared': 'Datos de uso borrados', 'toast.resetDefaults': 'Reiniciado a valores predeterminados',
    'toast.symbolsReady': 'Simbolos listos!', 'toast.symbolFailed': 'Error al descargar simbolos. Intenta desde Ajustes.',
    'toast.csvExported': 'CSV exportado', 'toast.noData': 'No hay datos para exportar',
    'toast.downloading': 'Descargando simbolos...',
    'confirm.gridSwitch': 'Cambiar a {name}? Esto reiniciara tus botones a los predeterminados. Los botones personalizados se perderan.',
    'confirm.resetPredictions': 'Reiniciar todas las predicciones aprendidas? Esto no se puede deshacer.',
    'confirm.clearUsage': 'Borrar todos los datos de uso? Esto no se puede deshacer.',
    'confirm.resetDefaults': 'Reiniciar todos los botones a valores predeterminados? Tus imagenes y ediciones se perderan.',
    'confirm.deleteButton': 'Eliminar este boton?',
    'parentMode.unlock': 'Desbloquear modo padre', 'parentMode.lock': 'Bloquear modo padre',
    'parentMode.unlocked': 'Modo padre desbloqueado', 'parentMode.locked': 'Modo padre bloqueado (tiempo)',
    'search.noMatches': 'No se encontraron coincidencias',
    'noVoices': 'No se encontraron voces en espanol',
    'speed.slow': 'Velocidad: lenta', 'speed.normal': 'Velocidad: normal',
    'speed.fast': 'Velocidad: rapida', 'speed.veryFast': 'Velocidad: muy rapida',
    'pitch.veryLow': 'Tono: muy bajo', 'pitch.low': 'Tono: bajo',
    'pitch.normal': 'Tono: normal', 'pitch.high': 'Tono: alto', 'pitch.veryHigh': 'Tono: muy alto',
    'grid.1': 'Primeras Palabras', 'grid.1.desc': 'Una gran palabra, un gran momento',
    'grid.21': 'Esto o Eso', 'grid.21.desc': 'Eligiendo entre dos',
    'grid.2': 'Mis Favoritos', 'grid.2.desc': 'Algunos favoritos para empezar',
    'grid.3': 'Hablemos', 'grid.3.desc': 'Pidiendo lo que necesito',
    'grid.4': 'Mas que Decir', 'grid.4.desc': 'Construyendo oraciones a mi manera',
    'grid.5': 'Gran Hablador', 'grid.5.desc': 'Muchas palabras para elegir',
    'grid.6': 'Parlanchin', 'grid.6.desc': 'Tanto que decir!',
  },
}; }

function t(key, fallback) {
  if (currentLang === 'en') return fallback;
  return getLangEs().uiStrings[key] || fallback;
}

function getDisplayLabel(btn) {
  const esLabel = getLangEs().labels[btn.id];
  if (currentLang === 'en') return btn.label;
  // Check for custom Spanish label
  const customEs = getCustomEsLabels();
  if (customEs[btn.id]) {
    if (currentLang === 'es') return customEs[btn.id];
    if (currentLang === 'both') return btn.label + '\n' + customEs[btn.id];
  }
  if (currentLang === 'es') return esLabel || btn.label;
  if (currentLang === 'both') return esLabel ? btn.label + '\n' + esLabel : btn.label;
  return btn.label;
}

function getSpeakLabel(btn) {
  if (currentLang === 'en') return btn.label;
  const customEs = getCustomEsLabels();
  if (customEs[btn.id]) return customEs[btn.id];
  return getLangEs().labels[btn.id] || btn.label;
}

function getPrimaryLabel(btn) {
  if (currentLang === 'en') return btn.label;
  return getLangEs().labels[btn.id] || btn.label;
}

function getSecondaryLabel(btn) {
  if (currentLang !== 'both') return null;
  return getLangEs().labels[btn.id] || null;
}

function getCustomEsLabels() {
  try { return JSON.parse(localStorage.getItem('aac-custom-es-labels') || '{}'); }
  catch { return {}; }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('aac-language', lang);
  document.documentElement.lang = (lang === 'es') ? 'es' : 'en';
  document.documentElement.classList.toggle('lang-es', lang === 'es' || lang === 'both');
  messageWords = [];
  messageButtonIds = [];
  renderMessage();
  renderGrid();
  updateUIStrings();
  updateLanguageButtons();
  initSpeech();
}

function updateLanguageButtons() {
  document.querySelectorAll('.lang-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
}

function updateUIStrings() {
  // Tab titles
  const tabTitles = {
    'tab-talk': t('tab.talk', 'Talk'),
    'tab-activities': 'Activities',
  };
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const label = btn.querySelector('.tab-label');
    if (label && tabTitles[btn.id]) label.textContent = tabTitles[btn.id];
  });
  // Update active header title
  const activeTabId = 'tab-' + activeTab;
  if (tabTitles[activeTabId]) {
    document.getElementById('app-header-title').textContent = tabTitles[activeTabId];
  }
  // Settings text - only update elements with data-t attributes
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const original = el.getAttribute('data-t-original');
    if (!original) el.setAttribute('data-t-original', el.textContent);
    el.textContent = t(key, el.getAttribute('data-t-original'));
  });
  // Grid size dropdown options
  const gridOpts = [
    { val: '1', label: t('grid.1', 'First Words'), dim: '1x1' },
    { val: '21', label: t('grid.21', 'This or That'), dim: '2x1' },
    { val: '2', label: t('grid.2', 'My Picks'), dim: '2x2' },
    { val: '3', label: t('grid.3', 'Let\'s Talk'), dim: '3x3' },
    { val: '4', label: t('grid.4', 'More to Say'), dim: '4x4' },
    { val: '5', label: t('grid.5', 'Big Talker'), dim: '5x5' },
    { val: '6', label: t('grid.6', 'Chatterbox'), dim: '6x6' },
  ];
  document.querySelectorAll('.grid-size-select').forEach(sel => {
    gridOpts.forEach(o => {
      const opt = sel.querySelector(`option[value="${o.val}"]`);
      if (opt) opt.textContent = `${o.label} (${o.dim})`;
    });
  });
}
