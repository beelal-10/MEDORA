import LegalPage from '@/components/LegalPage';

const sections = [
  {
    heading: 'What MEDORA does',
    body: [
      'MEDORA helps users understand medicine information in Hausa and English by matching a package photo against a small set of verified medicine records.',
      'The app is intentionally narrow and safety-focused. It does not diagnose illness, prescribe treatment, or invent medicine details when confidence is low.'
    ]
  },
  {
    heading: 'How the flow works',
    body: [
      'The scan flow reads text from the uploaded medicine package, compares it against verified records, and either returns a trusted result or a refusal message if confidence is below the safety threshold.',
      'This keeps the system transparent, constrained, and suitable for a prototype evaluation with a verified seed dataset.'
    ]
  },
  {
    heading: 'Boundaries',
    body: [
      'MEDORA is educational and informational only. It is not a replacement for a pharmacist, doctor, or licensed healthcare professional.',
      'If you are unsure about a medicine, dosage, interaction, or emergency concern, seek qualified medical advice immediately.'
    ]
  }
];

export default function AboutPage() {
  return (
    <LegalPage
      title="About MEDORA"
      intro="MEDORA exists to make medicine information clearer and more accessible for Hausa and English-speaking users in a way that stays grounded in verified records."
      sections={sections}
    />
  );
}
