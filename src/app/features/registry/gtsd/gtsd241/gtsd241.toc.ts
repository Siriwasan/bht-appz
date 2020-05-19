import { TableOfCentent } from 'src/app/shared/modules/registry-form/registry-form.model';

export const Gtsd241Toc: TableOfCentent[] = [
  { section: 'sectionA', title: 'A. Demographics' },
  { section: 'sectionB', title: 'B. Episode of care' },
  { section: 'sectionC', title: 'C. Pre-Operative Evaluation' },
  { section: 'sectionD', title: 'D. Diagnosis' },
  { section: 'sectionE', title: 'E. Operative' },
  { section: 'sectionF', title: 'F. Lung Cancer' },
  { section: 'sectionG', title: 'G. Esophageal Cancer' },
  { section: 'sectionH', title: 'H. Thymus/Mediastinal Mass Resection' },
  { section: 'sectionI', title: 'I. Tracheal Resection' },
  { section: 'sectionJ', title: 'J. Hiatal Hernia/GERD' },
  { section: 'sectionK', title: 'K. Disposition' },
  { section: 'sectionL', title: 'L. Post-Operative Events' },
  { section: 'sectionM', title: 'M. Discharge' },
  { section: 'sectionN', title: 'N. Follow Up' },
  { section: 'sectionO', title: 'O. Quality Measures' },
];

export function getTocTitle(section: string) {
  return Gtsd241Toc.find((t) => t.section === section).title;
}
