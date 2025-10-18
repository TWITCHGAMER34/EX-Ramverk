import React from 'react';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import styles from './events.module.scss';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onClear: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function SearchInput({ value, onChange, onClear, inputRef }: Props) {
    return (
        <div className={styles.searchInput}>
            <AiOutlineSearch className={styles.searchIcon} />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search for events..."
                aria-label="Search events"
            />
            {value && (
                <button type="button" className={styles.searchClear} onClick={onClear} aria-label="Clear search">
                    <AiOutlineClose />
                </button>
            )}
        </div>
    );
}