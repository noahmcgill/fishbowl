import React, {
  type KeyboardEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import ReactContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

interface ContentEditableProps {
  html: string;
  className?: string;
  tabIndex?: number;
  role?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: ContentEditableEvent) => void;
  onInput?: (e: FormEvent<HTMLDivElement>) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * ReactContentEditable wrapper to get the library working with state hooks,
 * with the help of Github user `ctrlplusb`.
 *
 * See more: https://github.com/lovasoa/react-contenteditable/issues/161#issuecomment-669633470
 */
export const ContentEditable: React.FC<ContentEditableProps> = ({
  onChange,
  onInput,
  onBlur,
  onKeyDown,
  placeholder,
  className,
  html,
  ...props
}) => {
  const onChangeRef = React.useRef(onChange);
  const onInputRef = React.useRef(onInput);
  const onBlurRef = React.useRef(onBlur);
  const onKeyDownRef = React.useRef(onKeyDown);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React.useEffect(() => {
    onInputRef.current = onInput;
  }, [onInput]);
  React.useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);
  React.useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  }, [onKeyDown]);

  return (
    <div className="relative flex cursor-text flex-col">
      <div
        className={`${className} absolute z-[-1] text-zinc-200 ${placeholder && (html === "" || html === "<br>") ? "visible" : "invisible"}`}
      >
        {placeholder}
      </div>
      <ReactContentEditable
        {...props}
        html={html}
        className={className}
        onChange={(e) => {
          if (onChangeRef.current) {
            onChangeRef.current(e);
          }
        }}
        onInput={
          onInput
            ? (e) => {
                if (onInputRef.current) {
                  onInputRef.current(e);
                }
              }
            : undefined
        }
        onBlur={
          onBlur
            ? (e) => {
                if (onBlurRef.current) {
                  onBlurRef.current(e);
                }
              }
            : undefined
        }
        onKeyDown={
          onKeyDown
            ? (e) => {
                if (onKeyDownRef.current) {
                  onKeyDownRef.current(e);
                }
              }
            : undefined
        }
      />
    </div>
  );
};
