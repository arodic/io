import{IoSelectorSidebar,IoStorageFactory}from"./io-elements.js";import{IoElement,Node}from"./io.js";function createCommonjsModule(e,t){return e(t={exports:{}},t.exports),t.exports}let defaults=createCommonjsModule(function(e){function t(){return{baseUrl:null,breaks:!1,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,xhtml:!1}}e.exports={defaults:{baseUrl:null,breaks:!1,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,xhtml:!1},getDefaults:t,changeDefaults:function(t){e.exports.defaults=t}}}),defaults_1=defaults.defaults,defaults_2=defaults.getDefaults,defaults_3=defaults.changeDefaults;const escapeTest=/[&<>"']/,escapeReplace=/[&<>"']/g,escapeTestNoEncode=/[<>"']|&(?!#?\w+;)/,escapeReplaceNoEncode=/[<>"']|&(?!#?\w+;)/g,escapeReplacements={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},getEscapeReplacement=e=>escapeReplacements[e];function escape(e,t){if(t){if(escapeTest.test(e))return e.replace(escapeReplace,getEscapeReplacement)}else if(escapeTestNoEncode.test(e))return e.replace(escapeReplaceNoEncode,getEscapeReplacement);return e}const unescapeTest=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function unescape(e){return e.replace(unescapeTest,(e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):"")}const caret=/(^|[^\[])\^/g;function edit(e,t){e=e.source||e,t=t||"";const n={replace:(t,i)=>(i=(i=i.source||i).replace(caret,"$1"),e=e.replace(t,i),n),getRegex:()=>new RegExp(e,t)};return n}const nonWordAndColonTest=/[^\w:]/g,originIndependentUrl=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function cleanUrl(e,t,n){if(e){let e;try{e=decodeURIComponent(unescape(n)).replace(nonWordAndColonTest,"").toLowerCase()}catch(e){return null}if(0===e.indexOf("javascript:")||0===e.indexOf("vbscript:")||0===e.indexOf("data:"))return null}t&&!originIndependentUrl.test(n)&&(n=resolveUrl(t,n));try{n=encodeURI(n).replace(/%25/g,"%")}catch(e){return null}return n}const baseUrls={},justDomain=/^[^:]+:\/*[^/]*$/,protocol=/^([^:]+:)[\s\S]*$/,domain=/^([^:]+:\/*[^/]*)[\s\S]*$/;function resolveUrl(e,t){baseUrls[" "+e]||(justDomain.test(e)?baseUrls[" "+e]=e+"/":baseUrls[" "+e]=rtrim(e,"/",!0));const n=-1===(e=baseUrls[" "+e]).indexOf(":");return"//"===t.substring(0,2)?n?t:e.replace(protocol,"$1")+t:"/"===t.charAt(0)?n?t:e.replace(domain,"$1")+t:e+t}const noopTest={exec:function(){}};function merge(e){let t,n,i=1;for(;i<arguments.length;i++)for(n in t=arguments[i])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}function splitCells(e,t){const n=e.replace(/\|/g,(e,t,n)=>{let i=!1,s=t;for(;--s>=0&&"\\"===n[s];)i=!i;return i?"|":" |"}).split(/ \|/);let i=0;if(n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;i<n.length;i++)n[i]=n[i].trim().replace(/\\\|/g,"|");return n}function rtrim(e,t,n){const i=e.length;if(0===i)return"";let s=0;for(;s<i;){const r=e.charAt(i-s-1);if(r!==t||n){if(r===t||!n)break;s++}else s++}return e.substr(0,i-s)}function findClosingBracket(e,t){if(-1===e.indexOf(t[1]))return-1;const n=e.length;let i=0,s=0;for(;s<n;s++)if("\\"===e[s])s++;else if(e[s]===t[0])i++;else if(e[s]===t[1]&&--i<0)return s;return-1}function checkSanitizeDeprecation(e){e&&e.sanitize&&e.silent}let helpers={escape:escape,unescape:unescape,edit:edit,cleanUrl:cleanUrl,resolveUrl:resolveUrl,noopTest:noopTest,merge:merge,splitCells:splitCells,rtrim:rtrim,findClosingBracket:findClosingBracket,checkSanitizeDeprecation:checkSanitizeDeprecation};const{noopTest:noopTest$1,edit:edit$1,merge:merge$1}=helpers,block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,hr:/^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:"^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",def:/^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,nptable:noopTest$1,table:noopTest$1,lheading:/^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};block.def=edit$1(block.def).replace("label",block._label).replace("title",block._title).getRegex(),block.bullet=/(?:[*+-]|\d{1,9}\.)/,block.item=/^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/,block.item=edit$1(block.item,"gm").replace(/bull/g,block.bullet).getRegex(),block.list=edit$1(block.list).replace(/bull/g,block.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+block.def.source+")").getRegex(),block._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",block._comment=/<!--(?!-?>)[\s\S]*?-->/,block.html=edit$1(block.html,"i").replace("comment",block._comment).replace("tag",block._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),block.paragraph=edit$1(block._paragraph).replace("hr",block.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",block._tag).getRegex(),block.blockquote=edit$1(block.blockquote).replace("paragraph",block.paragraph).getRegex(),block.normal=merge$1({},block),block.gfm=merge$1({},block.normal,{nptable:"^ *([^|\\n ].*\\|.*)\\n *([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",table:"^ *\\|(.+)\\n *\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"}),block.gfm.nptable=edit$1(block.gfm.nptable).replace("hr",block.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",block._tag).getRegex(),block.gfm.table=edit$1(block.gfm.table).replace("hr",block.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",block._tag).getRegex(),block.pedantic=merge$1({},block.normal,{html:edit$1("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",block._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,fences:noopTest$1,paragraph:edit$1(block.normal._paragraph).replace("hr",block.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",block.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()});const inline={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:noopTest$1,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,nolink:/^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,strong:/^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,em:/^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:noopTest$1,text:/^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/,_punctuation:"!\"#$%&'()*+,\\-./:;<=>?@\\[^_{|}~"};inline.em=edit$1(inline.em).replace(/punctuation/g,inline._punctuation).getRegex(),inline._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,inline._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,inline._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,inline.autolink=edit$1(inline.autolink).replace("scheme",inline._scheme).replace("email",inline._email).getRegex(),inline._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,inline.tag=edit$1(inline.tag).replace("comment",block._comment).replace("attribute",inline._attribute).getRegex(),inline._label=/(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,inline._href=/<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/,inline._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,inline.link=edit$1(inline.link).replace("label",inline._label).replace("href",inline._href).replace("title",inline._title).getRegex(),inline.reflink=edit$1(inline.reflink).replace("label",inline._label).getRegex(),inline.normal=merge$1({},inline),inline.pedantic=merge$1({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,link:edit$1(/^!?\[(label)\]\((.*?)\)/).replace("label",inline._label).getRegex(),reflink:edit$1(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",inline._label).getRegex()}),inline.gfm=merge$1({},inline.normal,{escape:edit$1(inline.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^~+(?=\S)([\s\S]*?\S)~+/,text:/^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/}),inline.gfm.url=edit$1(inline.gfm.url,"i").replace("email",inline.gfm._extended_email).getRegex(),inline.breaks=merge$1({},inline.gfm,{br:edit$1(inline.br).replace("{2,}","*").getRegex(),text:edit$1(inline.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()});let rules={block:block,inline:inline};const{defaults:defaults$1}=defaults,{block:block$1}=rules,{rtrim:rtrim$1,splitCells:splitCells$1,escape:escape$1}=helpers;let Lexer_1=class e{constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||defaults$1,this.rules=block$1.normal,this.options.pedantic?this.rules=block$1.pedantic:this.options.gfm&&(this.rules=block$1.gfm)}static get rules(){return block$1}static lex(t,n){return new e(n).lex(t)}lex(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    "),this.token(e,!0)}token(e,t){let n,i,s,r,l,o,a,c,h,p,g,d,u,m,b,f;for(e=e.replace(/^ +$/gm,"");e;)if((s=this.rules.newline.exec(e))&&(e=e.substring(s[0].length),s[0].length>1&&this.tokens.push({type:"space"})),s=this.rules.code.exec(e)){const t=this.tokens[this.tokens.length-1];e=e.substring(s[0].length),t&&"paragraph"===t.type?t.text+="\n"+s[0].trimRight():(s=s[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",codeBlockStyle:"indented",text:this.options.pedantic?s:rtrim$1(s,"\n")}))}else if(s=this.rules.fences.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"code",lang:s[2]?s[2].trim():s[2],text:s[3]||""});else if(s=this.rules.heading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:s[1].length,text:s[2]});else if((s=this.rules.nptable.exec(e))&&(o={type:"table",header:splitCells$1(s[1].replace(/^ *| *\| *$/g,"")),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3]?s[3].replace(/\n$/,"").split("\n"):[]}).header.length===o.align.length){for(e=e.substring(s[0].length),g=0;g<o.align.length;g++)/^ *-+: *$/.test(o.align[g])?o.align[g]="right":/^ *:-+: *$/.test(o.align[g])?o.align[g]="center":/^ *:-+ *$/.test(o.align[g])?o.align[g]="left":o.align[g]=null;for(g=0;g<o.cells.length;g++)o.cells[g]=splitCells$1(o.cells[g],o.header.length);this.tokens.push(o)}else if(s=this.rules.hr.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"hr"});else if(s=this.rules.blockquote.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"blockquote_start"}),s=s[0].replace(/^ *> ?/gm,""),this.token(s,t),this.tokens.push({type:"blockquote_end"});else if(s=this.rules.list.exec(e)){for(e=e.substring(s[0].length),a={type:"list_start",ordered:m=(r=s[2]).length>1,start:m?+r:"",loose:!1},this.tokens.push(a),c=[],n=!1,u=(s=s[0].match(this.rules.item)).length,g=0;g<u;g++)p=(o=s[g]).length,~(o=o.replace(/^ *([*+-]|\d+\.) */,"")).indexOf("\n ")&&(p-=o.length,o=this.options.pedantic?o.replace(/^ {1,4}/gm,""):o.replace(new RegExp("^ {1,"+p+"}","gm"),"")),g!==u-1&&(l=block$1.bullet.exec(s[g+1])[0],(r.length>1?1===l.length:l.length>1||this.options.smartLists&&l!==r)&&(e=s.slice(g+1).join("\n")+e,g=u-1)),i=n||/\n\n(?!\s*$)/.test(o),g!==u-1&&(n="\n"===o.charAt(o.length-1),i||(i=n)),i&&(a.loose=!0),f=void 0,(b=/^\[[ xX]\] /.test(o))&&(f=" "!==o[1],o=o.replace(/^\[[ xX]\] +/,"")),h={type:"list_item_start",task:b,checked:f,loose:i},c.push(h),this.tokens.push(h),this.token(o,!1),this.tokens.push({type:"list_item_end"});if(a.loose)for(u=c.length,g=0;g<u;g++)c[g].loose=!0;this.tokens.push({type:"list_end"})}else if(s=this.rules.html.exec(e))e=e.substring(s[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===s[1]||"script"===s[1]||"style"===s[1]),text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(s[0]):escape$1(s[0]):s[0]});else if(t&&(s=this.rules.def.exec(e)))e=e.substring(s[0].length),s[3]&&(s[3]=s[3].substring(1,s[3].length-1)),d=s[1].toLowerCase().replace(/\s+/g," "),this.tokens.links[d]||(this.tokens.links[d]={href:s[2],title:s[3]});else if((s=this.rules.table.exec(e))&&(o={type:"table",header:splitCells$1(s[1].replace(/^ *| *\| *$/g,"")),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3]?s[3].replace(/\n$/,"").split("\n"):[]}).header.length===o.align.length){for(e=e.substring(s[0].length),g=0;g<o.align.length;g++)/^ *-+: *$/.test(o.align[g])?o.align[g]="right":/^ *:-+: *$/.test(o.align[g])?o.align[g]="center":/^ *:-+ *$/.test(o.align[g])?o.align[g]="left":o.align[g]=null;for(g=0;g<o.cells.length;g++)o.cells[g]=splitCells$1(o.cells[g].replace(/^ *\| *| *\| *$/g,""),o.header.length);this.tokens.push(o)}else if(s=this.rules.lheading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:"="===s[2].charAt(0)?1:2,text:s[1]});else if(t&&(s=this.rules.paragraph.exec(e)))e=e.substring(s[0].length),this.tokens.push({type:"paragraph",text:"\n"===s[1].charAt(s[1].length-1)?s[1].slice(0,-1):s[1]});else if(s=this.rules.text.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"text",text:s[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens}};const{defaults:defaults$2}=defaults,{cleanUrl:cleanUrl$1,escape:escape$2}=helpers;let Renderer_1=class{constructor(e){this.options=e||defaults$2}code(e,t,n){const i=(t||"").match(/\S*/)[0];if(this.options.highlight){const t=this.options.highlight(e,i);null!=t&&t!==e&&(n=!0,e=t)}return i?'<pre><code class="'+this.options.langPrefix+escape$2(i,!0)+'">'+(n?e:escape$2(e,!0))+"</code></pre>\n":"<pre><code>"+(n?e:escape$2(e,!0))+"</code></pre>"}blockquote(e){return"<blockquote>\n"+e+"</blockquote>\n"}html(e){return e}heading(e,t,n,i){return this.options.headerIds?"<h"+t+' id="'+this.options.headerPrefix+i.slug(n)+'">'+e+"</h"+t+">\n":"<h"+t+">"+e+"</h"+t+">\n"}hr(){return this.options.xhtml?"<hr/>\n":"<hr>\n"}list(e,t,n){const i=t?"ol":"ul";return"<"+i+(t&&1!==n?' start="'+n+'"':"")+">\n"+e+"</"+i+">\n"}listitem(e){return"<li>"+e+"</li>\n"}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(e){return"<p>"+e+"</p>\n"}table(e,t){return t&&(t="<tbody>"+t+"</tbody>"),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return"<tr>\n"+e+"</tr>\n"}tablecell(e,t){const n=t.header?"th":"td";return(t.align?"<"+n+' align="'+t.align+'">':"<"+n+">")+e+"</"+n+">\n"}strong(e){return"<strong>"+e+"</strong>"}em(e){return"<em>"+e+"</em>"}codespan(e){return"<code>"+e+"</code>"}br(){return this.options.xhtml?"<br/>":"<br>"}del(e){return"<del>"+e+"</del>"}link(e,t,n){if(null===(e=cleanUrl$1(this.options.sanitize,this.options.baseUrl,e)))return n;let i='<a href="'+escape$2(e)+'"';return t&&(i+=' title="'+t+'"'),i+=">"+n+"</a>"}image(e,t,n){if(null===(e=cleanUrl$1(this.options.sanitize,this.options.baseUrl,e)))return n;let i='<img src="'+e+'" alt="'+n+'"';return t&&(i+=' title="'+t+'"'),i+=this.options.xhtml?"/>":">"}text(e){return e}},Slugger_1=class{constructor(){this.seen={}}slug(e){let t=e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-");if(this.seen.hasOwnProperty(t)){const e=t;do{this.seen[e]++,t=e+"-"+this.seen[e]}while(this.seen.hasOwnProperty(t))}return this.seen[t]=0,t}};const{defaults:defaults$3}=defaults,{inline:inline$1}=rules,{findClosingBracket:findClosingBracket$1,escape:escape$3}=helpers;let InlineLexer_1=class e{constructor(e,t){if(this.options=t||defaults$3,this.links=e,this.rules=inline$1.normal,this.options.renderer=this.options.renderer||new Renderer_1,this.renderer=this.options.renderer,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.pedantic?this.rules=inline$1.pedantic:this.options.gfm&&(this.options.breaks?this.rules=inline$1.breaks:this.rules=inline$1.gfm)}static get rules(){return inline$1}static output(t,n,i){return new e(n,i).output(t)}output(t){let n,i,s,r,l,o,a="";for(;t;)if(l=this.rules.escape.exec(t))t=t.substring(l[0].length),a+=escape$3(l[1]);else if(l=this.rules.tag.exec(t))!this.inLink&&/^<a /i.test(l[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(l[0])&&(this.inLink=!1),!this.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(l[0])?this.inRawBlock=!0:this.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(l[0])&&(this.inRawBlock=!1),t=t.substring(l[0].length),a+=this.renderer.html(this.options.sanitize?this.options.sanitizer?this.options.sanitizer(l[0]):escape$3(l[0]):l[0]);else if(l=this.rules.link.exec(t)){const i=findClosingBracket$1(l[2],"()");if(i>-1){const e=(0===l[0].indexOf("!")?5:4)+l[1].length+i;l[2]=l[2].substring(0,i),l[0]=l[0].substring(0,e).trim(),l[3]=""}t=t.substring(l[0].length),this.inLink=!0,s=l[2],this.options.pedantic?(n=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(s))?(s=n[1],r=n[3]):r="":r=l[3]?l[3].slice(1,-1):"",s=s.trim().replace(/^<([\s\S]*)>$/,"$1"),a+=this.outputLink(l,{href:e.escapes(s),title:e.escapes(r)}),this.inLink=!1}else if((l=this.rules.reflink.exec(t))||(l=this.rules.nolink.exec(t))){if(t=t.substring(l[0].length),n=(l[2]||l[1]).replace(/\s+/g," "),!(n=this.links[n.toLowerCase()])||!n.href){a+=l[0].charAt(0),t=l[0].substring(1)+t;continue}this.inLink=!0,a+=this.outputLink(l,n),this.inLink=!1}else if(l=this.rules.strong.exec(t))t=t.substring(l[0].length),a+=this.renderer.strong(this.output(l[4]||l[3]||l[2]||l[1]));else if(l=this.rules.em.exec(t))t=t.substring(l[0].length),a+=this.renderer.em(this.output(l[6]||l[5]||l[4]||l[3]||l[2]||l[1]));else if(l=this.rules.code.exec(t))t=t.substring(l[0].length),a+=this.renderer.codespan(escape$3(l[2].trim(),!0));else if(l=this.rules.br.exec(t))t=t.substring(l[0].length),a+=this.renderer.br();else if(l=this.rules.del.exec(t))t=t.substring(l[0].length),a+=this.renderer.del(this.output(l[1]));else if(l=this.rules.autolink.exec(t))t=t.substring(l[0].length),s="@"===l[2]?"mailto:"+(i=escape$3(this.mangle(l[1]))):i=escape$3(l[1]),a+=this.renderer.link(s,null,i);else if(this.inLink||!(l=this.rules.url.exec(t))){if(l=this.rules.text.exec(t))t=t.substring(l[0].length),this.inRawBlock?a+=this.renderer.text(this.options.sanitize?this.options.sanitizer?this.options.sanitizer(l[0]):escape$3(l[0]):l[0]):a+=this.renderer.text(escape$3(this.smartypants(l[0])));else if(t)throw new Error("Infinite loop on byte: "+t.charCodeAt(0))}else{if("@"===l[2])s="mailto:"+(i=escape$3(l[0]));else{do{o=l[0],l[0]=this.rules._backpedal.exec(l[0])[0]}while(o!==l[0]);i=escape$3(l[0]),s="www."===l[1]?"http://"+i:i}t=t.substring(l[0].length),a+=this.renderer.link(s,null,i)}return a}static escapes(t){return t?t.replace(e.rules._escapes,"$1"):t}outputLink(e,t){const n=t.href,i=t.title?escape$3(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(n,i,this.output(e[1])):this.renderer.image(n,i,escape$3(e[1]))}smartypants(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e}mangle(e){if(!this.options.mangle)return e;const t=e.length;let n,i="",s=0;for(;s<t;s++)n=e.charCodeAt(s),Math.random()>.5&&(n="x"+n.toString(16)),i+="&#"+n+";";return i}},TextRenderer_1=class{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return""+n}image(e,t,n){return""+n}br(){return""}};const{defaults:defaults$4}=defaults,{merge:merge$2,unescape:unescape$1}=helpers;let Parser_1=class e{constructor(e){this.tokens=[],this.token=null,this.options=e||defaults$4,this.options.renderer=this.options.renderer||new Renderer_1,this.renderer=this.options.renderer,this.renderer.options=this.options,this.slugger=new Slugger_1}static parse(t,n){return new e(n).parse(t)}parse(e){this.inline=new InlineLexer_1(e.links,this.options),this.inlineText=new InlineLexer_1(e.links,merge$2({},this.options,{renderer:new TextRenderer_1})),this.tokens=e.reverse();let t="";for(;this.next();)t+=this.tok();return t}next(){return this.token=this.tokens.pop(),this.token}peek(){return this.tokens[this.tokens.length-1]||0}parseText(){let e=this.token.text;for(;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)}tok(){let e="";switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,unescape$1(this.inlineText.output(this.token.text)),this.slugger);case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":{let t,n,i,s,r="";for(i="",t=0;t<this.token.header.length;t++)i+=this.renderer.tablecell(this.inline.output(this.token.header[t]),{header:!0,align:this.token.align[t]});for(r+=this.renderer.tablerow(i),t=0;t<this.token.cells.length;t++){for(n=this.token.cells[t],i="",s=0;s<n.length;s++)i+=this.renderer.tablecell(this.inline.output(n[s]),{header:!1,align:this.token.align[s]});e+=this.renderer.tablerow(i)}return this.renderer.table(r,e)}case"blockquote_start":for(e="";"blockquote_end"!==this.next().type;)e+=this.tok();return this.renderer.blockquote(e);case"list_start":{e="";const t=this.token.ordered,n=this.token.start;for(;"list_end"!==this.next().type;)e+=this.tok();return this.renderer.list(e,t,n)}case"list_item_start":{e="";const t=this.token.loose,n=this.token.checked,i=this.token.task;if(this.token.task)if(t)if("text"===this.peek().type){const e=this.peek();e.text=this.renderer.checkbox(n)+" "+e.text}else this.tokens.push({type:"text",text:this.renderer.checkbox(n)});else e+=this.renderer.checkbox(n);for(;"list_item_end"!==this.next().type;)e+=t||"text"!==this.token.type?this.tok():this.parseText();return this.renderer.listitem(e,i,n)}case"html":return this.renderer.html(this.token.text);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText());default:{const e='Token with "'+this.token.type+'" type was not found.';if(!this.options.silent)throw new Error(e)}}}};const{merge:merge$3,checkSanitizeDeprecation:checkSanitizeDeprecation$1,escape:escape$4}=helpers,{getDefaults:getDefaults,changeDefaults:changeDefaults,defaults:defaults$5}=defaults;function marked(e,t,n){if(void 0===e||null===e)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");if(n||"function"==typeof t){n||(n=t,t=null),t=merge$3({},marked.defaults,t||{}),checkSanitizeDeprecation$1(t);const i=t.highlight;let s,r,l=0;try{s=Lexer_1.lex(e,t)}catch(e){return n(e)}r=s.length;const o=function(e){if(e)return t.highlight=i,n(e);let r;try{r=Parser_1.parse(s,t)}catch(t){e=t}return t.highlight=i,e?n(e):n(null,r)};if(!i||i.length<3)return o();if(delete t.highlight,!r)return o();for(;l<s.length;l++)!function(e){"code"!==e.type?--r||o():i(e.text,e.lang,function(t,n){return t?o(t):null==n||n===e.text?--r||o():(e.text=n,e.escaped=!0,void(--r||o()))})}(s[l])}else try{return t=merge$3({},marked.defaults,t||{}),checkSanitizeDeprecation$1(t),Parser_1.parse(Lexer_1.lex(e,t),t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",(t||marked.defaults).silent)return"<p>An error occurred:</p><pre>"+escape$4(e.message+"",!0)+"</pre>";throw e}}marked.options=marked.setOptions=function(e){return merge$3(marked.defaults,e),changeDefaults(marked.defaults),marked},marked.getDefaults=getDefaults,marked.defaults=defaults$5,marked.Parser=Parser_1,marked.parser=Parser_1.parse,marked.Renderer=Renderer_1,marked.TextRenderer=TextRenderer_1,marked.Lexer=Lexer_1,marked.lexer=Lexer_1.lex,marked.InlineLexer=InlineLexer_1,marked.inlineLexer=InlineLexer_1.output,marked.Slugger=Slugger_1,marked.parse=marked;let marked_1=marked;class IoMdView extends IoElement{static get Style(){return"\n    :host {\n      display: block;\n      align-self: stretch;\n      justify-self: stretch;\n      flex: 1 1 auto;\n      --io-code-size: 15px;\n      padding: 0.5em 1em;\n    }\n    :host > :first-child {\n      margin-top: 0;\n    }\n    :host > :last-child {\n      margin-top: 0;\n    }\n    :host p {\n      line-height: 1.4em;\n      padding: 0 0.5em;\n    }\n    :host a {\n      text-decoration: underline;\n      color: var(--io-color-link);\n    }\n    :host h1, :host h2, :host h3, :host h4 {\n      margin: 0;\n      border: var(--io-border);\n      border-width: 0 0 var(--io-border-width) 0;\n    }\n    :host h1 {\n      padding: 0.5em 0;\n    }\n    :host h2 {\n      padding: 0.4em 0;\n    }\n    :host h3 {\n      padding: 0.3em 0;\n      border: 0;\n    }\n    :host h4 {\n      padding: 0.2em 0;\n      border: 0;\n    }\n    :host code {\n      font-family: monospace, monospace;\n      -webkit-font-smoothing: auto;\n      overflow: auto;\n      color: var(--io-color-link);\n    }\n    :host strong code {\n      background: var(--io-background-color-highlight);\n    }\n    :host pre > code {\n      background: var(--io-background-color-highlight);\n      color: inherit;\n      line-height: 1.6em;\n    }\n\n    :host code.language-html,\n    :host code.language-javascript {\n      padding: 1em;\n      display: block;\n      font-size: var(--io-code-size);\n    }\n    :host blockquote {\n      font-size: 0.85em;\n      opacity: 0.5;\n      margin: 0;\n      padding: var(--io-spacing) 0;\n    }\n    :host table  {\n      width: 100% !important;\n      border: 1px solid black;\n      border-collapse: collapse;\n      table-layout: fixed;\n    }\n    :host table td,\n    :host table tr,\n    :host table th {\n      border: 1px solid gray;\n      padding: 0.25em;\n      text-overflow: ellipsis;\n      overflow: hidden;\n    }\n    :host .videocontainer {\n        width: 100%;\n        height: 0;\n        position: relative;\n        padding-bottom: 56.25%;\n    }\n    :host .videocontainer > iframe {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n    }\n    @keyframes spinner {\n      to {transform: rotate(360deg);}\n    }\n    :host .io-loading {\n      background-image: repeating-linear-gradient(135deg, var(--io-background-color-highlight), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-highlight) 10px) !important;\n      background-repeat: repeat;\n      position: relative;\n    }\n    :host .io-loading:after {\n      content: '';\n      box-sizing: border-box;\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      width: 40px;\n      height: 40px;\n      margin-top: -20px;\n      margin-left: -20px;\n      border-radius: 50%;\n      border: var(--io-border);\n      border-top-color: #000;\n      animation: spinner .6s linear infinite;\n    }\n    "}static get Properties(){return{path:{type:String,reflect:1},role:"document"}}onResized(){let e=this.getBoundingClientRect().width;e=Math.min((e-30)/35,15),this.style.setProperty("--io-code-size",e+"px")}parseMarkdown(e){marked_1&&(marked_1&&marked_1.setOptions({sanitize:!1,highlight:function(e){return window.hljs?window.hljs.highlightAuto(e).value:null}}),this.innerHTML=marked_1(e),this.classList.toggle("io-loading",!1),this.dispatchEvent("content-ready",{},!0))}pathChanged(){this.classList.toggle("io-loading",!0),fetch(this.path).then(e=>e.text()).then(e=>{this.parseMarkdown(e)})}}IoMdView.Register();class IoMdViewSelector extends IoSelectorSidebar{update(){this.template([this.getSlotted(),["io-md-view",{id:"content",class:"io-content",path:this._selectedID}]])}}IoMdViewSelector.Register();class IoServiceLoader extends Node{static get Properties(){return{path:"service.js",serviceWorker:void 0,permission:window.Notification?window.Notification.permission:"default",subscription:""}}constructor(e){super(e),this.requestNotification=this.requestNotification.bind(this),"serviceWorker"in navigator&&this.init()}async init(){const e=await navigator.serviceWorker.register(this.path);e.update(),navigator.serviceWorker.addEventListener("message",this.onServiceWorkerMessage),e.active?this.serviceWorker=e:e.addEventListener("activate",()=>{this.serviceWorker=e})}serviceWorkerChanged(){"granted"===this.permission&&this.subscribe()}subscribe(){navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({command:"subscribe"})}async requestNotification(){this.permission=await window.Notification.requestPermission(),"granted"===this.permission&&this.subscribe()}onServiceWorkerMessage(e){const t=JSON.parse(e.data);t.subscription&&(this.subscription=JSON.stringify(t.subscription))}}IoServiceLoader.Register();class IoElementDemo extends IoElement{static get Style(){return"\n    :host {\n      @apply --io-panel;\n      position: relative;\n    }\n    :host > io-boolicon {\n      z-index: 2;\n      position: absolute !important;\n      top: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));\n      right: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));\n    }\n    :host > io-boolicon:not([value]):not(:hover) {\n      opacity: 0.5;\n    }\n    :host > io-properties {\n      align-self: stretch;\n      padding: var(--io-spacing) 0;\n      margin: var(--io-border-width);\n      margin-right: var(--io-spacing);\n      margin-bottom: calc(2 * var(--io-spacing));\n    }\n    :host > io-properties > :nth-child(3) {\n      margin-right: calc(var(--io-item-height) + var(--io-spacing));\n    }\n    :host > .io-content {\n      border-radius: var(--io-border-radius);\n      border: var(--io-border);\n      border-color: var(--io-color-border-inset);\n      padding: var(--io-spacing);\n      box-shadow: var(--io-shadow-inset);\n      color: var(--io-color);\n      background-color: var(--io-background-color);\n      background-image: none;\n    }\n    :host:not([expanded]) > .io-content {\n      margin-right: calc(var(--io-item-height) + calc(3 * var(--io-spacing)));\n    }\n    "}static get Properties(){return{element:{type:String,reflect:-1},properties:{type:Object,reflect:-1,observe:!0},width:{type:String,reflect:-1},height:{type:String,reflect:-1},config:{type:Object,reflect:-1},expanded:{type:Boolean,reflect:2}}}objectMutated(e){super.objectMutated(e);for(let t=this.__observedObjects.length;t--;){const n=this.__observedObjects[t],i=this.__properties[n].value;if(!!this.filterObject(i,t=>t===e.detail.object)){const e=this.querySelectorAll("*");for(let t=0;t<e.length;t++)e[t].changed&&e[t].changed()}}}propertiesChanged(){for(let e in this.properties){const t=this.properties[e];"string"==typeof t&&t.startsWith("demo:")&&(this.properties[e]=IoStorageFactory({key:t}))}}changed(){const e=this.properties,t=[["io-boolicon",{value:this.bind("expanded"),true:"icons:tune",false:"icons:tune"}]];this.expanded&&t.push(["io-properties",{value:e,config:Object.assign({"type:number":["io-number",{step:1e-5}],"type:boolean":["io-switch"]},this.config)}]),t.push(["div",{class:"io-content"},[[this.element,Object.assign({id:"demo-element"},e)]]]),this.template(t),this.width&&(this.$["demo-element"].style.width=this.width),this.height&&(this.$["demo-element"].style.height=this.height),this.$["demo-element"].onResized&&this.$["demo-element"].onResized()}}IoElementDemo.Register();export{IoElementDemo,IoMdView,IoMdViewSelector,IoServiceLoader};