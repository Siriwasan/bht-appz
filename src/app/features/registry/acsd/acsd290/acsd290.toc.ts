import { TableOfCentent } from 'src/app/shared/modules/registry-form/registry-form.model';

export const Acsd290Toc: TableOfCentent[] = [
  { section: 'sectionA', title: 'A. Administrative' },
  { section: 'sectionB', title: 'B. Demographics' },
  { section: 'sectionC', title: 'C. Hospitalization' },
  { section: 'sectionD', title: 'D. Risk Factors' },
  { section: 'sectionE', title: 'E. Previous Cardiac Interventions' },
  { section: 'sectionF', title: 'F. Preoperative Cardiac Status' },
  { section: 'sectionG', title: 'G. Preoperative Medications' },
  { section: 'sectionH', title: 'H. Hemodynamics/Cath/Echo' },
  { section: 'sectionI', title: 'I. Operative' },
  { section: 'sectionJ', title: 'J. Coronary Bypass' },
  { section: 'sectionK', title: 'K. Valve Surgery' },
  { section: 'sectionL', title: 'L. Mechanical Cardiac Assist Devices' },
  { section: 'sectionL2', title: 'L.2 Ventricular Assist Devices' },
  { section: 'sectionM', title: 'M. Other Cardiac Procedures' },
  { section: 'sectionM1', title: 'M.1. Atrial Fibrillation Procedures' },
  { section: 'sectionM2', title: 'M.2. Aorta And Aortic Root Procedures' },
  { section: 'sectionM3', title: 'M.3. Congenital Defect Repair' },
  { section: 'sectionN', title: 'N. Other Non-Cardiac Procedures' },
  { section: 'sectionO', title: 'O. Post-Operative' },
  { section: 'sectionP', title: 'P. Postoperative Events' },
  { section: 'sectionQ', title: 'Q. Discharge / Mortality' },
  { section: 'sectionR', title: 'R. Readmission' },
  { section: 'sectionS', title: 'S. Anesthesiology' },
];

export function getTocTitle(section: string) {
  return Acsd290Toc.find((t) => t.section === section).title;
}
