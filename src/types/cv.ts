export interface CVFile {
  cv_id: number;
  filename: string;
  upload_date: string; // Format chaîne ISO
  status: string;
}

export interface ParsedCV {
  id: number;
  cv_file_id: number;
  raw_text: string;
  parsed_data: any;
  processing_date: string;
}

export interface Recommendation {
  id: number;
  cv_file_id: number;
  job_type: string | null;
  environment: string | null;
  suggested_trainings: string[] | null; // Liste de chaînes
  skills_to_develop: string[] | null;   // Liste de chaînes
  generation_date: string;
}
