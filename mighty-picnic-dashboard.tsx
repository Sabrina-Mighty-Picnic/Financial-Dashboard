import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell, PieChart, Pie } from "recharts";

const REV = [
  { m:"2024-01",r:461453,e:581287 },{ m:"2024-02",r:561768,e:354350 },{ m:"2024-03",r:358467,e:310723 },{ m:"2024-04",r:309980,e:233220 },
  { m:"2024-05",r:233412,e:186183 },{ m:"2024-06",r:244218,e:300575 },{ m:"2024-07",r:366602,e:152839 },{ m:"2024-08",r:302471,e:263326 },
  { m:"2024-09",r:345137,e:364092 },{ m:"2024-10",r:540762,e:475723 },{ m:"2024-11",r:459854,e:326440 },{ m:"2024-12",r:222257,e:460080 },
  { m:"2025-01",r:514116,e:386518 },{ m:"2025-02",r:388844,e:329706 },{ m:"2025-03",r:445804,e:417876 },{ m:"2025-04",r:369681,e:193852 },
  { m:"2025-05",r:338862,e:270625 },{ m:"2025-06",r:361468,e:322354 },{ m:"2025-07",r:242300,e:319308 },{ m:"2025-08",r:453011,e:299354 },
  { m:"2025-09",r:281992,e:322942 },{ m:"2025-10",r:574826,e:403211 },{ m:"2025-11",r:500408,e:300300 },{ m:"2025-12",r:491871,e:457936 },
  { m:"2026-01",r:566861,e:677523 },{ m:"2026-02",r:1028283,e:585364 },{ m:"2026-03",r:690396,e:653377 },{ m:"2026-04",r:356747,e:397233 },
];

const ARS = [
  { m:"2024-01",inv:29,b:457901,d:50 },{ m:"2024-02",inv:22,b:558283,d:55 },{ m:"2024-03",inv:17,b:356469,d:30 },{ m:"2024-04",inv:19,b:305952,d:30 },
  { m:"2024-05",inv:11,b:230000,d:30 },{ m:"2024-06",inv:16,b:242833,d:40 },{ m:"2024-07",inv:16,b:365494,d:32 },{ m:"2024-08",inv:25,b:298729,d:33 },
  { m:"2024-09",inv:14,b:342164,d:30 },{ m:"2024-10",inv:22,b:538103,d:28 },{ m:"2024-11",inv:18,b:457412,d:32 },{ m:"2024-12",inv:17,b:218958,d:26 },
  { m:"2025-01",inv:25,b:509830,d:30 },{ m:"2025-02",inv:17,b:386657,d:32 },{ m:"2025-03",inv:15,b:442598,d:33 },{ m:"2025-04",inv:16,b:366974,d:28 },
  { m:"2025-05",inv:14,b:338075,d:38 },{ m:"2025-06",inv:13,b:358077,d:37 },{ m:"2025-07",inv:13,b:241580,d:47 },{ m:"2025-08",inv:26,b:448862,d:38 },
  { m:"2025-09",inv:17,b:280850,d:26 },{ m:"2025-10",inv:40,b:572757,d:29 },{ m:"2025-11",inv:24,b:499024,d:30 },{ m:"2025-12",inv:40,b:491192,d:32 },
  { m:"2026-01",inv:41,b:566861,d:34 },{ m:"2026-02",inv:50,b:1028283,d:24 },{ m:"2026-03",inv:38,b:698602,d:34 },{ m:"2026-04",inv:14,b:374001,d:21 },
];

const CUST = [
  { n:"Blue Apron / Fresh Realm", r24:1387900, r25:2136918, r26:955563,  r25jf:379634 },
  { n:"Hello Fresh",               r24:2648059, r25:2070192, r26:809275,  r25jf:396252 },
  { n:"Factor75",                  r24:0,       r25:290352,  r26:401625,  r25jf:0 },
  { n:"GloriAnn Farms",            r24:0,       r25:0,       r26:208790,  r25jf:0 },
  { n:"Marley Spoon",              r24:37905,   r25:130676,  r26:16800,   r25jf:17000 },
  { n:"Great Eastern Seafood",     r24:0,       r25:0,       r26:87125,   r25jf:0 },
  { n:"A-Sha Foods",               r24:0,       r25:460,     r26:68373,   r25jf:0 },
  { n:"Green Chef",                r24:0,       r25:71504,   r26:50717,   r25jf:49580 },
  { n:"Purple Carrot",             r24:201189,  r25:120771,  r26:24939,   r25jf:22014 },
  { n:"Feast Food",                r24:0,       r25:0,       r26:10979,   r25jf:0 },
  { n:"Russ & Daughters",         r24:0,       r25:0,       r26:8350,    r25jf:0 },
  { n:"Hillside Harvest",          r24:6360,    r25:67326,   r26:0,       r25jf:11154 },
  { n:"Jukebox (JBE)",             r24:12603,   r25:41860,   r26:0,       r25jf:22825 },
  { n:"Shopify Sales",             r24:35683,   r25:21253,   r26:0,       r25jf:4242 },
];

const NEW_CUST = [
  { m:"2024-01",c:8 },{ m:"2024-02",c:4 },{ m:"2024-04",c:2 },{ m:"2024-06",c:1 },
  { m:"2024-08",c:2 },{ m:"2024-09",c:1 },{ m:"2024-11",c:1 },{ m:"2024-12",c:3 },
  { m:"2025-01",c:1 },{ m:"2025-02",c:1 },{ m:"2025-03",c:1 },{ m:"2025-06",c:1 },
  { m:"2025-10",c:3 },{ m:"2026-02",c:2 },{ m:"2026-03",c:1 },
];

