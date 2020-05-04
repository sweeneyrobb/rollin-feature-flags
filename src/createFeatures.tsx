import React, { createContext, useContext, useState } from 'react'

export const createFeatures = <T extends string>(featureFlags: T[]) => {
  type FeatureFlagKeys = typeof featureFlags[number]
  type FeatureFlags = { [K in FeatureFlagKeys]: boolean | undefined }

  const featureFlagContext = createContext(
    {} as {
      flags: FeatureFlags
      setFlags: React.Dispatch<React.SetStateAction<FeatureFlags>>
    }
  )

  const useFlags = (...keys: FeatureFlagKeys[]) => {
    const { flags } = useContext(featureFlagContext)

    return keys.map(k => flags[k])
  }

  const useFlag = (key: FeatureFlagKeys) => {
    const { flags } = useContext(featureFlagContext)

    return flags[key]
  }

  const useSetFlags = () => {
    const { setFlags } = useContext(featureFlagContext)

    return setFlags
  }

  type FilterProps = {
    flag: FeatureFlagKeys
    children?: React.ReactNode
  }

  const Filter = ({ flag, children }: FilterProps) => {
    const isOn = useFlag(flag)

    return <>{isOn && children}</>
  }

  type FeatureFlagProviderProps = {
    children?: React.ReactNode
    initialFlags?: FeatureFlags
  }
  const FeatureFlagProvider = (props: FeatureFlagProviderProps) => {
    const [flags, setFlags] = useState(() => ({} as FeatureFlags))
    const { Provider } = featureFlagContext
    return <Provider value={{ flags, setFlags }} {...props} />
  }

  return {
    featureFlags,
    FeatureFlagProvider,
    useSetFlags,
    useFlag,
    useFlags,
    Filter,
  }
}
