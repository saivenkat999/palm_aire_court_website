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
      photos: [
        '/assets/cottage/living_area.webp',
        '/assets/cottage/master_bedroom.webp',
        '/assets/cottage/kitchen.jpeg',
        '/assets/cottage/exterior.webp'
      ]
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
      photos: [
        '/assets/cottage/IMG_7810-800x600.webp',
        '/assets/cottage/IMG_7811-800x600.webp',
        '/assets/cottage/kitchen.jpeg',
        '/assets/cottage/exterior_2.jpeg'
      ]
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
      photos: [
        '/assets/cottage/IMG_7812-800x600.webp',
        '/assets/cottage/master_bedroom.webp',
        '/assets/cottage/kitchen.jpeg',
        '/assets/cottage/exterior_3.jpg'
      ]
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
      photos: [
        '/assets/cottage/exterior_4.jpg',
        '/assets/cottage/living_area.webp',
        '/assets/cottage/kitchen.jpeg',
        '/assets/cottage/master_bedroom.webp'
      ]
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
      photos: [
        '/assets/cottage/living_area.webp',
        '/assets/cottage/master_bedroom.webp',
        '/assets/cottage/IMG_7812-800x600.webp',
        '/assets/cottage/exterior.webp'
      ]
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
      photos: [
        '/assets/Trailer/IMG_7832.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg',
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg'
      ]
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
      photos: [
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg',
        '/assets/Trailer/IMG_7832.jpg'
      ]
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
      photos: [
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg',
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg'
      ]
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
      photos: [
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg',
        '/assets/Trailer/IMG_7832.jpg',
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg'
      ]
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
      photos: [
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg',
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg'
      ]
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
      photos: [
        '/assets/Trailer/IMG_7832.jpg',
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg'
      ]
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
      photos: [
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg',
        '/assets/Trailer/IMG_7832.jpg'
      ]
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
      photos: [
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg',
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg'
      ]
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
      photos: [
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg',
        '/assets/Trailer/IMG_7832.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg'
      ]
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
      photos: [
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg'
      ]
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
      photos: [
        '/assets/Trailer/IMG_7832.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg',
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg'
      ]
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
      photos: [
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg',
        '/assets/Trailer/IMG_7832.jpg'
      ]
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
      photos: [
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg',
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg'
      ]
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
      photos: [
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg',
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg'
      ]
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
      photos: [
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
        '/assets/Trailer/IMG_7832.jpg',
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg'
      ]
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
      photos: [
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg',
        '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg'
      ]
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
      photos: [
        '/assets/Trailer/IMG_7832.jpg',
        '/assets/Trailer/8496AF4B-5B77-41CB-B0B5-AECF42FBFB0B.jpg',
        '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.10.59_3596466c.jpg'
      ]
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
      data: unitData,
    });
  }

  console.log('Creating rate plans...');
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
