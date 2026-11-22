/* ===== Ribbon definition (Arabic Word 365) =====
   item kinds:
   {id,label,icon,big:1,dd}   big button (dd = menu spec -> dropdown)
   {col:[...]}                column of small buttons (label shown)
   {rows:[[...],[...]]}       rows of icon-only small buttons / selects
   {id,select:[...],w}        select box
   {id,check:1,label}         checkbox
   {id,num:1,label,unit,w}    number input
   {id,gallery:'name'}        inline gallery
*/
const SW=(id,extra=[])=>'colors:'+id+(extra.length?'|'+extra.join(','):'');
const RIBBON={
 home:{label:'الصفحة الرئيسية',groups:[
  {label:'الحافظة',items:[
   {id:'paste',label:'لصق',icon:'paste',big:1,dd:[{id:'paste',arg:'keep',label:'الاحتفاظ بتنسيق المصدر',icon:'paste'},{id:'paste',arg:'merge',label:'دمج التنسيق',icon:'paste'},{id:'paste',arg:'text',label:'الاحتفاظ بالنص فقط',icon:'paste'}],split:1},
   {col:[{id:'cut',label:'قص',icon:'cut'},{id:'copy',label:'نسخ',icon:'copy'},{id:'painter',label:'نسخ التنسيق',icon:'painter'}]}]},
  {label:'خط',items:[{rows:[
   [{id:'fontName',select:['Arial','Times New Roman','Simplified Arabic','Traditional Arabic','Sakkal Majalla','Calibri','Tahoma','Cambria'],w:132},
    {id:'fontSize',select:['8','9','10','11','12','14','16','18','20','22','24','26','28','36','48','72'],w:50},
    {id:'grow',icon:'grow',tip:'تكبير حجم الخط'},{id:'shrink',icon:'shrink',tip:'تصغير حجم الخط'},{id:'clearfmt',icon:'clearfmt',tip:'مسح كل التنسيقات'}],
   [{id:'bold',icon:'bold',tip:'غامق (Ctrl+B)'},{id:'italic',icon:'italic',tip:'مائل (Ctrl+I)'},{id:'underline',icon:'underline',tip:'تسطير (Ctrl+U)',dd:'underline',split:1},
    {id:'strike',icon:'strike',tip:'يتوسطه خط'},{id:'sub',icon:'sub',tip:'منخفض'},{id:'sup',icon:'sup',tip:'مرتفع'},
    {id:'textfx',icon:'effects',tip:'تأثيرات النص والطباعة',dd:'textfx'},{id:'highlight',icon:'highlight',tip:'لون تمييز النص',dd:SW('highlight',['none:بلا لون']),split:1},
    {id:'fontcolor',icon:'fontcolor',tip:'لون الخط',dd:SW('fontcolor',['auto:تلقائي']),split:1}]]}]},
  {label:'فقرة',items:[{rows:[
   [{id:'bullets',icon:'bullets',tip:'تعداد نقطي',dd:'bullets',split:1},{id:'numbering',icon:'numbering',tip:'تعداد رقمي',dd:'numbering',split:1},{id:'multilevel',icon:'multilevel',tip:'قائمة متعددة المستويات',dd:'multilevel'},
    {id:'indentDec',icon:'indentDec',tip:'إنقاص المسافة البادئة'},{id:'indentInc',icon:'indentInc',tip:'زيادة المسافة البادئة'},{id:'sort',icon:'sort',tip:'فرز'},{id:'marks',icon:'pilcrow',tip:'إظهار/إخفاء علامات التنسيق ¶'}],
   [{id:'alignR',icon:'alignR',tip:'محاذاة إلى اليمين (Ctrl+R)'},{id:'alignC',icon:'alignC',tip:'توسيط (Ctrl+E)'},{id:'alignL',icon:'alignL',tip:'محاذاة إلى اليسار (Ctrl+L)'},{id:'justify',icon:'justify',tip:'ضبط (Ctrl+J)'},
    {id:'rtl',icon:'rtl',tip:'اتجاه النص من اليمين إلى اليسار'},{id:'ltr',icon:'ltr',tip:'اتجاه النص من اليسار إلى اليمين'},
    {id:'linespacing',icon:'linespacing',tip:'تباعد الأسطر والفقرات',dd:'linespacing'},{id:'pshading',icon:'shading',tip:'تظليل',dd:SW('pshading',['none:بلا لون']),split:1},{id:'pborders',icon:'borders',tip:'حدود',dd:'pborders',split:1}]]}]},
  {label:'أنماط',items:[{id:'styles',gallery:'styles'}]},
  {label:'تحرير',items:[{col:[{id:'find',label:'بحث',icon:'find',dd:[{id:'find',label:'بحث',icon:'find'},{id:'replace',label:'بحث متقدم...',icon:'find'},{id:'nav',arg:'on',label:'انتقال إلى...',icon:'navpane'}],split:1},{id:'replace',label:'استبدال',icon:'replace'},{id:'select',label:'تحديد',icon:'select',dd:[{id:'selectAll',label:'تحديد الكل',icon:'select'},{id:'selectObjects',label:'تحديد كائنات',icon:'select'},{id:'selPane',label:'جزء التحديد...',icon:'selpane'}]}]}]},
  {label:'صوت',items:[{id:'dictate',label:'إملاء',icon:'dictate',big:1}]},
  {label:'المحرر',items:[{id:'editor',label:'المحرر',icon:'editor',big:1}]},
 ]},
 insert:{label:'إدراج',groups:[
  {label:'صفحات',items:[{col:[{id:'cover',label:'صفحة غلاف',icon:'cover',dd:'covers'},{id:'blankPage',label:'صفحة فارغة',icon:'blankpage'},{id:'pageBreak',label:'فاصل صفحات',icon:'pagebreak'}]}]},
  {label:'جداول',items:[{id:'table',label:'جدول',icon:'table',big:1,dd:'tablegrid'}]},
  {label:'رسومات توضيحية',items:[
   {id:'pictures',label:'صور',icon:'pictures',big:1,dd:'pictures'},{id:'shapes',label:'أشكال',icon:'shapes',big:1,dd:'shapes'},{id:'icons',label:'أيقونات',icon:'icons',big:1},
   {col:[{id:'smartart',label:'SmartArt',icon:'smartart'},{id:'chart',label:'مخطط',icon:'chart'},{id:'screenshot',label:'لقطة شاشة',icon:'screenshot',dd:[{id:'screenshot',label:'قص الشاشة',icon:'screenshot'}]}]}]},
  {label:'ارتباطات',items:[{col:[{id:'link',label:'ارتباط',icon:'link'},{id:'bookmark',label:'إشارة مرجعية',icon:'bookmark'},{id:'crossref',label:'إسناد ترافقي',icon:'link'}]}]},
  {label:'تعليقات',items:[{id:'insComment',label:'تعليق',icon:'comment',big:1}]},
  {label:'رأس وتذييل',items:[{col:[{id:'header',label:'رأس الصفحة',icon:'header',dd:'headers'},{id:'footer',label:'تذييل الصفحة',icon:'footer',dd:'footers'},{id:'pagenum',label:'رقم الصفحة',icon:'pagenum',dd:'pagenums'}]}]},
  {label:'نص',items:[{id:'textbox',label:'مربع نص',icon:'textbox',big:1,dd:'textboxes'},
   {col:[{id:'quickparts',label:'أجزاء سريعة',icon:'quickparts'},{id:'wordart',label:'WordArt',icon:'wordart',dd:'wordart'},{id:'dropcap',label:'إسقاط الأحرف الاستهلالية',icon:'dropcap',dd:[{id:'dropcap',arg:'none',label:'بلا'},{id:'dropcap',arg:'drop',label:'مسقط'}]}]},
   {col:[{id:'sigline',label:'سطر التوقيع',icon:'pen'},{id:'datetime',label:'التاريخ والوقت',icon:'datetime'},{id:'object',label:'كائن',icon:'object'}]}]},
  {label:'رموز',items:[{id:'equation',label:'معادلة',icon:'equation',big:1,dd:'equations',split:1},{id:'symbol',label:'رمز',icon:'symbol',big:1,dd:'symbols'}]},
 ]},
 draw:{label:'رسم',groups:[
  {label:'أدوات الرسم',items:[{id:'drawSelect',label:'تحديد',icon:'select',big:1},{id:'lasso',label:'تحديد حر',icon:'lasso',big:1},{id:'pen1',label:'قلم',icon:'pen',big:1},{id:'pen2',label:'قلم رصاص',icon:'pencil',big:1},{id:'pen3',label:'قلم تمييز',icon:'marker',big:1},{id:'eraser2',label:'ممحاة',icon:'eraser',big:1}]},
  {label:'تحويل',items:[{id:'inkShape',label:'الحبر إلى شكل',icon:'inktoshape',big:1},{id:'inkMath',label:'الحبر إلى رياضيات',icon:'inkeq',big:1}]},
 ]},
 design:{label:'تصميم',groups:[
  {label:'تنسيق المستند',items:[{id:'themes',label:'نُسُق',icon:'themes',big:1,dd:'themes'},{id:'stylesets',gallery:'stylesets'},
   {id:'docColors',label:'ألوان',icon:'colors',big:1,dd:'docColors'},{id:'docFonts',label:'خطوط',icon:'fonts',big:1,dd:'docFonts'},
   {col:[{id:'paraspacing',label:'تباعد الفقرات',icon:'paraspacing',dd:[{id:'paraspacing',arg:'0',label:'بلا تباعد بين الفقرات'},{id:'paraspacing',arg:'8',label:'افتراضي'},{id:'paraspacing',arg:'16',label:'مفتوح'}]},{id:'docEffects',label:'تأثيرات',icon:'effectsDoc'},{id:'setDefault',label:'تعيين كافتراضي',icon:'setdefault'}]}]},
  {label:'خلفية الصفحة',items:[{id:'watermark',label:'علامة مائية',icon:'watermark',big:1,dd:'watermarks'},{id:'pageColor',label:'لون الصفحة',icon:'pagecolor',big:1,dd:SW('pageColor',['none:بلا لون'])},{id:'pageBorders',label:'حدود الصفحة',icon:'pageborders',big:1}]},
 ]},
 layout:{label:'تخطيط',groups:[
  {label:'إعداد الصفحة',items:[{id:'margins',label:'الهوامش',icon:'margins',big:1,dd:'margins'},{id:'orient',label:'الاتجاه',icon:'orientation',big:1,dd:'orient'},{id:'psize',label:'الحجم',icon:'size',big:1,dd:'psize'},{id:'columns',label:'أعمدة',icon:'columns',big:1,dd:'columns'},
   {col:[{id:'breaks',label:'فواصل',icon:'breaks',dd:'breaks'},{id:'lineNums',label:'أرقام الأسطر',icon:'linenumbers',dd:[{id:'lineNums',arg:'none',label:'بلا'},{id:'lineNums',arg:'cont',label:'مستمر'},{id:'lineNums',arg:'page',label:'إعادة البدء في كل صفحة'}]},{id:'hyphen',label:'الواصلة',icon:'hyphen',dd:[{id:'hyphen',label:'بلا'},{id:'hyphen',label:'تلقائي'}]}]}]},
  {label:'فقرة',items:[{col:[{id:'indentRight',num:1,label:'المسافة البادئة — يمين',unit:'سم',w:52},{id:'indentLeft',num:1,label:'المسافة البادئة — يسار',unit:'سم',w:52}]},{col:[{id:'spBefore',num:1,label:'التباعد — قبل',unit:'نقطة',w:52},{id:'spAfter',num:1,label:'التباعد — بعد',unit:'نقطة',w:52}]}]},
  {label:'ترتيب',items:[{id:'position',label:'الموضع',icon:'position',big:1,dd:'position'},{id:'wrap',label:'التفاف النص',icon:'wrap',big:1,dd:'wrap'},{id:'forward',label:'إحضار للأمام',icon:'forward',big:1},{id:'backward',label:'إرسال للخلف',icon:'backward',big:1},{col:[{id:'selPane',label:'جزء التحديد',icon:'selpane'},{id:'alignObj',label:'محاذاة',icon:'align',dd:'alignObj'},{id:'rotate',label:'تدوير',icon:'rotate',dd:'rotate'}]}]},
 ]},
 refs:{label:'مراجع',groups:[
  {label:'جدول المحتويات',items:[{id:'toc',label:'جدول المحتويات',icon:'toc',big:1,dd:'tocs'},{col:[{id:'addText',label:'إضافة نص',icon:'addtext',dd:[{id:'addText',arg:'0',label:'عدم الإظهار في جدول المحتويات'},{id:'addText',arg:'1',label:'مستوى 1'},{id:'addText',arg:'2',label:'مستوى 2'}]},{id:'updateToc',label:'تحديث الجدول',icon:'updatetable'}]}]},
  {label:'حواشي سفلية',items:[{id:'footnote',label:'إدراج حاشية سفلية',icon:'footnote',big:1},{col:[{id:'endnote',label:'إدراج تعليق ختامي',icon:'endnote'},{id:'nextNote',label:'الحاشية السفلية التالية',icon:'nextnote',dd:[{id:'nextNote',arg:'fn',label:'الحاشية السفلية التالية'},{id:'nextNote',arg:'fnPrev',label:'الحاشية السفلية السابقة'},{id:'nextNote',arg:'en',label:'التعليق الختامي التالي'}]},{id:'showNotes',label:'إظهار الملاحظات',icon:'shownotes'}]}]},
  {label:'الاقتباسات والمراجع',items:[{id:'citation',label:'إدراج اقتباس',icon:'citation',big:1},{col:[{id:'sources',label:'إدارة المصادر',icon:'properties'},{id:'citeStyle',label:'النمط: APA',icon:'properties'},{id:'biblio',label:'قائمة المراجع',icon:'toc'}]}]},
  {label:'تسميات توضيحية',items:[{id:'caption',label:'إدراج تسمية توضيحية',icon:'caption',big:1}]},
  {label:'فهرس',items:[{id:'markEntry',label:'وضع علامة على إدخال',icon:'index',big:1}]},
 ]},
 mail:{label:'مراسلات',groups:[
  {label:'إنشاء',items:[{id:'envelopes',label:'مغلفات',icon:'envelope',big:1},{id:'labels',label:'تسميات',icon:'labels',big:1}]},
  {label:'بدء دمج المراسلات',items:[{id:'startMerge',label:'بدء دمج المراسلات',icon:'mailmerge',big:1},{id:'recipients',label:'تحديد المستلمين',icon:'recipients',big:1},{id:'editList',label:'تحرير قائمة المستلمين',icon:'properties',big:1}]},
  {label:'كتابة وإدراج حقول',items:[{id:'mergeField',label:'إدراج حقل دمج',icon:'field',big:1}]},
  {label:'معاينة النتائج',items:[{id:'previewRes',label:'معاينة النتائج',icon:'preview',big:1}]},
  {label:'إنهاء',items:[{id:'finishMerge',label:'إنهاء ودمج',icon:'finish',big:1}]},
 ]},
 review:{label:'مراجعة',groups:[
  {label:'تدقيق',items:[{id:'spelling',label:'تدقيق إملائي ونحوي',icon:'spelling',big:1},{col:[{id:'thesaurus',label:'قاموس المرادفات',icon:'thesaurus'},{id:'wordCount',label:'عدد الكلمات',icon:'wordcount'}]}]},
  {label:'كلام',items:[{id:'readAloud',label:'قراءة بصوت عالٍ',icon:'readaloud',big:1}]},
  {label:'لغة',items:[{id:'translate',label:'ترجمة',icon:'translate',big:1},{id:'language',label:'اللغة',icon:'language',big:1}]},
  {label:'تعليقات',items:[{id:'newComment',label:'تعليق جديد',icon:'newcomment',big:1},{col:[{id:'delComment',label:'حذف',icon:'delete',dd:[{id:'delComment',arg:'one',label:'حذف',icon:'delete'},{id:'delComment',arg:'all',label:'حذف كل التعليقات في المستند',icon:'delete'}],split:1},{id:'prevComment',label:'السابق',icon:'prev'},{id:'nextComment',label:'التالي',icon:'next'}]},{id:'showComments',label:'إظهار التعليقات',icon:'showcomments',big:1}]},
  {label:'تعقب',items:[{id:'track',label:'تعقب التغييرات',icon:'track',big:1}]},
  {label:'تغييرات',items:[{id:'accept',label:'قبول',icon:'accept',big:1},{id:'reject',label:'رفض',icon:'reject',big:1}]},
  {label:'مقارنة',items:[{id:'compareDocs',label:'مقارنة',icon:'compare',big:1}]},
  {label:'حماية',items:[{id:'protect',label:'تقييد التحرير',icon:'protect',big:1}]},
 ]},
 view:{label:'عرض',groups:[
  {label:'طرق العرض',items:[{id:'readMode',label:'وضع القراءة',icon:'readmode',big:1},{id:'printLayout',label:'تخطيط الطباعة',icon:'printlayout',big:1},{id:'webLayout',label:'تخطيط ويب',icon:'weblayout',big:1},{col:[{id:'outlineView',label:'المخطط التفصيلي',icon:'outline'},{id:'draftView',label:'مسودة',icon:'draft'}]}]},
  {label:'إظهار',items:[{col:[{id:'ruler',check:1,label:'المسطرة'},{id:'gridlines',check:1,label:'خطوط الشبكة'},{id:'nav',check:1,label:'جزء التنقل'}]}]},
  {label:'تكبير/تصغير',items:[{id:'zoomDlg',label:'تكبير/تصغير',icon:'zoom',big:1},{id:'zoom100',label:'100%',icon:'zoom100',big:1},{col:[{id:'onePage',label:'صفحة واحدة',icon:'onepage'},{id:'multiPage',label:'صفحات متعددة',icon:'multipage'},{id:'pageWidth',label:'عرض الصفحة',icon:'pagewidth'}]}]},
  {label:'نافذة',items:[{id:'newWindow',label:'نافذة جديدة',icon:'newwindow',big:1},{id:'arrangeAll',label:'ترتيب الكل',icon:'arrange',big:1},{id:'splitWin',label:'انقسام',icon:'split',big:1},{id:'switchWin',label:'تبديل النوافذ',icon:'switchwin',big:1}]},
  {label:'وحدات الماكرو',items:[{id:'macros',label:'وحدات ماكرو',icon:'macros',big:1}]},
 ]},
 help:{label:'تعليمات',groups:[
  {label:'تعليمات',items:[{id:'helpBtn',label:'تعليمات',icon:'help',big:1},{id:'feedback',label:'ملاحظات',icon:'feedback',big:1},{id:'training',label:'إظهار التدريب',icon:'training',big:1}]},
 ]},
 /* ---------- contextual ---------- */
 tdesign:{label:'تصميم الجدول',ctx:'table',groups:[
  {label:'خيارات أنماط الجداول',items:[{col:[{id:'optHeader',check:1,label:'صف الرأس'},{id:'optTotal',check:1,label:'صف الإجمالي'},{id:'optBanded',check:1,label:'صفوف ذات نطاقات'}]},{col:[{id:'optFirstCol',check:1,label:'العمود الأول'},{id:'optLastCol',check:1,label:'العمود الأخير'},{id:'optBandCols',check:1,label:'أعمدة ذات نطاقات'}]}]},
  {label:'أنماط الجداول',items:[{id:'tstyles',gallery:'tstyles'},{id:'shading',label:'تظليل',icon:'shading',big:1,dd:SW('shading',['none:بلا لون'])}]},
  {label:'حدود',items:[{col:[{id:'penStyle',label:'نمط الخط',icon:'penstyle',dd:[{id:'penStyle',arg:'solid',label:'────── مفرد'},{id:'penStyle',arg:'dashed',label:'- - - - متقطع'},{id:'penStyle',arg:'double',label:'══════ مزدوج'}]},{id:'penWeight',label:'سُمك القلم',icon:'penweight',dd:[{id:'penWeight',arg:'1',label:'½ نقطة'},{id:'penWeight',arg:'2',label:'1½ نقطة'},{id:'penWeight',arg:'3',label:'2¼ نقطة'},{id:'penWeight',arg:'4',label:'3 نقاط'}]},{id:'penColor',label:'لون القلم',icon:'pencolor',dd:SW('penColor')}]},
   {id:'tborders',label:'حدود',icon:'borders',big:1,dd:'tborders'},{id:'borderPainter',label:'نسخ تنسيق الحدود',icon:'borderpainter',big:1}]},
 ]},
 tlayout:{label:'تخطيط',ctx:'table',groups:[
  {label:'جدول',items:[{col:[{id:'tselect',label:'تحديد',icon:'selecttbl',dd:[{id:'tselect',arg:'cell',label:'تحديد خلية'},{id:'tselect',arg:'col',label:'تحديد عمود'},{id:'tselect',arg:'row',label:'تحديد صف'},{id:'tselect',arg:'table',label:'تحديد الجدول'}]},{id:'viewGrid',label:'عرض خطوط الشبكة',icon:'viewgrid'},{id:'tprops',label:'خصائص',icon:'properties'}]}]},
  {label:'رسم',items:[{id:'drawTable',label:'رسم جدول',icon:'drawtable',big:1},{id:'eraser',label:'ممحاة',icon:'eraser',big:1}]},
  {label:'صفوف وأعمدة',items:[{id:'tdelete',label:'حذف',icon:'deltable',big:1,dd:[{id:'tdel',arg:'cells',label:'حذف خلايا...',icon:'deltable'},{id:'tdel',arg:'col',label:'حذف أعمدة',icon:'deltable'},{id:'tdel',arg:'row',label:'حذف صفوف',icon:'deltable'},{id:'tdel',arg:'table',label:'حذف جدول',icon:'deltable'}]},
   {id:'insAbove',label:'إدراج أعلى',icon:'insAbove',big:1},{id:'insBelow',label:'إدراج أسفل',icon:'insBelow',big:1},{id:'insRight',label:'إدراج إلى اليمين',icon:'insRight',big:1},{id:'insLeft',label:'إدراج إلى اليسار',icon:'insLeft',big:1}]},
  {label:'دمج',items:[{col:[{id:'merge',label:'دمج الخلايا',icon:'mergecells'},{id:'splitCells',label:'تقسيم الخلايا',icon:'splitcells'},{id:'splitTable',label:'تقسيم الجدول',icon:'splittable'}]}]},
  {label:'حجم الخلية',items:[{id:'autofit',label:'احتواء تلقائي',icon:'autofit',big:1,dd:[{id:'autofit',arg:'content',label:'احتواء تلقائي للمحتويات'},{id:'autofit',arg:'window',label:'احتواء تلقائي للإطار'},{id:'autofit',arg:'fixed',label:'عرض عمود ثابت'}]},{col:[{id:'rowH',num:1,label:'الارتفاع',unit:'سم',w:52},{id:'colW',num:1,label:'العرض',unit:'سم',w:52}]},{col:[{id:'distRows',label:'توزيع الصفوف',icon:'distrows'},{id:'distCols',label:'توزيع الأعمدة',icon:'distcols'}]}]},
  {label:'محاذاة',items:[{rows:[[{id:'calign',arg:'top-right',icon:'cellalignTR',tip:'محاذاة لأعلى اليمين'},{id:'calign',arg:'top-center',icon:'cellalignTC',tip:'محاذاة لأعلى الوسط'},{id:'calign',arg:'top-left',icon:'cellalignTL',tip:'محاذاة لأعلى اليسار'}],[{id:'calign',arg:'middle-right',icon:'cellalignMR',tip:'محاذاة للوسط اليمين'},{id:'calign',arg:'middle-center',icon:'cellalignMC',tip:'توسيط'},{id:'calign',arg:'middle-left',icon:'cellalignML',tip:'محاذاة للوسط اليسار'}]]},{id:'textDir',label:'اتجاه النص',icon:'textdir',big:1},{id:'cellMargins',label:'هوامش الخلايا',icon:'cellmargins',big:1}]},
  {label:'بيانات',items:[{id:'tsort',label:'فرز',icon:'sortTbl',big:1},{col:[{id:'repeatHeader',label:'تكرار صفوف الرأس',icon:'repeatheader'},{id:'convertText',label:'تحويل إلى نص',icon:'convert'},{id:'formula',label:'صيغة',icon:'formula'}]}]},
 ]},
 pformat:{label:'تنسيق الصورة',ctx:'pic',groups:[
  {label:'ضبط',items:[{id:'removeBg',label:'إزالة الخلفية',icon:'removebg',big:1},{col:[{id:'corrections',label:'تصحيحات',icon:'corrections',dd:'corrections'},{id:'picColor',label:'لون',icon:'color',dd:'picColor'},{id:'artistic',label:'تأثيرات فنية',icon:'artistic',dd:'artistic'}]},{col:[{id:'transparency',label:'الشفافية',icon:'transparency',dd:[{id:'transparency',arg:'0',label:'0%'},{id:'transparency',arg:'.3',label:'30%'},{id:'transparency',arg:'.6',label:'60%'}]},{id:'compress',label:'ضغط الصور',icon:'compress'},{id:'resetPic',label:'إعادة تعيين الصورة',icon:'resetpic'}]}]},
  {label:'أنماط الصورة',items:[{id:'pstyles',gallery:'pstyles'},{col:[{id:'picBorder',label:'حد الصورة',icon:'picborder',dd:SW('picBorder',['none:بلا مخطط'])},{id:'picEffects',label:'تأثيرات الصورة',icon:'piceffects',dd:'picEffects'},{id:'picLayout',label:'تخطيط الصورة',icon:'piclayout'}]}]},
  {label:'ترتيب',items:[{id:'position',label:'الموضع',icon:'position',big:1,dd:'position'},{id:'wrap',label:'التفاف النص',icon:'wrap',big:1,dd:'wrap'},{col:[{id:'forward',label:'إحضار للأمام',icon:'forward'},{id:'backward',label:'إرسال للخلف',icon:'backward'},{id:'selPane',label:'جزء التحديد',icon:'selpane'}]},{col:[{id:'alignObj',label:'محاذاة',icon:'align',dd:'alignObj'},{id:'groupObj',label:'تجميع',icon:'group'},{id:'rotate',label:'تدوير',icon:'rotate',dd:'rotate'}]}]},
  {label:'الحجم',items:[{id:'crop',label:'اقتصاص',icon:'crop',big:1},{col:[{id:'objH',num:1,label:'الارتفاع',unit:'سم',w:56},{id:'objW',num:1,label:'العرض',unit:'سم',w:56}]}]},
 ]},
 sformat:{label:'تنسيق الشكل',ctx:'shape',groups:[
  {label:'إدراج أشكال',items:[{id:'sgallery',gallery:'shapesmini'},{col:[{id:'editShape',label:'تحرير الشكل',icon:'editshape'},{id:'drawTextbox',label:'رسم مربع نص',icon:'drawtextbox'}]}]},
  {label:'أنماط الأشكال',items:[{id:'sstyles',gallery:'sstyles'},{col:[{id:'shapeFill',label:'تعبئة الشكل',icon:'fill',dd:SW('shapeFill',['none:بلا تعبئة'])},{id:'shapeOutline',label:'مخطط الشكل',icon:'shapeoutline',dd:'shapeOutline'},{id:'shapeEffects',label:'تأثيرات الشكل',icon:'shapeeffects',dd:'shapeEffects'}]}]},
  {label:'أنماط WordArt',items:[{id:'wastyles',gallery:'wastyles'},{col:[{id:'textFill',label:'تعبئة النص',icon:'textfill',dd:SW('textFill')},{id:'textOutline',label:'مخطط النص',icon:'textoutline',dd:SW('textOutline',['none:بلا مخطط'])},{id:'textEffects',label:'تأثيرات النص',icon:'texteffects',dd:'textEffects'}]}]},
  {label:'نص',items:[{col:[{id:'textDir',label:'اتجاه النص',icon:'textdir'},{id:'alignText',label:'محاذاة النص',icon:'aligntext'},{id:'createLink',label:'إنشاء ارتباط',icon:'link'}]}]},
  {label:'ترتيب',items:[{id:'position',label:'الموضع',icon:'position',big:1,dd:'position'},{id:'wrap',label:'التفاف النص',icon:'wrap',big:1,dd:'wrap'},{col:[{id:'forward',label:'إحضار للأمام',icon:'forward'},{id:'backward',label:'إرسال للخلف',icon:'backward'},{id:'selPane',label:'جزء التحديد',icon:'selpane'}]},{col:[{id:'alignObj',label:'محاذاة',icon:'align',dd:'alignObj'},{id:'groupObj',label:'تجميع',icon:'group'},{id:'rotate',label:'تدوير',icon:'rotate',dd:'rotate'}]}]},
  {label:'الحجم',items:[{col:[{id:'objH',num:1,label:'الارتفاع',unit:'سم',w:56},{id:'objW',num:1,label:'العرض',unit:'سم',w:56}]}]},
 ]},
 hfdesign:{label:'رأس وتذييل',ctx:'hf',groups:[
  {label:'رأس وتذييل',items:[{id:'header',label:'رأس الصفحة',icon:'header',big:1,dd:'headers'},{id:'footer',label:'تذييل الصفحة',icon:'footer',big:1,dd:'footers'},{id:'pagenum',label:'رقم الصفحة',icon:'pagenum',big:1,dd:'pagenums'}]},
  {label:'إدراج',items:[{id:'datetime',label:'التاريخ والوقت',icon:'datetime',big:1},{id:'docInfo',label:'معلومات المستند',icon:'docinfo',big:1},{id:'quickparts',label:'أجزاء سريعة',icon:'quickparts',big:1},{id:'pictures',label:'صور',icon:'pictures',big:1,dd:'pictures'},{id:'onlinePic',label:'صور عبر الإنترنت',icon:'onlinepic',big:1}]},
  {label:'تنقل',items:[{id:'gotoHeader',label:'الانتقال إلى الرأس',icon:'gotoheader',big:1},{id:'gotoFooter',label:'الانتقال إلى التذييل',icon:'gotofooter',big:1}]},
  {label:'خيارات',items:[{col:[{id:'firstDiff',check:1,label:'صفحة أولى مختلفة'},{id:'oddEven',check:1,label:'صفحات فردية وزوجية مختلفة'},{id:'showDocText',check:1,label:'إظهار نص المستند'}]}]},
  {label:'الموضع',items:[{col:[{id:'hdrPos',num:1,label:'الرأس من الأعلى',unit:'سم',w:52},{id:'ftrPos',num:1,label:'التذييل من الأسفل',unit:'سم',w:52}]}]},
  {label:'إغلاق',items:[{id:'closeHF',label:'إغلاق رأس وتذييل',icon:'closehf',big:1}]},
 ]},
 eqdesign:{label:'معادلة',ctx:'eq',groups:[
  {label:'أدوات',items:[{id:'equation',label:'معادلة',icon:'equation',big:1,dd:'equations'},{col:[{id:'eqPro',label:'احترافي',icon:'professional'},{id:'eqLinear',label:'خطي',icon:'linear'},{id:'eqNormal',label:'نص عادي',icon:'fonts'}]}]},
  {label:'رموز',items:[{id:'eqsym',gallery:'eqsym'}]},
  {label:'بنيات',items:[{id:'eqFrac',label:'كسر',icon:'fraction',big:1,dd:[{id:'eqFrac',arg:'stack',label:'كسر مكدّس  ▭/▭'},{id:'eqFrac',arg:'skew',label:'كسر مائل  ▭⁄▭'},{id:'eqFrac',arg:'lin',label:'كسر خطي  ▭/▭'}]},{id:'eqScript',label:'نص مرتفع',icon:'script',big:1,dd:[{id:'eqScript',arg:'sup',label:'مرتفع  ▭²'},{id:'eqScript',arg:'sub',label:'منخفض  ▭₂'}]},{id:'eqRad',label:'جذر',icon:'radical',big:1,dd:[{id:'eqRad',arg:'sq',label:'جذر تربيعي  √▭'},{id:'eqRad',arg:'n',label:'جذر بدليل  ∜▭'}]},{id:'eqInt',label:'تكامل',icon:'integral',big:1},{id:'eqLarge',label:'عامل كبير',icon:'largeop',big:1},{id:'eqBracket',label:'قوس',icon:'bracket',big:1},{id:'eqMatrix',label:'مصفوفة',icon:'matrix',big:1}]},
 ]},
};
const TAB_ORDER=['home','insert','draw','design','layout','refs','mail','review','view','help'];
const CTX_ORDER=['tdesign','tlayout','pformat','sformat','hfdesign','eqdesign'];

