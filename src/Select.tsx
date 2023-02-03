import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export type SelectOption = {
    label: string,
    value: string | number
};

// Multiple Select Props:
type MultipleSelectProps = {
    multiple: true,
    value: SelectOption[],
    onChange: (value: SelectOption[]) => void
};

// Single Select Props:
type SingleSelectProps = {
    multiple?: false,
    value?: SelectOption,
    onChange: (value: SelectOption | undefined) => void
};

// Select Props:
type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps);

export function Select({ multiple, value, onChange, options }: SelectProps) {
    // UseState:
    const [isOpen, setIsOpen] = useState(true);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    // UseRef:
    const containerRef = useRef<HTMLDivElement>(null);
    // UseEffect:
    useEffect(() => {
        if(isOpen) setHighlightedIndex(0);
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if(e.target != containerRef.current) return;
            switch(e.code) {
                case "Enter": 
                case "Space":
                    setIsOpen(prev => !prev)
                    if(isOpen) selectOption(options[highlightedIndex])
                break;
                case "ArrowUp":
                case "ArrowDown":
                    if(!isOpen) {
                        setIsOpen(true)
                        break;
                    }
                const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
                if(newValue >= 0 && newValue < options.length) {
                    setHighlightedIndex(newValue);
                }
                break;
                case "Escape":
                    setIsOpen(false);
                break;
            }
        };
        containerRef.current?.addEventListener("keydown", handler);

        return () => {
            containerRef.current?.removeEventListener("keydown", handler);
        }
    }, [isOpen, highlightedIndex, options]);
    // Functions:
    const clearOptions = () => { 
        multiple ? onChange([]) : onChange(undefined);
    };
    const selectOption = (option: SelectOption) => { 
        if(multiple) {
            if(value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else {
                onChange([...value, option]);
            }
        } else {
            if(option !== value) {
                onChange(option)
            }
        }
    };
    const isOptionSelected = (option: SelectOption) => {
        return multiple ? value.includes(option) : option === value;
    };
    // ------------------------------------------
    return (
        <div
            ref={containerRef}
            onClick={() => setIsOpen(prev => !prev)}
            onBlur={() => setIsOpen(false)}
            tabIndex={0} 
            className={styles.container}
        >
            <span className={styles.value}>{multiple ? (value.map(v => (
                <button className={styles["option-badge"]} key={v.value} onClick={e => {
                    e.stopPropagation()
                    selectOption(v)
                }}>{v.label} <span className={styles["remove-btn"]}>&times;</span></button>
            ))) : value?.label}</span>
            <button onClick={e => {
                e.stopPropagation()
                clearOptions()
            }} className={styles["clear-btn"]}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                {options.map((option, index) => (
                    <li onClick={e => {
                        e.stopPropagation()
                        selectOption(option)
                        setIsOpen(false)
                    }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        key={option.value} 
                        className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${index === highlightedIndex ? styles.highlighted : ""}`}>
                            {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};