import { PrismaClient } from '@prisma/client';

/**
 * Başlangıç verisi: yalnızca işletme ayarları kaydını oluşturur.
 * Hiçbir kaydı silmez veya değiştirmez; tekrar çalıştırmak güvenlidir.
 * Kullanıcı hesabı oluşturmaz — ilk sahip hesabı uygulamadaki "Kayıt Ol" ile açılır.
 */
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.businessSettings.findFirst();
  if (!existing) {
    await prisma.businessSettings.create({
      data: { name: 'Drinks', location: 'Forum Mersin' },
    });
    console.log('İşletme ayarları oluşturuldu');
  } else {
    console.log('İşletme ayarları zaten mevcut, değişiklik yapılmadı');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
