import { createTheme } from '@mantine/core'
import {
  PRIMARY_COLOR_PALETTE,
  SECONDARY_COLOR_PALETTE,
  TERTIARY_COLOR_PALETTE,
  colorVariations
} from '../../shared/constants/colors'

export const mantineTheme = createTheme({
  primaryColor: 'primary',
  primaryShade: 5,
  colors: {
    primary: Object.values(PRIMARY_COLOR_PALETTE) as any,
    secondary: Object.values(SECONDARY_COLOR_PALETTE) as any,
    tertiary: Object.values(TERTIARY_COLOR_PALETTE) as any,
    red: Object.values(colorVariations('#E31E24')) as any,
  },
  defaultRadius: 'sm',
  components: {
    Modal: {
      classNames: {
        title: 'text-xl! font-semibold! grow'
      },
    },
  },
})
