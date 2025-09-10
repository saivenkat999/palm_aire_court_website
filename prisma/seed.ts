import { PrismaClient, UnitType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Units
  const units = [
    // COTTAGES
    {
      slug: 'cottage-9606',
      name: 'Cottage 9606',
      type: UnitType.COTTAGE_2BR,
      capacity: 4,
      beds: 2,
      baths: 2,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'laundry-nearby', 'patio', 'two-bathrooms'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 4 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'cottage-9608',
      name: 'Cottage 9608 (Studio)',
      type: UnitType.COTTAGE_1BR,
      capacity: 2,
      beds: 0,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby', 'patio'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'cottage-9612',
      name: 'Cottage 9612',
      type: UnitType.COTTAGE_1BR,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'laundry-nearby', 'patio'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'cottage-9614',
      name: 'Cottage 9614 (Coming Soon)',
      type: UnitType.COTTAGE_1BR,
      capacity: 2,
      beds: 1,
      baths: 1,
      active: false,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'laundry-nearby', 'patio'],
      features: ['Unit currently under renovation', 'Availability coming soon', 'Contact us for updates'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'cottage-9618',
      name: 'Cottage 9618',
      type: UnitType.COTTAGE_2BR,
      capacity: 4,
      beds: 2,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'full-kitchen', 'ro-water', 'laundry-nearby', 'patio'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 4 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    // 5TH WHEEL TRAILERS
    {
      slug: 'trailer-03',
      name: '5th Wheel Trailer #3',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-05',
      name: '5th Wheel Trailer #5',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-07',
      name: '5th Wheel Trailer #7',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-08',
      name: '5th Wheel Trailer #8',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-09',
      name: '5th Wheel Trailer #9',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-10',
      name: '5th Wheel Trailer #10',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-12',
      name: '5th Wheel Trailer #12',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-14',
      name: '5th Wheel Trailer #14',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-18',
      name: '5th Wheel Trailer #18',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-20',
      name: '5th Wheel Trailer #20',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-21',
      name: '5th Wheel Trailer #21',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-22',
      name: '5th Wheel Trailer #22',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-23',
      name: '5th Wheel Trailer #23',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-24',
      name: '5th Wheel Trailer #24',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-25',
      name: '5th Wheel Trailer #25',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-26',
      name: '5th Wheel Trailer #26',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    },
    {
      slug: 'trailer-27',
      name: '5th Wheel Trailer #27',
      type: UnitType.TRAILER,
      capacity: 2,
      beds: 1,
      baths: 1,
      amenities: ['wifi', 'cable-tv', 'ac-heat', 'parking', 'kitchenette', 'ro-water', 'laundry-nearby'],
      features: ['No pets allowed', 'No smoking', 'Quiet hours 10 PM - 7 AM', 'Maximum occupancy: 2 guests'],
      photos: [] // Photos now handled by PhotoService
    }
  ];

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.hold.deleteMany();
  await prisma.ratePlan.deleteMany();
  await prisma.unit.deleteMany();

console.log('Creating units...');
for (const unitData of units) {
  await prisma.unit.create({
    data: {
      ...unitData,
      amenities: JSON.stringify(unitData.amenities),
      features: JSON.stringify(unitData.features),
      photos: JSON.stringify(unitData.photos),
    },
  });
}  console.log('Creating rate plans...');
  // Create rate plans for each unit type
  const ratePlans = [
    // Cottage rates
    {
      category: UnitType.COTTAGE_1BR,
      nightly: 6500, // $65/night
      weekly: 39000, // $390/week
      monthly: 150000, // $1500/month
      fourMonth: 560000 // $5600/4 months
    },
    {
      category: UnitType.COTTAGE_2BR,
      nightly: 8500, // $85/night
      weekly: 51000, // $510/week
      monthly: 195000, // $1950/month
      fourMonth: 728000 // $7280/4 months
    },
    // Trailer rates
    {
      category: UnitType.TRAILER,
      nightly: 4500, // $45/night
      weekly: 27000, // $270/week
      monthly: 100000, // $1000/month
      fourMonth: 360000 // $3600/4 months
    }
  ];

  for (const ratePlan of ratePlans) {
    await prisma.ratePlan.create({
      data: ratePlan,
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
