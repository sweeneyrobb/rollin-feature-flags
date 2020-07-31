import React, { createContext, useContext, useState } from 'react'

const getFeatureOverrides = <K extends string>(keys: K[]) => {
    return keys.reduce((p, c) => {
        const value = window.localStorage.getItem(c)

        return value === undefined || value === null
            ? p
            : {
                  ...p,
                  [c]: value.toLowerCase() === 'true',
              }
    }, {} as Record<K, boolean>)
}

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

        return (flags: FeatureFlags) => {
            const overrides = getFeatureOverrides<FeatureFlagKeys>(featureFlags)

            setFlags({
                ...flags,
                ...overrides,
            })
        }
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
    const FeatureFlagProvider = ({
        initialFlags,
        ...props
    }: FeatureFlagProviderProps) => {
        const overrides = getFeatureOverrides(featureFlags)
        const [flags, setFlags] = useState(
            () => ({ ...initialFlags, ...overrides } as FeatureFlags)
        )
        const { Provider } = featureFlagContext
        return <Provider value={{ flags, setFlags }} {...props} />
    }

    const FeatureFlagConsumer = featureFlagContext.Consumer

    return {
        featureFlags,
        FeatureFlagProvider,
        FeatureFlagConsumer,
        useSetFlags,
        useFlag,
        useFlags,
        Filter,
    }
}
