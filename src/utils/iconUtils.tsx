import * as LucideIcons from 'lucide-react';

export const getLucideIcon = (iconName: string, props?: any) => {
  const Icon = (LucideIcons as any)[iconName];
  if (!Icon) {
    return <LucideIcons.Circle {...props} />;
  }
  return <Icon {...props} />;
};

