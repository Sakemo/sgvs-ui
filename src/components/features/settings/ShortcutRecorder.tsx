import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuKeyboard, LuX } from 'react-icons/lu';
import Button from '../../common/ui/Button';
import {
  formatShortcutBinding,
  getShortcutStepFromEvent,
  KEYBOARD_SHORTCUT_MAX_STEPS,
  KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT,
  serializeShortcutSteps,
} from '../../../lib/keyboardShortcuts';

interface ShortcutRecorderProps {
  value: string;
  onChange: (nextValue: string) => void;
}

const ShortcutRecorder: React.FC<ShortcutRecorderProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSteps, setRecordedSteps] = useState<string[]>([]);
  const finishTimerRef = useRef<number | null>(null);

  const clearFinishTimer = useCallback(() => {
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    clearFinishTimer();
    setIsRecording(false);
    setRecordedSteps([]);
  }, [clearFinishTimer]);

  const finishRecording = useCallback(
    (steps: string[]) => {
      clearFinishTimer();
      setIsRecording(false);
      setRecordedSteps([]);
      onChange(serializeShortcutSteps(steps));
    },
    [clearFinishTimer, onChange]
  );

  useEffect(() => () => clearFinishTimer(), [clearFinishTimer]);

  const scheduleFinish = useCallback(
    (steps: string[]) => {
      clearFinishTimer();
      finishTimerRef.current = window.setTimeout(() => {
        finishRecording(steps);
      }, KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT);
    },
    [clearFinishTimer, finishRecording]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isRecording) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'Escape') {
      cancelRecording();
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      clearFinishTimer();
      setIsRecording(false);
      setRecordedSteps([]);
      onChange('');
      return;
    }

    if (event.key === 'Enter' && recordedSteps.length > 0) {
      finishRecording(recordedSteps);
      return;
    }

    const nextStep = getShortcutStepFromEvent(event.nativeEvent);

    if (!nextStep) {
      return;
    }

    const nextSteps = [...recordedSteps, nextStep].slice(
      0,
      KEYBOARD_SHORTCUT_MAX_STEPS
    );

    setRecordedSteps(nextSteps);

    if (nextSteps.length >= KEYBOARD_SHORTCUT_MAX_STEPS) {
      finishRecording(nextSteps);
      return;
    }

    scheduleFinish(nextSteps);
  };

  const buttonLabel = isRecording
    ? recordedSteps.length > 0
      ? formatShortcutBinding(serializeShortcutSteps(recordedSteps))
      : t('settings.keyboard.editor.pressKeys')
    : value
      ? formatShortcutBinding(value)
      : t('settings.keyboard.editor.empty');

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        className={
          isRecording
            ? 'border-brand-primary/50 bg-brand-primary/10'
            : 'min-w-[11rem] justify-start'
        }
        onClick={() => {
          if (isRecording) {
            cancelRecording();
            return;
          }

          setIsRecording(true);
          setRecordedSteps([]);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (isRecording && recordedSteps.length === 0) {
            cancelRecording();
          }
        }}
        data-shortcut-editor="true"
        iconLeft={<LuKeyboard className="h-4 w-4" />}
        title={t(
          isRecording
            ? 'settings.keyboard.editor.recording'
            : 'settings.keyboard.editor.record'
        )}
      >
        {buttonLabel}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          cancelRecording();
          onChange('');
        }}
        aria-label={t('settings.keyboard.editor.clear')}
        title={t('settings.keyboard.editor.clear')}
      >
        <LuX className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShortcutRecorder;