const NEW_SKU = [
  { m:"2024-01",s:19 },{ m:"2024-02",s:5 },{ m:"2024-03",s:4 },{ m:"2024-04",s:4 },
  { m:"2024-05",s:2 },{ m:"2024-07",s:1 },{ m:"2024-09",s:2 },{ m:"2024-10",s:4 },
  { m:"2024-11",s:1 },{ m:"2025-01",s:2 },{ m:"2025-02",s:1 },{ m:"2025-04",s:1 },
  { m:"2025-05",s:1 },{ m:"2025-06",s:8 },{ m:"2025-07",s:1 },{ m:"2025-08",s:4 },
  { m:"2025-09",s:1 },{ m:"2025-10",s:1 },{ m:"2025-11",s:1 },{ m:"2025-12",s:2 },
  { m:"2026-02",s:1 },{ m:"2026-03",s:1 },
];

const NEW_CUST_DETAIL = [
  { n:"Blue Apron LLC",d:"2024-01-02" },{ n:"Farmer Foodie",d:"2024-01-08" },{ n:"The Friends Experience",d:"2024-01-15" },
  { n:"Jukebox (JBE)",d:"2024-01-16" },{ n:"McMahon's Farm",d:"2024-01-17" },{ n:"Bespoke Post",d:"2024-01-18" },
  { n:"Hello Fresh",d:"2024-01-18" },{ n:"Shopify Sales",d:"2024-01-31" },{ n:"133 Greenwich LLC",d:"2024-02-13" },
  { n:"Just Date",d:"2024-02-13" },{ n:"Purple Carrot",d:"2024-02-14" },{ n:"Longaberger Sales",d:"2024-02-29" },
  { n:"Global Grub",d:"2024-04-11" },{ n:"T.H.E.M. of NJ",d:"2024-04-17" },{ n:"Marley Spoon",d:"2024-06-18" },
  { n:"Hillside Harvest",d:"2024-08-14" },{ n:"Morris National",d:"2024-08-21" },{ n:"Campe Diem",d:"2024-09-04" },
  { n:"Russ & Daughters",d:"2024-11-22" },{ n:"Great Jones Distilling",d:"2024-12-02" },{ n:"BKLYN Larder",d:"2024-12-12" },
  { n:"Team Bondy",d:"2024-12-13" },{ n:"Green Chef",d:"2025-01-17" },{ n:"Blake Hill Preserves",d:"2025-02-03" },
  { n:"True Made Foods",d:"2025-03-25" },{ n:"Factor75",d:"2025-06-19" },{ n:"Spread MMMs",d:"2025-10-15" },
  { n:"A-Sha Foods",d:"2025-10-22" },{ n:"Goldman Sachs Foundation",d:"2025-10-24" },
  { n:"Great Eastern Seafood",d:"2026-02-12" },{ n:"Feast Food Enterprises",d:"2026-02-17" },{ n:"GloriAnn Farms",d:"2026-03-03" },
];

const NEW_SKU_DETAIL = [
  { n:"TJS Orange Marmalade 1oz",d:"2024-01-02" },{ n:"TJS Raspberry Jalap. 1oz",d:"2024-01-02" },
  { n:"BA Peanut Butter .7oz",d:"2024-01-02" },{ n:"TJS Honey .5oz",d:"2024-01-02" },
  { n:"TJS Friends Strawberry 10oz",d:"2024-01-15" },{ n:"TJS Blueberry Bourbon 10oz",d:"2024-01-16" },
  { n:"TJS Drunken Monkey 10oz",d:"2024-01-16" },{ n:"TJS Raspberry Jalap. 10oz",d:"2024-01-16" },
  { n:"TJS Sweet Wino Onion 10oz",d:"2024-01-16" },{ n:"TJS Fig Tamarind 10oz",d:"2024-01-17" },
  { n:"TJS Rethink Strawberry 10oz",d:"2024-01-18" },{ n:"Peanut Butter 1.15oz",d:"2024-01-18" },
  { n:"HF Cherry 1oz",d:"2024-01-23" },{ n:"HF Apricot 1oz",d:"2024-01-25" },
  { n:"HF Cranberry 1oz",d:"2024-01-25" },{ n:"HF Peach 1oz",d:"2024-01-25" },
  { n:"HF Red Pepper 1oz",d:"2024-01-26" },{ n:"TJS Orange Marmalade 10oz",d:"2024-01-31" },
  { n:"TJS Blueberry Bourbon 1oz",d:"2024-01-31" },{ n:"Sesame Oil .5oz",d:"2024-02-01" },
  { n:"Apple Cider Vinegar .5oz",d:"2024-02-01" },{ n:"HF Plum 1oz",d:"2024-02-13" },
  { n:"Rice Vinegar .5oz",d:"2024-02-14" },{ n:"Tamari Soy .33oz (Arch)",d:"2024-02-14" },
  { n:"BA Mirin .5oz",d:"2024-03-26" },{ n:"BA Black Vinegar .5oz",d:"2024-03-26" },
  { n:"BA Ponzu .5oz",d:"2024-03-26" },{ n:"Tamari Soy .33oz",d:"2024-03-28" },
  { n:"BA Soy Sauce .5oz",d:"2024-04-09" },{ n:"BA Worcestershire 1oz",d:"2024-04-09" },
  { n:"BA Soy Sauce 1oz",d:"2024-04-09" },{ n:"HF Fig 1oz",d:"2024-04-12" },
  { n:"BA Peanut Butter Spread .7oz",d:"2024-05-03" },{ n:"BA Hoisin 1.38oz",d:"2024-05-17" },
  { n:"BA Rice Vinegar .5oz",d:"2024-07-23" },{ n:"Maple Syrup 1oz",d:"2024-09-17" },
  { n:"BA Preserved Lemon 6g",d:"2024-09-25" },{ n:"Agave Syrup .5oz",d:"2024-10-21" },
  { n:"TJS Strawberry Jalap. 1oz",d:"2024-10-28" },{ n:"BA Pomegranate .5oz",d:"2024-10-30" },
  { n:"Worcestershire 1oz",d:"2024-10-30" },{ n:"RD Blueberry Vanilla 10oz",d:"2024-11-22" },
  { n:"Jamaican Jerk Sauce 1.5oz",d:"2025-01-14" },{ n:"BA Peanut Butter (Salted) .7oz",d:"2025-01-27" },
  { n:"BA Blazing Buffalo 2oz",d:"2025-02-10" },{ n:"HF Honey .5oz",d:"2025-04-16" },
  { n:"HF Peanut Butter 1.15oz",d:"2025-05-16" },{ n:"CRAIT Apple Cider Vin. .5oz",d:"2025-06-10" },
  { n:"BA Gochujang 10g",d:"2025-06-17" },{ n:"BA Dijonnaise 18g",d:"2025-06-17" },
  { n:"BA Ketchup 21g",d:"2025-06-17" },{ n:"BA Red Harissa 21g",d:"2025-06-17" },
  { n:"BA Ketchup 62g",d:"2025-06-17" },{ n:"BA Hot Sauce 15g",d:"2025-06-24" },
  { n:"BA Black Bean Sauce 56g",d:"2025-06-24" },{ n:"BA Soy Miso 56g",d:"2025-07-08" },
  { n:"BA Sweet Chili 51g",d:"2025-08-07" },{ n:"Red Wine Vinegar .5oz",d:"2025-08-12" },
  { n:"BA Sambal 21g",d:"2025-08-14" },{ n:"BA Chipotle .5oz (9g)",d:"2025-08-14" },
  { n:"HF Maple Syrup 1oz",d:"2025-09-30" },{ n:"BA Whole Grain Dijon 21g",d:"2025-10-20" },
  { n:"Sherry Wine Vinegar",d:"2025-11-18" },{ n:"BA Dijon Mustard 21g",d:"2025-12-22" },
  { n:"Bacon Jam (Uncured) 1oz",d:"2025-12-26" },{ n:"Fresh Catch Thai-Ger 7oz",d:"2026-02-12" },
  { n:"Parmesan Cheese 1oz (Cases)",d:"2026-03-03" },
];

