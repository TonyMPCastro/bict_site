const { PrismaClient } = require('@prisma/client');

(async () => {
  const p = new PrismaClient();
  try {
    const items = await p.menuItem.findMany({ select: { id: true, label: true, parentId: true, menuId: true } });
    const map = new Map(items.map(i => [i.id, i]));

    function depth(id, seen = new Set()) {
      let d = 0;
      let cur = map.get(id);
      while (cur && cur.parentId) {
        if (seen.has(cur.parentId)) return -1; // cycle
        seen.add(cur.parentId);
        d++;
        cur = map.get(cur.parentId);
      }
      return d;
    }

    const withDepth = items.map(i => ({ ...i, depth: i.parentId ? depth(i.id) : 0 }));
    console.log('Total items:', items.length);
    const grouped = withDepth.reduce((acc, it) => {
      acc[it.depth] = acc[it.depth] || [];
      acc[it.depth].push(it);
      return acc;
    }, {});

    Object.keys(grouped).sort((a,b)=>Number(a)-Number(b)).forEach(k => {
      console.log('\nDepth', k, 'count=', grouped[k].length);
      grouped[k].forEach(i => console.log(' -', i.label, i.id, 'parentId=', i.parentId));
    });

  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