/* ===== menus / panels ===== */
const PALETTE=['#000000','#ffffff','#e7e6e6','#44546a','#4472c4','#ed7d31','#a5a5a5','#ffc000','#5b9bd5','#70ad47',
 '#7f7f7f','#f2f2f2','#d0cece','#d6dce4','#d9e2f3','#fbe5d5','#ededed','#fff2cc','#deebf6','#e2efd9',
 '#c00000','#ff0000','#ffc000','#ffff00','#92d050','#00b050','#00b0f0','#0070c0','#002060','#7030a0'];
const HILITE=['#ffff00','#00ff00','#00ffff','#ff00ff','#0000ff','#ff0000','#000080','#008080','#008000','#800080','#800000','#808000','#808080','#c0c0c0','#000000'];
const mi=(cmd,arg,label,ic)=>`<button class="mi" data-cmd="${cmd}"${arg!=null?` data-arg="${arg}"`:''}>${ic?icon(ic,18):'<span class="mi-sp"></span>'}<span>${label}</span></button>`;
const cap=t=>`<div class="mcap">${t}</div>`;
const sep='<div class="msep"></div>';
const PANELS={
 colors(spec){const [cmd,ex]=spec.split('|');const pal=cmd==='highlight'?HILITE:PALETTE;
   let h=(ex?ex.split(',').map(e=>{const [a,l]=e.split(':');return mi(cmd,a,l)}).join('')+sep:'')+cap(cmd==='highlight'?'ألوان التمييز':'ألوان النسق');
   h+=`<div class="swg${cmd==='highlight'?' hl':''}">`+pal.map(c=>`<button class="sw" data-cmd="${cmd}" data-arg="${c}" style="background:${c}" title="${c}"></button>`).join('')+'</div>';
   if(cmd!=='highlight')h+=sep+mi(cmd,'more','ألوان أخرى...','colors');return h},
 tablegrid:()=>`${cap('<span id="gridCap">إدراج جدول</span>')}<div class="tgrid" id="tgrid">${Array.from({length:80},(_,k)=>`<span data-r="${Math.floor(k/10)+1}" data-c="${k%10+1}"></span>`).join('')}</div>${sep}${mi('tableDlg',null,'إدراج جدول...','table')}${mi('drawTable',null,'رسم جدول','drawtable')}${mi('convertText',null,'تحويل نص إلى جدول...','convert')}${mi('quickTables',null,'جداول سريعة','table')}`,
 pictures:()=>`${mi('picDevice',null,'هذا الجهاز...','pictures')}${mi('picStock',null,'صور مخزنة...','pictures')}${mi('picOnline',null,'صور عبر الإنترنت...','onlinepic')}${cap('صور جاهزة (للتدريب)')}<div class="pgal">${SAMPLE_IMGS.map((s,i)=>`<button data-cmd="insPic" data-arg="${i}"><img src="${s}" alt=""></button>`).join('')}</div>`,
 shapes:()=>`${cap('الأشكال المستخدمة مؤخرًا')}<div class="shgal">${['rect','oval','tri','star','arrowR','line'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>${cap('خطوط')}<div class="shgal">${['line','arrowLine'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>${cap('مستطيلات')}<div class="shgal">${['rect','roundRect'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>${cap('الأشكال الأساسية')}<div class="shgal">${['oval','tri','diamond','hexagon','heart','smiley','cloud','moon'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>${cap('أسهم كتلية')}<div class="shgal">${['arrowR','arrowL','arrowU','arrowD'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>${cap('نجوم وشعارات')}<div class="shgal">${['star','star6','burst','ribbon'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>${cap('وسائل الشرح')}<div class="shgal">${['callout'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>${sep}${mi('newCanvas',null,'لوحة رسم جديدة','shapes')}`,
 wordart:()=>`<div class="wagal">${WA_STYLES.map((s,i)=>`<button data-cmd="insWordArt" data-arg="${i}" title="${s.name}"><span style="${s.css}">أ</span></button>`).join('')}</div>`,
 textboxes:()=>`${cap('مضمّن')}<div class="tbgal"><button data-cmd="insTextbox" data-arg="simple"><b>مربع نص بسيط</b><i></i><i></i></button><button data-cmd="insTextbox" data-arg="quote"><b>اقتباس</b><i></i><i></i></button></div>${sep}${mi('drawTextbox',null,'رسم مربع نص','drawtextbox')}`,
 covers:()=>`${cap('مضمّن')}<div class="covgal">${COVERS.map((c,i)=>`<button data-cmd="cover" data-arg="${i}"><div class="cv cv${i}"><b>العنوان</b><i></i><i></i></div><span>${c}</span></button>`).join('')}</div>${sep}${mi('removeCover',null,'إزالة صفحة الغلاف الحالية','cover')}`,
 headers:()=>`${cap('مضمّن')}<div class="hfgal">${HF_STYLES.map((h,i)=>`<button data-cmd="header" data-arg="${i}"><div class="hfp hf${i}"></div><span>${h}</span></button>`).join('')}</div>${sep}${mi('editHeader',null,'تحرير الرأس','header')}${mi('removeHeader',null,'إزالة الرأس','header')}`,
 footers:()=>`${cap('مضمّن')}<div class="hfgal">${HF_STYLES.map((h,i)=>`<button data-cmd="footer" data-arg="${i}"><div class="hfp hf${i} ft"></div><span>${h}</span></button>`).join('')}</div>${sep}${mi('editFooter',null,'تحرير التذييل','footer')}${mi('removeFooter',null,'إزالة التذييل','footer')}`,
 pagenums:()=>`<div class="sub"><button class="mi has-sub" data-sub="pnTop">${icon('header',18)}<span>أعلى الصفحة</span><em>◂</em></button><div class="subm" data-subm="pnTop">${PN_POS.map((p,i)=>`<button class="pnc" data-cmd="pagenumIns" data-arg="top-${p[0]}"><div class="pnp top ${p[0]}"><b>1</b></div><span>رقم عادي ${i+1}</span></button>`).join('')}</div></div>
  <div class="sub"><button class="mi has-sub" data-sub="pnBot">${icon('footer',18)}<span>أسفل الصفحة</span><em>◂</em></button><div class="subm" data-subm="pnBot">${PN_POS.map((p,i)=>`<button class="pnc" data-cmd="pagenumIns" data-arg="bottom-${p[0]}"><div class="pnp bottom ${p[0]}"><b>1</b></div><span>رقم عادي ${i+1}</span></button>`).join('')}</div></div>
  ${mi('pagenumIns','margin-right','هوامش الصفحة','pagenum')}${mi('pagenumIns','current','الموضع الحالي','pagenum')}${sep}${mi('pnFormat',null,'تنسيق أرقام الصفحات...','pagenum')}${mi('pnRemove',null,'إزالة أرقام الصفحات','pagenum')}`,
 symbols:()=>`<div class="symgal" id="symRecent">${(window.SYM_RECENT||[]).map(s=>`<button data-cmd="insSymbol" data-arg="${s}">${s}</button>`).join('')}</div>${sep}${mi('symbolDlg',null,'رموز إضافية...','symbol')}`,
 equations:()=>`${cap('مضمّن')}${EQ_READY.map((e,i)=>`<button class="eqc" data-cmd="insEqReady" data-arg="${i}"><span>${e.name}</span><div class="eqv">${e.html}</div></button>`).join('')}${sep}${mi('insEq',null,'إدراج معادلة جديدة','equation')}${mi('inkEq',null,'معادلة حبر','inkeq')}`,
 underline:()=>[['single','تسطير مفرد','underline'],['double','تسطير مزدوج','underline'],['dotted','منقّط','underline'],['wavy','متموّج','underline']].map(a=>mi('underline',a[0],a[1],a[2])).join(''),
 textfx:()=>`<div class="fxgal">${TEXT_FX.map((f,i)=>`<button data-cmd="textfx" data-arg="${i}" title="${f.name}"><span style="${f.css}">أ</span></button>`).join('')}</div>${sep}${mi('textfx','outline','مخطط','textoutline')}${mi('textfx','shadow','ظل','texteffects')}${mi('textfx','glow','توهّج','texteffects')}${mi('textfx','none','بلا تأثير','clearfmt')}`,
 bullets:()=>`${cap('مكتبة التعداد النقطي')}<div class="bgal">${['disc','circle','square','✓','➢','◆'].map(b=>`<button data-cmd="bullets" data-arg="${b}">${({disc:'●',circle:'○',square:'■'})[b]||b}</button>`).join('')}<button data-cmd="bullets" data-arg="none">بلا</button></div>`,
 numbering:()=>`${cap('مكتبة الترقيم')}<div class="ngal">${[['decimal','1. 2. 3.'],['arabic-indic','١. ٢. ٣.'],['arabic-abjad','أ. ب. ج.'],['upper-roman','I. II. III.'],['lower-alpha','a. b. c.']].map(n=>`<button data-cmd="numbering" data-arg="${n[0]}">${n[1].split(' ').join('<br>')}</button>`).join('')}<button data-cmd="numbering" data-arg="none">بلا</button></div>`,
 multilevel:()=>`<div class="ngal"><button data-cmd="multilevel" data-arg="1">1.<br>&nbsp;1.1.<br>&nbsp;&nbsp;1.1.1.</button><button data-cmd="multilevel" data-arg="2">1)<br>&nbsp;a)<br>&nbsp;&nbsp;i)</button></div>`,
 linespacing:()=>['1.0','1.15','1.5','2.0','2.5','3.0'].map(v=>mi('linespacing',v,v,null)).join('')+sep+mi('paraDlg',null,'خيارات تباعد الأسطر...','linespacing')+mi('spaceBefore',null,'إضافة مسافة قبل الفقرة','paraspacing')+mi('spaceAfter',null,'إزالة المسافة بعد الفقرة','paraspacing'),
 pborders:()=>[['bottom','حد سفلي'],['top','حد علوي'],['left','حد أيسر'],['right','حد أيمن'],['none','بلا حدود'],['all','كل الحدود'],['box','حدود خارجية'],['inside','حدود داخلية'],['ih','حد داخلي أفقي']].map(a=>mi('pborders',a[0],a[1],'borders')).join('')+sep+mi('pborders','hr','خط أفقي','borders')+mi('pborders','drawTable','رسم جدول','drawtable')+mi('pborders','viewGrid','عرض خطوط الشبكة','borders')+sep+mi('pborders','more','حدود وتظليل...','pageborders'),
 tborders:()=>[['bottom','حد سفلي'],['top','حد علوي'],['left','حد أيسر'],['right','حد أيمن'],['none','بلا حدود'],['all','كل الحدود'],['outside','حدود خارجية'],['inside','حدود داخلية'],['ih','حد داخلي أفقي'],['iv','حد داخلي عمودي'],['diagDown','حد قطري لأسفل'],['diagUp','حد قطري لأعلى']].map(a=>mi('tborders',a[0],a[1],'borders')).join('')+'<div class="msep"></div>'+mi('tborders','drawTable','رسم جدول','drawtable')+mi('tborders','viewGrid','عرض خطوط الشبكة','borders')+'<div class="msep"></div>'+mi('tborders','more','حدود وتظليل...','borders'),
 themes:()=>`<div class="thgal">${THEMES.map((t,i)=>`<button data-cmd="theme" data-arg="${i}"><div class="thp" style="--a:${t.c[0]};--b:${t.c[1]};--c:${t.c[2]};font-family:${t.f}"><b>أب</b><i></i><i></i><i></i></div><span>${t.name}</span></button>`).join('')}</div>`,
 docColors:()=>THEMES.map((t,i)=>`<button class="mi" data-cmd="theme" data-arg="${i}"><span class="tcs">${t.c.map(c=>`<i style="background:${c}"></i>`).join('')}</span><span>${t.name}</span></button>`).join(''),
 docFonts:()=>THEMES.map((t,i)=>`<button class="mi" data-cmd="themeFont" data-arg="${i}"><span style="font-family:${t.f};font-size:16px">أب</span><span>${t.f.split(',')[0]}</span></button>`).join(''),
 watermarks:()=>`${cap('سري')}<div class="wmgal">${['سرّي','لا تنسخ'].map(w=>`<button data-cmd="watermark" data-arg="${w}"><div class="wmp"><b>${w}</b></div><span>${w}</span></button>`).join('')}</div>${cap('إخلاء المسؤولية')}<div class="wmgal">${['مسودة','عاجل','نموذج'].map(w=>`<button data-cmd="watermark" data-arg="${w}"><div class="wmp"><b>${w}</b></div><span>${w}</span></button>`).join('')}</div>${sep}${mi('watermarkCustom',null,'علامة مائية مخصصة...','watermark')}${mi('watermark','none','إزالة العلامة المائية','watermark')}`,
 margins:()=>MARGINS.map(m=>`<button class="mi mg" data-cmd="margins" data-arg="${m.id}">${icon('margins',30)}<span><b>${m.name}</b><small>أعلى: ${m.t} سم&nbsp; أسفل: ${m.b} سم<br>يمين: ${m.r} سم&nbsp; يسار: ${m.l} سم</small></span></button>`).join('')+sep+mi('marginsCustom',null,'هوامش مخصصة...','margins'),
 orient:()=>`${mi('orient','portrait','عمودي','onepage')}${mi('orient','landscape','أفقي','orientation')}`,
 psize:()=>PSIZES.map(s=>`<button class="mi mg" data-cmd="psize" data-arg="${s.id}">${icon('size',26)}<span><b>${s.name}</b><small>${s.w} سم × ${s.h} سم</small></span></button>`).join(''),
 columns:()=>`${mi('columns','1','واحد','onepage')}${mi('columns','2','اثنان','columns')}${mi('columns','3','ثلاثة','columns')}${mi('columns','right','اليمين','columns')}${mi('columns','left','اليسار','columns')}${sep}${mi('colMore',null,'المزيد من الأعمدة...','columns')}`,
 breaks:()=>`${cap('فواصل الصفحات')}${mi('pageBreak',null,'صفحة — بداية صفحة جديدة','pagebreak')}${mi('colBreak',null,'عمود — النص بعده يبدأ في العمود التالي','columns')}${mi('textWrapBreak',null,'التفاف النص','wrap')}${cap('فواصل المقاطع')}${mi('sectionBreak','next','الصفحة التالية','breaks')}${mi('sectionBreak','cont','مستمر','breaks')}`,
 position:()=>`${mi('wrap','inline','مع النص','wrap')}${cap('مع التفاف النص')}<div class="posgal">${['tr','tc','tl','mr','mc','ml','br','bc','bl'].map(p=>`<button data-cmd="position" data-arg="${p}" title="${POSN(p)}"><i class="pp ${p}"></i></button>`).join('')}</div>`,
 wrap:()=>[['inline','مع النص'],['square','مربع'],['tight','ضيق'],['through','خلال'],['topbottom','أعلى وأسفل'],['behind','خلف النص'],['front','أمام النص']].map(a=>`<button class="mi" data-cmd="wrap" data-arg="${a[0]}">${wrapIcon(a[0])}<span>${a[1]}</span></button>`).join('')+sep+mi('wrapMore',null,'خيارات تخطيط إضافية...','wrap'),
 alignObj:()=>[['right','محاذاة إلى اليمين'],['center','توسيط'],['left','محاذاة إلى اليسار'],['top','محاذاة إلى الأعلى'],['middle','محاذاة إلى الوسط'],['bottom','محاذاة إلى الأسفل']].map(a=>mi('alignObj',a[0],a[1],'align')).join(''),
 rotate:()=>`${mi('rotate','90','تدوير لليمين 90°','rotate')}${mi('rotate','-90','تدوير لليسار 90°','rotate')}${mi('rotate','flipV','قلب رأسي','rotate')}${mi('rotate','flipH','قلب أفقي','rotate')}${mi('rotate','reset','إعادة التعيين','resetpic')}`,
 corrections:()=>`${cap('السطوع/التباين')}<div class="fxpics">${[['b-',.7,1],['b0',1,1],['b+',1.35,1],['c-',1,.7],['c+',1,1.4]].map(a=>`<button data-cmd="corrections" data-arg="${a[1]},${a[2]}" title="سطوع ${a[1]} تباين ${a[2]}"><img src="${SAMPLE_IMGS[0]}" style="filter:brightness(${a[1]}) contrast(${a[2]})"></button>`).join('')}</div>`,
 picColor:()=>`${cap('إعادة التلوين')}<div class="fxpics">${PIC_COLORS.map(c=>`<button data-cmd="picColor" data-arg="${c.f}" title="${c.name}"><img src="${SAMPLE_IMGS[0]}" style="filter:${c.f}"></button>`).join('')}</div>`,
 artistic:()=>`<div class="fxpics">${ARTISTIC.map(c=>`<button data-cmd="artistic" data-arg="${c.f}" title="${c.name}"><img src="${SAMPLE_IMGS[0]}" style="filter:${c.f}"></button>`).join('')}</div>`,
 picEffects:()=>[['shadow','ظل'],['reflection','انعكاس'],['glow','توهّج'],['soft','حواف ناعمة'],['none','بلا تأثير']].map(a=>mi('picEffects',a[0],a[1],'piceffects')).join(''),
 shapeEffects:()=>[['shadow','ظل'],['reflection','انعكاس'],['glow','توهّج'],['soft','حواف ناعمة'],['none','بلا تأثير']].map(a=>mi('shapeEffects',a[0],a[1],'shapeeffects')).join(''),
 textEffects:()=>[['shadow','ظل'],['reflection','انعكاس'],['glow','توهّج'],['arch','تحويل: قوس'],['none','بلا تأثير']].map(a=>mi('textEffects',a[0],a[1],'texteffects')).join(''),
 shapeOutline:()=>PANELS.colors('shapeOutline|none:بلا مخطط')+sep+`<div class="sub"><button class="mi has-sub" data-sub="ow">${icon('penweight',18)}<span>السُمك</span><em>◂</em></button><div class="subm" data-subm="ow">${[1,2,3,4.5,6].map(w=>mi('outlineW',w,w+' نقطة',null)).join('')}</div></div><div class="sub"><button class="mi has-sub" data-sub="od">${icon('penstyle',18)}<span>شرطات</span><em>◂</em></button><div class="subm" data-subm="od">${mi('outlineD','solid','──── متصل',null)}${mi('outlineD','dash','- - - شرطات',null)}${mi('outlineD','dot','···· نقاط',null)}</div></div>`,
 tocs:()=>`${cap('مضمّن')}${[['auto1','جدول تلقائي 1'],['auto2','جدول تلقائي 2'],['manual','جدول يدوي']].map(t=>`<button class="tocc" data-cmd="tocIns" data-arg="${t[0]}"><span>${t[1]}</span><div class="tocp"><b>${t[0]==='auto2'?'جدول المحتويات':'المحتويات'}</b><i></i><i class="s"></i><i></i></div></button>`).join('')}${sep}${mi('tocCustom',null,'جدول محتويات مخصص...','toc')}${mi('tocRemove',null,'إزالة جدول المحتويات','toc')}`,
};

