import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  featureFlagReducer,
  featureFlagInitialState,
  ActionType,
  FeatureFlags,
  FeatureFlagState,
} from './featureFlagReducer';

interface FeatureFlagContextType extends FeatureFlagState {
  updateFlag: (flagName: keyof FeatureFlags, value: boolean) => void;
  resetFlags: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(featureFlagReducer, featureFlagInitialState);

  // load flags from localStorage on initial mount
  useEffect(() => {
    try {
      const storedFlags = localStorage.getItem('featureFlags');
      if (storedFlags) {
        dispatch({
          type: ActionType.INITIALIZE_FLAGS,
          payload: JSON.parse(storedFlags),
        });
      } else {
        localStorage.setItem('featureFlags', JSON.stringify(featureFlagInitialState.flags));
        dispatch({
          type: ActionType.INITIALIZE_FLAGS,
          payload: featureFlagInitialState.flags,
        });
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
      dispatch({
        type: ActionType.INITIALIZE_FLAGS,
        payload: featureFlagInitialState.flags,
      });
    }
  }, []);

  // Update a single flag
  const updateFlag = (flagName: keyof FeatureFlags, value: boolean) => {
    dispatch({
      type: ActionType.UPDATE_FLAG,
      payload: { flagName, value },
    });

    const updatedFlags = {
      ...state.flags,
      [flagName]: value,
    };
    localStorage.setItem('featureFlags', JSON.stringify(updatedFlags));
  };

  // Reset flags to default
  const resetFlags = () => {
    dispatch({ type: ActionType.RESET_FLAGS });
    localStorage.setItem('featureFlags', JSON.stringify(featureFlagInitialState.flags));
  };

  return (
    <FeatureFlagContext
      value={{
        flags: state.flags,
        isLoaded: state.isLoaded,
        updateFlag,
        resetFlags,
      }}
    >
      {children}
    </FeatureFlagContext>
  );
}

// Custom hook to use feature flags
export const useFeatureFlags = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};
