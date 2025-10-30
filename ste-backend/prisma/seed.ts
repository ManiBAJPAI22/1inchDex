import { PrismaClient } from '@prisma/client';
import { mockTradingPairs } from '../src/utils/mockData';

const prisma = new PrismaClient();

// Mock Trading Pairs (from frontend mockData.ts)

async function main() {
  // Seed Trading Pairs
  console.log('📊 Seeding trading pairs...');

  await prisma.tradingPair.createMany({
    data: mockTradingPairs,
  });

  console.log(`✅ Created ${mockTradingPairs.length} trading pairs`);

  // Summary
  console.log('\n🎉 Database seeding complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Trading Pairs: ${mockTradingPairs.length}`);
  console.log('\n✅ Your exchange is ready to use!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Start backend: yarn start:dev');
  console.log('   2. Start frontend: cd ../exchange && yarn dev');
  console.log('   3. Open browser: http://localhost:3000');
  console.log('   4. Connect wallet and start trading!');
  console.log('   5. Orders and trades will be created when you trade!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