/* ===== galleries (inline in ribbon) ===== */
const GALLERIES={
 styles:()=>STYLE_LIST.map(s=>`<button class="gi st" data-cmd="style" data-arg="${s.id}" data-hid="style-${s.id}"><span style="${s.css}">أب ج</span><small>${s.name}</small></button>`).join(''),
 stylesets:()=>THEMES.slice(0,5).map((t,i)=>`<button class="gi ss" data-cmd="theme" data-arg="${i}" title="${t.name}"><b style="color:${t.c[0]};font-family:${t.f}">العنوان</b><i style="background:${t.c[1]}"></i><i></i><i></i></button>`).join(''),
 tstyles:()=>TSTYLES.map((t,i)=>`<button class="gi ts" data-cmd="tstyle" data-arg="${i}" title="${t.name}" data-hid="tstyle-${i}"><div class="mini">${Array.from({length:12},(_,k)=>`<i style="background:${k<3?t.h:(Math.floor(k/3)%2?t.b2:t.b1)};border-color:${t.l}"></i>`).join('')}</div></button>`).join(''),
 pstyles:()=>PSTYLES.map((p,i)=>`<button class="gi ps" data-cmd="pstyle" data-arg="${p.id}" title="${p.name}" data-hid="pstyle-${p.id}"><img src="${SAMPLE_IMGS[1]}" class="ps-${p.id}"></button>`).join(''),
 sstyles:()=>SSTYLES.map((s,i)=>`<button class="gi sst" data-cmd="sstyle" data-arg="${i}" title="${s.name}"><span style="background:${s.fill};border:2px solid ${s.line};color:${s.text}">أب</span></button>`).join(''),
 wastyles:()=>WA_STYLES.slice(0,4).map((s,i)=>`<button class="gi was" data-cmd="wastyle" data-arg="${i}"><span style="${s.css}">أ</span></button>`).join(''),
 eqsym:()=>`<div class="eqs">${EQ_SYMS.map(s=>`<button data-cmd="eqSym" data-arg="${s}">${s}</button>`).join('')}</div>`,
 shapesmini:()=>`<div class="shm">${['rect','oval','tri','line','arrowR','star','roundRect','diamond'].map(s=>`<button data-cmd="insShape" data-arg="${s}" title="${SHAPE_NAMES[s]}">${shapeIcon(s)}</button>`).join('')}</div>`,
};

