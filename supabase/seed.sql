-- Supabase SQL Seed Script for Verified Medicines

INSERT INTO medicines (id, brand_name, generic_name, active_ingredients, strength, dosage_form, manufacturer, nafdac_reg_number, uses, warnings, side_effects, storage, verified)
VALUES
(
  'med-001',
  'Paracetamol BP',
  'Paracetamol (Acetaminophen)',
  ARRAY['Paracetamol 500mg'],
  '500mg',
  'Tablet',
  'Emzor Pharmaceutical Industries Ltd',
  '04-0123',
  '{"en": ["Relief of mild to moderate pain", "Reduction of fever"], "ha": ["Neman saukin ciwon kai da ciwon jiki", "Rage zazzabi"]}'::jsonb,
  '{"en": ["Do not exceed recommended dose", "Excessive doses cause liver damage"], "ha": ["Kada a shiga fiye da kima", "Kiman da aka wuce zai iya lalata hanta"]}'::jsonb,
  '{"en": ["Rare skin rash", "Nausea"], "ha": ["Awasar fata", "Kaikayin ciki"]}'::jsonb,
  '{"en": "Store below 30°C", "ha": "A ajiye karkashin 30°C"}'::jsonb,
  true
),
(
  'med-002',
  'Coartem 80/480',
  'Artemether / Lumefantrine',
  ARRAY['Artemether 80mg', 'Lumefantrine 480mg'],
  '80mg/480mg',
  'Tablet',
  'Novartis Pharma AG',
  '04-5678',
  '{"en": ["Treatment of uncomplicated malaria"], "ha": ["Maganin zazzabin cizon sauro"]}'::jsonb,
  '{"en": ["Take with fatty food or milk", "Complete full course"], "ha": ["A sha tare da abinci mai mai ko madara", "A kammala duk maganin"]}'::jsonb,
  '{"en": ["Dizziness", "Loss of appetite", "Fatigue"], "ha": ["Jiri", "Rashin jin yunwa", "Gajiya"]}'::jsonb,
  '{"en": "Store below 30°C", "ha": "A ajiye karkashin 30°C"}'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;
