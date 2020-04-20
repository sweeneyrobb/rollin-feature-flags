import React, { createContext, useContext } from 'react'

export const createFeatures = <T extends string>(featureFlags: T[]) => {
  type FeatureFlagKeys = typeof featureFlags[number]
  type FeatureFlags = Record<FeatureFlagKeys, boolean | undefined>

  const featureFlagContext = createContext({} as FeatureFlags)

  const useFlags = (...keys: Array<FeatureFlagKeys>) => {
    const flags = useContext(featureFlagContext)

    return keys.map(k => flags[k])
  }

  const useFlag = (key: FeatureFlagKeys) => {
    const flags = useContext(featureFlagContext)

    return flags[key]
  }

  type FilterProps = {
    flag: FeatureFlagKeys
    children?: React.ReactNode
  }

  const Filter = ({ flag, children }: FilterProps) => {
    const isOn = useFlag(flag)

    return <>{isOn && children}</>
  }

  return {
    featureFlags,
    featureFlagContext,
    useFlag,
    useFlags,
    Filter,
  }
}