/* ===== render ribbon ===== */
function btnHTML(it,kind){
  const arg=it.arg!=null?` data-arg="${it.arg}"`:'', hid=` data-hid="${it.id}${it.arg!=null&&kind==='ico'?'-'+it.arg:''}"`;
  const tip=` title="${it.tip||it.label||''}"`;
  if(it.select)return `<select class="rsel" data-cmd="${it.id}" data-hid="${it.id}" style="width:${it.w}px"${tip}>${it.select.map(o=>`<option>${o}</option>`).join('')}</select>`;
  if(it.check)return `<label class="rck" data-hid="${it.id}"><input type="checkbox" data-cmd="${it.id}"> ${it.label}</label>`;
  if(it.num)return `<label class="rnum" data-hid="${it.id}"><span>${it.label}:</span><input type="number" step="0.1" min="0" data-cmd="${it.id}" style="width:${it.w}px"><em>${it.unit||''}</em></label>`;
  if(it.gallery)return `<div class="rgal" data-hid="${it.id}">${GALLERIES[it.gallery]()}</div>`;
  const dd=it.dd?' data-dd="1"':'';
  const caret=it.dd?'<span class="car">▾</span>':'';
  if(kind==='big')return `<div class="rbw${it.dd?' ddw':''}${it.split?' split':''}"><button class="rb big" data-cmd="${it.id}"${arg}${hid}${dd}${tip}>${icon(it.icon,32)}<span>${it.label}${caret}</span></button>${it.dd?`<div class="dd">${menuHTML(it.dd)}</div>`:''}</div>`;
  if(kind==='small')return `<div class="rbw${it.dd?' ddw':''}${it.split?' split':''}"><button class="rb small" data-cmd="${it.id}"${arg}${hid}${dd}${tip}>${icon(it.icon,18)}<span>${it.label}</span>${caret}</button>${it.dd?`<div class="dd">${menuHTML(it.dd)}</div>`:''}</div>`;
  return `<div class="rbw${it.dd?' ddw':''}${it.split?' split':''}"><button class="rb ico" data-cmd="${it.id}"${arg}${hid}${dd}${tip}>${icon(it.icon,18)}${it.dd?'<span class="car">▾</span>':''}</button>${it.dd?`<div class="dd">${menuHTML(it.dd)}</div>`:''}</div>`;
}
function menuHTML(spec){
  if(Array.isArray(spec))return spec.map(m=>mi(m.id,m.arg,m.label,m.icon)).join('');
  if(spec.startsWith('colors:'))return PANELS.colors(spec.slice(7));
  return PANELS[spec]?PANELS[spec]():'';
}
function renderRibbon(){
  const tabs=$('#wtabs'), rib=$('#ribbon');
  let th=`<button class="wtab file" data-tab="file" data-hid="tab-file">ملف</button>`;
  TAB_ORDER.forEach(t=>th+=`<button class="wtab" data-tab="${t}" data-hid="tab-${t}">${RIBBON[t].label}</button>`);
  CTX_ORDER.forEach(t=>th+=`<button class="wtab ctx" data-tab="${t}" data-ctx="${RIBBON[t].ctx}" hidden>${RIBBON[t].label}</button>`);
  tabs.innerHTML=th+`<div class="tabs-r"><button class="wtab cm" data-cmd="showComments" title="التعليقات">💬 تعليقات</button><button class="wtab share" data-cmd="share">مشاركة</button></div>`;
  let ph='';
  [...TAB_ORDER,...CTX_ORDER].forEach(t=>{
    ph+=`<div class="panel" data-panel="${t}">`+RIBBON[t].groups.map(g=>`<div class="grp" data-hid="grp-${t}-${g.label}"><div class="gi">${g.items.map(it=>{
      if(it.col)return `<div class="rcol">${it.col.map(c=>btnHTML(c,c.check||c.num?'':'small')).join('')}</div>`;
      if(it.rows)return `<div class="rrows">${it.rows.map(r=>`<div class="rrow">${r.map(c=>btnHTML(c,'ico')).join('')}</div>`).join('')}</div>`;
      if(it.big)return btnHTML(it,'big');
      return btnHTML(it,'');
    }).join('')}</div><div class="gl">${g.label}</div></div>`).join('')+`</div>`;
  });
  rib.innerHTML=ph;
}
/* map command -> tab (first occurrence, normal tabs preferred) */
const POSN=p=>'الموضع '+({t:'في الأعلى',m:'في المنتصف',b:'في الأسفل'})[p[0]]+' '+({r:'إلى اليمين',c:'في الوسط',l:'إلى اليسار'})[p[1]]+' مع التفاف نص مربع';window.POSN=POSN;
function tabOfCmd(id){for(const t of CTX_ORDER){const tb=$(`#wtabs [data-tab="${t}"]`);if(tb&&tb.offsetParent&&$(`[data-panel="${t}"] [data-hid="${id}"]`))return t}for(const t of [...TAB_ORDER,...CTX_ORDER]){if($(`[data-panel="${t}"] [data-hid="${id}"]`))return t}return null}