const SO_PIPELINE = [
  { so:"SO482",d:"1/26/2026",c:"Fresh Realm",a:14240,st:"Partially Fulfilled" },
  { so:"SO480",d:"2/2/2026",c:"Fresh Realm",a:24000,st:"Pending Fulfillment" },
  { so:"SO573",d:"3/17/2026",c:"Hello Fresh",a:1974,st:"Pending Billing" },
  { so:"SO492",d:"3/24/2026",c:"GloriAnn Farms",a:26385,st:"Partially Fulfilled" },
  { so:"SO552",d:"3/27/2026",c:"Fresh Realm",a:14410,st:"Pending Fulfillment" },
  { so:"SO611",d:"4/30/2026",c:"Marley Spoon",a:8400,st:"Pending Fulfillment" },
  { so:"SO605",d:"5/4/2026",c:"Hello Fresh",a:6000,st:"Pending Fulfillment" },
  { so:"SO606",d:"5/4/2026",c:"Hello Fresh",a:6000,st:"Pending Fulfillment" },
  { so:"SO607",d:"5/4/2026",c:"Hello Fresh",a:3000,st:"Pending Fulfillment" },
  { so:"SO608",d:"5/4/2026",c:"Hello Fresh",a:6000,st:"Pending Fulfillment" },
  { so:"SO609",d:"5/4/2026",c:"Hello Fresh",a:3000,st:"Pending Fulfillment" },
  { so:"SO634",d:"5/5/2026",c:"Fresh Realm",a:40000,st:"Pending Fulfillment" },
  { so:"SO562",d:"5/8/2026",c:"Fresh Realm",a:14481,st:"Pending Fulfillment" },
  { so:"SO578",d:"5/8/2026",c:"Fresh Realm",a:35175,st:"Pending Fulfillment" },
  { so:"SO615",d:"5/8/2026",c:"Fresh Realm",a:47230,st:"Pending Fulfillment" },
  { so:"SO622",d:"5/8/2026",c:"Fresh Realm",a:17811,st:"Pending Fulfillment" },
  { so:"SO647",d:"5/8/2026",c:"Fresh Realm",a:4284,st:"Pending Fulfillment" },
  { so:"SO612",d:"5/11/2026",c:"Hello Fresh",a:48024,st:"Pending Fulfillment" },
  { so:"SO614",d:"5/11/2026",c:"Hello Fresh",a:50400,st:"Pending Fulfillment" },
  { so:"SO641",d:"5/11/2026",c:"Green Chef",a:10536,st:"Pending Fulfillment" },
  { so:"SO616",d:"5/18/2026",c:"Fresh Realm",a:18000,st:"Pending Fulfillment" },
  { so:"SO627",d:"5/18/2026",c:"Hello Fresh",a:52920,st:"Pending Fulfillment" },
  { so:"SO635",d:"5/20/2026",c:"Purple Carrot",a:22200,st:"Pending Fulfillment" },
  { so:"SO631",d:"5/21/2026",c:"Hello Fresh",a:14000,st:"Pending Fulfillment" },
  { so:"SO642",d:"5/21/2026",c:"Hello Fresh",a:10080,st:"Pending Fulfillment" },
  { so:"SO643",d:"5/21/2026",c:"Hello Fresh",a:10080,st:"Pending Fulfillment" },
  { so:"SO617",d:"5/25/2026",c:"Fresh Realm",a:27327,st:"Pending Fulfillment" },
  { so:"SO557",d:"5/29/2026",c:"Fresh Realm",a:28802,st:"Pending Fulfillment" },
  { so:"SO625",d:"5/29/2026",c:"Fresh Realm",a:9540,st:"Pending Fulfillment" },
  { so:"SO648",d:"5/29/2026",c:"Fresh Realm",a:35728,st:"Pending Fulfillment" },
  { so:"SO649",d:"5/29/2026",c:"Fresh Realm",a:7381,st:"Pending Fulfillment" },
  { so:"SO650",d:"5/29/2026",c:"Fresh Realm",a:13754,st:"Pending Fulfillment" },
  { so:"SO619",d:"6/1/2026",c:"A-Sha Foods",a:71485,st:"Pending Fulfillment" },
  { so:"SO632",d:"6/1/2026",c:"Hello Fresh",a:27216,st:"Pending Fulfillment" },
  { so:"SO633",d:"6/1/2026",c:"Hello Fresh",a:27216,st:"Pending Fulfillment" },
  { so:"SO638",d:"6/3/2026",c:"Hello Fresh",a:17808,st:"Pending Fulfillment" },
  { so:"SO639",d:"6/3/2026",c:"Hello Fresh",a:17808,st:"Pending Fulfillment" },
  { so:"SO640",d:"6/3/2026",c:"Jukebox (JBE)",a:6450,st:"Pending Fulfillment" },
  { so:"SO644",d:"6/3/2026",c:"Hello Fresh",a:9434,st:"Pending Fulfillment" },
  { so:"SO637",d:"6/8/2026",c:"Hello Fresh",a:23305,st:"Pending Fulfillment" },
  { so:"SO645",d:"6/8/2026",c:"Hello Fresh",a:20736,st:"Pending Fulfillment" },
  { so:"SO651",d:"6/10/2026",c:"Hello Fresh",a:10080,st:"Pending Fulfillment" },
  { so:"SO652",d:"6/10/2026",c:"Hello Fresh",a:10080,st:"Pending Fulfillment" },
  { so:"SO653",d:"6/10/2026",c:"Hello Fresh",a:10080,st:"Pending Fulfillment" },
  { so:"SO654",d:"6/10/2026",c:"Hello Fresh",a:10080,st:"Pending Fulfillment" },
  { so:"SO655",d:"6/10/2026",c:"Hello Fresh",a:10080,st:"Pending Fulfillment" },
  { so:"SO646",d:"6/18/2026",c:"Hello Fresh",a:33120,st:"Pending Fulfillment" },
  { so:"SO636",d:"6/22/2026",c:"Hello Fresh",a:27216,st:"Pending Fulfillment" },
];

