import { isObject } from '../../types'

import { PropType, warn } from 'vue'
import type {
  IfMiProp,
  IfNativePropType,
  MiProp,
  MiPropConvert,
  MiPropFinalized,
  MiPropInput,
  MiPropMergeType,
  NativePropType,
} from './types'
import { hasOwn } from '../../objects'
import { fromPairs } from 'lodash-unified'

export const miPropKey = '__MiProKey'

export const definePropType = <T>(val: any): PropType<T> => val

export const isEpProp = (val: unknown): val is MiProp<any, any, any> =>
  isObject(val) && !!(val as any)[miPropKey]

export const isMiProp = (val: unknown): val is MiProp<any, any, any> =>
  isObject(val) && !!(val as any)[miPropKey]

export const buildProp = <
  Type = never,
  Value = never,
  Validator = never,
  Default extends MiPropMergeType<Type, Value, Validator> = never,
  Required extends boolean = false
>(
  prop: MiPropInput<Type, Value, Validator, Default, Required>,
  key?: string
): MiPropFinalized<Type, Value, Validator, Default, Required> => {
  if (!isObject(prop) || isMiProp(prop)) return prop as any

  const { values, required, default: defaultValue, type, validator } = prop

  const _validator =
    values || validator
      ? (val: unknown) => {
          let valid = false
          let allowedValues: unknown[] = []

          if (values) {
            allowedValues = Array.from(values)
            if (hasOwn(prop, 'default')) {
              allowedValues.push(defaultValue)
            }
            valid ||= allowedValues.includes(val)
          }
          if (validator) valid ||= validator(val)

          if (!valid && allowedValues.length > 0) {
            const allowValuesText = [...new Set(allowedValues)]
              .map((value) => JSON.stringify(value))
              .join(', ')
            warn(
              `Invalid prop: validation failed${
                key ? ` for prop "${key}"` : ''
              }. Expected one of [${allowValuesText}], got value ${JSON.stringify(
                val
              )}.`
            )
          }
          return valid
        }
      : undefined
  const miProp: any = {
    type,
    required: !!required,
    validator: _validator,
    [miPropKey]: true,
  }
  if (hasOwn(prop, 'default')) miProp.default = defaultValue
  return miProp
}

export const buildProps = <
  Props extends Record<
    string,
    | { [miPropKey]: true }
    | NativePropType
    | MiPropInput<any, any, any, any, any>
  >
>(
  props: Props
): {
  [K in keyof Props]: IfMiProp<
    Props[K],
    Props[K],
    IfNativePropType<Props[K], Props[K], MiPropConvert<Props[K]>>
  >
} =>
  fromPairs(
    Object.entries(props).map(([key, option]) => [
      key,
      buildProp(option as any, key),
    ])
  ) as any
