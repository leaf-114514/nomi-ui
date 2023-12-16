import { SFCWithInstall } from './typescript'

export const withInstall = <T>(component: T): SFCWithInstall<T> => {
  ;(component as SFCWithInstall<T>).install = (app): void => {
    const { name } = component as unknown as { name: string }
    app.component(name, component)
  }
  return component as SFCWithInstall<T>
}
