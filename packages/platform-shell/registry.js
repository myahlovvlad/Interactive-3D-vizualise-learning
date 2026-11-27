/* Shared catalog/launcher contract. No scientific models in this package. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LabRegistry=api;})(globalThis,function(){
  'use strict';
  const categories=Object.freeze({all:'Все методы',chrom:'Методы разделения',optics:'Оптические методы',bio:'Молекулярная биология',other:'Другие методы'});
  const statuses=Object.freeze({all:'Все статусы',prototype:'Доступные',planned:'В разработке'});
  function localPath(p){return typeof p==='string'&&/^(?:[a-z0-9_-][a-z0-9_.-]*\/)+[a-z0-9_.-]+\.html$/i.test(p)&&!p.split('/').some(s=>s==='.'||s==='..');}
  function validateCatalog(c){
    if(!c||c.version!==2||!Array.isArray(c.instruments))throw Error('CATALOG.VERSION');
    const ids=new Set();
    for(const x of c.instruments){
      if(!x||typeof x.id!=='string'||!/^[a-z][a-z0-9-]*$/.test(x.id)||ids.has(x.id))throw Error('CATALOG.ID');ids.add(x.id);
      if(!Object.hasOwn(categories,x.category)||x.category==='all')throw Error('CATALOG.CATEGORY');
      for(const k of ['title','shortTitle','label','description','topics'])if(typeof x[k]!=='string'||!x[k].trim())throw Error('CATALOG.TEXT.'+k);
      if(!Array.isArray(x.variants)||x.variants.some(v=>typeof v!=='string'||!v.trim()))throw Error('CATALOG.VARIANTS');
      if(x.status==='prototype'){if(!localPath(x.path)||x.module?.kind!=='legacy-html'||typeof x.module.version!=='string'||!x.module.version.trim())throw Error('CATALOG.MODULE');}
      else if(x.status!=='planned'||x.path!==null||x.module!==null)throw Error('CATALOG.STATUS');
    }
    return c;
  }
  function filter(c,{query='',category='all',status='all'}={}){
    const q=query.trim().toLocaleLowerCase('ru').replaceAll('ё','е');
    return c.instruments.filter(x=>(category==='all'||x.category===category)&&(status==='all'||x.status===status)&&[x.title,x.shortTitle,x.label,x.description,x.topics,...x.variants].join(' ').toLocaleLowerCase('ru').replaceAll('ё','е').includes(q));
  }
  function resolve(c,hash){const m=/^#lab=([a-z][a-z0-9-]*)$/.exec(hash);if(!m)return null;return c.instruments.find(x=>x.id===m[1]&&x.status==='prototype')||null;}
  /** One active module only; replacing it disposes its frame. */
  function createHost(adapter){let active=null;return {open(entry){if(!entry||entry.status!=='prototype'||!localPath(entry.path)||entry.module?.kind!=='legacy-html')throw Error('MODULE.UNAVAILABLE');if(active?.id===entry.id)return;this.close();adapter.mount(entry);active=entry;},close(){if(active){adapter.unmount();active=null;}},current(){return active;}};}
  return Object.freeze({categories,statuses,localPath,validateCatalog,filter,resolve,createHost});
});
