export interface FormDetail {
  baseDbId: string;
  baseDb: string;
  addendum: string;
  createdAt: any;
  createdBy: string;
  modifiedAt: any;
  modifiedBy: string;
  deletedAt: any;
  deletedBy: string;
}

export interface RegistryModel {
  registryId: string;
  hospitalId: string;
  hn: string;
  an: string;
  firstName: string;
  lastName: string;
  age: number;
  baseDbId: string;
  baseDb: string;
  addendum: string;
  procedureDateTime: string;
  completion: number;
  tags: string[];
  submitted: string[];
  createdAt: any;
  modifiedAt: any;
}