const PROFIT = {
  "2025": {
    items: [
      { s:"TJS Honey .5oz",         rev:465640,  cst:242421,  pft:223219, gp:47.9 },
      { s:"HF Cranberry 1oz",       rev:392580,  cst:260784,  pft:131796, gp:33.6 },
      { s:"BA Soy Sauce .5oz",      rev:164260,  cst:87185,   pft:77075,  gp:46.9 },
      { s:"HF Red Pepper 1oz",      rev:205140,  cst:137463,  pft:67677,  gp:33.0 },
      { s:"Maple Syrup 1oz",        rev:330408,  cst:270523,  pft:59885,  gp:18.1 },
      { s:"BA Blazing Buffalo 2oz", rev:155766,  cst:106276,  pft:49490,  gp:31.8 },
      { s:"BA Hoisin 1.38oz",       rev:150907,  cst:101996,  pft:48911,  gp:32.4 },
      { s:"HF Apricot 1oz",         rev:174074,  cst:126765,  pft:47309,  gp:27.2 },
      { s:"BA Dijonnaise 18g",      rev:99778,   cst:52573,   pft:47205,  gp:47.3 },
      { s:"HF Fig 1oz",             rev:126840,  cst:84407,   pft:42433,  gp:33.5 },
      { s:"Sesame Oil .5oz",        rev:222648,  cst:190567,  pft:32081,  gp:14.4 },
      { s:"HF Peanut Butter 1.15oz",rev:143820,  cst:117762,  pft:26058,  gp:18.1 },
      { s:"BA Soy Miso 56g",        rev:59208,   cst:34880,   pft:24329,  gp:41.1 },
      { s:"HF Maple Syrup 1oz",     rev:112320,  cst:88073,   pft:24247,  gp:21.6 },
    ],
    totals: { rev:4943813, cst:3401067, pft:1542746, gp:31.2 },
  },
  "2026": {
    items: [
      { s:"TJS Honey .5oz",          rev:150880, cst:79362,  pft:71518, gp:47.4 },
      { s:"Avocado Mayo 30# (Bulk)", rev:401625, cst:338143, pft:63483, gp:15.8 },
      { s:"BA Sambal 21g",           rev:89184,  cst:46046,  pft:43138, gp:48.4 },
      { s:"HF Fig 1oz",              rev:116580, cst:76583,  pft:39997, gp:34.3 },
      { s:"BA Sweet Chili 51g",      rev:138526, cst:104850, pft:33676, gp:24.3 },
      { s:"HF Cranberry 1oz",        rev:87240,  cst:58302,  pft:28938, gp:33.2 },
      { s:"Fresh Catch Thai-Ger 7oz",rev:85425,  cst:58220,  pft:27205, gp:31.8 },
      { s:"BA Hoisin 1.38oz",        rev:81116,  cst:55130,  pft:25986, gp:32.0 },
      { s:"HF Apricot 1oz",          rev:100701, cst:75455,  pft:25246, gp:25.1 },
      { s:"BA Soy Sauce .5oz",       rev:58376,  cst:34602,  pft:23774, gp:40.7 },
      { s:"HF Peanut Butter 1.15oz", rev:116940, cst:94859,  pft:22081, gp:18.9 },
      { s:"GC Apricot 5gal",         rev:50717,  cst:31142,  pft:19575, gp:38.6 },
      { s:"Parmesan Cheese 1oz",     rev:104869, cst:86423,  pft:18447, gp:17.6 },
      { s:"BA Dijonnaise 18g",       rev:34631,  cst:18021,  pft:16610, gp:48.0 },
    ],
    totals: { rev:2614789, cst:1894891, pft:719898, gp:27.5 },
  },
  "2024": {
    items: [
      { s:"TJS Honey .5oz",         rev:684241, cst:370000, pft:314241, gp:45.9 },
      { s:"Peanut Butter 1.15oz",   rev:593466, cst:400000, pft:193466, gp:32.6 },
      { s:"Maple Syrup 1oz",        rev:488016, cst:350000, pft:138016, gp:28.3 },
      { s:"HF Cherry 1oz",          rev:376320, cst:250000, pft:126320, gp:33.6 },
      { s:"HF Apricot 1oz",         rev:313950, cst:210000, pft:103950, gp:33.1 },
      { s:"HF Red Pepper 1oz",      rev:300560, cst:200000, pft:100560, gp:33.5 },
      { s:"BA Hoisin 1.38oz",       rev:128080, cst:86000,  pft:42080,  gp:32.9 },
      { s:"HF Fig 1oz",             rev:117318, cst:78000,  pft:39318,  gp:33.5 },
      { s:"HF Cranberry 1oz",       rev:113244, cst:75000,  pft:38244,  gp:33.8 },
      { s:"Sesame Oil .5oz",        rev:145432, cst:110000, pft:35432,  gp:24.4 },
    ],
    totals: { rev:4393739, cst:3243178, pft:1150561, gp:26.2 },
  },
};

