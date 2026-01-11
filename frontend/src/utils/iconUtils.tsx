/**
 * Icon utility functions
 */
import { 
  Sparkles, Rocket, Shield, Zap, Heart, Star, 
  CheckCircle, Award, Target, TrendingUp,
  Leaf, Sprout, Globe, Mail, Phone, MapPin
} from 'lucide-react'

export const featureIcons = [
  Sparkles, Rocket, Shield, Zap, Heart, Star,
  CheckCircle, Award, Target, TrendingUp
]

export const socialIcons = {
  facebook: 'f',
  twitter: '𝕏',
  linkedin: 'in',
  instagram: '📷'
}

export const contactIcons = {
  website: Globe,
  email: Mail,
  phone: Phone,
  address: MapPin,
}

export function getFeatureIcon(index: number) {
  return featureIcons[index % featureIcons.length]
}

export function getSocialIcon(platform: string): string {
  return socialIcons[platform as keyof typeof socialIcons] || '🔗'
}

