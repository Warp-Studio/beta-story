export interface WeddingEvent {
  name: string;        // "Nikaah Ceremony", "Walima Reception"
  date: string;        // ISO date string or human-readable
  time: string;
  venue: string;
  address?: string;
  mapsUrl?: string;
}

export interface WeddingParent {
  label: string;   // e.g. "Father of the Bride"
  name: string;
  phone?: string;
}

export interface WeddingTemplate {
  id: string;
  name: string;
  description: string;
  ceremony: string;
  /** Main brand color — navy, maroon, forest green, etc. */
  accentColor: string;
  /** Secondary decorative color — gold, rose, etc. */
  goldColor: string;
  bgColor: string;
  /** Optional path or URL to a background audio file */
  musicSrc?: string;
  /** Whether the curtains stop half-open (framing the card) or fully retract */
  curtainMode?: 'half' | 'full';
  defaults: {
    partner1: string;
    partner2: string;
    /** Primary event date — drives the invite card + countdown */
    date: string;
    time: string;
    venue: string;
    address: string;
    rsvp: string;
    events: WeddingEvent[];
    parents?: WeddingParent[];
  };
}

export const templates: WeddingTemplate[] = [
  {
    id: 'royal-arch',
    name: 'Royal Arch',
    description: 'Regal Mughal arch design with warm amber tones inspired by Rajasthani palace architecture',
    ceremony: 'Wedding',
    accentColor: '#8B5C0A',
    goldColor:   '#C4921C',
    bgColor:     '#FAF0DC',
    curtainMode: 'half',
    // musicSrc: '/music/your-track.mp3',
    defaults: {
      partner1: 'Prerna Singh',
      partner2: 'Sumit Gupta',
      date:     '2025-07-27',
      time:     '8:00 AM',
      venue:    '123 Anywhere St',
      address:  'Any City, ST 12345',
      rsvp:     '+123-456-7890',
      events: [
        {
          name:    'Mehendi Ceremony',
          date:    '2025-07-26',
          time:    '4:00 PM',
          venue:   'Family Residence',
          address: 'Any City, ST 12345',
          mapsUrl: '',
        },
        {
          name:    'Haldi Ceremony',
          date:    '2025-07-27',
          time:    '7:00 AM',
          venue:   '123 Anywhere St',
          address: 'Any City, ST 12345',
          mapsUrl: '',
        },
        {
          name:    'Pheras Ceremony',
          date:    '2025-07-27',
          time:    '11:00 AM',
          venue:   '123 Anywhere St',
          address: 'Any City, ST 12345',
          mapsUrl: '',
        },
        {
          name:    'Baraat',
          date:    '2025-07-27',
          time:    '5:00 PM',
          venue:   'Main Entrance',
          address: 'Any City, ST 12345',
          mapsUrl: '',
        },
        {
          name:    'Reception',
          date:    '2025-07-27',
          time:    '7:00 PM',
          venue:   'Grand Ballroom',
          address: 'Any City, ST 12345',
          mapsUrl: '',
        },
      ],
      parents: [
        { label: "Father of the Bride",  name: "Ramesh Singh",   phone: "+91 98100 11111" },
        { label: "Mother of the Bride",  name: "Sunita Singh",   phone: "+91 98100 22222" },
        { label: "Father of the Groom",  name: "Mahesh Gupta",   phone: "+91 98100 33333" },
        { label: "Mother of the Groom",  name: "Kavita Gupta",   phone: "+91 98100 44444" },
      ],
    },
  },
  {
    id: 'floral-blue',
    name: 'Floral Blue',
    description: 'Elegant watercolor-inspired design with soft blue tones and floral accents',
    ceremony: 'Nikaah',
    accentColor: '#2d4a7a',
    goldColor:   '#c8a97e',
    bgColor:     '#e8eef7',
    curtainMode: 'full',
    // musicSrc: '/music/your-track.mp3',
    defaults: {
      partner1: 'Tahleem Kaur',
      partner2: 'Farha Hasan',
      date:     '2025-05-10',
      time:     '4:00 PM',
      venue:    'Borcelle Restaurant',
      address:  '123 Anywhere St., Any City',
      rsvp:     '123-456-7890',
      events: [
        {
          name:    'Mehndi Night',
          date:    '2025-05-09',
          time:    '6:00 PM',
          venue:   'Family Residence',
          address: '123 Anywhere St., Any City',
          mapsUrl: '',
        },
        {
          name:    'Nikaah Ceremony',
          date:    '2025-05-10',
          time:    '4:00 PM',
          venue:   'Borcelle Restaurant',
          address: '123 Anywhere St., Any City',
          mapsUrl: '',
        },
        {
          name:    'Rukhsati',
          date:    '2025-05-10',
          time:    '8:00 PM',
          venue:   'Borcelle Restaurant',
          address: '123 Anywhere St., Any City',
          mapsUrl: '',
        },
        {
          name:    'Walima Reception',
          date:    '2025-05-11',
          time:    '7:00 PM',
          venue:   'Grand Ballroom',
          address: '456 Main Road, Any City',
          mapsUrl: '',
        },
      ],
      parents: [
        { label: "Father of the Bride",  name: "Tariq Kaur",     phone: "+91 99200 11111" },
        { label: "Mother of the Bride",  name: "Nazia Kaur",     phone: "+91 99200 22222" },
        { label: "Father of the Groom",  name: "Imran Hasan",    phone: "+91 99200 33333" },
        { label: "Mother of the Groom",  name: "Fatima Hasan",   phone: "+91 99200 44444" },
      ],
    },
  },
];