const FG_INV = [
  { n:"HF Honey .5oz",        oh:524000, v:52613 },
  { n:"BA Pomegranate .5oz",  oh:108400, v:34785 },
  { n:"BA Worcestershire 1oz",oh:153400, v:25029 },
  { n:"BA Ponzu .5oz",        oh:123600, v:13310 },
  { n:"BA PB Spread .7oz",    oh:54400,  v:10617 },
  { n:"HF Red Pepper 1oz",    oh:33600,  v:8252  },
  { n:"BA Soy Sauce .5oz",    oh:25200,  v:2357  },
  { n:"Nuoc Cham 1oz",        oh:12200,  v:2529  },
  { n:"HF Peach 1oz",         oh:4800,   v:1076  },
  { n:"Rice Vinegar .5oz",    oh:14800,  v:1175  },
  { n:"Ponzu Bulk Pack .5oz", oh:10200,  v:788   },
  { n:"BA Blazing Buffalo 2oz",oh:1896,  v:674   },
  { n:"FILM BA Sweet Chili",  oh:12975,  v:648   },
  { n:"Bacon Jam 1oz",        oh:1200,   v:450   },
  { n:"HF Fig 1oz",           oh:1200,   v:233   },
  { n:"TJS BB 1oz",           oh:600,    v:183   },
  { n:"Fish Sauce .5oz",      oh:400,    v:83    },
  { n:"BA Sambal 21g",        oh:355,    v:44    },
  { n:"BA Hoisin 1.38oz",     oh:200,    v:42    },
];

const BULK_INV = [
  { n:"BA Repeat 75mm Film",      oh:191260000, v:63586, c:"Film" },
  { n:"Maple Syrup Bulk",         oh:13492,     v:40476, c:"Bulk" },
  { n:"Greek Vinaigrette Bulk",   oh:21895,     v:32843, c:"Bulk" },
  { n:"BA Repeat (Lamick Meter)", oh:116650,    v:28817, c:"Film" },
  { n:"TJS Honey Film (Meter)",   oh:116460,    v:23493, c:"Film" },
  { n:"Honey (Deer Creek)",       oh:12154,     v:19422, c:"Bulk" },
  { n:"Shipper Case Box",         oh:24754,     v:19752, c:"Pkg"  },
  { n:"HF Honey Film (Meter)",    oh:73393,     v:18274, c:"Film" },
  { n:"HF Peanut Butter Film",    oh:476685,    v:16107, c:"Film" },
  { n:"Lamick White Film",        oh:59974,     v:13242, c:"Film" },
  { n:"Dijonnaise",               oh:2930,      v:13041, c:"Bulk" },
  { n:"HF Maple Film",            oh:59729,     v:12611, c:"Film" },
  { n:"Gochujang",                oh:3520,      v:11344, c:"Bulk" },
  { n:"BA Sweet Chili 51g Film",  oh:38500,     v:10395, c:"Film" },
  { n:"Lamick Silver Film",       oh:61100,     v:9776,  c:"Film" },
  { n:"TJS Strawberry Jalap Film",oh:18999,     v:6575,  c:"Film" },
  { n:"TJS Honey Film (.5oz)",    oh:600935,    v:6009,  c:"Film" },
  { n:"Fish Sauce (Bulk)",        oh:4196,      v:5881,  c:"Bulk" },
  { n:"BA Repeat Foil 75mm",      oh:11130000,  v:5603,  c:"Film" },
  { n:"Hillside Harvest Jerk Film",oh:124147,   v:5276,  c:"Film" },
  { n:"HF Cherry Film",           oh:19200,     v:4781,  c:"Film" },
  { n:"BA Chipotle 9g (Lamick)",  oh:17320,     v:4676,  c:"Film" },
  { n:"3C VMet12 Repeat (Lamick)",oh:19420,     v:4624,  c:"Film" },
  { n:"HF Apricot Film",          oh:17750,     v:4420,  c:"Film" },
  { n:"Lamick Crait Repeat",      oh:15500,     v:4352,  c:"Film" },
  { n:"Lamick Opaque White",      oh:20464,     v:5667,  c:"Film" },
  { n:"GE Thai-Ger Film",         oh:2850,      v:2645,  c:"Film" },
  { n:"HF Fig Film",              oh:11180,     v:2784,  c:"Film" },
  { n:"TJS BB Film (Meter)",      oh:10218,     v:3534,  c:"Film" },
  { n:"Sambal Oelek",             oh:2162,      v:3285,  c:"Bulk" },
  { n:"HF Plum Film",             oh:11303,     v:2708,  c:"Film" },
  { n:"HF Peach Film",            oh:9220,      v:2209,  c:"Film" },
  { n:"Whole Grain Dijon",        oh:1400,      v:1712,  c:"Bulk" },
  { n:"Rice Vinegar (Bulk)",      oh:1258,      v:950,   c:"Bulk" },
  { n:"Sherry Wine Vinegar",      oh:223,       v:361,   c:"Bulk" },
];

