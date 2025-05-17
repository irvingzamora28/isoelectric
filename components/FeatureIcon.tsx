import { getIconComponent } from '@/lib/utils/iconMap'

const FeatureIcon = ({ icon }: { icon: string }) => {
  const IconComponent = getIconComponent(icon)
  if (!IconComponent) {
    console.warn(`Icon ${icon} not found in iconMap`)
    return null
  }
  return <IconComponent className="text-primary-500 h-6 w-6" />
}

export default FeatureIcon
