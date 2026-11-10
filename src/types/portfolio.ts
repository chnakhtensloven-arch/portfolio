export type Language = 'en' | 'ar';

export interface ProjectData {
  id: string;
  titleKey: string;
  categoryKeys: string[];
  descriptionKey: string;
  image: string;
  imageAltKey: string;
  badge?: {
    value: string;
    labelKey: string;
  };
  metrics: {
    labelKey: string;
    value: string;
  }[];
  detailsKey: string;
  deliverablesKeys: string[];
  externalUrl?: string;
}

export interface ServiceData {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  isPopular?: boolean;
  featuresKeys: string[];
}

export interface SkillData {
  nameKey: string;
  percentage: number;
  category: 'tech' | 'marketing';
  color?: string;
}
