// flags and corresponding types
export interface FeatureFlags {
  darkMode: boolean;
}

export interface FeatureFlagState {
  flags: FeatureFlags;
  isLoaded: boolean;
}

export const featureFlagInitialState: FeatureFlagState = {
  flags: {
    darkMode: false,
  },
  isLoaded: false,
};

// actions and corresponding types
export enum ActionType {
  INITIALIZE_FLAGS = 'INITIALIZE_FLAGS',
  UPDATE_FLAG = 'UPDATE_FLAG',
  RESET_FLAGS = 'RESET_FLAGS',
}

type InitializeAction = {
  type: ActionType.INITIALIZE_FLAGS;
  payload: FeatureFlags;
};

type UpdateAction = {
  type: ActionType.UPDATE_FLAG;
  payload: {
    flagName: keyof FeatureFlags;
    value: boolean;
  };
};

type ResetAction = {
  type: ActionType.RESET_FLAGS;
};

export type FeatureFlagAction = InitializeAction | UpdateAction | ResetAction;


export function featureFlagReducer(
  state: FeatureFlagState,
  action: FeatureFlagAction,
): FeatureFlagState {
  switch (action.type) {
    case ActionType.INITIALIZE_FLAGS:
      return {
        ...state,
        flags: action.payload,
        isLoaded: true,
      };

    case ActionType.UPDATE_FLAG:
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.payload.flagName]: action.payload.value,
        },
      };

    case ActionType.RESET_FLAGS:
      return {
        ...state,
        flags: featureFlagInitialState.flags,
      };
    default:
      return state;
  }
}
