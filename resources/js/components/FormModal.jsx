import React from 'react';

function stopPropagation(event) {
    event.stopPropagation();
}

function resolveOptions(field, values) {
    if (typeof field.options === 'function') {
        return field.options(values ?? {});
    }

    return field.options;
}

function optionLabel(options, value) {
    return options.find((option) => String(option.value) === String(value))?.label ?? value;
}

export default function FormModal({ title, fields, values, onChange, onClose, onSubmit }) {
    if (!values) {
        return null;
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit();
    }

    function handleFieldChange(field, event) {
        if (field.multiple) {
            const selectedValue = event.target.value;

            if (!selectedValue) {
                return;
            }

            const current = (values[field.name] ?? []).map(String);

            if (!current.includes(String(selectedValue))) {
                onChange(field.name, [...current, String(selectedValue)]);
            }

            return;
        }

        onChange(field.name, event.target.value);
    }

    function removeSelectedValue(fieldName, value) {
        const current = (values[fieldName] ?? []).map(String);
        onChange(fieldName, current.filter((item) => item !== String(value)));
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <form
                className="modal-card"
                onClick={stopPropagation}
                onSubmit={handleSubmit}
            >
                <div className="section-copy">
                    <p className="eyebrow">{values.id ? 'Edit record' : 'New record'}</p>
                    <h2 className="section-title">{title}</h2>
                </div>
                <div className="field-stack">
                    {fields.map((field) => {
                        const options = resolveOptions(field, values) ?? [];
                        const selectedValues = field.multiple
                            ? (values[field.name] ?? []).map(String)
                            : [];
                        const availableOptions = field.multiple
                            ? options.filter((option) => !selectedValues.includes(String(option.value)))
                            : options;

                        return (
                            <div key={field.name} className="field-stack">
                                <label className="field-label">
                                    {field.label}
                                    {field.options ? (
                                        <select
                                            className="field-input"
                                            name={field.name}
                                            value={field.multiple ? '' : (values[field.name] ?? '')}
                                            onChange={(event) => handleFieldChange(field, event)}
                                        >
                                            <option value="">Select...</option>
                                            {availableOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className="field-input"
                                            name={field.name}
                                            value={values[field.name] ?? ''}
                                            onChange={(event) => handleFieldChange(field, event)}
                                        />
                                    )}
                                </label>

                                {field.multiple && selectedValues.length > 0 && (
                                    <div className="selected-values">
                                        {selectedValues.map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className="selected-value"
                                                onClick={() => removeSelectedValue(field.name, value)}
                                            >
                                                {optionLabel(options, value)}
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
