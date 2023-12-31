// Block 代码块 Element 元素 Modifier 装饰 -> BEM 规范
// State 状态
// examples:
// example1:  Block -> mi-button
// example2: Element -> mi-button__element
// example3: Modifier -> mi-button__element--disabled
// example4: State -> is-checked

// using: :class=[bem.b('button)]

export const defaultNamespace = 'mi'
const statePrefix = 'is-'

const _bem = (
  prefixName: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  if (blockSuffix) {
    prefixName += `-${blockSuffix}`
  }
  if (element) {
    prefixName += `__${element}`
  }
  if (modifier) {
    prefixName += `--${modifier}`
  }
  return prefixName
}

const createBEM = (prefixName: string) => {
  const b = (blockSuffix: string = '') => _bem(prefixName, blockSuffix, '', '')
  const e = (element: string = '') =>
    element ? _bem(prefixName, '', element, '') : ''
  const m = (modifier: string = '') =>
    modifier ? _bem(prefixName, '', '', modifier) : ''

  const be = (blockSuffix: string = '', element: string = '') =>
    blockSuffix && element ? _bem(prefixName, blockSuffix, element, '') : ''
  const bm = (blockSuffix: string = '', modifier: string = '') =>
    blockSuffix && modifier ? _bem(prefixName, blockSuffix, '', modifier) : ''
  const em = (element: string, modifier: string = '') =>
    element && modifier ? _bem(prefixName, '', element, modifier) : ''
  const bem = (
    blockSuffix: string,
    element: string = '',
    modifier: string = ''
  ) =>
    blockSuffix && element && modifier
      ? _bem(prefixName, blockSuffix, element, modifier)
      : ''
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }
  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is,
  }
}

export const useNamespace = (name: string) => {
  const prefixName = `${defaultNamespace}-${name}`
  return createBEM(prefixName)
}

export type UseNamespaceReturn = ReturnType<typeof useNamespace>
