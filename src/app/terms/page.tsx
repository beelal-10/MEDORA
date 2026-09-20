import LegalPage from '@/components/LegalPage';

const sections = [
  {
    heading: 'Educational use only',
    body: [
      'MEDORA provides simplified educational information about medicines. It does not diagnose diseases, prescribe treatment, or replace professional medical judgement.',
      'The app is intended to support understanding of medicine labels and approved information in a clearer, easier-to-read format.'
    ]
  },
  {
    heading: 'Verification boundaries',
    body: [
      'The system matches scanned labels against a limited verified dataset. If a medicine is not confidently matched, MEDORA will refuse to identify it rather than guess.',
      'This safety rule is a core product requirement and should not be bypassed.'
    ]
  },
  {
    heading: 'User responsibility',
    body: [
      'Users should verify any important medication decision with a licensed healthcare professional or pharmacist, especially for serious conditions, pregnancy, allergies, or medication interactions.',
      'MEDORA makes no guarantee of diagnosis, therapy outcome, authenticity, or treatment safety.'
    ]
  }
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These terms define the prototype use of MEDORA. The service is informational, safety-first, and limited to a verified medicine lookup flow."
      sections={sections}
    />
  );
}
