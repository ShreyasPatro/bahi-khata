import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge the custom type scale from styles/tokens.css, otherwise
// `text-display` is mistaken for a colour and dropped next to `text-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'caption',
            'body-sm',
            'body',
            'title-sm',
            'title',
            'headline',
            'display-sm',
            'display',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