const INV_VAL    = { total:575232, fg:154969, fgP:26.9, rm:420263, rmP:73.1 };
const TOP_VAL    = [
  { i:"BA Repeat 75mm Film",        v:63586, p:11.1 },
  { i:"HF Honey .5oz (FG)",         v:52613, p:9.1  },
  { i:"Maple Syrup Bulk",           v:40476, p:7.0  },
  { i:"BA Pomegranate .5oz (FG)",   v:34785, p:6.0  },
  { i:"Greek Vinaigrette Bulk",     v:32843, p:5.7  },
  { i:"BA Repeat (Lamick Meter)",   v:28817, p:5.0  },
  { i:"BA Worcestershire 1oz (FG)", v:25029, p:4.4  },
  { i:"TJS Honey Film (Meter)",     v:23493, p:4.1  },
  { i:"HF Peanut Butter Film",      v:16107, p:2.8  },
];
const INV_METRICS = {
  "2026":{ begVal:631384, endVal:575232, cogs:1894891, days:120 },
  "2025":{ begVal:461966, endVal:565951, cogs:3401067, days:365 },
  "2024":{ begVal:461966, endVal:461966, cogs:3243178, days:365 },
};

const QTR_MARGIN = [
  { s:"TJS Honey .5oz",          q1:43.1,q2:55.9,q3:53.3,q4:48.6,q126:47.4, r1:139400,r2:142320,r3:73280, r4:110640,r126:150880 },
  { s:"HF Cranberry 1oz",        q1:34.1,q2:28.6,q3:34.3,q4:33.4,q126:33.2, r1:171660,r2:20400, r3:110880,r4:89640, r126:87240  },
  { s:"BA Soy Sauce .5oz",       q1:48.3,q2:0,   q3:47.8,q4:46.2,q126:40.7, r1:81328, r2:0,     r3:32612, r4:50320, r126:58376  },
  { s:"HF Red Pepper 1oz",       q1:32.8,q2:34.1,q3:32.0,q4:32.9,q126:33.2, r1:80820, r2:55440, r3:52680, r4:16200, r126:48720  },
  { s:"BA Hoisin 1.38oz",        q1:30.5,q2:38.4,q3:33.7,q4:35.9,q126:32.0, r1:73368, r2:17165, r3:32840, r4:27535, r126:81116  },
  { s:"BA Blazing Buffalo 2oz",  q1:27.5,q2:29.5,q3:34.2,q4:40.9,q126:38.1, r1:42666, r2:40560, r3:33306, r4:39234, r126:31512  },
  { s:"HF Apricot 1oz",          q1:0,   q2:33.0,q3:24.0,q4:21.3,q126:25.1, r1:0,     r2:75600, r3:53424, r4:45050, r126:100701 },
  { s:"BA Dijonnaise 18g",       q1:0,   q2:51.8,q3:51.6,q4:45.6,q126:48.0, r1:0,     r2:14401, r3:12858, r4:72519, r126:34631  },
  { s:"HF Fig 1oz",              q1:31.9,q2:0,   q3:0,   q4:34.5,q126:34.3, r1:40380, r2:0,     r3:0,     r4:86460, r126:116580 },
  { s:"BA Sambal 21g",           q1:0,   q2:0,   q3:51.7,q4:44.9,q126:48.4, r1:0,     r2:0,     r3:21065, r4:34168, r126:89184  },
  { s:"BA Sweet Chili 51g",      q1:0,   q2:0,   q3:18.3,q4:23.2,q126:24.3, r1:0,     r2:0,     r3:34110, r4:38498, r126:138526 },
  { s:"Sesame Oil .5oz",         q1:16.0,q2:32.9,q3:11.0,q4:9.7, q126:7.8,  r1:104688,r2:22200, r3:16704, r4:79056, r126:27864  },
  { s:"HF Peanut Butter 1.15oz", q1:0,   q2:19.0,q3:27.6,q4:17.9,q126:18.9, r1:0,     r2:65820, r3:61680, r4:16320, r126:116940 },
  { s:"BA Gochujang 10g",        q1:0,   q2:43.0,q3:40.6,q4:35.5,q126:36.6, r1:0,     r2:16524, r3:15988, r4:31709, r126:32602  },
  { s:"BA Soy Miso 56g",         q1:0,   q2:0,   q3:39.6,q4:44.9,q126:37.2, r1:0,     r2:0,     r3:16071, r4:43137, r126:29019  },
  { s:"BA Mirin .5oz",           q1:0,   q2:36.0,q3:39.5,q4:39.5,q126:42.1, r1:0,     r2:9588,  r3:9520,  r4:29444, r126:39304  },
  { s:"BA Hot Sauce 15g",        q1:0,   q2:34.9,q3:35.9,q4:17.9,q126:37.9, r1:0,     r2:9055,  r3:34337, r4:16879, r126:27237  },
  { s:"Fresh Catch Thai-Ger 7oz",q1:0,   q2:0,   q3:0,   q4:0,   q126:31.8, r1:0,     r2:0,     r3:0,     r4:0,     r126:85425  },
  { s:"BA Black Bean 56g",       q1:0,   q2:46.1,q3:48.2,q4:45.6,q126:43.5, r1:0,     r2:13955, r3:15690, r4:27442, r126:36389  },
  { s:"Maple Syrup 1oz",         q1:20.6,q2:17.5,q3:0,   q4:0,   q126:0,    r1:115488,r2:214920,r3:0,     r4:0,     r126:0      },
];

