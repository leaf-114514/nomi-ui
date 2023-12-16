import type { ExtractPropTypes, PropType } from 'vue'
import { miPropKey } from './runtime'
import { IfNever, UnknownToNever, WritableArray } from './util'

type Value<T> = T[keyof T]

export type ExtractPropType<T extends object> = Value<
  ExtractPropTypes<{
    key: T
  }>
>

export type ResolvePropType<T> = IfNever<
  T,
  never,
  ExtractPropType<{
    type: WritableArray<T>
    required: true
  }>
>

export type MiPropMergeType<Type, Value, Validator> =
  | IfNever<UnknownToNever<Value>, ResolvePropType<Type>, never>
  | UnknownToNever<Value>
  | UnknownToNever<Validator>

export type MiPropInputDefault<
  Required extends boolean,
  Default
> = Required extends true
  ? never
  : Default extends Record<string, unknown> | Array<any>
  ? () => Default
  : (() => Default) | Default

export type NativePropType =
  | ((...args: any) => any)
  | { new (...args: any): any }
  | undefined
  | null
export type IfNativePropType<T, Y, N> = [T] extends [NativePropType] ? Y : N

export type MiPropInput<
  Type,
  Value,
  Validator,
  Default extends MiPropMergeType<Type, Value, Validator>,
  Required extends boolean
> = {
  type?: Type
  required?: Required
  values?: readonly Value[]
  validator?: ((val: any) => val is Validator) | ((val: any) => boolean)
  default?: MiPropInputDefault<Required, Default>
}

export type MiProp<Type, Default, Required> = {
  readonly type: PropType<Type>
  readonly required: [Required] extends [true] ? true : false
  readonly validator: ((val: unknown) => boolean) | undefined
  [miPropKey]: true
} & IfNever<Default, unknown, { readonly default: Default }>

export type IfMiProp<T, Y, N> = T extends { [miPropKey]: true } ? Y : N

export type MiPropConvert<Input> = Input extends MiPropInput<
  infer Type,
  infer Value,
  infer Validator,
  any,
  infer Required
>
  ? MiPropFinalized<Type, Value, Validator, Input['default'], Required>
  : never

export type MiPropFinalized<Type, Value, Validator, Default, Required> = MiProp<
  MiPropMergeType<Type, Value, Validator>,
  UnknownToNever<Default>,
  Required
>

export {}
