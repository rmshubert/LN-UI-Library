import React from 'react';
import PropTypes from 'prop-types';
import './heartbeatDetectionSetting.css';

/**
 * A 5-step sensitivity picker for heartbeat detection settings.
 * Steps range from "Less sensitive" (1) to "More sensitive" (5).
 */
export const HeartbeatDetectionSetting = ({
  value = 3,
  disabled = false,
  startLabel = 'Less sensitive',
  endLabel = 'More sensitive',
  onChange,
}) => {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="hds-container">
      <div className={`hds-track${disabled ? ' hds-track--disabled' : ''}`}>
        {steps.map((step) => (
          <button
            key={step}
            className={[
              'hds-step',
              step === value ? 'hds-step--selected' : '',
              disabled ? 'hds-step--disabled' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => !disabled && onChange?.(step)}
            disabled={disabled}
            aria-label={`Sensitivity level ${step}`}
            aria-pressed={step === value}
          >
            {step}
          </button>
        ))}
      </div>
      <div className={`hds-labels${disabled ? ' hds-labels--disabled' : ''}`}>
        <span className="hds-label-start">{startLabel}</span>
        <span className="hds-label-end">{endLabel}</span>
      </div>
    </div>
  );
};

HeartbeatDetectionSetting.propTypes = {
  /** Currently selected step (1–5) */
  value: PropTypes.oneOf([1, 2, 3, 4, 5]),
  /** Disables all interaction and applies muted styling */
  disabled: PropTypes.bool,
  /** Label displayed below step 1 */
  startLabel: PropTypes.string,
  /** Label displayed below step 5 */
  endLabel: PropTypes.string,
  /** Called with the new step value when a step is clicked */
  onChange: PropTypes.func,
};
