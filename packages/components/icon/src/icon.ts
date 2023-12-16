import { buildProps, definePropType } from '@nomi-ui/utils'
import type { ExtractPropTypes } from 'vue'
import type Icon from './icon.vue'

export const iconProps = buildProps({
  /**
   * @description SVG size, size x size
   */
  size: {
    type: definePropType<number | string>([Number, String]),
  },
  /**
   * @description SVG tag's fill color
   */
  color: {
    type: String,
  },
} as const)
export type IconProps = ExtractPropTypes<typeof iconProps>
export type IconInstance = InstanceType<typeof Icon>
