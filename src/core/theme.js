export const theme = {
  background: '#0A0A0F',
  surface: '#13131A',
  accent: '#4F46E5',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#1F2937',
}
export const getBiasColor = (score) => {
  if (score <= 30) return '#10B981';
  if (score <= 60) return '#F59E0B';
  if (score <= 80) return '#EF4444';
  return '#DC2626';
};

export const getBiasLabel = (score) => {
  if (score <= 30) return 'Low';
  if (score <= 60) return 'Medium';
  if (score <= 80) return 'High';
  return 'Critical';
};