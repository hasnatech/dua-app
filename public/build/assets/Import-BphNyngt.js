import{m as o,j as e,L as n}from"./app-D1PyiKA2.js";import{A as m}from"./app-layout-BhU13Tf8.js";import"./button-BZb6eFa3.js";import"./utils-jAU0Cazi.js";import"./index-Cht7Sf4o.js";import"./createLucideIcon-_Gm4vGiG.js";import"./index-fnwY9HLb.js";import"./index-DwIuxz98.js";import"./message-square-63JYjg3i.js";function j(){const{setData:a,post:l,processing:s,errors:r}=o({file:null}),i=t=>{t.preventDefault(),l(route("admin.import.store"))};return e.jsxs(m,{children:[e.jsx(n,{title:"Import Duas"}),e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-6 text-gray-900",children:[e.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Import Duas from JSON"}),e.jsxs("form",{onSubmit:i,className:"space-y-6 max-w-xl",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"JSON File"}),e.jsx("input",{type:"file",accept:".json",onChange:t=>a("file",t.target.files?t.target.files[0]:null),className:"mt-1 block w-full text-base p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"}),r.file&&e.jsx("p",{className:"mt-1 text-sm text-red-600",children:r.file})]}),e.jsx("div",{className:"flex items-center gap-4",children:e.jsx("button",{type:"submit",disabled:s,className:"bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50",children:s?"Importing...":"Import Data"})})]}),e.jsxs("div",{className:"mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200",children:[e.jsx("h3",{className:"font-bold text-sm mb-2",children:"Expected JSON Structure:"}),e.jsx("pre",{className:"text-xs bg-slate-800 text-slate-200 p-4 rounded overflow-auto",children:`[
  {
    "category": {
      "title": "Category Name",
      "icon": "fa-icon-name",
      "color": "bg-emerald-600"
    },
    "duas": [
      {
        "title": "Dua Title",
        "arabic": "Arabic Text",
        "transliteration": "Transliteration",
        "translation": "English Translation",
        "translation_tamil": "Tamil Translation",
        "when": "When to recite",
        "reference": "Source",
        "benefits": "Virtues"
      }
    ]
  }
]`})]})]})})})})]})}export{j as default};
