import type { ImgHTMLAttributes } from 'react';
import { BRAND_NAME } from 'shared/config/brand';
import { cn } from 'shared/lib/utils';
import unetLogo from 'shared/assets/img/UNET.png';

const sizeClass = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
  xl: 'h-16',
} as const;

export type AppLogoSize = keyof typeof sizeClass;

export interface AppLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: AppLogoSize;
}

/** Основной логотип UNET (PNG из `shared/assets/img/UNET.png`). */
export function AppLogo({ size = 'md', className, alt = BRAND_NAME, ...rest }: AppLogoProps) {
  return (
    <img
      src={unetLogo}
      alt={alt}
      decoding="async"
      className={cn('h-auto w-auto max-w-[min(200px,55vw)] object-contain object-left', sizeClass[size], className)}
      {...rest}
    />
  );
}