const QTRS        = ["Q1'25","Q2'25","Q3'25","Q4'25","Q1'26"];
const QTR_KEYS    = ["q1","q2","q3","q4","q126"];
const QTR_REV_KEYS= ["r1","r2","r3","r4","r126"];

const QTR_INV = [
  { q:"Q4'24",  total:461966, fg:190632, rm:271334 },
  { q:"Q1'25",  total:563588, fg:134641, rm:428947 },
  { q:"Q2'25",  total:465497, fg:101939, rm:363558 },
  { q:"Q3'25",  total:595805, fg:192765, rm:403041 },
  { q:"Q4'25",  total:565951, fg:126769, rm:439182 },
  { q:"Q1'26*", total:631384, fg:228502, rm:402882 },
  { q:"Apr '26",total:575232, fg:154969, rm:420263 },
];

const AR_AGING = [
  { c:"Blue Apron LLC",   inv:35, total:624215, avg:84,  o60:259469, o3060:364746, cur:0      },
  { c:"Factor75",         inv:3,  total:178532, avg:10,  o60:0,      o3060:0,      cur:178532 },
  { c:"Hello Fresh",      inv:6,  total:109698, avg:30,  o60:0,      o3060:0,      cur:105738 },
  { c:"Marley Spoon",     inv:2,  total:16800,  avg:100, o60:16800,  o3060:0,      cur:0      },
  { c:"Feast Food",       inv:1,  total:4229,   avg:13,  o60:0,      o3060:0,      cur:4229   },
  { c:"Russ & Daughters", inv:1,  total:559,    avg:36,  o60:0,      o3060:559,    cur:0      },
  { c:"McMahon's Farm",   inv:1,  total:153,    avg:143, o60:153,    o3060:0,      cur:0      },
];

const C = {
  bg:"#faf8f5", sf:"#ffffff", bd:"#e8e2d9", tx:"#2d2a26", mt:"#8c857a",
  ac:"#c06014", acL:"rgba(192,96,20,0.08)",
  gn:"#3a7d44", gnL:"rgba(58,125,68,0.08)",
  rd:"#c0392b", rdL:"rgba(192,57,43,0.08)",
  am:"#d4a017", pr:"#7b5ea7", cy:"#2980b9", tl:"#5b4a3f",
};

const fmt = (n) => {
  if (typeof n !== "number") return "$0";
  if (n >= 1e6) return "$" + (n/1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + (n/1e3).toFixed(0) + "K";
  return "$" + n.toFixed(0);
};
const ff  = (n) => "$" + Math.round(n||0).toLocaleString();
const fN  = (n) => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? (n/1e3).toFixed(0)+"K" : String(Math.round(n));
const pc  = (n) => (typeof n === "number" ? n.toFixed(1) : "0") + "%";
const ml  = (m) => {
  const p = m.split("-");
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(p[1],10)-1] + " '" + p[0].slice(2);
};

function KPI({ label, value, sub, trend, up }) {
  const hasT  = trend !== undefined;
  const arrow = hasT && trend < 0 ? "\u25BC" : "\u25B2";
  const tClr  = up ? C.gn : C.rd;
  const tBg   = up ? C.gnL : C.rdL;
  return (
    <div style={{ background:C.sf, border:"1px solid "+C.bd, borderRadius:12, padding:"20px 24px", flex:1, minWidth:170, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize:11, fontWeight:600, color:C.mt, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:700, color:C.tx, lineHeight:1.1 }}>{value}</div>
      {sub ? <div style={{ fontSize:12, color:C.mt, marginTop:4 }}>{sub}</div> : null}
      {hasT ? (
        <div style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:8, fontSize:11, fontWeight:600, color:tClr, background:tBg, padding:"3px 10px", borderRadius:6 }}>
          {arrow} {Math.abs(trend).toFixed(1)}% vs LY
        </div>
      ) : null}
    </div>
  );
}

function Sec({ children, sub }) {
  return (
    <div style={{ marginBottom:16, marginTop:36 }}>
      <h2 style={{ fontSize:17, fontWeight:700, color:C.tl, margin:0 }}>{children}</h2>
      {sub ? <p style={{ fontSize:13, color:C.mt, margin:"4px 0 0" }}>{sub}</p> : null}
    </div>
  );
}

