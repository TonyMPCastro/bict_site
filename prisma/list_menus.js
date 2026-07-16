const { PrismaClient } = require('@prisma/client');

(async () => {
  const p = new PrismaClient();
  try {
    const menus = await p.menu.findMany({ select: { id: true, nome: true } });
    console.log('MENUS:', menus);
    for (const m of menus) {
      const itens = await p.menuItem.findMany({ where: { menuId: m.id }, orderBy: [{ parentId: 'asc' }, { ordem: 'asc' }] });
      console.log(`\nITEMS for ${m.nome} (${m.id}): count=${itens.length}`);
      console.log(itens.slice(0,10));
    }
  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
