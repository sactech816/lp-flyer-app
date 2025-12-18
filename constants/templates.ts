// 後方互換のための再エクスポート
// 新しいテンプレートは constants/templates/ ディレクトリから読み込まれます

// 型エクスポート
export type { Template, TemplateCategory, TemplateId } from './templates/index';

// 値エクスポート
export { 
  templates, 
  recommendedTemplates,
  getTemplateById,
  getTemplatesByCategory,
  consultantTemplate,
  coachTemplate,
  retailEcTemplate,
  storeTemplate,
  cafeRestaurantTemplate,
  freelanceTemplate,
} from './templates/index';