function Cd({ children, title }) {
  return (
    <div style={{ background:C.sf, border:"1px solid "+C.bd, borderRadius:12, padding:24, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
      {title ? <div style={{ fontSize:14, fontWeight:600, color:C.tl, marginBottom:16 }}>{title}</div> : null}
      {children}
    </div>
  );
}

function TT({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background:C.sf, border:"1px solid "+C.bd, borderRadius:8, padding:"10px 14px", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
      <div style={{ fontSize:12, fontWeight:600, color:C.tx, marginBottom:6 }}>{label}</div>
      {payload.map((p, i) => {
        const isNum   = typeof p.value === "number";
        const isSpec  = p.name === "AR Days" || p.name === "New Customers" || p.name === "New SKUs";
        const display = isNum && !isSpec ? ff(p.value) : p.value;
        const suffix  = p.name === "AR Days" ? " days" : "";
        return (
          <div key={i} style={{ fontSize:12, color:p.color||C.mt, marginBottom:2, display:"flex", gap:8, justifyContent:"space-between" }}>
            <span>{p.name}:</span>
            <span style={{ fontWeight:600 }}>{display}{suffix}</span>
          </div>
        );
      })}
    </div>
  );
}

function TH({ children, left }) {
  return (
    <th style={{ padding:"10px 12px", textAlign:left?"left":"right", color:C.mt, fontWeight:600, fontSize:10, textTransform:"uppercase", borderBottom:"2px solid "+C.bd }}>
      {children}
    </th>
  );
}

const TABS = ["Overview","Sales vs LY","Most Profitable Items","Quarterly Review","Inventory","Open Sales Orders","AR Days"];

export default function Dashboard() {
  const [tab, setTab] = useState("Overview");
  const [yr,  setYr]  = useState("2025");
  const lyYr = String(Number(yr) - 1);

  const cyMonths = useMemo(() => REV.filter((d) => d.m.startsWith(yr)).map((d) => d.m.split("-")[1]), [yr]);
  const yd  = useMemo(() => REV.filter((d) => d.m.startsWith(yr)), [yr]);
  const lyd = useMemo(() => REV.filter((d) => d.m.startsWith(lyYr) && cyMonths.includes(d.m.split("-")[1])), [lyYr, cyMonths]);

  const tR  = yd.reduce((s,d) => s+d.r, 0);
  const tE  = yd.reduce((s,d) => s+d.e, 0);
  const lyR = lyd.reduce((s,d) => s+d.r, 0);
  const lyE = lyd.reduce((s,d) => s+d.e, 0);
  const rG  = lyR > 0 ? ((tR-lyR)/lyR)*100 : 0;
  const eG  = lyE > 0 ? ((tE-lyE)/lyE)*100 : 0;

  const arY   = useMemo(() => ARS.filter((d) => d.m.startsWith(yr)), [yr]);
  const arLY  = useMemo(() => ARS.filter((d) => d.m.startsWith(lyYr) && cyMonths.includes(d.m.split("-")[1])), [lyYr, cyMonths]);
  const aAR   = arY.length  > 0 ? Math.round(arY.reduce((s,d) => s+d.d, 0) / arY.length)  : 0;
  const lyAAR = arLY.length > 0 ? Math.round(arLY.reduce((s,d) => s+d.d, 0) / arLY.length) : 0;

  const custP = useMemo(() => {
    const rk = yr==="2026" ? "r26" : yr==="2025" ? "r25" : "r24";
    const lk = yr==="2026" ? "r25jf" : yr==="2025" ? "r24" : "r24";
    return CUST.map((c) => ({ customer:c.n, cy:c[rk], ly:c[lk] })).filter((c) => c.cy > 0).sort((a,b) => b.cy - a.cy);
  }, [yr]);

  const sc = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months.map((m, i) => {
      const mo    = String(i+1).padStart(2,"0");
      const cyRow = REV.find((d) => d.m === yr+"-"+mo);
      const lyRow = REV.find((d) => d.m === lyYr+"-"+mo);
      if (!cyRow && !lyRow) return null;
      const cyV = cyRow ? cyRow.r : 0;
      const lyV = lyRow ? lyRow.r : 0;
      return { month:m, cy:cyV, ly:lyV, variance: lyV > 0 ? ((cyV-lyV)/lyV)*100 : 0 };
    }).filter(Boolean);
  }, [yr, lyYr]);

  const qc = useMemo(() => {
    const qs = [
      { l:"Q1", ms:["01","02","03"] }, { l:"Q2", ms:["04","05","06"] },
      { l:"Q3", ms:["07","08","09"] }, { l:"Q4", ms:["10","11","12"] },
    ];
    return qs.map((q) => {
      const cyV = q.ms.reduce((s,m) => { const d=REV.find((r) => r.m===yr+"-"+m); return s+(d?d.r:0); }, 0);
      const lyV = q.ms.reduce((s,m) => { const d=REV.find((r) => r.m===lyYr+"-"+m); return s+(d?d.r:0); }, 0);
      if (!cyV && !lyV) return null;
      return { quarter:q.l, cy:cyV, ly:lyV, variance: lyV > 0 ? ((cyV-lyV)/lyV)*100 : 0 };
    }).filter(Boolean);
  }, [yr, lyYr]);

  const profitObj    = PROFIT[yr] || PROFIT["2025"];
  const profitData   = profitObj.items;
  const profitTotals = profitObj.totals;

  const newCustYr  = useMemo(() => NEW_CUST.filter((d) => d.m.startsWith(yr)).reduce((s,d) => s+d.c, 0), [yr]);
  const newSkuYr   = useMemo(() => NEW_SKU.filter((d) => d.m.startsWith(yr)).reduce((s,d) => s+d.s, 0), [yr]);
  const custDetails = useMemo(() => NEW_CUST_DETAIL.filter((c) => c.d.startsWith(yr)), [yr]);
  const skuDetails  = useMemo(() => NEW_SKU_DETAIL.filter((s) => s.d.startsWith(yr)), [yr]);

  const growthChart = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months.map((m, i) => {
      const mo = String(i+1).padStart(2,"0");
      if (!REV.find((d) => d.m === yr+"-"+mo)) return null;
      const nc = NEW_CUST.find((d) => d.m === yr+"-"+mo);
      const ns = NEW_SKU.find((d) => d.m === yr+"-"+mo);
      return { month:m, "New Customers": nc ? nc.c : 0, "New SKUs": ns ? ns.s : 0 };
    }).filter(Boolean);
  }, [yr]);

  const catData = useMemo(() => {
    const bv = BULK_INV.filter((i) => i.c === "Bulk").reduce((s,i) => s+i.v, 0);
    const fv = BULK_INV.filter((i) => i.c === "Film").reduce((s,i) => s+i.v, 0);
    const pv = BULK_INV.filter((i) => i.c === "Pkg").reduce((s,i)  => s+i.v, 0);
    const gv = FG_INV.reduce((s,i) => s+i.v, 0);
    return [
      { name:"Finished Goods", value:gv, fill:C.ac },
      { name:"Bulk",           value:bv, fill:C.gn },
      { name:"Film",           value:fv, fill:C.am },
      { name:"Packaging",      value:pv, fill:C.pr },
    ];
  }, []);

  const im = useMemo(() => {