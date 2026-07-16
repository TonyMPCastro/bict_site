const { PrismaClient } = require('@prisma/client');

(async () => {
  const p = new PrismaClient();
  try {
    const items = await p.menuItem.findMany({ select: { id: true, label: true, parentId: true, url: true, ordem: true } });
    const filteredItems = items.filter(i => {
      const s = '';
      return (i.label||'').toLowerCase().includes(s) || (i.url||'').toLowerCase().includes(s);
    });

    const parents = filteredItems.filter(i => !i.parentId).sort((a,b)=>a.ordem-b.ordem);
    function getChildren(parentId) { return filteredItems.filter(i => i.parentId === parentId).sort((a,b)=>a.ordem-b.ordem); }

    const renderedIds = new Set();
    parents.forEach(p => { renderedIds.add(p.id); getChildren(p.id).forEach(c=>renderedIds.add(c.id)); });
    const remaining = filteredItems.filter(i=>!renderedIds.has(i.id));

    console.log('total items', items.length);
    console.log('parents count', parents.length);
    parents.forEach(p => console.log(' parent', p.label, 'children', getChildren(p.id).length));
    console.log('remaining count', remaining.length);
    remaining.forEach(r => console.log(' remaining', r.label, r.id, 'parentId', r.parentId));
  } catch (e) {
    console.error(e);
  } finally { await p.$disconnect(); }
})();
