import { PrismaClient, UnitType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Units
  const units = [
    {
      slug: 'essex',
      name: 'Essex Cottage',
      type: UnitType.COTTAGE_2BR,
      capacity: 4,
      beds: 2,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'laundry-nearby', 'patio'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Essex+Cottage+Living+Area',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Essex+Cottage+Master+Bedroom',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Essex+Cottage+Kitchen',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Essex+Cottage+Exterior'
      ]
    },
    {
      slug: 'view',
      name: 'Mountain View',
      type: UnitType.COTTAGE_1BR,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'mountain-view', 'patio'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/F2CC8F/000000?text=Mountain+View+Living+Room',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Mountain+View+Bedroom',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Mountain+View+Kitchen',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Mountain+View+Patio'
      ]
    },
    {
      slug: '9606-2br',
      name: 'Desert Rose Cottage',
      type: UnitType.COTTAGE_2BR,
      capacity: 4,
      beds: 2,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'patio', 'storage'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/EEEAE6/000000?text=Desert+Rose+Living+Area',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Desert+Rose+Master+Bedroom',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Desert+Rose+Second+Bedroom',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Desert+Rose+Exterior'
      ]
    },
    {
      slug: '9608-1br',
      name: 'Cactus Bloom Cottage',
      type: UnitType.COTTAGE_1BR,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'patio'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/F2CC8F/000000?text=Cactus+Bloom+Living+Space',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Cactus+Bloom+Bedroom',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Cactus+Bloom+Kitchen',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Cactus+Bloom+Entrance'
      ]
    },
    {
      slug: '9618-2br',
      name: 'Sunset Vista Cottage',
      type: UnitType.COTTAGE_2BR,
      capacity: 6,
      beds: 2,
      baths: 2,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'patio', 'storage', 'two-bathrooms', 'washer-dryer'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Sunset+Vista+Great+Room',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Sunset+Vista+Master+Suite',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Sunset+Vista+Second+Bedroom',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Sunset+Vista+Kitchen'
      ]
    },
    {
      slug: 'trailer-01',
      name: 'Desert Breeze Trailer',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/EEEAE6/000000?text=Desert+Breeze+Interior',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Desert+Breeze+Sleeping+Area',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Desert+Breeze+Kitchenette',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Desert+Breeze+Exterior'
      ]
    },
    {
      slug: 'trailer-02',
      name: 'Cactus Valley Trailer',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/F2CC8F/000000?text=Cactus+Valley+Interior',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Cactus+Valley+Bedroom',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Cactus+Valley+Kitchen',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Cactus+Valley+Exterior'
      ]
    },
    {
      slug: 'trailer-03',
      name: 'Sunrise Trailer',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Sunrise+Trailer+Interior',
        'https://placehold.co/1200x800/EEEAE6/000000?text=Sunrise+Trailer+Bedroom',
        'https://placehold.co/1200x800/F2CC8F/000000?text=Sunrise+Trailer+Kitchen',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Sunrise+Trailer+Exterior'
      ]
    },
    {
      slug: 'rv-01',
      name: 'Premium RV Site 1',
      type: UnitType.RV_SITE,
      capacity: 8,
      beds: 0,
      baths: 0,
      amenities: ['full-hookups', '50-amp-electric', 'water-sewer', 'cable-tv', 'wifi', 'concrete-pad', 'picnic-table', 'fire-ring'],
      features: ['RV length up to 45 feet', 'No permanent structures', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/F2CC8F/000000?text=Premium+RV+Site+Overview',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=RV+Site+Hookups',
        'https://placehold.co/1200x800/EEEAE6/000000?text=RV+Site+Landscaping',
        'https://placehold.co/1200x800/F2CC8F/000000?text=RV+Site+Utilities'
      ]
    },
    {
      slug: 'rv-02',
      name: 'Premium RV Site 2',
      type: UnitType.RV_SITE,
      capacity: 8,
      beds: 0,
      baths: 0,
      amenities: ['full-hookups', '50-amp-electric', 'water-sewer', 'cable-tv', 'wifi', 'concrete-pad', 'picnic-table', 'fire-ring'],
      features: ['RV length up to 45 feet', 'No permanent structures', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/E07A5F/ffffff?text=Premium+RV+Site+2+Overview',
        'https://placehold.co/1200x800/F2CC8F/000000?text=RV+Site+2+Hookups',
        'https://placehold.co/1200x800/EEEAE6/000000?text=RV+Site+2+Landscaping',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=RV+Site+2+Utilities'
      ]
    },
    {
      slug: 'rv-03',
      name: 'Premium RV Site 3',
      type: UnitType.RV_SITE,
      capacity: 8,
      beds: 0,
      baths: 0,
      amenities: ['full-hookups', '50-amp-electric', 'water-sewer', 'cable-tv', 'wifi', 'concrete-pad', 'picnic-table', 'fire-ring'],
      features: ['RV length up to 45 feet', 'No permanent structures', 'Quiet hours 10 PM - 7 AM'],
      photos: [
        'https://placehold.co/1200x800/F2CC8F/000000?text=Premium+RV+Site+3+Overview',
        'https://placehold.co/1200x800/EEEAE6/000000?text=RV+Site+3+Hookups',
        'https://placehold.co/1200x800/E07A5F/ffffff?text=RV+Site+3+Landscaping',
        'https://placehold.co/1200x800/F2CC8F/000000?text=RV+Site+3+Utilities'
      ]
    }
  ];

  // Create units
  for (const unitData of units) {
    await prisma.unit.upsert({
      where: { slug: unitData.slug },
      update: {},
      create: unitData
    });
  }

  // Create Rate Plans (prices in cents)
  const ratePlans = [
    {
      category: UnitType.TRAILER,
      nightly: 4500, // $45.00
      weekly: 28000, // $280.00
      monthly: 100000, // $1000.00
      fourMonth: 360000, // $3600.00
    },
    {
      category: UnitType.COTTAGE_1BR,
      nightly: 6500, // $65.00
      weekly: 42000, // $420.00
      monthly: 150000, // $1500.00
      fourMonth: 540000, // $5400.00
    },
    {
      category: UnitType.COTTAGE_2BR,
      nightly: 8500, // $85.00
      weekly: 56000, // $560.00
      monthly: 200000, // $2000.00
      fourMonth: 720000, // $7200.00
    },
    {
      category: UnitType.RV_SITE,
      nightly: 4500, // $45.00
      weekly: 28000, // $280.00
      monthly: 100000, // $1000.00
      fourMonth: 360000, // $3600.00
    }
  ];

  // Special rate for premium cottage
  const sunsetVista = await prisma.unit.findUnique({ where: { slug: '9618-2br' } });
  if (sunsetVista) {
    await prisma.ratePlan.create({
      data: {
        unitId: sunsetVista.id,
        nightly: 10500, // $105.00
        weekly: 70000, // $700.00
        monthly: 250000, // $2500.00
        fourMonth: 900000, // $9000.00
      }
    });
  }

  // Create category-wide rate plans
  for (const ratePlan of ratePlans) {
    await prisma.ratePlan.create({
      data: ratePlan
    });
  }

  // Create Seasons
  const currentYear = new Date().getFullYear();
  const seasons = [
    {
      name: 'Nov Discount',
      startDate: new Date(currentYear, 10, 1), // November 1
      endDate: new Date(currentYear, 10, 30), // November 30
      discountPct: 10
    },
    {
      name: 'Apr Discount',
      startDate: new Date(currentYear, 3, 1), // April 1
      endDate: new Date(currentYear, 3, 30), // April 30
      discountPct: 10
    },
    {
      name: 'Summer Discount',
      startDate: new Date(currentYear, 4, 1), // May 1
      endDate: new Date(currentYear, 9, 31), // October 31
      discountPct: 20
    }
  ];

  for (const season of seasons) {
    const existing = await prisma.season.findFirst({
      where: { name: season.name }
    });
    
    if (existing) {
      await prisma.season.update({
        where: { id: existing.id },
        data: season
      });
    } else {
      await prisma.season.create({
        data: season
      });
    }
  }

  // Create Fees
  const existingFee = await prisma.fee.findFirst({
    where: { name: 'Cleaning Fee' }
  });
  
  if (!existingFee) {
    await prisma.fee.create({
      data: {
        name: 'Cleaning Fee',
        amount: 4000, // $40.00
        perStay: true
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });