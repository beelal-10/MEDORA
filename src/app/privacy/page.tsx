import LegalPage from '@/components/LegalPage';

const sections = [
  {
    heading: 'Transient image handling',
    body: [
      'MEDORA processes uploaded medicine images only for the immediate OCR and matching workflow. Images are not stored long-term for normal operation in this prototype.',
      'The system may keep brief in-memory state only while the scan is being processed and then discard it.'
    ]
  },
  {
    heading: 'What we do not store',
    body: [
      'We do not keep medical records or personal health histories as part of the core scan process in this prototype. We also avoid saving image binaries in the database layer.',
      'The focus is on the scanned text needed to match against a small verified dataset of medicine records.'
    ]
  },
  {
    heading: 'Use of logs',
    body: [
      'Aggregate scan events may be stored for system monitoring and product improvement, but the log is limited to status, confidence, language, and medicine identifier information only.',
      'No user image or sensitive health data is intended to be stored in the audit log.'
    ]
  }
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="MEDORA is designed for a lightweight, privacy-aware prototype. The project aims to keep image handling transient and avoid unnecessary personal health data storage."
      sections={sections}
    />
  );
}
