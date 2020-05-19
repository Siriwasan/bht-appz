export interface TagCondition {
  section: string;
  control: string;
  values: any[];
  tag: string;
}

export const Acsd290tags: TagCondition[] = [
  {
    section: 'sectionM2',
    control: 'ArchDiscSite',
    values: ['Ascending Aorta'],
    tag: 'Asc Ao repair',
  },
  {
    section: 'sectionM2',
    control: 'ArchDiscSite',
    values: ['Hemiarch', 'Zone 1', 'Zone 2'],
    tag: 'Hemiarch repair',
  },
  {
    section: 'sectionM2',
    control: 'ArchDiscSite',
    values: ['Zone 3', 'Zone 4'],
    tag: 'Total arch repair',
  },
  {
    section: 'sectionM2',
    control: 'DescAortaProc',
    values: ['Yes'],
    tag: 'Thoracoabdomical Ao repair',
  },
  {
    section: 'sectionM2',
    control: 'EndoProxZone',
    values: [
      'Below STJ',
      'STJ-midascending',
      'Midascending to distal ascending',
      'Zone 1',
      'Zone 2',
      'Zone 3',
      'Zone 4',
      'Zone 5',
    ],
    tag: 'TEVAR',
  },
  {
    section: 'sectionM2',
    control: 'EndoProxZone',
    values: ['Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10', 'Zone 11'],
    tag: 'EVAR',
  },
  { section: 'sectionK', control: 'VSAVPr', values: ['Replacement'], tag: 'AVR' },
  { section: 'sectionK', control: 'VSAVPr', values: ['Repair/Reconstruction'], tag: 'AV repair' },
  { section: 'sectionK', control: 'VSMVPr', values: ['Repair'], tag: 'MV repair' },
  { section: 'sectionK', control: 'VSMVPr', values: ['Replacement'], tag: 'MVR' },
  { section: 'sectionK', control: 'VSTVPr', values: ['Repair'], tag: 'TV repair' },
  { section: 'sectionK', control: 'VSTVPr', values: ['Replacement'], tag: 'TVR' },
  {
    section: 'sectionK',
    control: 'OpPulm',
    values: ['Repair/Leaflet Reconstruction'],
    tag: 'PV repair',
  },
  { section: 'sectionK', control: 'OpPulm', values: ['Replacement'], tag: 'PVR' },
  { section: 'sectionM', control: 'OCarASDSec', values: ['Yes'], tag: 'ASD' },
  {
    section: 'sectionM',
    control: 'OCarVSD',
    values: ['Yes-congenital', 'Yes-acquired'],
    tag: 'VSD',
  },
  {
    section: 'sectionM',
    control: 'OCPulThromDis',
    values: ['Yes, Acute', 'Yes, Chronic'],
    tag: 'PE',
  },
  { section: 'sectionI', control: 'AFibProc', values: ['Yes'], tag: 'AF' },
  { section: 'sectionL', control: 'IABP', values: ['Yes'], tag: 'IABP' },
  {
    section: 'sectionL',
    control: 'ECMO',
    values: ['Veno-venous', 'Veno-arterial', 'Veno-venous converted to Veno-arterial'],
    tag: 'ECMO',
  },
  { section: 'sectionL2', control: 'VADImp', values: ['Yes'], tag: 'VAD' },
  {
    section: 'sectionQ',
    control: 'DischMortStat',
    values: ['Died in hospital', 'Discharged alive, died after discharge'],
    tag: 'Dead',
  },
  { section: 'sectionR', control: 'Readmit', values: ['Yes'], tag: 'Readmit' },
];

export const tagPriorities = {
  IABP: 'medium',
  ECMO: 'medium',
  VAD: 'medium',
  Readmit: 'medium',
  Dead: 'high',
};
